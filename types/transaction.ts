export type Transaction = {
    id: string,
    description: string,
    type: "income" | "expense",
    category: string,
    amount: number,
    currency: string,
    date: string,
    account: string,
    method: string
}