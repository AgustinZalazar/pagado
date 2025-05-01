import { auth } from "@/auth";
import { google } from "googleapis";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const session = await auth();
    try {
        const accessToken = session?.accessToken;
        const user = await fetch(`${process.env.NEXTAUTH_URL}api/user/${session?.user.email}`).then((res) => res.json());
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

        const range = `Config!L:O`;
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range,
        });

        const rows = response.data.values || [];

        const [header, ...methods] = rows;
        const formattedMethods = methods.map((row) =>
            header.reduce((obj, key, index) => {
                obj[key] = row[index] || null;
                return obj;
            }, {})
        );
        return NextResponse.json({ formattedMethods }, { status: 200 });
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
        const { title, cardType, idAccount } = body;


        if (!accessToken || !sheetId) {
            return NextResponse.json(
                { error: "Faltan parámetros: accessToken, sheetId o transaction" },
                { status: 400 }
            );
        }

        if (!title || !cardType || !idAccount) {
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
        const range = `Config!L:O`; // Asumiendo que la columna A contiene los IDs
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
            range: `Config!L1:O1`,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [
                    [newId, title, cardType, idAccount],
                ],
            },
        });
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
        const { id, title, cardType, idAccount } = body;

        if (!accessToken || !sheetId) {
            return NextResponse.json(
                { error: "Faltan parámetros: accessToken o sheetId" },
                { status: 400 }
            );
        }

        if (!id || !title || !cardType || !idAccount) {
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

        const range = `Config!L:O`;
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
        const updateRange = `Config!L${rowIndex + 1}:O${rowIndex + 1}`;
        await sheets.spreadsheets.values.update({
            spreadsheetId: sheetId,
            range: updateRange,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [[id, title, cardType, idAccount]],
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
        const id = await request.json();


        // console.log(id)
        if (!accessToken || !sheetId || !id) {
            return NextResponse.json(
                { error: "Faltan parámetros: accessToken, sheetId, id" },
                { status: 400 }
            );
        }

        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: accessToken });

        const sheets = google.sheets({ version: "v4", auth });

        const range = `Config!L2:O`;
        const existingData = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range,
        });

        const rows = existingData.data.values || [];
        const rowIndex = rows.findIndex((row) => {
            return row[0].toString() === id.toString();
        });

        if (rowIndex === -1) {
            return NextResponse.json(
                { error: "No se encontró la transacción para eliminar" },
                { status: 404 }
            );
        }

        const realRowIndex = rowIndex + 2;

        const requests = [
            {
                deleteRange: {
                    range: {
                        sheetId: 108754243,
                        startRowIndex: realRowIndex - 1,
                        endRowIndex: realRowIndex,
                    },
                    shiftDimension: "ROWS",
                },
            },
        ];

        const batchUpdateRequest = { requests };
        await sheets.spreadsheets.batchUpdate({
            spreadsheetId: sheetId,
            requestBody: batchUpdateRequest,
        });
        return NextResponse.json({ message: "Categoria eliminada exitosamente" });
    } catch (error: any) {
        console.error("Error al eliminar la categoria:", error.message || error);
        return NextResponse.json(
            { error: "Error al eliminar la categoria" },
            { status: 500 }
        );
    }
}
