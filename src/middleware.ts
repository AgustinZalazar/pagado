import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { routing } from "./i18n/routing";

const locales = ["es", "en"];

const publicPages = ["/", "/login", "/register"]; // your public routes
const handleI18nRouting = createMiddleware(routing);

const authMiddleware = auth((req) => {
    return handleI18nRouting(req);
});

export default function middleware(req: NextRequest) {
    const publicPathnameRegex = RegExp(
        `^(/(${locales.join("|")}))?(${publicPages
            .flatMap((p) => (p === "/" ? ["", "/"] : p))
            .join("|")})/?$`,
        "i"
    );
    const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

    if (isPublicPage) return handleI18nRouting(req);
    else return (authMiddleware as any)(req);
}

export const config = {
    matcher: ["/((?!api|_next|.*\\..*).*)"],
};