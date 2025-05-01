"use client"
import { Account } from "@/types/Accounts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_NEXTAUTH_URL;

export const useGetAccounts = () => {
    const { data: accounts = [], isLoading, error } = useQuery({
        queryKey: ["accounts"],
        queryFn: async () => {
            const response = await fetch(`${API_URL}api/accounts`);

            if (!response.ok) throw new Error(`Error: ${response.statusText}`);

            const { formattedAccounts } = await response.json();
            return formattedAccounts;
        },
        staleTime: 1000 * 60 * 10,
    });

    return { accounts, isLoading, error };
};


export const useCreateAccount = (setOpenPopover: Dispatch<SetStateAction<boolean>>) => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (data: Account) => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}api/accounts`, {
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
            const toastId = toast.loading("Creando cuenta...");
            return { toastId };
        },
        onSuccess: (_, __, context) => {
            if (context?.toastId) {
                toast.dismiss(context.toastId);
            }
            toast.success("¡Cuenta creada correctamente!");
        },
        onError: (error, _, context) => {
            if (context?.toastId) {
                toast.dismiss(context.toastId);
            }
            toast.error("Error al crear la cuenta.");
            console.error(error);
        },
        onSettled: (context) => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] })
            setOpenPopover(false)
        },
    });

    return {
        createAccount: mutation.mutate,
        isLoadingCreate: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,
    };
};


export const useEditAccount = (setOpenPopover: Dispatch<SetStateAction<boolean>>) => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (data: Account) => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}api/accounts`, {
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
            const toastId = toast.loading("Editando cuenta...");
            return { toastId };
        },
        onSuccess: (_, __, context) => {
            if (context?.toastId) {
                toast.dismiss(context.toastId);
            }
            toast.success("¡Cuenta editada correctamente!");
        },
        onError: (error, _, context) => {
            if (context?.toastId) {
                toast.dismiss(context.toastId);
            }
            toast.error("Error al editar la cuenta.");
            console.error(error);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] })
            setOpenPopover(false)
        },
    });

    return {
        editAccount: mutation.mutate,
        isLoadingEdit: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,
    };
};


export const useDeleteAccount = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (accountId: string) => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}api/accounts`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(accountId),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            return response.json();
        },
        onMutate: () => {
            const toastId = toast.loading("Eliminando cuenta...");
            return { toastId };
        },
        onSuccess: (_, __, context) => {
            if (context?.toastId) {
                toast.dismiss(context.toastId);
            }
            toast.success("¡Cuenta eliminada correctamente!");
        },
        onError: (error, _, context) => {
            if (context?.toastId) {
                toast.dismiss(context.toastId);
            }
            toast.error("Error al eliminar la cuenta.");
            console.error(error);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
        },
    });

    return {
        deleteAccount: mutation.mutate,
        isLoadingDelete: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,
    };
};