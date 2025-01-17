import { Payment } from "@/types/payment"

export const getTotalIncomes = async (incomes: Payment[]) => {
    if (!incomes) return 0
    const incomeItems = incomes.filter((item) => item.type === "income");

    const total = incomeItems.reduce((acc, item) => {
        const amount = parseFloat(item.amount.toString());
        return acc + (isNaN(amount) ? 0 : amount);
    }, 0);

    return total;
}