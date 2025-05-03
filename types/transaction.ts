export type Transaction = {
    id: string,
    description: string,
    type: "income" | "expense",
    category: string,
    amount: number,
    date: string,
    account: string,
    method: string
}