export type Payment = {
    id: string,
    description: string,
    type: "income" | "expense",
    category: string,
    amount: number,
    date: string,
    typeOfPayment: string
}