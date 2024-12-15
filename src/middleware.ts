// import { auth } from "@/auth"
// import NextAuth from "next-auth"
// import authConfig from "@/auth.config"
// import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, authRoutes, publicRoutes } from '@/routes'

// const { auth } = NextAuth(authConfig)

// export default auth((req) => {
//     const { nextUrl } = req;
//     const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
//     const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
//     const isAuthRoute = authRoutes.includes(nextUrl.pathname);

//     // console.log(nextUrl)
//     // console.log(isAuthRoute)

//     // if (isApiAuthRoute) {
//     //     return undefined;
//     // }
//     // if (isAuthRoute) {
//     //     if (isLoggedIn) {
//     //         return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
//     //     }
//     //     return undefined;
//     // }
//     console.log(req.auth)
//     if (!req.auth) {
//         return Response.redirect(new URL("/login", req.nextUrl.origin));
//     }

//     // return undefined;
// })

// // Optionally, don't invoke Middleware on some paths
// export const config = {
//     matcher: [
//         // Skip Next.js internals and all static files, unless found in search params
//         '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//         // Always run for API routes
//         '/(api|trpc)(.*)'
//     ],
// }

import { auth } from "@/auth"

export default auth((req) => {
    // console.log(req.auth)
    if (!req.auth && req.nextUrl.pathname !== "/login") {
        const newUrl = new URL("/login", req.nextUrl.origin)
        return Response.redirect(newUrl)
    }
})


export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}