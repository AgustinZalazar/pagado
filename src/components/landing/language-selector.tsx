"use client"

import { useState } from "react"
import { ChevronDown, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { languages, useLanguage } from "./language-context"

export function LanguageSelector() {
    const [isOpen, setIsOpen] = useState(false)
    const { language, setLanguage } = useLanguage()

    return (
        <div className="relative">
            <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-3 border-gray-200 hover:bg-gray-50"
            >
                <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{language.code.toUpperCase()}</span>
                <span className="sm:hidden">{language.flag}</span>
                <ChevronDown className="w-2 h-2 sm:w-3 sm:h-3" />
            </Button>

            {isOpen && (
                <>
                    {/* Mobile backdrop */}
                    <div className="fixed inset-0 z-40 md:hidden" onClick={() => setIsOpen(false)} />

                    <Card
                        className={`absolute z-50 bg-white border shadow-lg ${
                            // Mobile: full width dropdown from top
                            "top-full mt-2 left-0 right-0 mx-4 md:mx-0 md:right-0 md:left-auto md:w-48"
                            }`}
                    >
                        <CardContent className="p-2">
                            <div className="space-y-1">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => {
                                            setLanguage(lang)
                                            setIsOpen(false)
                                        }}
                                        className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-blue-50 transition-colors ${language.code === lang.code ? "bg-blue-100 text-blue-700" : "text-gray-700"
                                            }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <span className="text-lg">{lang.flag}</span>
                                            <div>
                                                <span className="font-medium">{lang.name}</span>
                                                <div className="text-xs text-gray-500">{lang.code.toUpperCase()}</div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    )
}
