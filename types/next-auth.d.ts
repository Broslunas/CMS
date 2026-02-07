import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
    access_token?: string;
    appInstalled?: boolean;
    error?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    expiresAt?: number;
    refreshToken?: string;
    error?: string;
    appInstalled?: boolean;
    lastAppCheck?: number;
    user?: any;
  }
}
