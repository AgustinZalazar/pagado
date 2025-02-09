"use client"
import { useRouter, useSearchParams } from "next/navigation";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";


// Definir el tipo del contexto
interface MonthContextType {
    selectedMonth: string;
    setSelectedMonth: (month: string) => void;
}

const MonthContext = createContext<MonthContextType | undefined>(undefined);

export const MonthProvider = ({ children }: { children: ReactNode }) => {
    const date = new Date().toISOString();
    const params = useSearchParams();
    const router = useRouter()
    const monthParam = params.get("date")
    const initialDate = date.split("T")[0];
    const [selectedMonth, setSelectedMonth] = useState<string>(monthParam ? monthParam : initialDate); // Formato "YYYY-MM-DD"

    useEffect(() => {
        if (monthParam) {
            setSelectedMonth(monthParam)
            router.refresh()
        }
    }, [monthParam])
    return (
        <MonthContext.Provider value={{ selectedMonth, setSelectedMonth }}>
            {children}
        </MonthContext.Provider>
    );
};

export const useMonth = () => {
    const context = useContext(MonthContext);
    if (!context) {
        throw new Error("useMonth debe usarse dentro de un MonthProvider");
    }
    return context;
};
