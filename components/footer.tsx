"use client"

import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram } from "lucide-react"
import Link from "next/link"
import { Home, Building, Users, Briefcase, Camera } from "lucide-react"

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Properties", href: "/properties" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
]

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
]

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-900 to-blue-900 text-white pb-16 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Ananta Realty
            </h3>
            <p className="text-blue-100 mb-6 leading-relaxed">
              Discover your dream home with our expert team, dedicated to providing exceptional real estate services
              tailored to your unique needs and preferences.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-amber-400" />
                <span className="text-blue-100">123 Estate Lane, City, ST 12345</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-400" />
                <a href="tel:+1234567890" className="text-blue-100 hover:text-amber-400 transition-colors">
                  (123) 456-7890
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-400" />
                <a href="mailto:info@anantarealty.com" className="text-blue-100 hover:text-amber-400 transition-colors">
                  info@anantarealty.com
                </a>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-6 text-amber-400">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-blue-100 hover:text-amber-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-6 text-amber-400">Connect With Us</h3>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-blue-100 hover:text-amber-400 hover:bg-white/20 transition-all duration-300"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="border-t border-white/20 mt-12 pt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-blue-200">
            © 2025 Ananta Realty. All rights reserved. |{" "}
            <Link href="/privacy" className="text-amber-400 hover:text-amber-300 transition-colors">
              Privacy Policy
            </Link>{" "}
            |{" "}
            <Link href="/terms" className="text-amber-400 hover:text-amber-300 transition-colors">
              Terms of Service
            </Link>
          </p>
        </motion.div>
      </div>
      {/* Mobile Navigation - Only visible on mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50">
        <div className="flex justify-around items-center py-2">
          {[
            { name: "Home", href: "/", icon: Home },
            { name: "Properties", href: "/properties", icon: Building },
            { name: "About", href: "/about", icon: Users },
            { name: "Services", href: "/services", icon: Briefcase },
            { name: "Gallery", href: "/gallery", icon: Camera },
            { name: "Contact", href: "/contact", icon: Phone },
          ].map((item) => {
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
    </footer>
  )
}
