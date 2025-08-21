"use client"

import { useCompanyDetails } from "@/hooks/use-company-details"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSession, signIn, signOut } from "next-auth/react"
import { useEffect, useState } from "react"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Properties", href: "/properties" },
  { name: "Blog", href: "/blogs" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
]

type CompanyDetails = {
  id: number;
  companyName: string;
  tagline: string | null;
  aboutDescription: string | null;
  primaryEmail: string;
  primaryPhone: string;
  secondaryPhone: string | null;
  whatsappNumber: string | null;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  businessHoursWeekday: string | null;
  businessHoursWeekend: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  twitterUrl: string | null;
  linkedinUrl: string | null;
  youtubeUrl: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  establishedYear: number | null;
  licenseNumber: string | null;
  websiteUrl: string | null;
  googleMapsUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { data: session } = useSession()
  const { company } = useCompanyDetails()

  const handleGoogleLogin = () => {
    if (session) {
      signOut({ callbackUrl: '/' })
    } else {
      signIn('google', { callbackUrl: '/' })
    }
  }

  const handleSignIn = () => {
    if (session) {
      signOut({ callbackUrl: '/' })
    } else {
      window.location.href = '/auth/login'
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      className={`hidden md:block text-white fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        "bg-white/95 text-black backdrop-blur-md shadow-lg" 
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div className="flex-shrink-0" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/"
              className={`text-2xl font-bold transition-colors duration-300 ${
                "text-slate-800"
              }`}
            >
              {company ? company.companyName : "Ananta Realty"}
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item) => (
                <motion.div key={item.name} whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                  <Link
                    href={item.href}
                    className={`px-3 py-2 text-sm font-medium transition-colors duration-300 hover:text-amber-500 ${
                      "text-slate-700"
                    }`}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              
              {/* Google Login/Logout Button */}
              <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                {session ? (
                  <div className="flex items-center gap-3">
                    <Link
                      href="/profile"
                      className="text-sm text-slate-600 hover:text-blue-600 transition-colors"
                    >
                      <img 
                        src={session.user?.image || "/default-avatar.png"}
                        width={24}
                        height={24}
                        className="rounded-full"
                        alt="user"
                      />
                    </Link>
                    <Button
                      onClick={handleGoogleLogin}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 border-red-200 hover:border-red-300 hover:bg-red-50"
                    >
                      <span className="text-sm font-medium text-red-600">Sign Out</span>
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={handleSignIn}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 border-slate-300 hover:border-blue-500 hover:bg-blue-50"
                  >
                    <span className="text-sm text-black font-medium">Sign In</span>
                  </Button>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </nav>

      {/* 🔥 Live Scrolling Banner */}
      <div className="w-full overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2">
        <motion.div
          className="whitespace-nowrap text-sm md:text-base font-medium"
          animate={{ x: ["100%", "-100%"] }}
          transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
        >
          {[1,1,1,1,1,1,1,1,1,1].map((i)=>company?.tagline || "Ananta Realty is your way to property" + " | ")}
        </motion.div>
      </div>
    </motion.header>
  )
}
