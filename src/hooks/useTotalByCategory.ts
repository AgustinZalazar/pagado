"use client"

import { SummaryCategory } from "@/types/category";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_NEXTAUTH_URL;

// Hook para obtener el total por categoría
export const useTotalByCategory = (month: string) => {
    const [isLoadingCat, setIsLoadingCat] = useState<boolean>(false)
    const [totalCategory, setTotalCategory] = useState<SummaryCategory>()
    const [totalCat, setTotalCat] = useState<number>(0)

    useEffect(() => {
        const fetchTotalByCategory = async () => {
            try {
                setIsLoadingCat(true);
                const response = await fetch(`${API_URL}/api/transaction/category?month=${month}`);
                const data = await response.json();
                if (data) {
                    setTotalCategory(data);
                    setTotalCat(data.currentMonth.total)
                }
            } catch (error) {
                console.error("Error fetching total by category:", error);
            } finally {
                setIsLoadingCat(false);
            }
        };

        fetchTotalByCategory();
    }, [month]);

    return { totalCategory, isLoadingCat, totalCat };
};