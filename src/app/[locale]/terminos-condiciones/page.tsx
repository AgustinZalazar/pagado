import React from 'react'

const Page = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-8">
                        <div className="prose prose-gray max-w-none">
                            <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <h2 className="text-xl font-bold text-blue-900 mb-2">Términos y Condiciones del Servicio – Pagado</h2>
                                <p className="text-sm text-blue-800 mb-0">
                                    <strong>Fecha de entrada en vigor:</strong> 07/08/2025
                                </p>
                            </div>

                            <div className="space-y-8">
                                <section>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">1. Aceptación de los Términos</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Al acceder o usar el Servicio, aceptás quedar legalmente vinculado por estos Términos. Si no estás de acuerdo, no utilices el Servicio.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">2. Descripción del Servicio</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Pagado es una aplicación de finanzas personales que permite registrar y organizar tus ingresos y gastos mediante una integración con Google Sheets. El Servicio se ofrece actualmente de forma gratuita. En el futuro se podrían agregar funciones de pago opcionales, pero la funcionalidad principal seguirá siendo gratuita.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">3. Elegibilidad</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Para utilizar el Servicio, debés tener al menos 13 años o la edad legal mínima en tu país. Si usás el Servicio en nombre de una organización, declarás tener autoridad para aceptar estos Términos en su representación.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">4. Cuentas de Usuario y Autenticación</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Para usar el Servicio, debés iniciar sesión con tu cuenta de Google. Al hacerlo, otorgás acceso limitado a tu perfil de Google y a tu Google Drive exclusivamente para el funcionamiento de la aplicación.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">5. Datos a los que accedemos</h3>
                                    <p className="text-gray-700 leading-relaxed mb-3">
                                        Al iniciar sesión con Google, solo accedemos a:
                                    </p>
                                    <div className="bg-gray-50 rounded-lg p-4 mb-3">
                                        <ul className="space-y-2">
                                            <li className="flex items-start gap-2">
                                                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                                                <span className="text-gray-700">Tu nombre</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                                                <span className="text-gray-700">Tu apellido</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                                                <span className="text-gray-700">Tu dirección de correo electrónico</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">
                                        <strong className="text-red-600">No</strong> accedemos a otros datos personales ni a archivos fuera del alcance necesario.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">6. Integración con Google Sheets</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Después del inicio de sesión, se crea una hoja de cálculo privada en tu cuenta de Google Drive para gestionar tus registros. Esta hoja es accesible únicamente por vos y la aplicación. Cumplimos con todas las políticas de acceso responsable de Google, y podés revocar el acceso en cualquier momento desde la configuración de tu cuenta de Google.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">7. Privacidad y Uso de Datos</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        No vendemos, compartimos ni divulgamos tus datos personales a terceros. Toda la información se almacena de forma segura, y el acceso está restringido a lo estrictamente necesario para brindar el Servicio. Podés consultar nuestra <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors underline">Política de Privacidad</a> para más detalles.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">8. Modificaciones del Servicio</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Nos reservamos el derecho a modificar o descontinuar cualquier parte del Servicio en cualquier momento, con o sin previo aviso. Esto incluye cambios en las funcionalidades, precios (para funciones futuras) o en estos Términos.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">9. Funciones de Pago Futuras</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Aunque el Servicio es actualmente gratuito, podríamos introducir planes pagos en el futuro. Estas funciones serán siempre opcionales, y las funcionalidades básicas permanecerán accesibles gratuitamente.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">10. Inicio de Sesión con Google</h3>
                                    <p className="text-gray-700 leading-relaxed mb-3">
                                        Al iniciar sesión con tu cuenta de Google, aceptás que Pagado pueda:
                                    </p>
                                    <div className="bg-green-50 rounded-lg p-4 mb-3">
                                        <ul className="space-y-2">
                                            <li className="flex items-start gap-2">
                                                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                                                <span className="text-gray-700">Acceder únicamente a tu nombre y correo electrónico</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                                                <span className="text-gray-700">Crear una hoja de cálculo privada en tu Drive</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                                                <span className="text-gray-700">Gestionar esa hoja para registrar ingresos y egresos</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">
                                        No accedemos a otros archivos de tu Drive. Podés revocar el acceso desde tu cuenta de Google. Cumplimos en todo momento con las políticas de uso de la API y OAuth de Google.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">11. Uso Internacional</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Pagado está diseñado para usuarios de todo el mundo. Es compatible con múltiples monedas y es accesible globalmente, siempre que cumplas con las leyes locales aplicables.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">12. Cancelación</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Podés dejar de usar el Servicio en cualquier momento. Nos reservamos el derecho de suspender o cancelar tu acceso si violás estos Términos o hacés un mal uso del Servicio.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">13. Exención de Responsabilidad</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        El Servicio se brinda "tal cual" y sin garantías de ningún tipo. No somos responsables de decisiones financieras tomadas en base a los datos registrados en la aplicación.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">14. Limitación de Responsabilidad</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        En la medida permitida por la ley, Pagado no será responsable por daños indirectos, incidentales o consecuentes derivados del uso del Servicio.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">15. Contacto</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Si tenés alguna pregunta sobre estos Términos, podés escribirnos a:
                                    </p>
                                    <div className="mt-4 p-6 bg-blue-50 rounded-lg border border-blue-200">
                                        <p className="text-blue-800 font-medium">
                                            <a href="mailto:agusstiin.az@gmail.com" className="text-blue-600 hover:text-blue-800 transition-colors underline">agusstiin.az@gmail.com</a>
                                        </p>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page