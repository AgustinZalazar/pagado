"use client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getTotalExpenses } from "@/src/actions/getTotalExpenses";
import { getTotalIncomes } from "@/src/actions/getTotalIncomes";
import { Transaction } from "@/types/transaction";
import { Dispatch, SetStateAction } from "react";

const API_URL = process.env.NEXT_PUBLIC_NEXTAUTH_URL;

export const useGetTransactions = (month: string) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["transactions", month], // 🟢 Cachea por mes
        queryFn: async () => {
            const response = await fetch(`${API_URL}api/transaction?month=${month}`);
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


export const useCreateTransaction = (setOpenPopover: Dispatch<SetStateAction<boolean>>) => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (data: Transaction) => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}api/transaction`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            return response.json();
        },
        onMutate: () => {
            const toastId = toast.loading("Creando transaccion...");
            return { toastId };
        },
        onSuccess: (_, __, context) => {
            if (context?.toastId) {
                toast.dismiss(context.toastId);
            }
            toast.success("¡Transaccion creada correctamente!");
        },
        onError: (error, _, context) => {
            if (context?.toastId) {
                toast.dismiss(context.toastId);
            }
            toast.error("Error al crear la transaccion.");
            console.error(error);
        },
        onSettled: (context) => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
            queryClient.invalidateQueries({ queryKey: ['transactionsSummary'] })
            setOpenPopover(false)
        },
    });

    return {
        createTransaction: mutation.mutate,
        isLoadingCreate: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,
    };
};


export const useEditTransaction = (setOpenPopover: Dispatch<SetStateAction<boolean>>) => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (data: Transaction) => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}api/transaction`, {
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
            const toastId = toast.loading("Editando transaccion...");
            return { toastId };
        },
        onSuccess: (_, __, context) => {
            if (context?.toastId) {
                toast.dismiss(context.toastId);
            }
            toast.success("¡Transaccion editada correctamente!");
        },
        onError: (error, _, context) => {
            if (context?.toastId) {
                toast.dismiss(context.toastId);
            }
            toast.error("Error al editar la cuenta.");
            console.error(error);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
            queryClient.invalidateQueries({ queryKey: ['transactionsSummary'] })
            setOpenPopover(false)
        },
    });

    return {
        editTransaction: mutation.mutate,
        isLoadingEdit: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,
    };
};


export const useDeleteTransaction = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (transactionId: string) => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}api/transaction`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(transactionId),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            return response.json();
        },
        onMutate: () => {
            const toastId = toast.loading("Eliminando transaccion...");
            return { toastId };
        },
        onSuccess: (_, __, context) => {
            if (context?.toastId) {
                toast.dismiss(context.toastId);
            }
            toast.success("¡Transaccion eliminada correctamente!");
        },
        onError: (error, _, context) => {
            if (context?.toastId) {
                toast.dismiss(context.toastId);
            }
            toast.error("Error al eliminar la transaccion.");
            console.error(error);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["transactionsSummary"] });
        },
    });

    return {
        deleteTransaction: mutation.mutate,
        isLoadingDelete: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,
    };
};



export const useGetExpensesByMonth = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["transactionsByMonth"],
        queryFn: async () => {
            const response = await fetch(`${API_URL}api/transaction/summary/bymonth`);
            if (!response.ok) throw new Error(`Error: ${response.statusText}`);

            const resp = await response.json();
            console.log("fetching transactions by month");
            // console.log({ resp: resp })

            return resp;
        },
        staleTime: 1000 * 60 * 5, // 🟢 Cachea por 5 minutos antes de volver a hacer la solicitud
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    return {
        summary: data || [],
        isLoading,
        error,
    };
};