"use client"
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { LanguageSelector } from './language-selector'
import { MobileMenu } from './mobile-menu'
import { useLanguage } from './language-context'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '../ui/button'
import { LogIn } from 'lucide-react'

const Header = () => {
    const { t } = useLanguage()
    const pathname = usePathname();
    const router = useRouter()
    const hideNavbar = pathname.includes('/dashboard') || pathname.includes('/login');
    if (hideNavbar) {
        return null;
    }
    return (
        <header className="px-4 lg:px-24 h-14 flex items-center border-b backdrop-blur-sm bg-white/80 sticky top-0 z-50 transition-all duration-300">
            <Link className="flex items-center justify-center group" href="/">
                {/* <Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-primary group-hover:scale-110 transition-transform duration-200" />
                    <span className="ml-2 text-base sm:text-lg font-bold">FinanceBot</span> */}
                <Image src="/logo_black.png" alt="Pagado" width={100} height={100} />
            </Link>

            {/* Desktop Navigation */}
            <nav className="ml-auto hidden md:flex gap-4 sm:gap-6 items-center">
                <Link
                    className="text-sm font-medium hover:text-primary transition-colors duration-200 hover:scale-105"
                    href="#features"
                >
                    {t("nav.features")}
                </Link>
                <Link
                    className="text-sm font-medium hover:text-primary transition-colors duration-200 hover:scale-105"
                    href="#dashboard"
                >
                    {t("nav.dashboard")}
                </Link>
                <Link
                    className="text-sm font-medium hover:text-primary transition-colors duration-200 hover:scale-105"
                    href="#pricing"
                >
                    {t("nav.pricing")}
                </Link>
                {/* <Link
                    className="text-sm font-medium hover:text-primary transition-colors duration-200 hover:scale-105"
                    href="#contact"
                >
                    {t("nav.contact")}
                </Link> */}
                {/* Language Selector in Desktop Navigation */}
                <div className="ml-2">
                    <LanguageSelector />
                </div>
                {/* Login Button */}
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

            {/* Mobile Navigation */}
            <div className="ml-auto flex items-center space-x-2 md:hidden">
                <LanguageSelector />
                <MobileMenu />
            </div>
        </header>
    )
}

export default Header