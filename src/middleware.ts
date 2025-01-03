// import { NextRequest, NextResponse } from "next/server"; // Importa los tipos correctos
// import { auth } from "@/auth";
// import createMiddleware from "next-intl/middleware";
// import { routing } from "./i18n/routing";

// // Crear una instancia del middleware de internacionalización
// const intlMiddleware = createMiddleware(routing);

// export default async function middleware(req: NextRequest) {
//     // 1. Lógica de autenticación
//     // const authResponse = await auth(req);
//     // if (!authResponse && req.nextUrl.pathname !== "/login") {
//     //     const newUrl = new URL("/login", req.nextUrl.origin);
//     //     return NextResponse.redirect(newUrl); // Usa NextResponse para redirigir
//     // }

//     // 2. Ejecutar la lógica de internacionalización
//     const intlResponse = intlMiddleware(req);
//     if (intlResponse) {
//         return intlResponse;
//     }

//     // 3. Continuar con la solicitud si no se intercepta
//     return NextResponse.next();
// }

// // Configuración de las rutas para ambas funcionalidades
// export const config = {
//     matcher: [
//         "/((?!api|_next/static|_next/image|favicon.ico).*)",
//         "['/', '/(es|en)/:path*']",
//     ],
// };


import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
    // Match only internationalized pathnames
    matcher: ['/', '/(es|en)/:path*']
};