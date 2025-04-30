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
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Redirigir al dashboard después del inicio de sesión
      if (url === "/login") return `${baseUrl}/dashboard`;
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async session({ session, user }) {
      if (!user?.id) {
        console.error("El usuario no tiene un ID válido");
        return session;
      }

      // 🔹 Buscar el token en la BD
      const userAccount = await db
        .select()
        .from(accounts)
        .where(eq(accounts.userId, user.id))
        .limit(1)
        .execute()
        .then((rows) => rows[0]);

      if (!userAccount) {
        console.error("No se encontró la cuenta en la BD");
        return session;
      }

      // 🔹 Agregar el accessToken a la sesión
      session.accessToken = userAccount.access_token!;
      session.accessTokenExpires = userAccount.expires_at ? userAccount.expires_at * 1000 : undefined;
      session.refreshToken = userAccount.refresh_token!;

      // Verificar si el token ha expirado (asegurándonos de que `accessTokenExpires` es un número válido)
      const expiresAt = session.accessTokenExpires ?? 0;
      if (expiresAt && Date.now() > expiresAt) {
        console.log("Access token expirado, intentando refrescar...");

        const newToken = await refreshAccessToken(session.refreshToken, session.user.id);

        if (!newToken) {
          console.error("Error al refrescar el token, cerrando sesión...");
          return { ...session, error: "RefreshTokenError" };
        }

        if (!newToken) {
          console.error("Error al refrescar el token, cerrando sesión...");
          return { ...session, error: "RefreshTokenError" };
        }


        // Retornar la sesión con el nuevo token
        return {
          ...session,
          accessToken: newToken.accessToken,
          error: null,
        };
      }

      // Retornar sesión normal si el token sigue válido
      return session
    },
    async signIn({ account, profile }) {
      if (account?.provider === "google" && account?.access_token) {
        console.log({ acc_s: account })
        try {
          const userEmail = profile?.email;
          // Verificar si el usuario existe en la base de datos
          const user = await fetch(`${process.env.NEXTAUTH_URL}/api/user/${userEmail}`).then((res) => res.json());
          console.log(user)
          if (!user || user?.error === "User not found") {
            // Crear un Google Sheet para el nuevo usuario
            const response = await fetch(`${process.env.NEXTAUTH_URL}/api/google-sheets`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ accessToken: account.access_token }),
            });

            const data = await response.json();
            // console.log(data)

            const responseConfig = await fetch(`${process.env.NEXTAUTH_URL}/api/setup-sheet`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ accessToken: account.access_token, sheetId: data.id }),
            });

            // console.log(responseConfig)
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
