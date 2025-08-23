import { getUserSensitiveInfo } from "@/actions/getUserSensitiveInfo";
import { auth } from "@/auth";
import { google } from "googleapis";

async function getTransactionsByMonth() {
    const session = await auth();
    try {
        // const url = new URL(request.url);
        // const mailParam = url.searchParams.get("mail");
        // const authHeader = request.headers.get("authorization");
        // const token = authHeader?.split(" ")[1];
        // const expectedToken = process.env.API_SECRET_TOKEN;

        const mail = session?.user.email;
        const user = await getUserSensitiveInfo(mail as string);
        const { sheetId, accessToken } = user;

        if (!session) {
            // return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!sheetId) {
            // return NextResponse.json({ error: "Falta sheetId" }, { status: 400 });
        }

        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: accessToken });
        const sheets = google.sheets({ version: "v4", auth });

        const sheet = await sheets.spreadsheets.get({ spreadsheetId: sheetId!! });
        const monthSheets = sheet.data.sheets?.filter((s) => {
            const title = s.properties?.title;
            return title && /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+$/.test(title);
        });

        const monthOrder = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];

        const monthly = {
            expenses: Object.fromEntries(monthOrder.map((m) => [m, 0])),
            incomes: Object.fromEntries(monthOrder.map((m) => [m, 0])),
        };

        const daysOfWeek = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];
        const weekly = {
            expenses: Object.fromEntries(daysOfWeek.map((d) => [d, 0])),
            incomes: Object.fromEntries(daysOfWeek.map((d) => [d, 0])),
        };

        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1));

        for (const monthSheet of monthSheets || []) {
            const title = monthSheet.properties?.title;
            if (!title || !monthOrder.includes(title)) continue;

            const range = `${title}!A:Z`;
            const res = await sheets.spreadsheets.values.get({
                spreadsheetId: sheetId!!,
                range,
            });

            const rows = res.data.values || [];
            if (rows.length === 0) continue;

            const [header, ...transactions] = rows;

            const amountKey = header.find((h) => h.toLowerCase().includes("monto") || h.toLowerCase().includes("amount"));
            const typeKey = header.find((h) => h.toLowerCase() === "type");
            const dateKey = header.find((h) => h.toLowerCase().includes("fecha") || h.toLowerCase() === "date");

            if (!amountKey || !typeKey || !dateKey) continue;

            const formatted = transactions.map((row) =>
                header.reduce((obj, key, index) => {
                    obj[key] = row[index] || null;
                    return obj;
                }, {} as Record<string, string>)
            );

            for (const tx of formatted) {
                const amount = parseFloat(tx[amountKey]?.replace(",", ".") || "0");
                const type = tx[typeKey]?.toLowerCase();
                const date = new Date(tx[dateKey]);

                if (isNaN(amount) || isNaN(date.getTime())) continue;

                if (type === "expense") {
                    monthly.expenses[title] += amount;
                } else if (type === "income") {
                    monthly.incomes[title] += amount;
                }

                if (date >= startOfWeek && date <= now) {
                    const day = date.toLocaleDateString('es-AR', { weekday: 'short' }).toLowerCase();
                    if (daysOfWeek.includes(day)) {
                        if (type === "expense") {
                            weekly.expenses[day] += amount;
                        } else if (type === "income") {
                            weekly.incomes[day] += amount;
                        }
                    }
                }
            }
        }
        return { monthly, weekly };
    } catch (error: any) {
        // return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        console.log(error)
    }
}