import { useQuery } from "@tanstack/react-query";
import { Transaction } from "@/types/transaction";
import { SummaryCategory } from "@/types/category";
import { SummaryMethod } from "@/types/PaymentMethod";

const API_URL = process.env.NEXT_PUBLIC_NEXTAUTH_URL;

interface TransactionsSummary {
    transactions: Transaction[];
    totalIncome: number;
    totalExpenses: number;
    totalLastIncome: number;
    totalLastExpenses: number;
    categorySummary: {
        totalCategory: SummaryCategory | null;
        totalCat: number;
    };
    methodSummary: {
        totalMethod: SummaryMethod | null;
        totalMetCurrentMonth: number;
    };
    isLoading: boolean;
    error: Error | null;
}

const calculateTotals = (transactions: Transaction[]) => {
    return transactions.reduce(
        (acc, transaction) => {
            const amount = parseFloat(transaction.amount.toString());
            if (transaction.type === "income") {
                acc.income += amount;
            } else {
                acc.expenses += amount;
            }
            return acc;
        },
        { income: 0, expenses: 0 }
    );
};

const calculateCategorySummary = (currentTransactions: Transaction[], previousTransactions: Transaction[]) => {
    // Calculate category totals for current month
    const categoryTotals = currentTransactions.reduce((acc, t) => {
        if (t.type === "expense" && t.category) {
            const category = t.category.trim();
            const amount = parseFloat(t.amount.toString());
            acc[category] = (acc[category] || 0) + amount;
        }
        return acc;
    }, {} as Record<string, number>);

    // Find top category for current month
    const topCategory = Object.entries(categoryTotals).reduce(
        (max, [category, total]) => (total > max.total ? { category, total } : max),
        { category: "", total: 0 }
    );

    // Calculate previous month's total for the same category
    const previousTotal = previousTransactions.reduce((total, t) => {
        if (t.type === "expense" && t.category?.trim() === topCategory.category) {
            return total + parseFloat(t.amount.toString());
        }
        return total;
    }, 0);

    // Calculate percentage change
    let percentage = previousTotal === 0
        ? "Nuevo gasto"
        : `${(((topCategory.total - previousTotal) / previousTotal) * 100).toFixed(2)}%`;

    return {
        totalCategory: {
            currentMonth: {
                month: "",  // These will be set by the component
                category: topCategory.category,
                total: topCategory.total
            },
            previousMonth: {
                month: "",  // These will be set by the component
                category: topCategory.category,
                total: previousTotal
            },
            percentage
        },
        totalCat: topCategory.total
    };
};

const calculateMethodSummary = (currentTransactions: Transaction[], previousTransactions: Transaction[]) => {
    // Calculate method totals for current month
    const methodTotals = currentTransactions.reduce((acc, t) => {
        if (t.type === "expense" && t.method) {
            const method = t.method.trim();
            const amount = parseFloat(t.amount.toString());
            acc[method] = (acc[method] || 0) + amount;
        }
        return acc;
    }, {} as Record<string, number>);

    // Find top method for current month
    const topMethod = Object.entries(methodTotals).reduce(
        (max, [method, total]) => (total > max.total ? { method, total } : max),
        { method: "", total: 0 }
    );

    // Calculate previous month's total for the same method
    const previousTotal = previousTransactions.reduce((total, t) => {
        if (t.type === "expense" && t.method?.trim() === topMethod.method) {
            return total + parseFloat(t.amount.toString());
        }
        return total;
    }, 0);

    // Calculate percentage change
    let percentage = previousTotal === 0
        ? "Nuevo gasto"
        : `${(((topMethod.total - previousTotal) / previousTotal) * 100).toFixed(2)}%`;

    return {
        totalMethod: {
            currentMonth: {
                month: "",  // These will be set by the component
                method: topMethod.method,
                total: topMethod.total
            },
            previousMonth: {
                month: "",  // These will be set by the component
                method: topMethod.method,
                total: previousTotal
            },
            percentage
        },
        totalMetCurrentMonth: topMethod.total
    };
};

export const useTransactionsSummary = (currentMonth: string, previousMonth: string): TransactionsSummary => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["transactionsSummary", currentMonth, previousMonth],
        queryFn: async () => {
            // Fetch current month transactions
            const currentResponse = await fetch(`${API_URL}api/transaction?month=${currentMonth}`);
            if (!currentResponse.ok) throw new Error(`Error: ${currentResponse.statusText}`);
            const { formattedTransactions: currentTransactions } = await currentResponse.json();

            // Fetch previous month transactions
            const previousResponse = await fetch(`${API_URL}api/transaction?month=${previousMonth}`);
            if (!previousResponse.ok) throw new Error(`Error: ${previousResponse.statusText}`);
            const { formattedTransactions: previousTransactions } = await previousResponse.json();

            // Calculate all summaries
            const currentTotals = calculateTotals(currentTransactions);
            const previousTotals = calculateTotals(previousTransactions);
            const categorySummary = calculateCategorySummary(currentTransactions, previousTransactions);
            const methodSummary = calculateMethodSummary(currentTransactions, previousTransactions);

            return {
                transactions: currentTransactions,
                totalIncome: currentTotals.income,
                totalExpenses: currentTotals.expenses,
                totalLastIncome: previousTotals.income,
                totalLastExpenses: previousTotals.expenses,
                categorySummary,
                methodSummary
            };
        },
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });

    return {
        transactions: data?.transactions || [],
        totalIncome: data?.totalIncome || 0,
        totalExpenses: data?.totalExpenses || 0,
        totalLastIncome: data?.totalLastIncome || 0,
        totalLastExpenses: data?.totalLastExpenses || 0,
        categorySummary: {
            totalCategory: data?.categorySummary.totalCategory || null,
            totalCat: data?.categorySummary.totalCat || 0
        },
        methodSummary: {
            totalMethod: data?.methodSummary.totalMethod || null,
            totalMetCurrentMonth: data?.methodSummary.totalMetCurrentMonth || 0
        },
        isLoading: isLoading,
        error: error as Error | null
    };
}; 