export interface Category {
    id: string;
    nombre: string;
    color?: string;
    porcentaje: number;
    icon: string;
}

export interface SummaryCategory {
    "currentMonth": {
        "month": string,
        "category": string,
        "total": number
    },
    "previousMonth": {
        "month": string,
        "category": string,
        "total": number
    }
    "percentage": string
}