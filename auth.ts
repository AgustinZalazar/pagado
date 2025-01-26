import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/db/index"
import { accounts, sessions, users, verificationTokens } from "@/db/schema"
import { refreshAccessToken } from "@/actions/updateUserToken"
import { eq } from "drizzle-orm"



export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [Google({
    clientId: process.env.AUTH_GOOGLE_CLIENT_ID!,
    clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET!,
    authorization: {
      params: {
        scope: "openid email profile https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets",
        access_type: "offline",
        prompt: "consent",
      },
    },
  })],
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // Duración de la sesión: 30 días
    updateAge: 24 * 60 * 60, // Actualiza automáticamente después de 24 horas
  },
  callbacks: {
    // authorized: ({ auth, request: { nextUrl } }) => {
    //   const isLoggedIn = !!auth?.user;
    //   const isOnProtectRoute = nextUrl.pathname.includes("/dashboard");
    //   console.log(auth)
    //   if (isOnProtectRoute) {
    //     if (isLoggedIn) return true;
    //     return Response.redirect(new URL("/login", nextUrl));
    //   } else if (isLoggedIn) {
    //     return Response.redirect(new URL("/dashboard", nextUrl));
    //   }
    //   return true;
    // },
    async redirect({ url, baseUrl }) {
      // Redirigir al dashboard después del inicio de sesión
      if (url === "/login") return `${baseUrl}/dashboard`;
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }

      return token;
    },
    async session({ session, token }) {
      const account = await db
        .select()
        .from(accounts)
        .where(eq(accounts.userId, session.user.id))
        .execute();

      const currentAccount = account[0];

      // Verifica si el token ha expirado
      if (currentAccount.expires_at! * 1000 < Date.now()) {
        await refreshAccessToken(currentAccount.refresh_token!, session.user.id);
      } else {
        session.accessToken = currentAccount.access_token ?? undefined;
      }
      return session;
    },
    async signIn({ account, profile }) {
      if (account?.provider === "google" && account?.access_token) {
        try {
          const userEmail = profile?.email;
          // Verificar si el usuario existe en la base de datos
          // console.log(account)
          const user = await fetch(`${process.env.NEXTAUTH_URL}/api/user/${userEmail}`).then((res) => res.json());
          // console.log(user)
          if (!user) {
            // Crear un Google Sheet para el nuevo usuario
            const response = await fetch(`${process.env.NEXTAUTH_URL}/api/google-sheets`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ accessToken: account.access_token }),
            });

            const data = await response.json();

            const responseConfig = await fetch(`${process.env.NEXTAUTH_URL}/api/setup-sheet`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ accessToken: account.access_token, sheetId: data.id }),
            });

            if (!response.ok) {
              console.error("Error en el fetch a /api/google-sheets:", data);
              return false;
            }

            // Crear el usuario en la base de datos
            const newUserResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/user`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: profile?.name, phone: '', email: userEmail, sheetId: data.id }),
            });

            if (!newUserResponse.ok) {
              console.error("Error al crear el usuario en la base de datos");
              return false;
            }
          } else {
            // const token = {
            //   accessToken: account.access_token,
            //   refreshToken: account.refresh_token,

            // }
            // const newToken = await refreshAccessToken(token, user.id)
          }
        } catch (error) {
          console.error("Error al gestionar el usuario y Google Sheets:", error);
          return false;
        }
      }
      return true;
    }
  },
  pages: {
    signIn: "login"
  }
})


// export const options = {

// }