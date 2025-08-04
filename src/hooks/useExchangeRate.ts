"use client"
import { useQuery } from "@tanstack/react-query";

const API_URL = `https://dolarapi.com/v1/`;
// const TOKEN = process.env.API_SECRET_TOKEN;

export const useGetExchangeRate = () => {
    const { data: exchange = {}, isLoading, error } = useQuery({
        queryKey: ["exchange"],
        queryFn: async () => {
            const [dolares, cotizaciones, btc_usd, eth_usd, sol_usd] = await Promise.all([
                fetch(`${API_URL}dolares`).then((res) => res.json()),
                fetch(`${API_URL}cotizaciones`).then((res) => res.json()),
                fetch(`${API_URL}exchanges/monedas/btc/usd`).then((res) => res.json()),
                fetch(`${API_URL}exchanges/monedas/eth/usd`).then((res) => res.json()),
                fetch(`${API_URL}exchanges/monedas/sol/usd`).then((res) => res.json()),
            ]);

            return {
                dolares,
                cotizaciones,
                btc_usd,
                eth_usd,
                sol_usd,
            };
        },
        staleTime: 1000 * 60 * 10,
    });

    return { exchange, isLoading, error };
};
