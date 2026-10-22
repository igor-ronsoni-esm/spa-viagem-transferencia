import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import EnvConfiguration from "@configs/environment/env.config";
import { container } from "@modules/domain/DI";
import { authorizeHomologation } from "@modules/components/auth/esm-auth";
import ValidaJWTUseCase from "@modules/domain/auth/usecases/valida-jwt.usecase";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt", maxAge: 8 * 60 * 60, updateAge: 0 },
  pages: {
    signIn: "/login",
    error: "/unauthorized",
  },
  jwt: {
    maxAge: 8 * 60 * 60,
  },
  trustHost: true,
  providers: [
    Credentials({
      id: "credentials",
      credentials: {
        token: { type: "text" },
      },
      authorize(credentials, _) {
        if (EnvConfiguration.get().isDevelopment())
          return authorizeHomologation;

        const usecase: ValidaJWTUseCase = container.get("ValidaJWTUseCase");
        const token = credentials?.token;
        if (!token || typeof token !== "string") return null;

        const user = usecase.execute(token);

        if (!user) {
          throw new CredentialsSignin("Credenciais inválidas");
        }

        return user
          ? {
              id: Number(user.sub),
              name: user.name,
              company: Number(user.company),
              auth: user.auth || "",
              sector: Number(user.sector),
            }
          : null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...token.user,
      };
      return session;
    },
    authorized({ auth, request }) {
      const nextUrl = request.nextUrl;
      if (nextUrl.pathname == "/unauthorized" || nextUrl.pathname == "/login") return true;
      if (nextUrl.searchParams.get("jwt")) return false;
      if (auth?.user && Object.keys(auth?.user).length === 0) return false;
      return !!auth?.user;
    },
  },
});
