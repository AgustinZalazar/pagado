"use client"

import { useState } from "react"
import { LogIn, Menu, X } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLanguage } from "./language-context"
import { useRouter } from "next/navigation"

export function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false)
    const { t } = useLanguage()
    const router = useRouter()

    return (
        <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="p-2">
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-sm border-b shadow-lg z-50">
                    <nav className="flex flex-col p-4 space-y-4">
                        <Link
                            className="text-sm font-medium hover:text-primary transition-colors duration-200"
                            href="#features"
                            onClick={() => setIsOpen(false)}
                        >
                            {t("nav.features")}
                        </Link>
                        <Link
                            className="text-sm font-medium hover:text-primary transition-colors duration-200"
                            href="#dashboard"
                            onClick={() => setIsOpen(false)}
                        >
                            {t("nav.dashboard")}
                        </Link>
                        <Link
                            className="text-sm font-medium hover:text-primary transition-colors duration-200"
                            href="#pricing"
                            onClick={() => setIsOpen(false)}
                        >
                            {t("nav.pricing")}
                        </Link>
                        {/* <Link
                            className="text-sm font-medium hover:text-primary transition-colors duration-200"
                            href="#contact"
                            onClick={() => setIsOpen(false)}
                        >
                            {t("nav.contact")}
                        </Link> */}
                        <Button
                            variant="outline"
                            size="sm"
                            className="ml-2 hover:scale-105 transition-all duration-200 border-blue-200 hover:bg-blue-50 bg-transparent"
                            onClick={() => router.push("/login")}
                        >
                            <LogIn className="w-4 h-4 mr-2" />
                            {t("nav.login")}
                        </Button>
                    </nav>
                </div>
            )}
        </div>
    )
}
