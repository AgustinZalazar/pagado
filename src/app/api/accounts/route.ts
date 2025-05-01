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
        const range = `Config!G:J`; // Ajusta el rango según la estructura de tu hoja
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range,
        });

        const rows = response.data.values || [];

        const [header, ...methods] = rows;
        const formattedAccounts = methods.map((row) =>
            header.reduce((obj, key, index) => {
                obj[key] = row[index] || null;
                return obj;
            }, {})
        );
        return NextResponse.json({ formattedAccounts }, { status: 200 });
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
        const { title, type, color } = body;


        if (!accessToken || !sheetId) {
            return NextResponse.json(
                { error: "Faltan parámetros: accessToken, sheetId o transaction" },
                { status: 400 }
            );
        }

        if (!title || !type) {
            return NextResponse.json(
                { error: "Datos incompletos de la cuenta" },
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
        const range = `Config!G:J`;
        const existingData = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range,
        });

        // Determinar el próximo ID
        const rows = existingData.data.values || [];
        const lastId = rows.length > 1 ? parseInt(rows[rows.length - 1][0]) : 0; // Ignorar encabezado
        const newId = isNaN(lastId) ? 1 : lastId + 1;

        await sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: `Config!G1:J1`,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [
                    [newId, title, type, color],
                ],
            },
        });
        return NextResponse.json(newId, { status: 201 });
    } catch (error: any) {
        console.error("Error al guardar la cuenta:", error.message || error);
        return NextResponse.json(
            { error: "Error al guardar la cuenta" },
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
        const { id, title, type } = body;

        if (!accessToken || !sheetId) {
            return NextResponse.json(
                { error: "Faltan parámetros: accessToken o sheetId" },
                { status: 400 }
            );
        }

        if (!id || !title || !type) {
            return NextResponse.json(
                { error: "Datos incompletos en la cuenta" },
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
        const range = `Config!G:I`; // Asumiendo que la columna A contiene los IDs
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

        const updateRange = `Config!G${rowIndex + 1}:J${rowIndex + 1}`;
        await sheets.spreadsheets.values.update({
            spreadsheetId: sheetId,
            range: updateRange,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [[id, title, type]],
            },
        });
        return NextResponse.json({ message: "Cuenta actualizada exitosamente" });
    } catch (error: any) {
        console.error("Error al actualizar la Cuenta:", error.message || error);
        return NextResponse.json(
            { error: "Error al actualizar la Cuenta" },
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

        const range = `Config!G2:J`;
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
                { error: "No se encontró la cuenta para eliminar" },
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
        return NextResponse.json({ message: "Cuenta eliminada exitosamente" });
    } catch (error: any) {
        console.error("Error al eliminar la cuenta:", error.message || error);
        return NextResponse.json(
            { error: "Error al eliminar la cuenta" },
            { status: 500 }
        );
    }
}
