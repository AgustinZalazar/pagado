import { NextResponse } from "next/server";
import { google } from "googleapis";
import { auth } from "@/auth";
import { getMonthNameByDate } from "@/helpers/getMonthName";

export async function GET(request: Request) {
    const session = await auth();

    try {
        const url = new URL(request.url);
        const monthParam = url.searchParams.get("month");

        // console.log(monthParam)
        if (!monthParam) {
            return NextResponse.json(
                { error: "Falta el parámetro 'month' en la consulta" },
                { status: 400 }
            );
        }

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


        // Extraer manualmente año y mes del parámetro recibido
        const [year, month] = monthParam.split("-").map(Number);
        const requestedDate = new Date(Date.UTC(year, month - 1, 1));

        // Calcular el mes anterior correctamente
        const previousDate = new Date(Date.UTC(year, month - 2, 1));

        // Obtener los nombres de los meses correctamente
        const requestedMonth = getMonthNameByDate(requestedDate);
        const previousMonth = getMonthNameByDate(previousDate);

        // Obtener datos del mes solicitado y el anterior
        const getSheetData = async (monthName: string) => {
            const sheet = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
            const sheetForMonth = sheet.data.sheets?.find((s) => s.properties?.title === monthName);

            if (!sheetForMonth) return [];

            const range = `${monthName}!A:G`; // Ajusta el rango según la estructura de tu hoja
            const response = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range });

            const rows = response.data.values || [];
            const [header, ...transactions] = rows;
            return transactions.map((row) =>
                header.reduce((obj, key, index) => {
                    obj[key] = row[index] || null;
                    return obj;
                }, {} as Record<string, any>)
            );
        };

        const currentTransactions = await getSheetData(requestedMonth);
        const previousTransactions = await getSheetData(previousMonth);

        // Función para calcular la categoría con más gasto
        const getTopCategory = (transactions: any[]) => {
            const categoryTotals: Record<string, number> = {};

            transactions.forEach((t) => {
                if (t["type"] !== "income" && t["category"] && t["amount"]) {
                    const category = t["category"].trim();
                    const amount = parseFloat(t["amount"]);

                    if (!isNaN(amount)) {
                        categoryTotals[category] = (categoryTotals[category] || 0) + amount;
                    }
                }
            });

            // Encontrar la categoría con mayor gasto total
            const topCategory = Object.entries(categoryTotals).reduce(
                (max, [category, total]) => (total > max.total ? { category, total } : max),
                { category: "", total: 0 }
            );

            return topCategory;
        };

        const topCategoryCurrent = getTopCategory(currentTransactions);
        const topCategoryPrevious = getTopCategory(previousTransactions);
        // Calcular porcentaje de cambio
        let changePercentage = (currentTotal: number, previousTotal: number) => {
            if (previousTotal === 0) {
                return "Nuevo gasto";
            }

            const percentageChange = ((currentTotal - previousTotal) / previousTotal) * 100;
            return `${percentageChange.toFixed(2)}%`;
        };

        return NextResponse.json({
            currentMonth: {
                month: requestedMonth,
                category: topCategoryCurrent.category,
                total: topCategoryCurrent.total,
            },
            previousMonth: {
                month: previousMonth,
                category: topCategoryPrevious.category,
                total: topCategoryPrevious.total,
            },
            percentage: changePercentage(topCategoryCurrent.total, topCategoryPrevious.total),
        });
    } catch (error: any) {
        console.error("Error en el API:", error.message || error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}