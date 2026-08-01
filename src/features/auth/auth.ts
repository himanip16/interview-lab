// src/features/auth/auth.ts

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import MicrosoftEntraId from "next-auth/providers/microsoft-entra-id";
import Apple from "next-auth/providers/apple";
import bcrypt from "bcryptjs";

import { prisma } from "shared/prisma/client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    MicrosoftEntraId({
      clientId: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    }),
    Apple({
      clientId: process.env.APPLE_CLIENT_ID,
      clientSecret: process.env.APPLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
  const email = credentials?.email as string | undefined;
  const password = credentials?.password as string | undefined;

  if (!email || !password) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.passwordHash) {
    return null;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);

  if (!valid) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
  };
}
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (existingUser) {
        // Link OAuth account to existing user
        const updateData: any = {
          name: user.name,
          image: user.image,
        };

        if (account?.provider === "google" && !existingUser.googleId) {
          updateData.googleId = account.providerAccountId;
        } else if (account?.provider === "github" && !existingUser.githubId) {
          updateData.githubId = account.providerAccountId;
        } else if (account?.provider === "microsoft-entra-id" && !existingUser.microsoftId) {
          updateData.microsoftId = account.providerAccountId;
        } else if (account?.provider === "apple" && !existingUser.appleId) {
          updateData.appleId = account.providerAccountId;
        }

        await prisma.user.update({
          where: { id: existingUser.id },
          data: updateData,
        });
        user.id = existingUser.id;
      } else {
        // Create new user with OAuth account
        const newUser = await prisma.user.create({
          data: {
            email: user.email!,
            name: user.name,
            image: user.image,
            ...(account?.provider === "google" && { googleId: account.providerAccountId }),
            ...(account?.provider === "github" && { githubId: account.providerAccountId }),
            ...(account?.provider === "microsoft-entra-id" && { microsoftId: account.providerAccountId }),
            ...(account?.provider === "apple" && { appleId: account.providerAccountId }),
          },
        });
        user.id = newUser.id;
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});