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
    async signIn({ user, account, profile }) {
      // Handle Google sign-in success
      if (account?.provider === 'google' && user.email) {
        try {
          // Call backend API to create/update customer
          const response = await fetch(`${process.env.BACKEND_URL}/api/public/customer`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: user.name || '',
              email: user.email,
              mobile: null, // Google doesn't provide mobile
              avatar: user.image || null,
            }),
          });

          if (!response.ok) {
            console.warn(`Failed to create/update customer for ${user.email}: ${response.status}`);
            // Continue with sign-in even if customer creation fails
          } else {
            console.log(`Successfully created/updated customer for ${user.email}`);
          }
        } catch (error) {
          console.error('Error creating/updating customer:', error);
          // Continue with sign-in even if API call fails
        }
      }
      
      return true; // Allow sign-in to proceed
    },
    async jwt({ token, user, trigger }) {
      if (user) {
        token.mobile = user.mobile
        token.avatar = user.avatar
      }

      // If mobile is null, empty, or undefined, and we have an email, fetch from backend
      // Only do this once per session to avoid repeated API calls
      if (token.email && (!token.mobile || token.mobile.trim() === '') && !token.mobileFetched) {
        try {
          const response = await fetch(`${process.env.BACKEND_URL}/api/public/customer/${encodeURIComponent(token.email)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });

          if (response.ok) {
            const customerData = await response.json();
            if (customerData.mobile) {
              token.mobile = customerData.mobile;
            }
          } else {
            console.warn(`Failed to fetch customer data for ${token.email}: ${response.status}`);
          }
        } catch (fetchError) {
          console.error('Error fetching customer mobile in JWT callback:', fetchError);
          // Continue without mobile if API call fails
        }
        
        // Mark that we've attempted to fetch mobile to avoid repeated calls
        token.mobileFetched = true;
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