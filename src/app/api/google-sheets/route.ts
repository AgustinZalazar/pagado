import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function POST(req: Request) {
    try {
        const today = new Date();
        const year = today.getFullYear();
        const { accessToken } = await req.json();
        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: accessToken });

        const drive = google.drive({ version: "v3", auth });

        // 1. Busca si existe un archivo con el nombre "PagadoService"
        const searchResponse = await drive.files.list({
            q: `name = 'PagadoService${year}' and mimeType = 'application/vnd.google-apps.spreadsheet'`,
            fields: "files(id, name)",
        });

        const existingFile = searchResponse.data.files?.[0];
        if (existingFile) {
            // Si el archivo ya existe, retorna su ID
            return NextResponse.json({ id: existingFile.id, message: "El archivo ya existe" });
        }
        else {
            // 2. Si no existe, crea un nuevo archivo
            const fileMetadata = {
                name: `PagadoService${year}`,
                mimeType: "application/vnd.google-apps.spreadsheet",
            };

            const createResponse = await drive.files.create({
                requestBody: fileMetadata,
                fields: "id",
            });

            return NextResponse.json({ id: createResponse.data.id, message: "Archivo creado exitosamente" });
        }

    } catch (error) {
        console.error("Error al gestionar el Google Sheet:", error);
        return NextResponse.json({ error: "Error al gestionar el Google Sheet" }, { status: 500 });
    }
}
