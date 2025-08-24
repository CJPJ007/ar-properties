// hooks/useLocalePath.ts
"use client"

import { usePathname } from "next/navigation"

export function useLocalePath(locale: string) {
  return (path: string) => {
    // Remove leading slash to avoid double slashes
    const cleanPath = path.startsWith("/") ? path.slice(1) : path
    return `/${locale}/${cleanPath}`
  }
}
