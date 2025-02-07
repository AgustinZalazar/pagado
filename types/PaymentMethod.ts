export interface SummaryMethod {
    "currentMonth": {
        "month": string,
        "method": string,
        "total": number
    },
    "previousMonth": {
        "month": string,
        "method": string,
        "total": number
    },
    percentage: string
}