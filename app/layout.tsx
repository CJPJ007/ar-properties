import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import MobileNavigation from "@/components/mobile-navigation"
import AuthSessionProvider from "@/components/providers/session-provider"
import NotificationProvider from "@/components/providers/notifications-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ananta Realty - Find Your Dream Home",
  description:
    "Discover your dream home with Ananta Realty's expert team, dedicated to providing exceptional real estate services.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthSessionProvider>
          <NotificationProvider>
          {children}
          <MobileNavigation />
          <Toaster />
          </NotificationProvider>
        </AuthSessionProvider>
      </body>
    </html>
  )
}
