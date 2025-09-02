import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Toaster } from "@/components/ui/toaster";
import MobileNavigation from "@/components/mobile-navigation";
import AuthSessionProvider from "@/components/providers/session-provider";
import NotificationProvider from "@/components/providers/notifications-provider";
import { ThemeProvider } from "@/components/theme-provider";
import GoogleAnalytics from "@/components/GAConfigClient";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";

async function getMessages(locale: string) {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/api/public/i18n/${locale}`, {
      cache: "no-store"
    });
    if (!res.ok) throw new Error("Failed to load messages");
    return res.json();
  } catch (e) {
    console.error("Translation load failed:", e);
    notFound(); // fallback to 404 if locale invalid
  }
}


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ananta Realty - Find Your Dream Home",
  icons: {
    icon: "/header-logo.png",
  },
  description:
    "Discover your dream home with Ananta Realty's expert team, dedicated to providing exceptional real estate services.",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = params?.locale ?? 'en'; // fallback if undefined
  const messages = await getMessages(locale);
  // console.log("Loaded messages for locale:", locale, messages);
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
