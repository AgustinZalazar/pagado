import { google } from "googleapis";
import { NextApiRequest, NextApiResponse } from "next";

export async function POST(req: Request) {
    if (req.method === "POST") {
        const { accessToken, sheetId } = await req.json();
        // console.log(accessToken, sheetId)

        if (!accessToken || !sheetId) {
            // res.status(400).json({ error: "Faltan parámetros: accessToken o sheetId" });
            return new Response('Faltan parámetros: accessToken o sheetId', { status: 400 })
        }

        try {
            const auth = new google.auth.OAuth2();
            auth.setCredentials({ access_token: accessToken });

            const sheets = google.sheets({ version: "v4", auth });

            // Configurar la hoja "Config"
            const configSheetResponse = await sheets.spreadsheets.batchUpdate({
                spreadsheetId: sheetId,
                requestBody: {
                    requests: [
                        {
                            addSheet: {
                                properties: {
                                    title: "Config",
                                },
                            },
                        },
                    ],
                },
            });

            const configSheetId =
                configSheetResponse.data.replies?.[0]?.addSheet?.properties?.sheetId;

            if (!configSheetId) {
                throw new Error("No se pudo crear la hoja 'Config'.");
            }

            // Insertar cabeceras y categorías predeterminadas
            const categories = [
                { id: 0, name: "Servicio", color: "#FF5733", porcentaje: 0 },
                { id: 1, name: "Alquiler", color: "#33FF57", porcentaje: 0 },
                { id: 2, name: "Entretenimiento", color: "#3357FF", porcentaje: 0 },
                { id: 3, name: "Comida", color: "#FF33A6", porcentaje: 0 },
            ];

            const categoryRows = categories.map((category) => [
                { userEnteredValue: { numberValue: category.id } },
                { userEnteredValue: { stringValue: category.name } },
                { userEnteredValue: { stringValue: category.color } },
                { userEnteredValue: { numberValue: category.porcentaje } }
            ]);

            await sheets.spreadsheets.batchUpdate({
                spreadsheetId: sheetId,
                requestBody: {
                    requests: [
                        {
                            updateCells: {
                                range: {
                                    sheetId: configSheetId,
                                    startRowIndex: 0,
                                    startColumnIndex: 0,
                                    endRowIndex: 1,
                                    endColumnIndex: 10,
                                },
                                rows: [
                                    {
                                        values: [
                                            { userEnteredValue: { stringValue: "id" } },
                                            { userEnteredValue: { stringValue: "nombre" } },
                                            { userEnteredValue: { stringValue: "color" } },
                                            {}, {}, {},
                                            { userEnteredValue: { stringValue: "id" } },
                                            { userEnteredValue: { stringValue: "title" } },
                                            { userEnteredValue: { stringValue: "type" } },
                                            { userEnteredValue: { stringValue: "color" } }
                                        ],
                                    },
                                ],
                                fields: "userEnteredValue",
                            },
                        },
                        {
                            updateCells: {
                                range: {
                                    sheetId: configSheetId,
                                    startRowIndex: 1,
                                    startColumnIndex: 0,
                                    endRowIndex: 1 + categories.length,
                                    endColumnIndex: 4,
                                },
                                rows: categoryRows.map((row) => ({ values: row })),
                                fields: "userEnteredValue",
                            },
                        },
                        {
                            updateCells: {
                                range: {
                                    sheetId: configSheetId,
                                    startRowIndex: 0,
                                    startColumnIndex: 11,
                                    endRowIndex: 1,
                                    endColumnIndex: 15,
                                },
                                rows: [
                                    {
                                        values: [
                                            { userEnteredValue: { stringValue: "id" } },
                                            { userEnteredValue: { stringValue: "title" } },
                                            { userEnteredValue: { stringValue: "cardType" } },
                                            { userEnteredValue: { stringValue: "idAccount" } }
                                        ],
                                    },
                                ],
                                fields: "userEnteredValue",
                            },
                        }
                    ],
                },
            });

            // Crear hojas para cada mes
            const months = [
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

            const requests = months.map((month) => ({
                addSheet: {
                    properties: {
                        title: month,
                    },
                },
            }));

            await sheets.spreadsheets.batchUpdate({
                spreadsheetId: sheetId,
                requestBody: { requests },
            });

            // Configurar la tabla "Transacciones" en cada hoja de mes
            for (const month of months) {
                const sheet = await sheets.spreadsheets.get({
                    spreadsheetId: sheetId,
                });

                const sheetIdForMonth = sheet.data.sheets
                    ?.find((s) => s.properties?.title === month)
                    ?.properties?.sheetId;

                if (sheetIdForMonth !== undefined) {
                    await sheets.spreadsheets.batchUpdate({
                        spreadsheetId: sheetId,
                        requestBody: {
                            requests: [
                                {
                                    updateCells: {
                                        range: {
                                            sheetId: sheetIdForMonth,
                                            startRowIndex: 0,
                                            startColumnIndex: 0,
                                            endRowIndex: 1,
                                            endColumnIndex: 7,
                                        },
                                        rows: [
                                            {
                                                values: [
                                                    { userEnteredValue: { stringValue: "id" } },
                                                    { userEnteredValue: { stringValue: "descripcion" } },
                                                    { userEnteredValue: { stringValue: "tipo" } },
                                                    { userEnteredValue: { stringValue: "categoria" } },
                                                    { userEnteredValue: { stringValue: "monto" } },
                                                    { userEnteredValue: { stringValue: "fecha" } },
                                                    { userEnteredValue: { stringValue: "metodo de pago" } },
                                                ],
                                            },
                                        ],
                                        fields: "userEnteredValue",
                                    },
                                },
                            ],
                        },
                    });
                } else {
                    console.warn(`No se encontró la hoja para el mes: ${month}`);
                }
            }
            return new Response('Google Sheet configurado exitosamente', { status: 200 })
            // res.status(200).json({ message: "Google Sheet configurado exitosamente" });
        } catch (error) {
            console.error("Error al configurar el Google Sheet:", error);
            return new Response('Error al configurar el Google Sheet', { status: 500 })
            // res.status(500).json({ error: "Error al configurar el Google Sheet" });
        }
    } else {
        // res.status(405).json({ error: "Método no permitido" });
        return new Response('Método no permitido', { status: 405 })
    }
}
