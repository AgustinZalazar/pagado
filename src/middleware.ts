import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const locales = ["es", "en"];
const publicPages = ["/", "/login", "/register"]; // Tus rutas públicas

// Middleware para manejo de internacionalización
const handleI18nRouting = createMiddleware(routing);

// Middleware principal
export default function middleware(req: NextRequest) {
    const publicPathnameRegex = new RegExp(
        `^(/(${locales.join("|")}))?(${publicPages
            .flatMap((p) => (p === "/" ? ["", "/"] : p))
            .join("|")})/?$`,
        "i"
    );

    const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

    // Si es una página pública, aplica solo la internacionalización
    if (isPublicPage) {
        return handleI18nRouting(req);
    }

    // Verificación de autenticación para páginas protegidas
    const token = req.cookies.get("next-auth.session-token")?.value || req.headers.get("cookie")?.match(/next-auth\.session-token=([^;]*)/)?.[1];

    if (!token) {
        // Redirige al login si no está autenticado
        const loginUrl = new URL("/login", req.nextUrl.origin);
        return NextResponse.redirect(loginUrl);
    }

    // Si está autenticado, continúa con la internacionalización
    return handleI18nRouting(req);
}

// Configuración del matcher para el middleware
export const config = {
    matcher: ["/((?!api|_next|.*\\..*).*)"], // Excluye API, _next y archivos estáticos
};
