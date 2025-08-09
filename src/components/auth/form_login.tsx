"use client"
import React, { useEffect, useState } from 'react'
import CardWrapper from './card_wrapper'
import { FormError } from './form_error'
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { signIn } from 'next-auth/react'

const LoginForm = () => {
    const [error, setError] = useState<string | null>(null)

    const searchParams = useSearchParams();
    const errorParams = searchParams.get("error");

    const errorMessages: Record<string, string> = {
        unauthorized_email: "Tu correo no está autorizado para acceder a esta aplicación.",
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const errorParam = params.get("error");

        if (errorParam && errorMessages[errorParam]) {
            setError(errorMessages[errorParam]);
        } else {
            setError(null);
        }
    }, [errorParams]);


    return (
        // <CardWrapper headerLabel='Bienvenido otra vez'
        //     backButtonLabel='No tienes una cuenta?'
        //     backButtonHref='/register'
        //     showSocial
        // >
        //     <FormError message={error} />
        // </CardWrapper>
        <Card className="border-0 md:border md:border-gray-200 shadow-2xl bg-white/95 md:bg-white backdrop-blur-sm">
            <CardContent className="p-8 md:p-10">
                <div className="flex flex-col items-center space-y-6">
                    {/* Logo */}
                    <div className="w-48 h-16 relative">
                        <img src='/logo_black.png' alt='logo' className='w-[160px] mx-auto mb-4' />
                    </div>

                    {/* Welcome section */}
                    <div className="text-center space-y-3">
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Bienvenido otra vez</h1>
                        <p className="text-gray-600">Inicia sesión para acceder a tu gestor financiero personal</p>
                    </div>

                    {/* Google login button */}
                    <Button
                        className="w-full h-14 text-base font-medium bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                        variant="outline"
                        onClick={() => signIn("google", { redirectTo: "/dashboard" })}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" className="mr-3">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Continuar con Google
                    </Button>

                    {/* Legal text */}
                    <div className="w-full pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500 text-center leading-relaxed">
                            Al continuar, aceptas nuestros{" "}
                            <a href="/terminos-condiciones" className="text-blue-600 hover:underline font-medium">
                                Términos de Servicio
                            </a>{" "}
                            y{" "}
                            <a href="/politica-privacidad" className="text-blue-600 hover:underline font-medium">
                                Política de Privacidad
                            </a>
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default LoginForm