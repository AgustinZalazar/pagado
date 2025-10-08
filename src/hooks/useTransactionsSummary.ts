import { useQuery } from "@tanstack/react-query";
import { Transaction } from "@/types/transaction";
import { SummaryCategory } from "@/types/category";
import { SummaryMethod } from "@/types/PaymentMethod";
import { OtherCurrencies } from "@/types/Currency";

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
    otherCurrencies: OtherCurrencies
}

const calculateTotalsByCurrency = (transactions: Transaction[], defaultCurrency: string) => {
    // console.log({ defaultCurrency: defaultCurrency })
    const totals = {
        default: { income: 0, expenses: 0 },
        others: {} as Record<string, { income: number, expenses: number }>
    };

    for (const transaction of transactions) {
        const amount = parseFloat(transaction.amount.toString());
        const currency = transaction.currency;

        const target = currency === defaultCurrency
            ? totals.default
            : (totals.others[currency] ||= { income: 0, expenses: 0 });

        if (transaction.type === "income") {
            target.income += amount;
        } else {
            target.expenses += amount;
        }
    }

    return totals;
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


export const useTransactionsSummary = (
    currentMonth: string,
    previousMonth: string,
    defaultCurrency: string
): TransactionsSummary => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["transactionsSummary", currentMonth, previousMonth, defaultCurrency],
        enabled: !!currentMonth && !!previousMonth && !!defaultCurrency,
        queryFn: async () => {
            const currentRes = await fetch(`${API_URL}api/transaction?month=${currentMonth}`);
            const previousRes = await fetch(`${API_URL}api/transaction?month=${previousMonth}`);

            if (!currentRes.ok || !previousRes.ok)
                throw new Error("Error al cargar transacciones");

            const { formattedTransactions: currentTransactions } = await currentRes.json();
            const { formattedTransactions: previousTransactions } = await previousRes.json();

            // Filter out invalid transactions with null values
            const validCurrentTransactions = currentTransactions.filter((t: Transaction) => t.id !== null && t.type !== null);
            const validPreviousTransactions = previousTransactions.filter((t: Transaction) => t.id !== null && t.type !== null);

            // console.log({ currentRes: validCurrentTransactions, previousRes: validPreviousTransactions })

            // 🎯 Calcula totales solo para moneda por defecto
            const currentTotals = calculateTotalsByCurrency(validCurrentTransactions, defaultCurrency);
            const previousTotals = calculateTotalsByCurrency(validPreviousTransactions, defaultCurrency);

            const categorySummary = calculateCategorySummary(
                validCurrentTransactions.filter((t: Transaction) => t.currency === defaultCurrency),
                validPreviousTransactions.filter((t: Transaction) => t.currency === defaultCurrency)
            );

            const methodSummary = calculateMethodSummary(
                validCurrentTransactions.filter((t: Transaction) => t.currency === defaultCurrency),
                validPreviousTransactions.filter((t: Transaction) => t.currency === defaultCurrency)
            );
            // console.log({ defaultCurrency, currentTotals, previousTotals, categorySummary, methodSummary })
            // console.log("transactions summary hook called");
            // console.log({
            //     currentMonth,
            //     previousMonth,
            //     defaultCurrency,
            //     transactions: validCurrentTransactions,
            //     totalIncome: currentTotals.default.income,
            //     totalExpenses: currentTotals.default.expenses,
            //     totalLastIncome: previousTotals.default.income,
            //     totalLastExpenses: previousTotals.default.expenses,
            //     categorySummary,
            //     methodSummary,
            //     otherCurrencies: {
            //         current: currentTotals.others,
            //         previous: previousTotals.others
            //     }
            // })

            return {
                transactions: validCurrentTransactions,
                totalIncome: currentTotals.default.income,
                totalExpenses: currentTotals.default.expenses,
                totalLastIncome: previousTotals.default.income,
                totalLastExpenses: previousTotals.default.expenses,
                categorySummary,
                methodSummary,
                otherCurrencies: {
                    current: currentTotals.others,
                    previous: previousTotals.others
                }
            };
        },
        staleTime: 1000 * 60 * 5,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    return {
        transactions: data?.transactions || [],
        totalIncome: data?.totalIncome || 0,
        totalExpenses: data?.totalExpenses || 0,
        totalLastIncome: data?.totalLastIncome || 0,
        totalLastExpenses: data?.totalLastExpenses || 0,
        categorySummary: data?.categorySummary || { totalCategory: null, totalCat: 0 },
        methodSummary: data?.methodSummary || { totalMethod: null, totalMetCurrentMonth: 0 },
        isLoading,
        error,
        otherCurrencies: data?.otherCurrencies || { current: {}, previous: {} }
    };
};
