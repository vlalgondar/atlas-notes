import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: { params: { scope: "read:user user:email" } },
    }),
  ],
  debug: true, 
  callbacks: {
  // Runs on every JWT create/update
  // async jwt({ token, user }) {
  //   // On first sign-in, persist the DB id (if adapter is enabled) or the OAuth id
  //   if (user) {
  //     // Prefer user.id when available (adapter on), else keep token.sub as fallback
  //     (token as any).id = (user as any).id ?? token.sub;
  //   }
  //   return token;
  // },

  // // Controls what ends up in `session`
  // async session({ session, token }) {
  //   if (session.user) {
  //     // Prefer the custom token.id we set; fallback to token.sub
  //     (session.user as any).id = (token as any).id ?? (token.sub as string);
  //   }
  //   return session;
  // },

  async session({ session, user }) {
    if (session.user && user) {
      (session.user as any).id = user.id; // <- put DB id on the session
    }
    return session;
  },
},
  secret: process.env.NEXTAUTH_SECRET,
};
