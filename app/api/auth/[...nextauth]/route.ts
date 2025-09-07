import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { admin } from "@/lib/firebaseAdmin";

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
        console.log("Credentials : {}", credentials);
        try {
          if (!credentials?.firebaseToken) {
            return null;
          }

          // Verify with Admin SDK
          const decodedToken = await admin
            .auth()
            .verifyIdToken(credentials.firebaseToken);
          const firebaseUser = await admin.auth().getUser(decodedToken.uid);
          console.log("firebaseUser : ", firebaseUser);
          return {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || decodedToken.name,
            email: credentials.email || firebaseUser.email || "",
            mobile: firebaseUser.phoneNumber || "",
            image: firebaseUser.photoURL || "",
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.mobile = user.mobile || "";
        token.avatar = user.avatar || "";

        // Call POST /api/public/customer after login success
        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/public/customer`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: user.name,
                email: user.email,
                mobile: user.mobile || "",
                avatar: user.image || "",
              }),
            }
          );

          if (!response.ok) {
            console.warn(
              `Failed to create/update customer for ${user.email}: ${response.status}`
            );
          } else {
            console.log(`Customer API called successfully for ${user.email}`);
          }
        } catch (err) {
          console.error(
            `Error calling /api/public/customer for ${user.email}:`,
            err
          );
        }
      }

      // If mobile is null, empty, or undefined, and we have an email, fetch from backend
      // Only do this once per session to avoid repeated API calls

       try {
          const response = await fetch(
            `${
              process.env.BACKEND_URL
            }/api/public/customer/${encodeURIComponent(token.mobile || "")}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          console.log("After calling customerData api");
          if (response.ok) {
            const customerData = await response.json();
            console.log("Response for customer data api : ", customerData);
            if (customerData) {
              token.mobile = customerData.mobile;
              token.name = customerData.name;
              token.email = customerData.email;
              token.referralCode = customerData.referralCode;
            }
          } else {
            console.warn(
              `Failed to fetch customer data for ${token.mobile}: ${response.status}`
            );
            try {
              const response = await fetch(
                `${
                  process.env.BACKEND_URL
                }/api/public/customer/${encodeURIComponent(
                  token.email || ""
                )}`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
              console.log("After calling customerData api");
              if (response.ok) {
                const customerData = await response.json();
                console.log("Response for customer data api : ", customerData);
                if (customerData) {
                  token.mobile = customerData.mobile;
                  token.name = customerData.name;
                  token.email = customerData.email;
                  token.referralCode = customerData.referralCode;
                }
              }
            } catch (fetchError) {
              console.error(
                "Error fetching customer mobile in JWT callback:",
                fetchError
              );
              // Continue without mobile if API call fails
            }
          }
        } catch (fetchError) {
          console.error(
            "Error fetching customer mobile in JWT callback:",
            fetchError
          );
          // Continue without mobile if API call fails
        }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.mobile = token.mobile;
        session.user.email = token.email;
        session.user.referralCode = token.referralCode;
        session.user.name = token.name;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
