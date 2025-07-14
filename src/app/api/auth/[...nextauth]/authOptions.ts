import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { PrismaClient } from "@prisma/client";

// Create a single Prisma client instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/",
    error: "/auth/error", // Custom error page
  },
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("SignIn callback triggered:", { 
        email: user.email, 
        provider: account?.provider,
        profile: profile?.email 
      });

      if (account?.provider === "google") {
        try {
          // Check if user exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!existingUser) {
            // Create new user
            const newUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name!,
                image: user.image!,
              },
            });
            console.log("Created new user:", newUser.email);
          } else {
            console.log("User already exists:", existingUser.email);
          }
          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          // Don't block sign in if database operations fail
          return true;
        }
      }
      return true;
    },
    async session({ session }) {
      console.log("Session callback:", { user: session.user?.email });
      return session;
    },
    async jwt({ token, account }) {
      console.log("JWT callback:", { email: token.email, provider: account?.provider });
      return token;
    },
    async redirect({ url, baseUrl }) {
      console.log("Redirect callback:", { url, baseUrl });
      // Always redirect to dashboard after login
      return `${baseUrl}/dashboard`;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
}; 