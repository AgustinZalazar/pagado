export const getMonthName = (date: string) => {
    const formatter = new Intl.DateTimeFormat("es-ES", { month: "long", timeZone: "UTC" });
    return formatter.format(new Date(date)).replace(/^\w/, (c) => c.toUpperCase()); // Primera letra mayúscula
};


export const getMonthNameByDate = (date: Date) => {
    return date.toLocaleString("es-ES", { month: "long", timeZone: "UTC" })
        .replace(/^\w/, (c) => c.toUpperCase());
};