import { auth } from "@/auth";
import { google } from "googleapis";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const session = await auth();
    try {
        const accessToken = session?.accessToken;
        const user = await fetch(`${process.env.NEXTAUTH_URL}/api/user/agusstiin.az@gmail.com`).then((res) => res.json());
        const { sheetId } = user;

        if (!accessToken || !sheetId) {
            return NextResponse.json(
                { error: "Faltan parámetros: accessToken o sheetId" },
                { status: 400 }
            );
        }

        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: accessToken });

        const sheets = google.sheets({ version: "v4", auth });

        // Buscar el ID de la hoja correspondiente al mes actual
        const sheet = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
        const sheetConfig = sheet.data.sheets?.find(
            (s) => s.properties?.title === "Config"
        );
        if (!sheetConfig) {
            console.log("error 41")
            return NextResponse.json(
                { error: `No se encontró la hoja Config` },
                { status: 404 }
            );
        }

        // Leer los datos de la hoja del mes actual
        const range = `Config!A:E`; // Ajusta el rango según la estructura de tu hoja
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range,
        });

        const rows = response.data.values || [];

        // Procesar los datos para excluir el encabezado (si existe)
        const [header, ...categories] = rows;
        // console.log({ ct: categories })
        const formattedCategories = categories.map((row) =>
            header.reduce((obj, key, index) => {
                obj[key] = row[index] || null; // Usa null si no hay un valor en esa celda
                return obj;
            }, {})
        );
        // console.log({ ftc: formattedCategories })
        return NextResponse.json({ formattedCategories }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}


export async function POST(request: Request) {
    const session = await auth();
    try {
        const accessToken = session?.accessToken;
        const user = await fetch(`${process.env.NEXTAUTH_URL}/api/user/${session?.user.email}`).then((res) => res.json());
        const { sheetId } = user;
        const body = await request.json();
        const { nombre, color, porcentaje, icon } = body;


        if (!accessToken || !sheetId) {
            return NextResponse.json(
                { error: "Faltan parámetros: accessToken, sheetId o transaction" },
                { status: 400 }
            );
        }

        if (!nombre || !color) {
            return NextResponse.json(
                { error: "Datos incompletos en la transacción" },
                { status: 400 }
            );
        }

        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: accessToken });

        const sheets = google.sheets({ version: "v4", auth });

        // Buscar el ID de la hoja correspondiente al mes
        const sheet = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
        const sheetIdForMonth = sheet.data.sheets
            ?.find((s) => s.properties?.title === "Config")
            ?.properties?.sheetId;

        if (!sheetIdForMonth) {
            return NextResponse.json(
                { error: `No se encontró la hoja Config` },
                { status: 404 }
            );
        }
        // Leer los valores existentes en la hoja para calcular el próximo ID
        const range = `Config!A:A`; // Asumiendo que la columna A contiene los IDs
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
            range: `Config!A1:D1`,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [
                    [newId, nombre, color, porcentaje, icon],
                ],
            },
        });
        // revalidateTag('category')
        return NextResponse.json(newId, { status: 201 });
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
        const user = await fetch(`${process.env.NEXTAUTH_URL}/api/user/${session?.user.email}`).then((res) => res.json());
        const { sheetId } = user;
        const body = await request.json();
        const { id, nombre, color, porcentaje, icon } = body;

        if (!accessToken || !sheetId) {
            return NextResponse.json(
                { error: "Faltan parámetros: accessToken o sheetId" },
                { status: 400 }
            );
        }

        if (!id || !nombre || !color) {
            return NextResponse.json(
                { error: "Datos incompletos en la transacción" },
                { status: 400 }
            );
        }

        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: accessToken });

        const sheets = google.sheets({ version: "v4", auth });
        const sheet = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
        const sheetIdForMonth = sheet.data.sheets
            ?.find((s) => s.properties?.title === "Config")
            ?.properties?.sheetId;

        if (!sheetIdForMonth) {
            return NextResponse.json(
                { error: `No se encontró la hoja Config` },
                { status: 404 }
            );
        }
        // Leer los valores existentes en la hoja para calcular el próximo ID
        const range = `Config!A:A`; // Asumiendo que la columna A contiene los IDs
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
        const updateRange = `Config!A${rowIndex + 1}:G${rowIndex + 1}`;
        await sheets.spreadsheets.values.update({
            spreadsheetId: sheetId,
            range: updateRange,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [[id, nombre, color, porcentaje, icon]],
            },
        });
        // revalidatePath('/dashboard/incomes')
        revalidateTag("transactions")
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
        const user = await fetch(`${process.env.NEXTAUTH_URL}/api/user/${session?.user.email}`).then((res) => res.json());
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

        const range = `${month}!A:G`; // Asumiendo que los datos están entre las columnas A y G
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
        const deleteRange = `${month}!A${rowIndex + 1}:G${rowIndex + 1}`;
        await sheets.spreadsheets.values.update({
            spreadsheetId: sheetId,
            range: deleteRange,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [["", "", "", "", "", "", ""]],
            },
        });
        revalidateTag("transactions");
        return NextResponse.json({ message: "Transacción eliminada exitosamente" });
    } catch (error: any) {
        console.error("Error al eliminar la transacción:", error.message || error);
        return NextResponse.json(
            { error: "Error al eliminar la transacción" },
            { status: 500 }
        );
    }
}
