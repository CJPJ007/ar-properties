"use client"

import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Check, Globe } from "lucide-react"

interface Language {
  code: string
  name: string
  isDefault?: boolean
}

interface LanguageSwitcherProps {
  currentLocale: string
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const languages : Language[] = [
    { code: "en", name: "English", isDefault: true },
    { code: "hi", name: "Hindi", },
    { code: "te", name: "Telugu",}
  ]
  const currentLang = languages.find((l) => l.code === currentLocale)

  const handleChangeLanguage = (code: string) => {
    setOpen(false)
    const newPath = pathname.replace(`/${currentLocale}`, `/${code}`)
    router.push(newPath)
  }

  if (languages.length <= 1) return null

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          {currentLang ? (
            <div className="relative">
              <Globe className="h-4 w-4" />
              <span className="hidden uppercase text-blue-600 sm:inline absolute -top-2 -right-4 text-xs bg-transparent px-1 rounded shadow">
              {currentLang.code}
              </span>
            </div>
          ) : (
            <div className="relative">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline absolute -top-2 -right-2 text-xs bg-white px-1 rounded shadow">
              Language
              </span>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleChangeLanguage(lang.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span>{lang.name}</span>
            </div>
            {currentLocale === lang.code && <Check className="h-4 w-4 text-green-600" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
