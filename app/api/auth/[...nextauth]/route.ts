import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import type { NextAuthOptions } from "next-auth"

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
            method: "POST",
            headers: {
              "Content-Type": "application/json",
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
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.mobile = user.mobile || ""
        token.avatar = user.avatar || ""

        // Call POST /api/public/customer after login success
        try {
          const response = await fetch(`${process.env.BACKEND_URL}/api/public/customer`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: user.name,
              email: user.email,
              mobile: user.mobile || "",
              avatar: user.image || "",
            }),
          })

          if (!response.ok) {
            console.warn(`Failed to create/update customer for ${user.email}: ${response.status}`)
          } else {
            console.log(`Customer API called successfully for ${user.email}`)
          }
        } catch (err) {
          console.error(`Error calling /api/public/customer for ${user.email}:`, err)
        }
      }

      // If mobile is null, empty, or undefined, and we have an email, fetch from backend
      // Only do this once per session to avoid repeated API calls
      if (token.email && (!token.mobile || token.mobile.trim() === "") && !token.mobileFetched) {
        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/public/customer/${encodeURIComponent(token.email)}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            },
          )
          console.log("After calling customerData api")
          if (response.ok) {
            const customerData = await response.json()
            console.log("Response for customer data api : ", customerData)
            if (customerData.mobile) {
              token.mobile = customerData.mobile
            }
          } else {
            console.warn(`Failed to fetch customer data for ${token.email}: ${response.status}`)
          }
        } catch (fetchError) {
          console.error("Error fetching customer mobile in JWT callback:", fetchError)
          // Continue without mobile if API call fails
        }

        // Mark that we've attempted to fetch mobile to avoid repeated calls
        token.mobileFetched = true
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
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
