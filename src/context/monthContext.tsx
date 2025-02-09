"use client"
import { createContext, useContext, useState, ReactNode } from "react";


const getMonthName = (date: string) => {
    const formatter = new Intl.DateTimeFormat("es-ES", { month: "long", timeZone: "UTC" });
    return formatter.format(new Date(date)).replace(/^\w/, (c) => c.toUpperCase()); // Primera letra mayúscula
};

// Definir el tipo del contexto
interface MonthContextType {
    selectedMonth: string;
    setSelectedMonth: (month: string) => void;
}

const MonthContext = createContext<MonthContextType | undefined>(undefined);

export const MonthProvider = ({ children }: { children: ReactNode }) => {
    const date = new Date().toISOString();
    const initialDate = date.split("T")[0];
    console.log(initialDate)
    const [selectedMonth, setSelectedMonth] = useState<string>(initialDate); // Formato "YYYY-MM-DD"

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
