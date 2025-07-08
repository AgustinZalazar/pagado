"use client"

import { useState, useEffect } from "react"
import { Bot, Mic, Camera, Send, MoreVertical, Phone, Video, Check, CheckCheck } from "lucide-react"
import { useLanguage } from "./language-context"

interface Message {
    id: number
    type: "user" | "bot"
    content: string
    timestamp: string
    status?: string
    isImage?: boolean
    isVoice?: boolean
    isProcessing?: boolean
    delay?: number
}

export function SophisticatedWhatsAppBot() {
    const { t } = useLanguage()
    const [currentStep, setCurrentStep] = useState(0)
    const [isTyping, setIsTyping] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            type: "user",
            content: t("bot.msg.hello"),
            timestamp: "14:32",
            status: "read",
        },
    ])

    const conversationSteps: Omit<Message, "id" | "status">[] = [
        {
            type: "bot",
            content: t("bot.msg.categorized"),
            timestamp: "14:32",
            delay: 2000,
        },
        {
            type: "user",
            content: "📷 [Imagen del Recibo]",
            timestamp: "14:33",
            isImage: true,
            delay: 3000,
        },
        {
            type: "bot",
            content: t("bot.msg.analyzing"),
            timestamp: "14:33",
            isProcessing: true,
            delay: 1500,
        },
        {
            type: "bot",
            content: t("bot.msg.breakdown"),
            timestamp: "14:34",
            delay: 2500,
        },
        {
            type: "user",
            content: t("bot.msg.voice"),
            timestamp: "14:35",
            isVoice: true,
            delay: 2000,
        },
        {
            type: "bot",
            content: t("bot.msg.heard"),
            timestamp: "14:35",
            delay: 2000,
        },
    ]

    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentStep < conversationSteps.length) {
                setIsTyping(true)

                setTimeout(() => {
                    setIsTyping(false)
                    setMessages((prev) => [
                        ...prev,
                        {
                            id: prev.length + 1,
                            ...conversationSteps[currentStep],
                            status: "read",
                        } as Message,
                    ])
                    setCurrentStep((prev) => prev + 1)
                }, 1500)
            } else {
                // Reset animation
                setTimeout(() => {
                    setCurrentStep(0)
                    setMessages([
                        {
                            id: 1,
                            type: "user",
                            content: t("bot.msg.hello"),
                            timestamp: "14:32",
                            status: "read",
                        },
                    ])
                }, 3000)
            }
        }, conversationSteps[currentStep]?.delay || 2000)

        return () => clearTimeout(timer)
    }, [currentStep])

    return (
        <div className="flex justify-center px-4 sm:px-0">
            <div className="relative group">
                {/* Phone Frame - Responsive sizing */}
                <div className="w-72 h-[500px] sm:w-80 sm:h-[600px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] sm:rounded-[3rem] p-1 sm:p-2 shadow-2xl group-hover:shadow-3xl transition-all duration-300 group-hover:scale-105">
                    <div className="w-full h-full bg-black rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden relative">
                        {/* Status Bar */}
                        <div className="bg-green-600 px-3 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between text-white text-xs sm:text-sm">
                            <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center">
                                    <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
                                </div>
                                <div>
                                    <p className="font-semibold text-xs sm:text-sm">FinanceBot AI</p>
                                    <p className="text-xs opacity-80">{t("bot.online")}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 sm:space-x-4">
                                <Video className="w-4 h-4 sm:w-5 sm:h-5" />
                                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                                <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                        </div>

                        {/* Chat Background */}
                        <div
                            className="flex-1 bg-slate-100 relative overflow-hidden"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23f1f5f9' fillOpacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                            }}
                        >
                            {/* Messages Container */}
                            <div className="h-[380px] sm:h-[480px] overflow-y-auto p-2 sm:p-4 space-y-2 sm:space-y-3">
                                {messages.map((message, index) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} animate-fadeInUp`}
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <div
                                            className={`max-w-[85%] sm:max-w-[80%] rounded-xl sm:rounded-2xl px-2 sm:px-4 py-1.5 sm:py-2 shadow-sm ${message.type === "user"
                                                    ? "bg-green-500 text-white rounded-br-md"
                                                    : "bg-white text-gray-800 rounded-bl-md border"
                                                }`}
                                        >
                                            {message.isImage ? (
                                                <div className="space-y-2">
                                                    <div className="w-32 h-20 sm:w-48 sm:h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center relative overflow-hidden">
                                                        <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                                        <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 text-white text-xs font-medium">
                                                            Recibo_supermercado.jpg
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : message.isVoice ? (
                                                <div className="flex items-center space-x-2 sm:space-x-3 py-1">
                                                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center">
                                                        <Mic className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-0.5 sm:space-x-1">
                                                            {[...Array(15)].map((_, i) => (
                                                                <div
                                                                    key={i}
                                                                    className="w-0.5 sm:w-1 bg-green-500 rounded-full animate-pulse"
                                                                    style={{
                                                                        height: `${Math.random() * 15 + 3}px`,
                                                                        animationDelay: `${i * 0.1}s`,
                                                                    }}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-gray-500">0:05</span>
                                                </div>
                                            ) : message.isProcessing ? (
                                                <div className="flex items-center space-x-2">
                                                    <div className="flex space-x-1">
                                                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-bounce" />
                                                        <div
                                                            className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-bounce"
                                                            style={{ animationDelay: "0.1s" }}
                                                        />
                                                        <div
                                                            className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-bounce"
                                                            style={{ animationDelay: "0.2s" }}
                                                        />
                                                    </div>
                                                    <span className="text-xs sm:text-sm">{message.content}</span>
                                                </div>
                                            ) : (
                                                <div className="whitespace-pre-line text-xs sm:text-sm leading-relaxed">{message.content}</div>
                                            )}

                                            <div
                                                className={`flex items-center justify-end mt-1 space-x-1 ${message.type === "user" ? "text-white/70" : "text-gray-500"
                                                    }`}
                                            >
                                                <span className="text-xs">{message.timestamp}</span>
                                                {message.type === "user" && (
                                                    <div className="flex">
                                                        {message.status === "read" ? (
                                                            <CheckCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-300" />
                                                        ) : (
                                                            <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Typing Indicator */}
                                {isTyping && (
                                    <div className="flex justify-start animate-fadeInUp">
                                        <div className="bg-white rounded-xl sm:rounded-2xl rounded-bl-md px-2 sm:px-4 py-2 sm:py-3 shadow-sm border">
                                            <div className="flex items-center space-x-2">
                                                <div className="flex space-x-1">
                                                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" />
                                                    <div
                                                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"
                                                        style={{ animationDelay: "0.1s" }}
                                                    />
                                                    <div
                                                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"
                                                        style={{ animationDelay: "0.2s" }}
                                                    />
                                                </div>
                                                <span className="text-xs text-gray-500">{t("bot.typing")}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Input Area */}
                            <div className="bg-white border-t border-gray-200 p-2 sm:p-3">
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                    <div className="flex-1 bg-gray-100 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 flex items-center space-x-2">
                                        <span className="text-gray-500 text-xs sm:text-sm">{t("bot.type.message")}</span>
                                    </div>
                                    <div className="flex items-center space-x-1 sm:space-x-2">
                                        <button className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                                            <Camera className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                                        </button>
                                        <button className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                                            <Mic className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                                        </button>
                                        <button className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                                            <Send className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating AI Indicators - Hidden on mobile */}
                <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-blue-500 text-white p-1.5 sm:p-2 rounded-full shadow-lg animate-pulse hidden sm:block">
                    <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>

                <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 bg-green-500 text-white p-1.5 sm:p-2 rounded-full shadow-lg animate-bounce hidden sm:block">
                    <Mic className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>

                {/* Feature Callouts - Hidden on mobile */}
                <div className="absolute -left-16 top-16 sm:-left-20 sm:top-20 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border animate-fadeInLeft hidden lg:block">
                    <div className="flex items-center space-x-2">
                        <Camera className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-medium">{t("receipt.scan")}</span>
                    </div>
                </div>

                <div className="absolute -right-16 bottom-24 sm:-right-20 sm:bottom-32 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border animate-fadeInRight hidden lg:block">
                    <div className="flex items-center space-x-2">
                        <Mic className="w-4 h-4 text-green-500" />
                        <span className="text-xs font-medium">{t("voice.recognition")}</span>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
        }

        .animate-fadeInLeft {
          animation: fadeInLeft 0.5s ease-out forwards;
        }

        .animate-fadeInRight {
          animation: fadeInRight 0.5s ease-out forwards;
        }
      `}</style>
        </div>
    )
}
