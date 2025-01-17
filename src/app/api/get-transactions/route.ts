import { auth } from "@/auth";
import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    // const session = await auth();
    // console.log(session)
    try {
        const accessToken = '';
        const user = await fetch(`${process.env.NEXTAUTH_URL}/api/user/agusstiin.az@gmail.com`).then((res) => res.json());
        const { sheetId } = user;
        // console.log(accessToken, sheetId)
        if (!accessToken || !sheetId) {
            return NextResponse.json(
                { error: "Faltan parámetros: accessToken o sheetId" },
                { status: 400 }
            );
        }

        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: accessToken });

        const sheets = google.sheets({ version: "v4", auth });

        // Obtener el mes actual
        const now = new Date();
        const monthNames = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
        ];
        const currentMonth = monthNames[now.getMonth()];

        // Buscar el ID de la hoja correspondiente al mes actual
        const sheet = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
        const sheetForMonth = sheet.data.sheets?.find(
            (s) => s.properties?.title === currentMonth
        );
        if (!sheetForMonth) {
            console.log("error 41")
            return NextResponse.json(
                { error: `No se encontró la hoja para el mes: ${currentMonth}` },
                { status: 404 }
            );
        }

        // Leer los datos de la hoja del mes actual
        const range = `${currentMonth}!A:G`; // Ajusta el rango según la estructura de tu hoja
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range,
        });

        const rows = response.data.values || [];

        // Procesar los datos para excluir el encabezado (si existe)
        const [header, ...transactions] = rows;
        console.log({ ts: transactions })
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