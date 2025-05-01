"use client"

import { useEffect, useState } from "react";
import { SummaryMethod } from "@/types/PaymentMethod";
import { useQuery } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_NEXTAUTH_URL;

// export const useTotalByMethod = (month: string) => {
//     const [isLoadingMethod, setIsLoadingMethod] = useState<boolean>(false)
//     const [totalMethod, setTotalMethod] = useState<SummaryMethod>()
//     const [totalMetCurrentMonth, setTotalMetCurrentMonth] = useState<number>(0)

//     useEffect(() => {
//         const fetchTotalByMethod = async () => {
//             try {
//                 setIsLoadingMethod(true);
//                 const response = await fetch(`${API_URL}/api/transaction/method?month=${month}`);
//                 const data = await response.json();
//                 if (data) {
//                     setTotalMethod(data);
//                     setTotalMetCurrentMonth(data.currentMonth.total)
//                 }

//             } catch (error) {
//                 console.error("Error fetching total by method:", error);
//             } finally {
//                 setIsLoadingMethod(false);
//             }
//         };

//         fetchTotalByMethod();
//     }, [month]);

//     return { totalMethod, isLoadingMethod, totalMetCurrentMonth };
// };

export const useTotalByMethod = (month: string) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["totalByMethod", month], // Cachea la consulta por mes
        queryFn: async () => {
            const response = await fetch(`${API_URL}api/transaction/method?month=${month}`);
            if (!response.ok) throw new Error(`Error: ${response.statusText}`);

            return response.json();
        },
        staleTime: 1000 * 60 * 5, // Cachea los datos por 5 minutos
    });

    return {
        totalMethod: data || null,
        totalMetCurrentMonth: data?.currentMonth?.total || 0,
        isLoading,
        error,
    };
};