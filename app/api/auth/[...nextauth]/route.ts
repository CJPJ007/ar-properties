import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { NextAuthOptions } from "next-auth"
import { auth } from "@/lib/firebase"
import { signInWithCustomToken } from "firebase/auth"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Firebase",
      credentials: {
        firebaseToken: { label: "Firebase Token", type: "text" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.firebaseToken) {
            return null
          }

          // Verify Firebase token with your backend
          const response = await fetch(`${process.env.BACKEND_URL}/api/auth/verify-firebase-token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              firebaseToken: credentials.firebaseToken,
            }),
          })

          if (!response.ok) {
            return null
          }

          const user = await response.json()

          return {
            id: user.uid,
            name: user.displayName || user.name,
            email: user.email,
            mobile: user.phoneNumber,
            avatar: user.photoURL || user.avatar,
            image: user.photoURL || user.avatar,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.mobile = user.mobile
        token.avatar = user.avatar
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.mobile = token.mobile
        session.user.avatar = token.avatar
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST } 