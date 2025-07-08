import { auth } from "@/auth";
import { getMonthNameByDate } from "@/helpers/getMonthName";
import { google } from "googleapis";
import { NextResponse } from "next/server";



export async function GET(request: Request) {
    const session = await auth();
    try {
        // const accessToken = session?.accessToken;
        const url = new URL(request.url);
        const monthParam = url.searchParams.get("month");
        const mailParam = url.searchParams.get("mail");

        // Validar token desde el header Authorization
        const authHeader = request.headers.get("authorization");
        const token = authHeader?.split(" ")[1]; // Espera formato: "Bearer <token>"

        const expectedToken = process.env.API_SECRET_TOKEN;

        if (!session) {
            if (!token || token !== expectedToken) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
        }


        const user = await fetch(`${process.env.NEXTAUTH_URL}api/user/${!mailParam ? session?.user.email : mailParam}`, {
            headers: {
                'Authorization': `Bearer ${process.env.API_SECRET_TOKEN}`,
            },
        }).then((res) => res.json());

        const { sheetId } = user;
        // console.log({ user: user })
        if (!sheetId) {
            return NextResponse.json(
                { error: "Faltan parámetros: accessToken o sheetId" },
                { status: 400 }
            );
        }

        if (!monthParam) {
            return NextResponse.json(
                { error: "Falta el parámetro 'month' en la consulta" },
                { status: 400 }
            );
        }
        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: user.accessToken });

        const sheets = google.sheets({ version: "v4", auth });

        // Obtener el mes actual
        const now = new Date();
        const monthNames = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
        ];
        const currentMonth = monthNames[now.getMonth()];

        const [year, month] = monthParam.split("-").map(Number);
        const requestedDate = new Date(Date.UTC(year, month - 1, 1));

        const requestedMonth = getMonthNameByDate(requestedDate);

        // Buscar el ID de la hoja correspondiente al mes actual
        const sheet = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
        const sheetForMonth = sheet.data.sheets?.find(
            (s) => s.properties?.title === requestedMonth
        );
        if (!sheetForMonth) {
            console.log("error 41")
            return NextResponse.json(
                { error: `No se encontró la hoja para el mes: ${currentMonth}` },
                { status: 404 }
            );
        }

        // Leer los datos de la hoja del mes actual
        const range = `${requestedMonth}!A:I`; // Ajusta el rango según la estructura de tu hoja
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range,
        });

        const rows = response.data.values || [];

        // Procesar los datos para excluir el encabezado (si existe)
        const [header, ...transactions] = rows;
        // console.log({ ts: transactions })
        const formattedTransactions = transactions.map((row) =>
            header.reduce((obj, key, index) => {
                obj[key] = row[index] || null; // Usa null si no hay un valor en esa celda
                return obj;
            }, {})
        );
        return NextResponse.json({ formattedTransactions }, { status: 200 });
    } catch (error: any) {
        // console.error("Error al obtener las transacciones:", error.message || error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}


export async function POST(request: Request) {
    const session = await auth();
    try {
        // const accessToken = session?.accessToken;
        const url = new URL(request.url);
        const mailParam = url.searchParams.get("mail");

        // Validar token desde el header Authorization
        const authHeader = request.headers.get("authorization");
        const token = authHeader?.split(" ")[1]; // Espera formato: "Bearer <token>"

        const expectedToken = process.env.API_SECRET_TOKEN;

        if (!token || token !== expectedToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await fetch(`${process.env.NEXTAUTH_URL}api/user/${!mailParam ? session?.user.email : mailParam}`, {
            headers: {
                'Authorization': `Bearer ${process.env.API_SECRET_TOKEN}`,
            },
        }).then((res) => res.json());

        const { sheetId } = user;
        const body = await request.json();
        const { description, type, category, amount, currency, date, account, method } = body;


        if (!sheetId) {
            return NextResponse.json(
                { error: "Faltan parámetros: accessToken, sheetId o transaction" },
                { status: 400 }
            );
        }

        if (!description || !type || !category || !amount || !currency || !date || !account || !method) {
            return NextResponse.json(
                { error: "Datos incompletos en la transacción" },
                { status: 400 }
            );
        }

        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: user.accessToken });

        const sheets = google.sheets({ version: "v4", auth });
        // Obtener el mes y año de la fecha
        const dateNow = new Date(date);
        const monthNames = [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre",
        ];
        const month = monthNames[dateNow.getMonth()];
        // Buscar el ID de la hoja correspondiente al mes
        const sheet = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
        const sheetIdForMonth = sheet.data.sheets
            ?.find((s) => s.properties?.title === month)
            ?.properties?.sheetId;

        if (!sheetIdForMonth) {
            return NextResponse.json(
                { error: `No se encontró la hoja para el mes: ${month}` },
                { status: 404 }
            );
        }
        // Leer los valores existentes en la hoja para calcular el próximo ID
        const range = `${month}!A:A`; // Asumiendo que la columna A contiene los IDs
        const existingData = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range,
        });

        // Determinar el próximo ID
        const rows = existingData.data.values || [];
        const lastId = rows.length > 1 ? parseInt(rows[rows.length - 1][0]) : 0; // Ignorar encabezado
        const newId = isNaN(lastId) ? 1 : lastId + 1;

        // Insertar la transacción en la hoja
        await sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: `${month}!A1:G1`, // Ajusta el rango según tu estructura
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [
                    [newId, description, type, category, amount, currency, date, account, method], // Filas de la transacción
                ],
            },
        });
        return NextResponse.json({ message: "Transacción guardada exitosamente" });
    } catch (error: any) {
        console.error("Error al guardar la transacción:", error.message || error);
        return NextResponse.json(
            { error: "Error al guardar la transacción" },
            { status: 500 }
        );
    }
}


export async function PUT(request: Request) {
    const session = await auth();
    try {
        const accessToken = session?.accessToken;
        const user = await fetch(`${process.env.NEXTAUTH_URL}api/user/${session?.user.email}`, {
            headers: {
                'Authorization': `Bearer ${process.env.API_SECRET_TOKEN}`,
            },
        }).then((res) => res.json());
        const { sheetId } = user;
        const body = await request.json();
        const { id, description, type, category, amount, currency, date, account, method } = body;

        if (!accessToken || !sheetId) {
            return NextResponse.json(
                { error: "Faltan parámetros: accessToken o sheetId" },
                { status: 400 }
            );
        }

        if (!id || !description || !type || !category || !amount || !currency || !date || !account || !method) {
            return NextResponse.json(
                { error: "Datos incompletos en la transacción" },
                { status: 400 }
            );
        }

        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: accessToken });

        const sheets = google.sheets({ version: "v4", auth });
        const dateNow = new Date(date);
        const monthNames = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
        ];
        const month = monthNames[dateNow.getMonth()];
        const sheet = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
        const sheetIdForMonth = sheet.data.sheets
            ?.find((s) => s.properties?.title === month)
            ?.properties?.sheetId;

        if (!sheetIdForMonth) {
            return NextResponse.json(
                { error: `No se encontró la hoja para el mes: ${month}` },
                { status: 404 }
            );
        }

        const range = `${month}!A:H`; // Asumiendo que los datos están entre las columnas A y H
        const existingData = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range,
        });

        const rows = existingData.data.values || [];
        const rowIndex = rows.findIndex((row) => row[0] === id.toString());

        if (rowIndex === -1) {
            return NextResponse.json(
                { error: "No se encontró la transacción para actualizar" },
                { status: 404 }
            );
        }

        // Actualiza los datos en la hoja
        const updateRange = `${month}!A${rowIndex + 1}:H${rowIndex + 1}`;
        await sheets.spreadsheets.values.update({
            spreadsheetId: sheetId,
            range: updateRange,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [[id, description, type, category, amount, currency, date, account, method]],
            },
        });

        return NextResponse.json({ message: "Transacción actualizada exitosamente" });
    } catch (error: any) {
        console.error("Error al actualizar la transacción:", error.message || error);
        return NextResponse.json(
            { error: "Error al actualizar la transacción" },
            { status: 500 }
        );
    }
}


export async function DELETE(request: Request) {
    const session = await auth();
    try {
        const accessToken = session?.accessToken;
        const user = await fetch(`${process.env.NEXTAUTH_URL}api/user/${session?.user.email}`, {
            headers: {
                'Authorization': `Bearer ${process.env.API_SECRET_TOKEN}`,
            },
        }).then((res) => res.json());
        const { sheetId } = user;
        const body = await request.json();
        const { id, date } = body;

        if (!accessToken || !sheetId || !id || !date) {
            return NextResponse.json(
                { error: "Faltan parámetros: accessToken, sheetId, id o date" },
                { status: 400 }
            );
        }

        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: accessToken });

        const sheets = google.sheets({ version: "v4", auth });
        const dateNow = new Date(date);
        const monthNames = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
        ];
        const month = monthNames[dateNow.getMonth()];
        const sheet = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
        const sheetIdForMonth = sheet.data.sheets
            ?.find((s) => s.properties?.title === month)
            ?.properties?.sheetId;

        if (!sheetIdForMonth) {
            return NextResponse.json(
                { error: `No se encontró la hoja para el mes: ${month}` },
                { status: 404 }
            );
        }

        const range = `${month}!A:H`; // Asumiendo que los datos están entre las columnas A y H
        const existingData = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range,
        });

        const rows = existingData.data.values || [];
        const rowIndex = rows.findIndex((row) => row[0] === id.toString());

        if (rowIndex === -1) {
            return NextResponse.json(
                { error: "No se encontró la transacción para eliminar" },
                { status: 404 }
            );
        }

        // Elimina la fila configurando las celdas en blanco
        const deleteRange = `${month}!A${rowIndex + 1}:H${rowIndex + 1}`;
        await sheets.spreadsheets.values.update({
            spreadsheetId: sheetId,
            range: deleteRange,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [["", "", "", "", "", "", "", "", ""]],
            },
        });
        return NextResponse.json({ message: "Transacción eliminada exitosamente" });
    } catch (error: any) {
        console.error("Error al eliminar la transacción:", error.message || error);
        return NextResponse.json(
            { error: "Error al eliminar la transacción" },
            { status: 500 }
        );
    }
}


