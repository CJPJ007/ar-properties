// lib/i18n.ts
let cachedLocales: string[] | null = null;

export async function getSupportedLocales(): Promise<string[]> {
  if (cachedLocales) return cachedLocales;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/i18n/locales`, {
    cache: 'no-store'
  });
  if (!res.ok) {
    throw new Error("Failed to fetch locales");
  }

  const data = await res.json();
  cachedLocales = data.locales;
  return cachedLocales;
}
