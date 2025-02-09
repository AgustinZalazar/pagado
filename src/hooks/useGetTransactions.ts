"use client"
import { getTotalExpenses } from "@/actions/getTotalExpenses";
import { getTotalIncomes } from "@/actions/getTotalIncomes";
import { Payment } from "@/types/payment";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_NEXTAUTH_URL;

export const useGetTransactions = (month: string) => {
    const [transactions, setTransactions] = useState<Payment[]>([]);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${API_URL}/api/transaction?month=${month}`, { next: { tags: ["transactions"] } });
                const { formattedTransactions } = await response.json();

                if (formattedTransactions) {
                    setTransactions(formattedTransactions);
                    const totalIncomes = await getTotalIncomes(formattedTransactions)
                    const totalExpenses = await getTotalExpenses(formattedTransactions)
                    setTotalIncome(totalIncomes)
                    setTotalExpenses(totalExpenses)
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    return { transactions, totalIncome, totalExpenses, isLoading };
};