"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { 
  Home, 
  Building, 
  Users, 
  Briefcase, 
  Camera, 
  Phone, 
  Menu, 
  X, 
  FileText, 
  Shield, 
  LogIn,
  ChevronRight,
  BookOpen,
  User,
  User2,
  User2Icon,
  Facebook,
  Twitter,
  Instagram,
  LucideYoutube
} from "lucide-react"
import { useSession, signIn, signOut } from "next-auth/react"
import { useCompanyDetails } from "@/hooks/use-company-details"

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { data: session } = useSession()

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

  const { company } = useCompanyDetails();

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: company?.facebookUrl || "#" },
    { name: "Twitter", icon: Twitter, href: company?.twitterUrl || "#" },
    { name: "Instagram", icon: Instagram, href: company?.instagramUrl || "#" },
    { name: "YouTube", icon: LucideYoutube, href: company?.youtubeUrl || "#" },
  ]
  
  // Only show first 5 navigation items in footer
  const footerNavigation = mainNavigation.slice(0, 5)

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-50 flex items-center h-14 px-4">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="mr-3 p-2 rounded-full hover:bg-slate-100 transition-colors"
        >
          {session?.user?.image ? (
            <img 
              src={session.user.image} 
              alt={session.user.name || 'User'} 
              className="w-6 h-6 rounded-full border-2 border-slate-200"
            />
          ) : (
            <User2Icon className="w-6 h-6 text-slate-700 border-2 rounded-full p-1" />
          )}
        </button>
        <span className="text-lg font-bold text-slate-800">Ananta Realty</span>
      </div>

      {/* Bottom Navigation Tabs - First 5 links */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40">
        <div className="flex justify-around items-center py-2">
          {footerNavigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center justify-center py-2 px-3 text-slate-600 hover:text-blue-600 transition-colors duration-200"
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            )
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

      {/* Sidebar - slides in from left, partial width */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="md:hidden fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-xl z-50"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <span className="text-xl font-bold text-slate-800">Ananta Realty</span>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <X className="w-6 h-6 text-slate-600" />
                </button>
              </div>
              
              {/* User Profile Section */}
              {session && (
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {session.user?.image ? (
                        <img 
                          src={session.user.image} 
                          alt={session.user.name || 'User'} 
                          className="w-16 h-16 rounded-full border-4 border-white/20"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full border-4 border-white/20 bg-white/20 flex items-center justify-center">
                          <User className="w-8 h-8 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{session.user?.name || 'User'}</h3>
                      <p className="text-blue-100 text-sm">{session.user?.email || 'user@example.com'}</p>
                      {session.user?.mobile && (
                        <p className="text-blue-100 text-sm">{session.user.mobile}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Navigation Links */}
              <div className="flex-1 p-6 bg-white overflow-y-auto">
                <div className="space-y-6">
                  {/* Main Navigation */}
                  {/* <div>
                    <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-4">
                      Navigation
                    </h3>
                    <div className="space-y-2">
                      {mainNavigation.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsSidebarOpen(false)}
                            className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
                              <span className="font-medium text-slate-700 group-hover:text-blue-600">
                                {item.name}
                              </span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                          </Link>
                        )
                      })}
                    </div>
                  </div> */}
                  
                  {/* Additional Navigation */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-4">
                      More
                    </h3>
                    <div className="space-y-2">
                      {sidebarNavigation.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsSidebarOpen(false)}
                            className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
                              <span className="font-medium text-slate-700 group-hover:text-blue-600">
                                {item.name}
                              </span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                  
                  {/* Account Section */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-4">
                      Account
                    </h3>
                    {session ? (
                      <div className="space-y-2">
                        <Link
                          onClick={() => setIsSidebarOpen(false)}
                          href="/profile"
                          className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <User className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
                            <span className="font-medium text-slate-700 group-hover:text-blue-600">
                              Profile
                            </span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                        </Link>
                        <button
                          onClick={handleGoogleLogin}
                          className="w-full flex items-center justify-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors group"
                        >
                          <LogIn className="w-5 h-5 text-red-600" />
                          <span className="font-medium text-red-700 group-hover:text-red-800">
                            Sign Out
                          </span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleSignIn}
                        className="w-full flex items-center justify-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors group"
                      >
                        <LogIn className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-blue-700 group-hover:text-blue-800">
                          Sign In
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>


              {/* Footer */}
              <div className="p-6 border-t border-slate-200">
                <div className="text-center">
                  <p className="text-sm text-slate-500">
                    © 2025 Ananta Realty
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 