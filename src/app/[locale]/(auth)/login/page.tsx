// import LoginForm from "@/components/auth/form_login";

// export default function Login() {
//     return (
//         <>
//             <div className="grid min-h-svh lg:grid-cols-2">
//                 <div className="relative hidden bg-muted lg:block">
//                     <img
//                         src="/place-holder.jpg"
//                         alt="Image"
//                         className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
//                     />
//                 </div>
//                 <div className="flex flex-col gap-4 p-6 md:p-10 bg-slate-50">
//                     <div className="flex flex-1 items-center justify-center">
//                         <div className="w-full max-w-xs">
//                             <LoginForm />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }

"use client"


import { Shield, Users, Award } from "lucide-react"
import FloatingElements from "@/components/auth/floating_elements"
import LoginForm from "@/components/auth/form_login"

export default function LoginPage() {

    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            {/* First column - Presentation style with blue gradient and floating elements */}
            <div className="relative hidden w-full md:flex md:w-1/2 bg-gradient-to-br from-blue-50 via-sky-100 to-cyan-50 p-12 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <FloatingElements />
                </div>

                <div className="relative z-10 flex flex-col justify-center items-center text-center h-full w-full space-y-8">
                    {/* Header Section */}
                    <div className="space-y-4">
                        <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            <Award className="w-4 h-4 mr-2" />
                            Plataforma Líder en Gestión Financiera
                        </div>

                        <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                            Gestiona tus finanzas con
                            <span className="text-blue-600 block">inteligencia artificial</span>
                        </h1>

                        <p className="text-xl text-gray-600 leading-relaxed max-w-lg mx-auto">
                            La plataforma todo-en-uno que necesitas para tomar control total de tus finanzas personales y
                            empresariales.
                        </p>
                    </div>

                    {/* Trust Indicators */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-x-8 gap-y-4 pt-6 border-t border-gray-200 w-full max-w-md mx-auto">
                        <div className="flex items-center space-x-2">
                            <Users className="w-5 h-5 text-gray-400" />
                            <span className="text-sm text-gray-600">Confiado por miles de usuarios</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Shield className="w-5 h-5 text-gray-400" />
                            <span className="text-sm text-gray-600">Certificado ISO 27001</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Second column - Login section */}
            <div className="relative flex w-full items-center justify-center bg-gradient-to-br from-blue-50 via-sky-100 to-cyan-50 md:bg-white p-6 md:w-1/2 min-h-screen md:min-h-0">
                {/* Mobile floating elements (hidden on desktop) */}
                <div className="absolute inset-0 md:hidden pointer-events-none">
                    <FloatingElements />
                </div>

                {/* CSS Animations */}
                <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            25% { transform: translateY(-20px) translateX(10px); }
            50% { transform: translateY(-10px) translateX(-5px); }
            75% { transform: translateY(-15px) translateX(8px); }
          }
          
          @keyframes bounce {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-30px) scale(1.1); }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.7; }
            50% { transform: scale(1.2); opacity: 1; }
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes wiggle {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(3deg); }
            75% { transform: rotate(-3deg); }
          }
          
          @keyframes slide {
            0%, 100% { transform: translateX(-100%); opacity: 0; }
            50% { transform: translateX(100%); opacity: 1; }
          }
        `}</style>

                <div className="relative z-10 w-full max-w-md">
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}
