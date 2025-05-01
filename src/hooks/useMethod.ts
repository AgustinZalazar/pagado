"use client"
import { Method } from "@/types/Accounts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_NEXTAUTH_URL;

export const useGetMethods = () => {
    const { data: methods = [], isLoading, error } = useQuery({
        queryKey: ["methods"],
        queryFn: async () => {
            const response = await fetch(`${API_URL}api/methods`);

            if (!response.ok) throw new Error(`Error: ${response.statusText}`);

            const { formattedMethods } = await response.json();
            return formattedMethods;
        },
        staleTime: 1000 * 60 * 10,
    });

    return { methods, isLoading, error };
};


export const useCreateMethod = (setOpenPopover: Dispatch<SetStateAction<boolean>>) => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (data: Method) => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/methods`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            return response.json();
        },
        onMutate: () => {
            const toastId = toast.loading("Creando metodo de pago...");
            return { toastId };
        },
        onSuccess: (_, __, context) => {
            if (context?.toastId) {
                toast.dismiss(context.toastId);
            }
            toast.success("¡Metodo de pago creada correctamente!");
        },
        onError: (error, _, context) => {
            if (context?.toastId) {
                toast.dismiss(context.toastId);
            }
            toast.error("Error al crear el metodo de pago.");
            console.error(error);
        },
        onSettled: (context) => {
            queryClient.invalidateQueries({ queryKey: ['methods'] })
            setOpenPopover(false)
        },
    });

    return {
        createMethod: mutation.mutate,
        isLoadingCreate: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,
    };
};


export const useEditMethod = (setOpenPopover: Dispatch<SetStateAction<boolean>>) => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (data: Method) => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/methods`, {
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
            const toastId = toast.loading("Editando metodo de pago...");
            return { toastId };
        },
        onSuccess: (_, __, context) => {
            if (context?.toastId) {
                toast.dismiss(context.toastId);
            }
            toast.success("¡Metodo de pago editada correctamente!");
        },
        onError: (error, _, context) => {
            if (context?.toastId) {
                toast.dismiss(context.toastId);
            }
            toast.error("Error al editar el metodo de pago.");
            console.error(error);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['methods'] })
            setOpenPopover(false)
        },
    });

    return {
        editMethod: mutation.mutate,
        isLoadingEdit: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,
    };
};


export const useDeleteMethod = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (methodId: string) => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/methods`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(methodId),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            return response.json();
        },
        onMutate: () => {
            const toastId = toast.loading("Eliminando metodo de pago...");
            return { toastId };
        },
        onSuccess: (_, __, context) => {
            if (context?.toastId) {
                toast.dismiss(context.toastId);
            }
            toast.success("¡Metodo de pago eliminada correctamente!");
        },
        onError: (error, _, context) => {
            if (context?.toastId) {
                toast.dismiss(context.toastId);
            }
            toast.error("Error al eliminar el metodo de pago.");
            console.error(error);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["methods"] });
        },
    });

    return {
        deleteMethod: mutation.mutate,
        isLoadingDelete: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,
    };
};