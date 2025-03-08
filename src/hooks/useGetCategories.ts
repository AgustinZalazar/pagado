"use client"
import { Category } from "@/types/category";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_NEXTAUTH_URL;

export const useGetCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        const fetchCategories = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${API_URL}/api/category`, { cache: 'no-store', credentials: 'include' });
                const { formattedCategories } = await response.json();

                if (formattedCategories) {
                    setCategories(formattedCategories);
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
        return () => {
            controller.abort();
        };
    }, []);

    return { categories, isLoading };
};


export const useEditCategory = () => {
    const [isLoadingEdit, setIsLoadingEdit] = useState<boolean>(true);
    const controller = new AbortController();

    const editCategory = async (data: Category) => {
        try {
            setIsLoadingEdit(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/category`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const id = await response.json();
            // setCategory(id)
            // if (formattedCategories) {
            //     setCategories(formattedCategories);
            // }
        } catch (error) {
            console.error("Error fetching transactions:", error);
        } finally {
            setIsLoadingEdit(false);
        }
    };


    return { editCategory, isLoadingEdit };
}