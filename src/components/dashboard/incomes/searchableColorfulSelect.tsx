"use client";

import React, { useState, useEffect } from "react";
import { motion, useAnimate, stagger } from "motion/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
    id: string;
    label: string;
    color: string;
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

export const SearchableColorfulSelect = ({ field }: any) => {
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
    const [isOpen, setIsOpen] = useState(false);

    const [scope, animate] = useAnimate();

    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const staggerItems = stagger(0.1, { startDelay: 0.15 });

    useEffect(() => {
        if (!isOpen) return;

        const listItems = scope.current.querySelectorAll("li");
        const hasListItems = listItems.length > 0;

        animate(
            scope.current.querySelectorAll("ul"),
            {
                clipPath: isOpen
                    ? "inset(0% 0% 0% 0% round 12px)"
                    : "inset(10% 50% 90% 50% round 12px)",
            },
            {
                type: "spring",
                bounce: 0,
                duration: 0.5,
            },
        );

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

    const handleCreateOption = () => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const newOption: Option = {
            id: Date.now().toString(),
            label: searchTerm,
            color: randomColor,
        };
        setOptions((prev) => [...prev, newOption]);
        setSelectedOption(newOption.id);
        setSearchTerm("");
        setIsOpen(false);
    };

    return (
        <div className="relative w-full" ref={scope}>
            <motion.button
                type="button" // <---- Cambiado a "button"
                whileTap={{ scale: 0.97 }}
                className="flex w-full items-center justify-between rounded-lg border p-3 bg-white dark:bg-neutral-900"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {selectedOption
                        ? options.find((opt) => opt.id === selectedOption)?.label
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
                                    className={`w-3 h-3 rounded-full ${option.color}`}
                                ></span>
                                {option.label}
                            </div>
                        </motion.li>
                    ))}

                    {filteredOptions.length === 0 && (
                        <div className="mt-2 flex items-center justify-center">
                            <Button variant="outline" onClick={handleCreateOption}>
                                Crear &quot;{searchTerm}&quot;
                            </Button>
                        </div>
                    )}
                </motion.ul>
            )}
        </div>
    );
};
