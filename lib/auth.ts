import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { checkAppInstalled } from "@/lib/github-app";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise, { databaseName: DB_NAME }),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          scope: "repo user:email",
        },
      },
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          username: profile.login, // Store GitHub username
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Guardar el access token en el JWT cuando el usuario se loguea
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Pasar el access token a la sesión
      session.access_token = token.accessToken as string;
      // Note: En NextAuth v5, el user.id viene del token sub
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      
      // Verificar si el usuario tiene la app instalada
      if (session.access_token) {
        session.appInstalled = await checkAppInstalled(session.access_token);
      }
      
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
});
