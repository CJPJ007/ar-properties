import { NextIntlClientProvider } from "next-intl"

export const metadata = {
  title: 'Ananta Real Estate - Auth',
  description: 'Authentication pages for Ananta Real Estate',
}


async function getMessages(locale: string) {
  const res = await fetch(`${process.env.BACKEND_URL}/api/public/i18n/${locale}`, {
    cache: "no-store" // always get latest translations
  });

  if (!res.ok) {
    throw new Error(`Failed to load messages for ${locale}`);
  }

  return await res.json();
}

export default async function RootLayout({
  children,
    params: { locale },

}: {
  children: React.ReactNode,
    params: { locale: string };

}) {
    const messages = await getMessages(locale);

  return (
    <html lang={locale}>
      <NextIntlClientProvider messages={messages} locale={locale}>
      <body>{children}</body>
      </NextIntlClientProvider>
    </html>
  )
}
