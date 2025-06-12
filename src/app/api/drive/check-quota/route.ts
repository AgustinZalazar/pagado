import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const REQUIRED_SPACE_BYTES = 1024 * 1024; // 1MB minimum required space

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Missing or invalid authorization token' }, { status: 401 });
        }

        const accessToken = authHeader.split(' ')[1];

        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: accessToken });

        const drive = google.drive({ version: 'v3', auth: oauth2Client });

        // Get the user's storage quota
        const about = await drive.about.get({
            fields: 'storageQuota'
        });

        const quota = about.data.storageQuota;

        if (!quota || !quota.limit || !quota.usage) {
            return NextResponse.json({ error: 'Unable to fetch storage quota' }, { status: 500 });
        }

        const availableSpace = Number(quota.limit) - Number(quota.usage);

        if (availableSpace < REQUIRED_SPACE_BYTES) {
            return NextResponse.json({
                error: 'Insufficient storage space',
                required: REQUIRED_SPACE_BYTES,
                available: availableSpace
            }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            availableSpace
        });

    } catch (error) {
        console.error('Drive quota check error:', error);
        return NextResponse.json({
            error: 'Failed to check drive quota',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 