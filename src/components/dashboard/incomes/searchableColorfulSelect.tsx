"use client";

import React, { useState, useEffect } from "react";
import { motion, useAnimate, stagger } from "motion/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Spinner } from "../spinnerLoading";
import { toast } from "@/components/hooks/use-toast";
import { colors } from "@/data/colors";

interface Option {
    id: string;
    nombre: string;
    color: string;
    porcentaje: number;
}

export const SearchableColorfulSelect = ({ field }: any) => {
    const [options, setOptions] = useState<Option[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const [scope, animate] = useAnimate();
    const getCategories = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/category`, { cache: 'no-store', credentials: 'include' }).then((resp) => resp.json())
            const { formattedCategories } = await response
            if (formattedCategories) {
                setOptions(formattedCategories)
                setIsLoading(false)
            }

        } catch (error) {
            console.log(error)
        }

    }

    async function createCategory(data: Option) {
        const newCategory = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/category`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }).then((resp) => resp.json());

        toast({
            title: "Listo!",
            description: (
                <p className="mt-2 w-[340px] rounded-md  p-4">
                    Categoria guardada correctamente!
                </p>
            ),
        })
        return newCategory
    }
    const filteredOptions = options.filter((option) =>
        option.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const staggerItems = stagger(0.1, { startDelay: 0.15 });

    useEffect(() => {
        getCategories();
    }, [])

    useEffect(() => {
        if (!isOpen) return;

        const listItems = scope.current.querySelectorAll("li");
        const hasListItems = listItems.length > 0;

        if (hasListItems) {
            animate(
                listItems,
                isOpen
                    ? { opacity: 1, scale: 1, filter: "blur(0px)" }
                    : { opacity: 0, scale: 0.3, filter: "blur(20px)" },
                { duration: 0.3, delay: isOpen ? staggerItems : 0 }
            );
        }
    }, [isOpen, animate, scope, staggerItems]);

    const handleCreateOption = async () => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        let newOption: Option = {
            id: "0",
            nombre: searchTerm,
            color: randomColor,
            porcentaje: 0
        };
        const idNewCategory = await createCategory(newOption)
        newOption = { ...newOption, id: idNewCategory }
        setOptions((prev) => [...prev, newOption]);
        setSelectedOption(newOption.id);
        setSearchTerm("");
        setIsOpen(false);
    };

    return (
        <div className="relative w-full" ref={scope}>
            <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                className="flex w-full items-center justify-between rounded-lg border p-3 bg-white dark:bg-neutral-900"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {selectedOption
                        ? options.find((opt) => opt.id === selectedOption)?.nombre
                        : "Selecciona una opcion o crea una"}
                </span>
                {isOpen ? (
                    <ChevronUpIcon size={16} className="text-gray-500" />
                ) : (
                    <ChevronDownIcon size={16} className="text-gray-500" />
                )}
            </motion.button>

            {isOpen && (
                <motion.ul
                    className={cn(
                        "absolute left-0 right-0 mt-2 max-h-60 overflow-y-auto rounded-lg border bg-white p-2 shadow-lg dark:bg-neutral-900 z-40",
                        isOpen ? "pointer-events-auto" : "pointer-events-none"
                    )}
                >
                    <>
                        {!isLoading ?
                            <>
                                <div className="mb-2">
                                    <Input
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Busca o crea una"
                                        className="w-full"
                                    />
                                </div>
                                {filteredOptions.map((option) => (
                                    <motion.li
                                        key={option.id}
                                        onClick={() => {
                                            setSelectedOption(option.id);
                                            field.onChange(option.id);
                                            setIsOpen(false);
                                        }}
                                        className="flex items-center justify-between p-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-800 cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`w-3 h-3 rounded-full`}
                                                style={{ background: option.color }}
                                            ></span>
                                            {option.nombre}
                                        </div>
                                    </motion.li>
                                ))}

                                {filteredOptions.length === 0 && (
                                    <div className="mt-2 flex items-center justify-center">
                                        <Button type="button" variant="outline" onClick={handleCreateOption}>
                                            Crear &quot;{searchTerm}&quot;
                                        </Button>
                                    </div>
                                )}
                            </>
                            :
                            <div className="flex justify-center items-center overflow-y-hidden py-3">
                                <Spinner />
                            </div>
                        }
                    </>
                </motion.ul>
            )}
        </div>
    );
};
