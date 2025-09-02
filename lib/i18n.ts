// lib/i18n.ts
let cachedLocales: string[] | null = null;

async function getSupportedLocales(): Promise<string[]> {
  if (cachedLocales) return cachedLocales;

  const res = await fetch(`${process.env.BACKEND_URL}/api/public/i18n/locales`, {
    cache: 'no-store'
  });
  if (!res.ok) {
    throw new Error("Failed to fetch locales");
  }

  const data = await res.json();
  // cachedLocales = data.locales;
  return data;
}

export default async function getRequestedLocale(locale: string): Promise<{locale: string}> {
  const locales = await getSupportedLocales();
  console.log("Supported locales:", locales, "Requested locale:", locale);
  if (locale && locales.includes(locale)) {
    return {locale};
  }
  return {locale:'en'}; // default locale
}