import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

const createAuth = async () => {
  const config = await authConfig();
  return NextAuth(config);
};

export const { handlers, signIn, signOut, auth } = await createAuth();