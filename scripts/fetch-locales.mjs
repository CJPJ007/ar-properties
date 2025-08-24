// scripts/fetch-locales.js
import fs from "fs";

async function main() {
  const res = await fetch(`${process.env.BACKEND_URL}/i18n/locales`);
  if (!res.ok) throw new Error("Failed to fetch locales");
  const data = await res.json();

  fs.writeFileSync(
    "next-locales.ts",
    `export const locales = ${JSON.stringify(data.locales)};`
  );

  console.log("Locales fetched:", data.locales);
}

main();
