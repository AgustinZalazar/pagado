export function getMonthsOfYear(locale: string): { mes: string; fecha: string }[] {
    const months = [];
    const year = new Date().getFullYear();
    const formatter = new Intl.DateTimeFormat(locale === "es" ? "es-ES" : "en-US", { month: "long" });

    for (let i = 0; i < 12; i++) {
        const date = new Date(year, i, 1);
        const monthName = formatter.format(date);
        months.push({
            mes: monthName.charAt(0).toUpperCase() + monthName.slice(1),
            fecha: date.toISOString().split("T")[0], // Formato YYYY-MM-DD
        });
    }

    return months;
}