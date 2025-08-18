"use client"

import {
    Check,
    MessageCircle,
    TrendingUp,
    Wallet,
    Zap,
    Bot,
    ImageIcon,
    Mic,
    Users,
    Calendar,
    PiggyBank,
    CreditCard,
    Monitor,
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DashboardPreview } from "./dashboard-preview"
import { AnimatedSection } from "./animated-section"
import { SophisticatedHeroBackground } from "./sophisticated-hero-background"
import { AnimatedTextGradient } from "./animated-text-gradient"
import { FloatingCards } from "./floating-cards"
import { SophisticatedWhatsAppBot } from "./sophisticated-whatsapp-bot"
import { CurrencySelector } from "./currency-selector"
import { LanguageSelector } from "./language-selector"
import { MobileMenu } from "./mobile-menu"
import { useLanguage } from "./language-context"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { DataStorageSection } from "./data-storage-section"

export default function Component() {
    const { t } = useLanguage()
    const router = useRouter()

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1">
                {/* Hero Section with Sophisticated Background */}
                <section className="w-full py-8 sm:py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden">
                    <SophisticatedHeroBackground />
                    <FloatingCards />

                    <div className="container px-4 md:px-6 relative z-10">
                        <AnimatedSection>
                            <div className="flex flex-col items-center space-y-4 text-center">
                                <div className="space-y-4">
                                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
                                        <Badge
                                            variant="secondary"
                                            className="hover:scale-105 transition-transform duration-200 backdrop-blur-sm bg-white/20 border-white/30"
                                        >
                                            <MessageCircle className="w-3 h-3 mr-1" />
                                            {t("hero.whatsapp.integration")}
                                        </Badge>
                                        <CurrencySelector />
                                    </div>
                                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tighter leading-tight">
                                        {t("hero.title")} <AnimatedTextGradient>{t("hero.title.highlight")}</AnimatedTextGradient>
                                    </h1>
                                    <p className="mx-auto max-w-[700px] text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground backdrop-blur-sm px-4">
                                        {t("hero.subtitle")}
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                                    <Button
                                        size="lg"
                                        className="h-11 sm:h-12 px-6 sm:px-8 hover:scale-105 transition-all duration-200 hover:shadow-lg backdrop-blur-sm bg-blue-600/90 hover:bg-blue-600 text-sm sm:text-base"
                                        onClick={() => router.push("/login")}
                                    >
                                        {t("hero.cta.primary")}
                                    </Button>
                                    {/* <Button
                                        variant="outline"
                                        size="lg"
                                        className="h-11 sm:h-12 px-6 sm:px-8 hover:scale-105 transition-all duration-200 hover:shadow-lg backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20 text-sm sm:text-base"
                                    >
                                        {t("hero.cta.secondary")}
                                    </Button> */}
                                </div>
                                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 text-xs sm:text-sm text-muted-foreground backdrop-blur-sm bg-white/10 rounded-full px-4 py-2">
                                    <div className="flex items-center space-x-2">
                                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                                        <span>{t("hero.no.credit.card")}</span>
                                    </div>
                                    <span className="hidden sm:inline">•</span>
                                    <div className="flex items-center space-x-2">
                                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                                        <span>{t("hero.free.plan")}</span>
                                    </div>
                                </div>
                            </div>
                        </AnimatedSection>
                    </div>
                </section>

                {/* Dashboard Preview Section */}
                <section
                    id="dashboard"
                    className="w-full py-8 sm:py-12 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50 to-white"
                >
                    <div className="container px-4 md:px-6">
                        <AnimatedSection>
                            <div className="text-center mb-8 sm:mb-12">
                                <Badge variant="secondary" className="mb-4">
                                    <Monitor className="w-3 h-3 mr-1" />
                                    {t("dashboard.badge")}
                                </Badge>
                                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">
                                    {t("dashboard.title")}
                                </h2>
                                <p className="mx-auto max-w-[700px] text-muted-foreground text-sm sm:text-base md:text-lg lg:text-xl mt-4 px-4">
                                    {t("dashboard.subtitle")}
                                </p>
                            </div>
                        </AnimatedSection>

                        <AnimatedSection delay={300}>
                            <div className="max-w-6xl mx-auto relative">
                                <DashboardPreview />
                            </div>
                        </AnimatedSection>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="w-full py-8 sm:py-12 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6">
                        <AnimatedSection>
                            <div className="text-center mb-8 sm:mb-12">
                                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">
                                    {t("features.title")}
                                </h2>
                                <p className="mx-auto max-w-[700px] text-muted-foreground text-sm sm:text-base md:text-lg lg:text-xl mt-4 px-4">
                                    {t("features.subtitle")}
                                </p>
                            </div>
                        </AnimatedSection>

                        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-12 mb-8 sm:mb-12">
                            {[
                                {
                                    icon: TrendingUp,
                                    title: t("features.income.expense.title"),
                                    description: t("features.income.expense.desc"),
                                },
                                {
                                    icon: PiggyBank,
                                    title: t("features.savings.title"),
                                    description: t("features.savings.desc"),
                                },
                                {
                                    icon: CreditCard,
                                    title: t("features.debt.title"),
                                    description: t("features.debt.desc"),
                                },
                                {
                                    icon: Calendar,
                                    title: t("features.recurring.title"),
                                    description: t("features.recurring.desc"),
                                },
                                {
                                    icon: Users,
                                    title: t("features.shared.title"),
                                    description: t("features.shared.desc"),
                                },
                                {
                                    icon: MessageCircle,
                                    title: t("features.whatsapp.title"),
                                    description: t("features.whatsapp.desc"),
                                },
                            ].map((feature, index) => (
                                <AnimatedSection key={feature.title} delay={index * 100}>
                                    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-2 group border-blue-100 hover:border-blue-200 h-full">
                                        <CardHeader className="p-4 sm:p-6">
                                            <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-200" />
                                            <CardTitle className="group-hover:text-blue-600 transition-colors duration-200 text-sm sm:text-base">
                                                {feature.title}
                                            </CardTitle>
                                            <CardDescription className="text-xs sm:text-sm">{feature.description}</CardDescription>
                                        </CardHeader>
                                    </Card>
                                </AnimatedSection>
                            ))}
                        </div>
                    </div>
                </section>

                {/* WhatsApp Bot Section */}
                <section className="w-full py-8 sm:py-12 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50/50 to-cyan-50/50">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
                            <AnimatedSection>
                                <div className="space-y-4 text-center lg:text-left">
                                    <Badge variant="secondary">
                                        <Bot className="w-3 h-3 mr-1" />
                                        {t("bot.badge")}
                                    </Badge>
                                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter">{t("bot.title")}</h2>
                                    <p className="text-muted-foreground text-sm sm:text-base md:text-lg">{t("bot.subtitle")}</p>
                                    <div className="space-y-3">
                                        {[
                                            t("bot.feature.nlp"),
                                            t("bot.feature.receipt"),
                                            t("bot.feature.voice"),
                                            t("bot.feature.insights"),
                                        ].map((feature, index) => (
                                            <AnimatedSection key={feature} delay={index * 100}>
                                                <div className="flex items-center space-x-2 group justify-center lg:justify-start">
                                                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 group-hover:scale-110 transition-transform duration-200" />
                                                    <span className="text-sm sm:text-base">{feature}</span>
                                                </div>
                                            </AnimatedSection>
                                        ))}
                                    </div>
                                </div>
                            </AnimatedSection>

                            <AnimatedSection delay={300}>
                                <SophisticatedWhatsAppBot />
                            </AnimatedSection>
                        </div>
                    </div>
                </section>

                {/* Data Storage Section */}
                <DataStorageSection />

                {/* Pricing Section */}
                <section id="pricing" className="w-full py-8 sm:py-12 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6">
                        <AnimatedSection>
                            <div className="text-center mb-8 sm:mb-12">
                                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">
                                    {t("pricing.title")}
                                </h2>
                                <p className="mx-auto max-w-[700px] text-muted-foreground text-sm sm:text-base md:text-lg lg:text-xl mt-4 px-4">
                                    {t("pricing.subtitle")}
                                </p>
                            </div>
                        </AnimatedSection>

                        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8 max-w-4xl mx-auto">
                            <AnimatedSection delay={200}>
                                <Card className="relative hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-blue-100">
                                    <CardHeader className="p-4 sm:p-6">
                                        <CardTitle className="text-xl sm:text-2xl">{t("pricing.free.title")}</CardTitle>
                                        <CardDescription className="text-sm sm:text-base">{t("pricing.free.desc")}</CardDescription>
                                        <div className="text-2xl sm:text-3xl font-bold">
                                            $0<span className="text-base sm:text-lg font-normal text-muted-foreground">/mes</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
                                        <div className="space-y-3">
                                            {[
                                                t("pricing.basic.tracking"),
                                                t("pricing.income.management"),
                                                t("pricing.simple.categorization"),
                                                t("pricing.whatsapp.access"),
                                                t("pricing.basic.dashboard"),
                                            ].map((feature, index) => (
                                                <div key={feature} className="flex items-center space-x-2 group">
                                                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 group-hover:scale-110 transition-transform duration-200" />
                                                    <span className="text-xs sm:text-sm">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <Button
                                            className="w-full bg-transparent hover:scale-105 transition-all duration-200 border-blue-200 hover:bg-blue-50 text-sm sm:text-base"
                                            variant="outline"
                                        >
                                            {t("pricing.free.cta")}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </AnimatedSection>

                            <AnimatedSection delay={400}>
                                <Card className="relative border-blue-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-600">
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                        <Badge className="bg-blue-600 text-white animate-pulse">{t("pricing.popular")}</Badge>
                                    </div>
                                    <CardHeader className="p-4 sm:p-6">
                                        <CardTitle className="text-xl sm:text-2xl">{t("pricing.pro.title")}</CardTitle>
                                        <CardDescription className="text-sm sm:text-base">{t("pricing.pro.desc")}</CardDescription>
                                        <div className="text-2xl sm:text-3xl font-bold">
                                            $9.99<span className="text-base sm:text-lg font-normal text-muted-foreground">/mes</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
                                        <div className="space-y-3">
                                            {[
                                                { text: t("pricing.everything.free"), icon: Check },
                                                { text: t("pricing.ai.receipt"), icon: ImageIcon },
                                                { text: t("pricing.voice.processing"), icon: Mic },
                                                { text: t("pricing.advanced.insights"), icon: Bot },
                                                { text: t("pricing.smart.budget"), icon: Zap },
                                                { text: t("pricing.investment.tracking"), icon: TrendingUp },
                                            ].map((feature, index) => (
                                                <div key={feature.text} className="flex items-center space-x-2 group">
                                                    <feature.icon
                                                        className={`w-3 h-3 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform duration-200 ${feature.icon === Check ? "text-blue-500" : "text-blue-600"
                                                            }`}
                                                    />
                                                    <span className="text-xs sm:text-sm">{feature.text}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <Button className="w-full hover:scale-105 transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-sm sm:text-base">
                                            {t("pricing.pro.cta")}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </AnimatedSection>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="w-full py-8 sm:py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-600 to-cyan-600 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-cyan-600/90"></div>
                    <div className="container px-4 md:px-6 relative z-10">
                        <AnimatedSection>
                            <div className="flex flex-col items-center space-y-4 text-center">
                                <div className="space-y-4">
                                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">
                                        {t("cta.title")}
                                    </h2>
                                    <p className="mx-auto max-w-[600px] text-white/80 text-sm sm:text-base md:text-lg lg:text-xl px-4">
                                        {t("cta.subtitle")}
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                                    <Button
                                        size="lg"
                                        variant="secondary"
                                        className="h-11 sm:h-12 px-6 sm:px-8 hover:scale-105 transition-all duration-200 bg-white text-blue-600 hover:bg-gray-50 text-sm sm:text-base"
                                        onClick={() => router.push("/login")}
                                    >
                                        <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                        {t("cta.whatsapp")}
                                    </Button>
                                </div>
                            </div>
                        </AnimatedSection>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
                <p className="text-xs text-muted-foreground text-center sm:text-left">
                    © 2025 Pagado. {t("footer.rights")}
                </p>
                <nav className="sm:ml-auto flex flex-wrap gap-4 sm:gap-6 justify-center sm:justify-end">
                    <Link
                        className="text-xs hover:underline underline-offset-4 hover:text-blue-600 transition-colors duration-200"
                        href="/terminos-condiciones"
                    >
                        {t("footer.terms")}
                    </Link>
                    <Link
                        className="text-xs hover:underline underline-offset-4 hover:text-blue-600 transition-colors duration-200"
                        href="/politica-privacidad"
                    >
                        {t("footer.privacy")}
                    </Link>
                    {/* <Link
                        className="text-xs hover:underline underline-offset-4 hover:text-blue-600 transition-colors duration-200"
                        href="#contact"
                    >
                        {t("nav.contact")}
                    </Link> */}
                </nav>
            </footer>
        </div>
    )
}
