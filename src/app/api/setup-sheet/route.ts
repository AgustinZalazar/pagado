import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { accessToken, sheetId } = await req.json();

        if (!accessToken || !sheetId) {
            return NextResponse.json({ error: "Missing required parameters: accessToken or sheetId" }, { status: 400 });
        }

        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: accessToken });
        const sheets = google.sheets({ version: "v4", auth });

        // First, get existing sheets
        const spreadsheet = await sheets.spreadsheets.get({
            spreadsheetId: sheetId,
        });

        const existingSheets = spreadsheet.data.sheets || [];
        const existingSheetTitles = existingSheets.map(sheet => sheet.properties?.title);

        // Required sheets: Config and monthly sheets
        const months = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];
        const requiredSheets = ["Config", ...months];

        const sheetsToCreate = requiredSheets.filter(
            sheetName => !existingSheetTitles.includes(sheetName)
        );

        if (sheetsToCreate.length > 0) {
            // Only create sheets that don't exist
            const requests = sheetsToCreate.map(sheetName => ({
                addSheet: {
                    properties: {
                        title: sheetName,
                    },
                },
            }));

            await sheets.spreadsheets.batchUpdate({
                spreadsheetId: sheetId,
                requestBody: { requests },
            });
        }

        // Set up Config sheet headers if they don't exist
        const configHeaders = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: "Config!A1:O1"
        });

        if (!configHeaders.data.values?.[0]?.length) {
            // Set up the three sections in Config: Categories, Accounts, and Methods
            await sheets.spreadsheets.values.update({
                spreadsheetId: sheetId,
                range: "Config!A1:O1",
                valueInputOption: "RAW",
                requestBody: {
                    values: [[
                        // Categories (A-E)
                        "id", "nombre", "color", "porcentaje", "icon",
                        "", // Empty column F as separator
                        // Accounts (G-J)
                        "id", "title", "type", "color",
                        "", // Empty column K as separator
                        // Methods (L-O)
                        "id", "title", "cardType", "idAccount"
                    ]]
                },
            });
        }

        // Set up monthly sheets headers if they don't have them
        for (const month of months) {
            const monthHeaders = await sheets.spreadsheets.values.get({
                spreadsheetId: sheetId,
                range: `${month}!A1:I1`
            });

            if (!monthHeaders.data.values?.[0]?.length) {
                await sheets.spreadsheets.values.update({
                    spreadsheetId: sheetId,
                    range: `${month}!A1:I1`,
                    valueInputOption: "RAW",
                    requestBody: {
                        values: [[
                            "id", "description", "type", "category",
                            "amount", "currency", "date", "account", "method"
                        ]]
                    },
                });
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error al configurar el Google Sheet:", error);
        return NextResponse.json({ error: "Failed to setup spreadsheet" }, { status: 500 });
    }
}
