"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Building, Users, Briefcase, Camera, Phone, MessageCircle, X, FileText, Shield, LogIn, ChevronRight, BookOpen, User, User2Icon, Facebook, Twitter, Instagram, LucideYoutube, MessageCircleIcon, LinkedinIcon } from 'lucide-react'
import { useSession, signIn, signOut } from "next-auth/react"
import { useCompanyDetails } from "@/hooks/use-company-details"
import { Whatsapp } from "./icons/whatsapp-icon"

const mainNavigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Properties", href: "/properties", icon: Building },
  { name: "Gallery", href: "/gallery", icon: Camera },
  { name: "Blog", href: "/blogs", icon: BookOpen },
  { name: "About", href: "/about", icon: Users },
]

const sidebarNavigation = [
  { name: "Services", href: "/services", icon: Briefcase },
  { name: "Contact", href: "/contact", icon: Phone },
  { name: "Terms of Service", href: "/terms", icon: FileText },
  { name: "Privacy Policy", href: "/privacy", icon: Shield },
]

export default function MobileNavigation() {
  const pathname = usePathname()

  if(pathname==="/auth/login")
    return null;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const { data: session } = useSession()
  

  // Add this helper inside your component
const isInWebView = () => {
  const ua = navigator.userAgent || navigator.vendor || window.opera
  return (
    ua.includes("wv") || ua.includes("WebView") || (ua.includes("Version/") && /; wv/.test(ua))
  )
}

const handleWhatsApp = (number: string) => {
  const formatted = number.replace(/\D/g, "")
  if (isInWebView()) {
    // Force open WhatsApp via Android intent
    window.location.href = `intent://send/${formatted}#Intent;scheme=smsto;package=com.whatsapp;end`
  } else {
    // Browser normal
    window.open(
      `https://wa.me/${formatted}?text=Hello, I'm interested in your real estate services`,
      "_blank"
    )
  }
}

const handleCall = (number: string
) => {
  const formatted = number.replace(/\D/g, "")
  if (isInWebView()) {
    // Force open dialer via intent
    window.location.href = `intent://${formatted}#Intent;scheme=tel;end`
  } else {
    window.location.href = `tel:${formatted}`
  }
}

  // Update active index based on current path
  useEffect(() => {
    const currentIndex = mainNavigation.findIndex((item) => item.href === pathname)
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex)
    }
  }, [pathname])

  const handleGoogleLogin = () => {
    if (session) {
      signOut({ callbackUrl: "/" })
    } else {
      signIn("google", { callbackUrl: "/" })
    }
  }

  const handleSignIn = () => {
    if (session) {
      signOut({ callbackUrl: "/" })
    } else {
      window.location.href = "/auth/login"
    }
  }

  const { company } = useCompanyDetails()

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: company?.facebookUrl || "#" },
    { name: "Twitter", icon: Twitter, href: company?.twitterUrl || "#" },
    { name: "Instagram", icon: Instagram, href: company?.instagramUrl || "#" },
    { name: "YouTube", icon: LucideYoutube, href: company?.youtubeUrl || "#" },
    { name: "WhatsApp", icon:MessageCircleIcon, href:`https://wa.me/${company?.whatsappNumber?.replace(/\D/g, '') || '1234567890'}?text=Hello, I'm interested in your real estate services`},
    { name: "LinkedIn", icon: LinkedinIcon, href: company?.linkedinUrl || "#" },
  ]

  // Only show first 5 navigation items in footer
  const footerNavigation = mainNavigation.slice(0, 5)

  return (
    <>
  {/* Mobile Top Header */}
  <div className="md:hidden fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-gray-700 z-50 flex items-center h-14 px-4">
    <button
      onClick={() => setIsSidebarOpen(true)}
      className="mr-3 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
    >
      {session?.user?.image ? (
        <img
          src={session.user.image || "/placeholder.svg"}
          alt={session.user.name || "User"}
          className="w-10 h-10 rounded-full border-2 border-slate-200 dark:border-gray-700"
        />
      ) : (
        <User2Icon className="w-6 h-6 text-slate-700 dark:text-gray-200 border-2 rounded-full p-1" />
      )}
    </button>
    <span className="text-lg font-bold text-slate-800 dark:text-white">Ananta Realty</span>
    
  </div>
{/* 🔥 Live Scrolling Banner */}
  <div className="md:hidden w-full relative top-[3.5rem] overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2">
    <motion.div
      className="whitespace-nowrap text-sm md:text-base font-medium"
      animate={{ x: ["100%", "-100%"] }}
      transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
    >
      {[...Array(10)].map((_, i) => (
        <span key={i} className="mx-6">
          {company?.tagline || "Ananta Realty is your way to property"} |
        </span>
      ))}
    </motion.div>
  </div>
  {/* Floating Action Buttons */}
  <motion.button
    onClick={() => handleCall(company?.primaryPhone || '+1234567890')}
    className="md:hidden fixed bottom-32 ml-5 w-14 h-14 z-40 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    initial={{ scale: 0, rotate: 180 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 20 }}
  >
    <Phone className="w-6 h-6 text-white" />
  </motion.button>

  <motion.button
    onClick={() => handleWhatsApp(company?.whatsappNumber || '1234567890')}
    rel="noopener noreferrer"
    className="md:hidden fixed bottom-32 right-5 w-14 h-14 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    initial={{ scale: 0, rotate: -180 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
  >
    <Whatsapp className="rounded-full" />
  </motion.button>

  {/* Bottom Navigation Tabs */}
  <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-slate-200 dark:border-gray-700 z-40">
    <div className="relative flex justify-around items-center py-2 px-4">
      {footerNavigation.map((item, index) => {
        const Icon = item.icon;
        const isActive = activeIndex === index;

        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => setActiveIndex(index)}
            className="flex flex-col items-center justify-center py-2 px-3 transition-all duration-200 relative z-10 flex-1"
          >
            {!isActive ? (
              <>
                <motion.div 
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-5 h-5 text-slate-600 dark:text-gray-300 hover:text-purple-600 transition-colors duration-200" />
                </motion.div>
                <span className="text-xs font-medium text-slate-600 dark:text-gray-300 hover:text-purple-600 transition-colors duration-200 mt-1">
                  {item.name}
                </span>
              </>
            ) : (
              <>
                <motion.div
                  key={activeIndex}
                  className="absolute top-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-xl flex items-center justify-center"
                  initial={{ y: -24 }}
                  animate={{ y: [-24, -50, -24, -30, -24] }}
                  transition={{
                    y: { duration: 0.8, times: [0, 0.25, 0.5, 0.75, 1], ease: [0.25, 0.46, 0.45, 0.94] }
                  }}
                >
            {footerNavigation[activeIndex] && (
              Object.keys(footerNavigation[activeIndex]).map((key)=>{
                if(key==='icon'){
                const Icon = footerNavigation[activeIndex][key];
                return <Icon className="w-6 h-6 text-white" />
                }
                return null;
              })
                  )}
                </motion.div>
                <div className="h-16 flex flex-col items-center justify-end pb-2">
                  <div className="h-12" />
                  <span className="text-xs font-medium text-purple-600 text-center">{item.name}</span>
                </div>
              </>
            )}
          </Link>
        );
      })}
    </div>
  </div>

  {/* Sidebar Overlay */}
  <AnimatePresence>
    {isSidebarOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="md:hidden fixed inset-0 bg-black/50 z-50"
        onClick={() => setIsSidebarOpen(false)}
      />
    )}
  </AnimatePresence>

  {/* Sidebar */}
  <AnimatePresence>
    {isSidebarOpen && (
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="md:hidden fixed top-0 left-0 h-full w-100 max-w-[85vw] bg-white dark:bg-gray-900 shadow-xl z-50"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-gray-700">
            <span className="text-xl font-bold text-slate-800 dark:text-white">Ananta Realty</span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-6 h-6 text-slate-600 dark:text-gray-200" />
            </button>
          </div>

          {/* User Profile Section */}
          {session && (
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
              <div className="flex items-center gap-4">
                {session.user?.image ? (
                  <img
                    src={session.user.image || "/placeholder.svg"}
                    alt={session.user.name || "User"}
                    className="w-16 h-16 rounded-full border-4 border-white/20"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full border-4 border-white/20 bg-white/20 flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{session.user?.name || "User"}</h3>
                  <p className="text-blue-100 text-sm">{session.user?.email || "user@example.com"}</p>
                  {session.user?.mobile && <p className="text-blue-100 text-sm">{session.user.mobile}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-600 dark:text-gray-300 uppercase tracking-wide mb-4">More</h3>
                <div className="space-y-2">
                  {sidebarNavigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsSidebarOpen(false)}
                        className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-slate-600 dark:text-gray-300 group-hover:text-blue-600" />
                          <span className="font-medium text-slate-700 dark:text-gray-200 group-hover:text-blue-600">{item.name}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 dark:text-gray-400 group-hover:text-blue-600" />
                      </Link>
                    );
                  })}
                </div>
              </div>
{/* Sidebar Overlay */}
<AnimatePresence>
  {isSidebarOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="md:hidden fixed inset-0 bg-black/50 dark:bg-black/70 z-50"
      onClick={() => setIsSidebarOpen(false)}
    />
  )}
</AnimatePresence>

{/* Sidebar */}
<AnimatePresence>
  {isSidebarOpen && (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="md:hidden fixed top-0 left-0 h-full w-100 max-w-[85vw] bg-white dark:bg-gray-900 shadow-xl z-50"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-gray-700">
          <span className="text-xl font-bold text-slate-800 dark:text-white">Ananta Realty</span>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-6 h-6 text-slate-600 dark:text-gray-200" />
          </button>
           
        </div>

        {/* User Profile */}
        {session && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <div className="flex items-center gap-4">
              {session.user?.image ? (
                <img
                  src={session.user.image || "/placeholder.svg"}
                  alt={session.user.name || "User"}
                  className="w-16 h-16 rounded-full border-4 border-white/20"
                />
              ) : (
                <div className="w-16 h-16 rounded-full border-4 border-white/20 bg-white/20 flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{session.user?.name || "User"}</h3>
                <p className="text-blue-100 text-sm">{session.user?.email || "user@example.com"}</p>
                {session.user?.mobile && <p className="text-blue-100 text-sm">{session.user.mobile}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <div className="flex-1 p-6 overflow-y-auto bg-white dark:bg-gray-900">
          <div className="space-y-6">
            {/* More Section */}
            <div>
              <h3 className="text-sm font-semibold text-slate-600 dark:text-gray-300 uppercase tracking-wide mb-4">More</h3>
              <div className="space-y-2">
                {sidebarNavigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-slate-600 dark:text-gray-300 group-hover:text-blue-600" />
                        <span className="font-medium text-slate-700 dark:text-gray-200 group-hover:text-blue-600">{item.name}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 dark:text-gray-400 group-hover:text-blue-600" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Account Section */}
            <div>
              <h3 className="text-sm font-semibold text-slate-600 dark:text-gray-300 uppercase tracking-wide mb-4">Account</h3>
              {session ? (
                <div className="space-y-2">
                  <Link
                    href="/profile"
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-slate-600 dark:text-gray-300 group-hover:text-blue-600" />
                      <span className="font-medium text-slate-700 dark:text-gray-200 group-hover:text-blue-600">Profile</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 dark:text-gray-400 group-hover:text-blue-600" />
                  </Link>
                  <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-800 transition-colors group"
                  >
                    <LogIn className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <span className="font-medium text-red-700 dark:text-red-200 group-hover:text-red-800">Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="w-full flex items-center justify-center gap-3 p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors group"
                >
                  <LogIn className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium text-blue-700 dark:text-blue-200 group-hover:text-blue-800">Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Social Links */}
        <motion.div className="p-6">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-gray-300 uppercase tracking-wide mb-4">Connect With Us</h3>
          <div className="flex gap-4">
            {socialLinks.map((social) => {
              if (!social.href || social.href === "#") return null;
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 dark:bg-white/20 rounded-full flex items-center justify-center hover:bg-white/20 dark:hover:bg-white/30 transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </motion.a>
              );
            })}
          </div>
        </motion.div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-sm text-slate-500 dark:text-gray-400">© 2025 Ananta Realty</p>
          </div>
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>


            </div>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</>

  )
}
