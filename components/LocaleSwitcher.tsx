"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";

export function LocaleSwitcher({locales}: {locales: string[]}) {
  const pathname = usePathname();

  return (
    <nav>
      {locales.map((locale) => (
        <Link key={locale} href={`/${locale}${pathname}`}>
          {locale.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}
