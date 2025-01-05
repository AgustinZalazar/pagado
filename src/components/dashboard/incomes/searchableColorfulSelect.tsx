"use client";

import React, { useState } from "react";
import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectValue,
    SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Option {
    id: string;
    label: string;
    color: string; // Color asociado a la opción
}

const colors = [
    "bg-red-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-gray-500",
    "bg-pink-500",
    "bg-teal-500",
];

const SearchableColorfulSelect = ({ field }: any) => {
    const [options, setOptions] = useState<Option[]>([
        { id: "1", label: "Home", color: "bg-yellow-500" },
        { id: "2", label: "Food", color: "bg-green-500" },
        { id: "3", label: "Entertainment", color: "bg-blue-500" },
        { id: "4", label: "Study", color: "bg-purple-500" },
        { id: "5", label: "Car", color: "bg-red-500" },
        { id: "6", label: "Services", color: "bg-gray-500" },
        { id: "7", label: "Travel", color: "bg-teal-500" },
        { id: "8", label: "Health", color: "bg-pink-500" },
    ]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateOption = () => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const newOption: Option = { id: Date.now().toString(), label: searchTerm, color: randomColor };
        setOptions((prev) => [...prev, newOption]);
        setSelectedOption(newOption.id); // Seleccionar la nueva opción creada
        setSearchTerm(""); // Resetear búsqueda
        setIsOpen(false); // Cerrar el select
    };

    return (
        <div className="w-full max-w-sm">
            <Select
                onValueChange={(value) => field.onChange(value)}
                defaultValue={field.value}
                open={isOpen}
                onOpenChange={setIsOpen}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an option or create one" />
                </SelectTrigger>
                <SelectContent>
                    <div className="p-2">
                        {/* Campo de búsqueda */}
                        <Input
                            placeholder="Buscar o crear"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {/* Opciones filtradas */}
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <SelectItem key={option.id} value={option.id}>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`w-3 h-3 rounded-full ${option.color}`}
                                    ></span>
                                    {option.label}
                                </div>
                            </SelectItem>
                        ))
                    ) : (
                        <div className="p-2 text-center text-sm text-gray-500">
                            No se encontraron opciones.
                        </div>
                    )}
                    {/* Botón para crear nueva opción */}
                    {searchTerm && !filteredOptions.some((option) => option.label === searchTerm) && (
                        <div className="p-2 flex items-center justify-center">
                            <Button variant="outline" size="sm" onClick={handleCreateOption}>
                                Crear {searchTerm}
                            </Button>
                        </div>
                    )}
                </SelectContent>
            </Select>
        </div>
    );
};

export default SearchableColorfulSelect;
