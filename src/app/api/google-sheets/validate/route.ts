import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const REQUIRED_SHEETS = ["Config", "Transactions", "Categories", "Methods"];

async function validateSheetStructure(sheets: any, spreadsheetId: string) {
    try {
        // Check if all required sheets exist and have headers
        const sheetsData = await sheets.spreadsheets.get({
            spreadsheetId,
            includeGridData: true,
        });

        const existingSheets = sheetsData.data.sheets || [];
        const sheetTitles = existingSheets.map((sheet: { properties?: { title?: string } }) => sheet.properties?.title);

        // Check if all required sheets exist
        const hasAllSheets = REQUIRED_SHEETS.every(requiredSheet =>
            sheetTitles.includes(requiredSheet)
        );

        if (!hasAllSheets) {
            return false;
        }

        // Check if sheets have their headers (indicating they're properly set up)
        const configHeaders = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: "Config!A1:B1"
        });
        if (!configHeaders.data.values?.[0] || configHeaders.data.values[0].length < 2) {
            return false;
        }

        const transactionsHeaders = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: "Transactions!A1:G1"
        });
        if (!transactionsHeaders.data.values?.[0] || transactionsHeaders.data.values[0].length < 7) {
            return false;
        }

        const categoriesHeaders = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: "Categories!A1:E1"
        });
        if (!categoriesHeaders.data.values?.[0] || categoriesHeaders.data.values[0].length < 5) {
            return false;
        }

        const methodsHeaders = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: "Methods!A1:D1"
        });
        if (!methodsHeaders.data.values?.[0] || methodsHeaders.data.values[0].length < 4) {
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error validating sheet structure:', error);
        return false;
    }
}

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Missing or invalid authorization token' }, { status: 401 });
        }

        const accessToken = authHeader.split(' ')[1];

        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: accessToken });

        const sheets = google.sheets({ version: 'v4', auth: oauth2Client });
        const drive = google.drive({ version: 'v3', auth: oauth2Client });

        // Get user's spreadsheet ID from query params
        const { searchParams } = new URL(request.url);
        const sheetId = searchParams.get('sheetId');

        if (!sheetId) {
            return NextResponse.json({ error: 'Sheet ID is required' }, { status: 400 });
        }

        try {
            // First check if the file exists and is a spreadsheet
            const file = await drive.files.get({
                fileId: sheetId,
                fields: 'id, name, mimeType'
            });

            if (file.data.mimeType !== 'application/vnd.google-apps.spreadsheet') {
                return NextResponse.json({ exists: false, error: 'Invalid file type' });
            }

            // Then validate the sheet structure
            const isValid = await validateSheetStructure(sheets, sheetId);

            return NextResponse.json({
                exists: true,
                isValid,
                needsSetup: !isValid
            });

        } catch (error) {
            // If we get a 404 or permission error, the sheet doesn't exist or is inaccessible
            return NextResponse.json({ exists: false });
        }

    } catch (error) {
        console.error('Sheet validation error:', error);
        return NextResponse.json({
            error: 'Failed to validate sheet',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 