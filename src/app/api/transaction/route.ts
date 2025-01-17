import { auth } from "@/auth";
import { google } from "googleapis";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const session = await auth();
    try {
        const accessToken = session?.accessToken;
        const user = await fetch(`${process.env.NEXTAUTH_URL}/api/user/${session?.user.email}`).then((res) => res.json());
        const { sheetId } = user;
        const body = await request.json();
        const { id = 1, description, type, category, amount, date, paymentMethod } = body;

        if (!accessToken || !sheetId) {
            return NextResponse.json(
                { error: "Faltan parámetros: accessToken, sheetId o transaction" },
                { status: 400 }
            );
        }

        if (!id || !description || !type || !category || !amount || !date || !paymentMethod) {
            return NextResponse.json(
                { error: "Datos incompletos en la transacción" },
                { status: 400 }
            );
        }

        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: accessToken });

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
                    [newId, description, type, category, amount, date, paymentMethod], // Filas de la transacción
                ],
            },
        });
        revalidateTag('collection')
        return NextResponse.json({ message: "Transacción guardada exitosamente" });
    } catch (error: any) {
        console.error("Error al guardar la transacción:", error.message || error);
        return NextResponse.json(
            { error: `Error al guardar la transacción` },
            { status: 404 }
        );
        return NextResponse.json(
            { error: "Error al guardar la transacción" },
            { status: 500 }
        );
    }
}



