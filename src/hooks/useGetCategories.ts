"use client"
import { Category } from "@/types/category";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_NEXTAUTH_URL;

export const useGetCategories = () => {
    const { data: categories = [], isLoading, error } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/api/category`);

            if (!response.ok) throw new Error(`Error: ${response.statusText}`);

            const { formattedCategories } = await response.json();
            return formattedCategories;
        },
        staleTime: 1000 * 60 * 10,
    });

    return { categories, isLoading, error };
};


export const useEditCategory = (setOpenPopover: Dispatch<SetStateAction<boolean>>) => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (data: Category) => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/category`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            return response.json();
        },
        onMutate: () => {
            // Muestra el toast de loading cuando se inicie la mutación
            const loadingToast = toast.loading("Editando categoría...");
            return loadingToast;  // Devolvemos el toast para manipularlo más tarde
        },
        onSuccess: (data, variables, context) => {
            // Muestra el toast de éxito y cierra el toast de loading
            toast.success("¡Categoría editada correctamente!");
            toast.dismiss(context); // Cierra el toast de loading
        },
        onError: (error, variables, context) => {
            // Muestra el toast de error y cierra el toast de loading
            toast.error("Error al editar la categoría.");
            toast.dismiss(context); // Cierra el toast de loading
            console.error(error); // Log para depuración
        },
        onSettled: (data, error, variables, context) => {
            // Asegura que el toast de loading se cierre si no se ha hecho aún
            if (context) {
                toast.dismiss(context); // Cierra el toast de loading
            }
            queryClient.invalidateQueries({ queryKey: ['categories'] })
            setOpenPopover(false)
        },
    });

    return {
        editCategory: mutation.mutate, // Exponemos la función `mutate` para que se pueda usar en el componente
        isLoadingEdit: mutation.isPending, // Estado de carga
        isSuccess: mutation.isSuccess,  // Si la mutación fue exitosa
        isError: mutation.isError,  // Si la mutación falló
        error: mutation.error, // Error si existe
    };
};


export const useDeleteCategory = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (categoryId: string) => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/category`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(categoryId),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            return response.json();
        },
        onMutate: () => {
            const toastId = toast.loading("Eliminando categoría...");
            return { toastId };
        },
        onSuccess: (_, __, context) => {
            console.log(context)
            if (context?.toastId) {
                toast.dismiss(context.toastId);
            }
            toast.success("¡Categoría eliminada correctamente!");
        },
        onError: (error, _, context) => {
            if (context?.toastId) {
                toast.dismiss(context.toastId);
            }
            toast.error("Error al eliminar la categoría.");
            console.error(error);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });

    return {
        deleteCategory: mutation.mutate,
        isLoadingDelete: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,
    };
};