export const renderFormattedAmount = (
    amount: number | string,
    currency: string,
    type: "income" | "expense",
    locale: string
) => {
    const parsedAmount = typeof amount === "string"
        ? parseFloat(amount.replace(",", "."))
        : typeof amount === "number"
            ? amount
            : 0;

    const parts = formatCurrency(parsedAmount, currency, locale);
    const color = type === "expense" ? "text-[#dc4a46]" : "text-[#008f4c]";
    const sign = type === "expense" ? "-" : "+";

    return (
        <p className={`text-left font-medium ${color}`}>
            <span className="text-gray-700">{sign} </span>
            {parts.map((part, idx) => {
                if (part.type === "currency") {
                    return (
                        <span key={idx} className="text-gray-700 font-medium">
                            {part.value}
                        </span>
                    );
                }
                return part.value;
            })}
        </p>
    );
};

export const formatCurrency = (value: number, currency: string, locale: string) =>
    new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).formatToParts(value);