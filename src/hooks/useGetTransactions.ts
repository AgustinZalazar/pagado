"use client"
import { getTotalExpenses } from "@/actions/getTotalExpenses";
import { getTotalIncomes } from "@/actions/getTotalIncomes";
import { Payment } from "@/types/payment";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_NEXTAUTH_URL;

// export const useGetTransactions = (month: string) => {
//     const [transactions, setTransactions] = useState<Payment[]>([]);
//     const [totalIncome, setTotalIncome] = useState(0);
//     const [totalExpenses, setTotalExpenses] = useState(0);
//     const [isLoading, setIsLoading] = useState<boolean>(true);

//     useEffect(() => {
//         const controller = new AbortController();
//         const signal = controller.signal;
//         const fetchTransactions = async () => {
//             try {
//                 setIsLoading(true);
//                 const response = await fetch(`${API_URL}/api/transaction?month=${month}`, { next: { tags: ["transactions"] } });
//                 const { formattedTransactions } = await response.json();

//                 if (formattedTransactions) {
//                     setTransactions(formattedTransactions);
//                     const totalIncomes = await getTotalIncomes(formattedTransactions)
//                     const totalExpenses = await getTotalExpenses(formattedTransactions)
//                     setTotalIncome(totalIncomes)
//                     setTotalExpenses(totalExpenses)
//                 }
//             } catch (error) {
//                 console.error("Error fetching transactions:", error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchTransactions();
//         return () => {
//             controller.abort();
//         };
//     }, [month]);

//     return { transactions, totalIncome, totalExpenses, isLoading };
// };

export const useGetTransactions = (month: string) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["transactions", month], // 🟢 Cachea por mes
        queryFn: async () => {
            const response = await fetch(`${API_URL}/api/transaction?month=${month}`);
            if (!response.ok) throw new Error(`Error: ${response.statusText}`);

            const { formattedTransactions } = await response.json();
            const totalIncome = await getTotalIncomes(formattedTransactions);
            const totalExpenses = await getTotalExpenses(formattedTransactions);

            return { transactions: formattedTransactions, totalIncome, totalExpenses };
        },
        staleTime: 1000 * 60 * 5, // 🟢 Cachea por 5 minutos antes de volver a hacer la solicitud
    });

    return {
        transactions: data?.transactions || [],
        totalIncome: data?.totalIncome || 0,
        totalExpenses: data?.totalExpenses || 0,
        isLoading,
        error,
    };
};