import { Transaction } from "@/types/transaction"

export const getTotalExpenses = async (expenses: Transaction[]) => {
    if (!expenses) return 0
    const incomeItems = expenses.filter((item) => item.type === "expense");

    const total = incomeItems.reduce((acc, item) => {
        const amount = parseFloat(item.amount.toString());
        return acc + (isNaN(amount) ? 0 : amount);
    }, 0);

    return total;
}