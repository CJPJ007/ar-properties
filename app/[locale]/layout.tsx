import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import MobileNavigation from "@/components/mobile-navigation";
import AuthSessionProvider from "@/components/providers/session-provider";
import NotificationProvider from "@/components/providers/notifications-provider";
import { ThemeProvider } from "@/components/theme-provider";
import GoogleAnalytics from "@/components/GAConfigClient";
import { NextIntlClientProvider } from "next-intl";
import messagesEn from "@/messages/en.json";
import messagesHi from "@/messages/hi.json";
import messagesTe from "@/messages/te.json";

const messagesMap: Record<string, any> = {
  en: messagesEn,
  hi: messagesHi,
  te: messagesTe,
};

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ananta Realty - Find Your Dream Home",
  icons: {
    icon: "/header-logo.png",
  },
  description:
    "Discover your dream home with Ananta Realty's expert team, dedicated to providing exceptional real estate services.",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = messagesMap[locale] || messagesMap.en;
  return (
    <html lang={locale}>
      <body className={inter.className}>
        <GoogleAnalytics userId={1} />
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeProvider>
            <AuthSessionProvider>
              <NotificationProvider>
                {children}
                <MobileNavigation />
                <Toaster />
              </NotificationProvider>
            </AuthSessionProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
