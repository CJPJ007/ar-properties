import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    user: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
      mobile?: string
      avatar?: string
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    mobile?: string
    avatar?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    mobile?: string
    avatar?: string
    mobileFetched?: boolean
  }
} 