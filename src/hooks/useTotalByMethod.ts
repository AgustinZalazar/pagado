"use client"

import { useEffect, useState } from "react";
import { SummaryMethod } from "@/types/PaymentMethod";

const API_URL = process.env.NEXT_PUBLIC_NEXTAUTH_URL;

export const useTotalByMethod = (month: string) => {
    const [isLoadingMethod, setIsLoadingMethod] = useState<boolean>(false)
    const [totalMethod, setTotalMethod] = useState<SummaryMethod>()
    const [totalMetCurrentMonth, setTotalMetCurrentMonth] = useState<number>(0)

    useEffect(() => {
        const fetchTotalByMethod = async () => {
            try {
                setIsLoadingMethod(true);
                const response = await fetch(`${API_URL}/api/transaction/method?month=${month}`);
                const data = await response.json();
                if (data) {
                    setTotalMethod(data);
                    setTotalMetCurrentMonth(data.currentMonth.total)
                }

            } catch (error) {
                console.error("Error fetching total by method:", error);
            } finally {
                setIsLoadingMethod(false);
            }
        };

        fetchTotalByMethod();
    }, [month]);

    return { totalMethod, isLoadingMethod, totalMetCurrentMonth };
};