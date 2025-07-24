import { Category, SummaryCategory } from "@/types/category";
import { Transaction } from "@/types/transaction";
import { useQuery } from "@tanstack/react-query";


const API_URL = process.env.NEXT_PUBLIC_NEXTAUTH_URL;

type ResultadoPorCategoria = {
    name: string;
    value: number;
    color: string;
    icon: string | null;
};

export const useTotalByCategory = (month: string) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["totalByCategory", month], // Cachea la consulta por mes
        queryFn: async () => {
            console.log(month)
            const transactionRes = await fetch(`${API_URL}api/transaction?month=${month}`);
            if (!transactionRes.ok) throw new Error(`Error: ${transactionRes.statusText}`);
            const { formattedTransactions } = await transactionRes.json();

            // console.log({ formattedTransactions: formattedTransactions })

            const response = await fetch(`${API_URL}api/category`);
            if (!response.ok) throw new Error(`Error: ${response.statusText}`);
            const { formattedCategories } = await response.json()

            // console.log({ formattedCategories: formattedCategories })

            const soloGastos = formattedTransactions.filter((g: Transaction) => g.type === "expense");

            // Agrupar y acumular montos por categoría
            const acumulado: { [categoria: string]: number } = {};

            for (const gasto of soloGastos) {
                const categoria = gasto.category;
                const monto = parseFloat(gasto.amount) || 0;

                if (!acumulado[categoria]) acumulado[categoria] = 0;
                acumulado[categoria] += monto;
            }

            // Convertir el acumulado en un array enriquecido con color e ícono
            const resultado: ResultadoPorCategoria[] = Object.entries(acumulado).map(
                ([categoria, total]) => {
                    const categoriaInfo = formattedCategories.find((c: Category) => c.nombre === categoria);
                    return {
                        name: categoria,
                        value: total,
                        color: categoriaInfo?.color || "#000000",
                        icon: categoriaInfo?.icon || null,
                    };
                }
            );

            return resultado;
        },
        staleTime: 1000 * 60 * 5, // Cachea los datos por 5 minutos
    });

    return {
        totalByCategory: data || [],
        isLoading,
        error,
    };
};