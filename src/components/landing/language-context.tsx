"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface Language {
    code: string
    name: string
    flag: string
}

export const languages: Language[] = [
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "en", name: "English", flag: "🇺🇸" },
]

interface Translations {
    [key: string]: {
        es: string
        en: string
    }
}

export const translations: Translations = {
    // Header
    "nav.features": { es: "Características", en: "Features" },
    "nav.dashboard": { es: "Panel", en: "Dashboard" },
    "nav.pricing": { es: "Precios", en: "Pricing" },
    "nav.contact": { es: "Contacto", en: "Contact" },

    // Hero Section
    "hero.whatsapp.integration": { es: "Integración con WhatsApp", en: "WhatsApp Integration" },
    "hero.title": { es: "Gestiona tus Finanzas a través de", en: "Manage your Finances through" },
    "hero.title.highlight": { es: "WhatsApp", en: "WhatsApp" },
    "hero.subtitle": {
        es: "Rastrea gastos, gestiona inversiones y controla tu presupuesto con nuestro bot inteligente de WhatsApp. Obtén insights impulsados por IA y nunca pierdas un detalle financiero.",
        en: "Track expenses, manage investments, and control your budget with our intelligent WhatsApp bot. Get AI-powered insights and never miss a financial detail.",
    },
    "hero.cta.primary": { es: "Comenzar gratis", en: "Start Free" },
    "hero.cta.secondary": { es: "Ver Demo", en: "View Demo" },
    "hero.no.credit.card": { es: "No se requiere tarjeta de crédito", en: "No credit card required" },
    "hero.free.plan": { es: "Plan gratuito disponible", en: "Free plan available" },

    // Dashboard Section
    "dashboard.badge": { es: "Panel en Vivo", en: "Live Dashboard" },
    "dashboard.title": { es: "Tu Panel Financiero", en: "Your Financial Dashboard" },
    "dashboard.subtitle": {
        es: "Ve todos tus datos financieros en un panel hermoso e intuitivo. Actualizado en tiempo real a través de WhatsApp.",
        en: "See all your financial data in a beautiful and intuitive dashboard. Updated in real-time through WhatsApp.",
    },

    // Dashboard Preview
    "dashboard.welcome": { es: "¡Bienvenido de vuelta, Juan!", en: "Welcome back, Juan!" },
    "dashboard.sync": { es: "Sincronización en vivo", en: "Live sync" },
    "dashboard.total.balance": { es: "Saldo Total", en: "Total Balance" },
    "dashboard.monthly.income": { es: "Ingresos", en: "Income" },
    "dashboard.monthly.expenses": { es: "Gastos", en: "Expenses" },
    "dashboard.savings": { es: "Ahorros", en: "Savings" },
    "dashboard.this.month": { es: "Este mes", en: "This month" },
    "dashboard.budget.summary": { es: "Resumen de Presupuesto", en: "Budget Summary" },
    "dashboard.recent.transactions": { es: "Transacciones Recientes", en: "Recent Transactions" },
    "dashboard.bot.activity": { es: "Última actividad del bot", en: "Latest bot activity" },

    // Features Section
    "features.title": {
        es: "Todo lo que Necesitas para Gestionar tu Dinero",
        en: "Everything You Need to Manage Your Money",
    },
    "features.subtitle": {
        es: "Desde el seguimiento simple de gastos hasta la gestión compleja de inversiones, todo a través de WhatsApp.",
        en: "From simple expense tracking to complex investment management, all through WhatsApp.",
    },
    "features.income.expense.title": { es: "Seguimiento de Ingresos y Gastos", en: "Income & Expense Tracking" },
    "features.income.expense.desc": {
        es: "Registra fácilmente tus ingresos y gastos a través de mensajes simples de WhatsApp. Obtén categorización instantánea e insights de gastos.",
        en: "Easily record your income and expenses through simple WhatsApp messages. Get instant categorization and spending insights.",
    },
    "features.savings.title": { es: "Ahorros e Inversiones", en: "Savings & Investments" },
    "features.savings.desc": {
        es: "Rastrea tus metas de ahorro y portafolio de inversiones. Monitorea el rendimiento y obtén recomendaciones personalizadas.",
        en: "Track your savings goals and investment portfolio. Monitor performance and get personalized recommendations.",
    },
    "features.debt.title": { es: "Gestión de Deudas", en: "Debt Management" },
    "features.debt.desc": {
        es: "Mantén un registro de tus deudas, horarios de pago y progreso hacia estar libre de deudas con recordatorios inteligentes.",
        en: "Keep track of your debts, payment schedules, and progress towards being debt-free with smart reminders.",
    },
    "features.recurring.title": { es: "Pagos Recurrentes", en: "Recurring Payments" },
    "features.recurring.desc": {
        es: "Nunca pierdas una factura. Configura el seguimiento de pagos recurrentes y recibe recordatorios oportunos para todas tus suscripciones.",
        en: "Never miss a bill. Set up recurring payment tracking and get timely reminders for all your subscriptions.",
    },
    "features.shared.title": { es: "Gastos Compartidos", en: "Shared Expenses" },
    "features.shared.desc": {
        es: "Divide facturas y rastrea gastos compartidos con amigos, familia o compañeros de cuarto. Mantén a todos responsables y al día.",
        en: "Split bills and track shared expenses with friends, family, or roommates. Keep everyone accountable and up to date.",
    },
    "features.whatsapp.title": { es: "Integración con WhatsApp", en: "WhatsApp Integration" },
    "features.whatsapp.desc": {
        es: "No necesitas descargar apps. Gestiona todo a través de WhatsApp con nuestro bot inteligente que entiende lenguaje natural.",
        en: "No need to download apps. Manage everything through WhatsApp with our intelligent bot that understands natural language.",
    },

    // WhatsApp Bot Section
    "bot.badge": { es: "Bot Impulsado por IA", en: "AI-Powered Bot" },
    "bot.title": {
        es: "Tu Asistente Personal de Finanzas en WhatsApp",
        en: "Your Personal Finance Assistant on WhatsApp",
    },
    "bot.subtitle": {
        es: "Simplemente envía un mensaje, foto o nota de voz a nuestro bot de WhatsApp. Nuestra IA entiende el contexto y categoriza automáticamente tus datos financieros.",
        en: "Simply send a message, photo, or voice note to our WhatsApp bot. Our AI understands context and automatically categorizes your financial data.",
    },
    "bot.feature.nlp": { es: "Procesamiento de lenguaje natural", en: "Natural language processing" },
    "bot.feature.receipt": { es: "Reconocimiento de fotos de recibos (Pro)", en: "Receipt photo recognition (Pro)" },
    "bot.feature.voice": { es: "Transcripción de mensajes de voz (Pro)", en: "Voice message transcription (Pro)" },
    "bot.feature.insights": { es: "Categorización inteligente e insights", en: "Smart categorization and insights" },

    // Pricing Section
    "pricing.title": { es: "Precios Simples y Transparentes", en: "Simple and Transparent Pricing" },
    "pricing.subtitle": {
        es: "Comienza gratis y actualiza cuando necesites características impulsadas por IA.",
        en: "Start free and upgrade when you need AI-powered features.",
    },
    "pricing.free.title": { es: "Plan Gratuito", en: "Free Plan" },
    "pricing.free.desc": {
        es: "Perfecto para comenzar con seguimiento básico de finanzas",
        en: "Perfect for getting started with basic finance tracking",
    },
    "pricing.free.cta": { es: "Comenzar Gratis", en: "Start Free" },
    "pricing.pro.title": { es: "Plan Pro", en: "Pro Plan" },
    "pricing.pro.desc": {
        es: "Características avanzadas de IA para usuarios avanzados",
        en: "Advanced AI features for power users",
    },
    "pricing.pro.cta": { es: "Comenzar plan Pro", en: "Start Pro Plan" },
    "pricing.popular": { es: "Más Popular", en: "Most Popular" },

    // Pricing Features
    "pricing.basic.tracking": { es: "Seguimiento básico de gastos", en: "Basic expense tracking" },
    "pricing.income.management": { es: "Gestión de ingresos", en: "Income management" },
    "pricing.simple.categorization": { es: "Categorización simple", en: "Simple categorization" },
    "pricing.whatsapp.access": { es: "Acceso al bot de WhatsApp", en: "WhatsApp bot access" },
    "pricing.basic.dashboard": { es: "Panel básico", en: "Basic dashboard" },
    "pricing.everything.free": { es: "Todo en Gratuito", en: "Everything in Free" },
    "pricing.ai.receipt": { es: "Reconocimiento IA de recibos", en: "AI receipt recognition" },
    "pricing.voice.processing": { es: "Procesamiento de mensajes de voz", en: "Voice message processing" },
    "pricing.advanced.insights": { es: "Insights avanzados de IA", en: "Advanced AI insights" },
    "pricing.smart.budget": { es: "Recomendaciones inteligentes de presupuesto", en: "Smart budget recommendations" },
    "pricing.investment.tracking": {
        es: "Seguimiento y análisis de inversiones",
        en: "Investment tracking and analysis",
    },

    // CTA Section
    "cta.title": { es: "¿Listo para Tomar Control de tus Finanzas?", en: "Ready to Take Control of Your Finances?" },
    "cta.subtitle": {
        es: "Únete a miles de usuarios que ya están gestionando su dinero de manera más inteligente con Pagado Bot.",
        en: "Join thousands of users who are already managing their money smarter with Pagado Bot.",
    },
    "cta.whatsapp": { es: "Comenzar ahora", en: "Start now" },
    "cta.demo": { es: "Ver Demo del Panel", en: "View Dashboard Demo" },

    // Footer
    "footer.rights": { es: "Todos los derechos reservados.", en: "All rights reserved." },
    "footer.terms": { es: "Términos de Servicio", en: "Terms of Service" },
    "footer.privacy": { es: "Política de Privacidad", en: "Privacy Policy" },

    // WhatsApp Bot Messages
    "bot.msg.hello": {
        es: "¡Hola! Acabo de comprar víveres por $67.43",
        en: "Hello! I just bought groceries for $67.43",
    },
    "bot.msg.categorized": {
        es: "¡Perfecto! Lo he categorizado como Comida y Restaurantes. ¿Te gustaría que escanee tu recibo para un desglose detallado?",
        en: "Perfect! I've categorized it as Food & Restaurants. Would you like me to scan your receipt for a detailed breakdown?",
    },
    "bot.msg.analyzing": { es: "🤖 Analizando recibo con IA...", en: "🤖 Analyzing receipt with AI..." },
    "bot.msg.breakdown": {
        es: "¡Excelente! Encontré:\n• Verduras: $23.50\n• Lácteos: $18.20\n• Snacks: $15.73\n• Hogar: $10.00\n\nTotal coincide: $67.43 ✅",
        en: "Excellent! I found:\n• Vegetables: $23.50\n• Dairy: $18.20\n• Snacks: $15.73\n• Household: $10.00\n\nTotal matches: $67.43 ✅",
    },
    "bot.msg.voice": { es: "🎤 Mensaje de voz (0:05)", en: "🎤 Voice message (0:05)" },
    "bot.msg.heard": {
        es: 'Escuché: "Agregar $25 por almuerzo en restaurante italiano"\n\n✅ Agregué $25 a Comida y Restaurantes\n📊 Presupuesto diario restante: $45.50',
        en: 'I heard: "Add $25 for lunch at Italian restaurant"\n\n✅ Added $25 to Food & Restaurants\n📊 Daily budget remaining: $45.50',
    },
    "bot.typing": { es: "Pagado Bot está escribiendo...", en: "Pagado Bot is typing..." },
    "bot.online": { es: "En línea", en: "Online" },
    "bot.type.message": { es: "Escribe un mensaje...", en: "Type a message..." },

    // Transaction Categories
    "category.food": { es: "Comida", en: "Food" },
    "category.income": { es: "Ingresos", en: "Income" },
    "category.entertainment": { es: "Entretenimiento", en: "Entertainment" },
    "category.transport": { es: "Transporte", en: "Transport" },

    // Transaction Descriptions
    "transaction.supermarket": { es: "Supermercado", en: "Supermarket" },
    "transaction.salary": { es: "Depósito de Salario", en: "Salary Deposit" },
    "transaction.netflix": { es: "Suscripción Netflix", en: "Netflix Subscription" },
    "transaction.gas": { es: "Gasolinera", en: "Gas Station" },

    // Time
    "time.hours.ago": { es: "hace 2 horas", en: "2 hours ago" },
    "time.day.ago": { es: "hace 1 día", en: "1 day ago" },
    "time.days.ago.2": { es: "hace 2 días", en: "2 days ago" },
    "time.days.ago.3": { es: "hace 3 días", en: "3 days ago" },

    // Budget Categories
    "budget.food.restaurants": { es: "Comida", en: "Food" },
    "budget.transport": { es: "Transporte", en: "Transport" },
    "budget.entertainment": { es: "Entretenimiento", en: "Entertainment" },

    // Dashboard Stats
    "stats.since.last.month": { es: "desde el mes pasado", en: "since last month" },
    "stats.on.track": { es: "En camino para este mes", en: "On track for this month" },
    "stats.emergency.fund": { es: "Meta fondo emergencia: 70%", en: "Emergency fund goal: 70%" },
    "stats.goal": { es: "Meta: 70%", en: "Goal: 70%" },

    // Receipt Recognition
    "receipt.scan": { es: "Escaneo de Recibos", en: "Receipt Scanning" },
    "voice.recognition": { es: "Reconocimiento de Voz", en: "Voice Recognition" },
}

interface LanguageContextType {
    language: Language
    setLanguage: (language: Language) => void
    t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>(languages[0]) // Default to Spanish

    // Load saved language preference
    useEffect(() => {
        const savedLanguage = localStorage.getItem("preferred-language")
        if (savedLanguage) {
            const found = languages.find((lang) => lang.code === savedLanguage)
            if (found) {
                setLanguage(found)
            }
        } else {
            // Detect browser language
            const browserLang = navigator.language.split("-")[0]
            const found = languages.find((lang) => lang.code === browserLang)
            if (found) {
                setLanguage(found)
            }
        }
    }, [])

    // Save language preference
    useEffect(() => {
        localStorage.setItem("preferred-language", language.code)
    }, [language])

    const t = (key: string): string => {
        const translation = translations[key]
        if (!translation) {
            console.warn(`Translation missing for key: ${key}`)
            return key
        }
        return translation[language.code as keyof typeof translation] || key
    }

    return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider")
    }
    return context
}
