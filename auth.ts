import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
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
    strategy: "jwt", // Usar JWT para las sesiones
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  callbacks: {
    authorized: ({ auth, request: { nextUrl } }) => {
      const isLoggedIn = !!auth?.user;
      const isOnProtectRoute = nextUrl.pathname.includes("/dashboard");
      if (isOnProtectRoute) {
        if (isLoggedIn) return true;
        return Response.redirect(new URL("/login", nextUrl));
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token as string;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },

    async signIn({ account, profile }) {
      if (account?.provider === "google" && account?.access_token) {
        try {
          const userEmail = profile?.email;
          // Verificar si el usuario existe en la base de datos
          const user = await fetch(`${process.env.NEXTAUTH_URL}/api/user/${userEmail}`).then((res) => res.json());
          // console.log(user)
          console.log(account.access_token)
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
              body: JSON.stringify({ name: profile?.name, lastname: '', phone: '', email: userEmail, sheetId: data.id }),
            });

            if (!newUserResponse.ok) {
              console.error("Error al crear el usuario en la base de datos");
              return false;
            }
          } else {
            console.log("El usuario ya existe:", user);
          }
        } catch (error) {
          console.error("Error al gestionar el usuario y Google Sheets:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      // session.refreshToken = token.refreshToken
      return session
    }
  },
  pages: {
    signIn: "login"
  }
})