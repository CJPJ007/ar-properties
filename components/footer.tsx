"use client"

import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube, LucideYoutube } from "lucide-react"
import Link from "next/link"
import { Home, Building, Users, Briefcase, Camera } from "lucide-react"
import { useCompanyDetails } from "@/hooks/use-company-details"

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

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Properties", href: "/properties" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
]

export default function Footer() {
  const { company } = useCompanyDetails()

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: company?.facebookUrl || "#" },
    { name: "Twitter", icon: Twitter, href: company?.twitterUrl || "#" },
    { name: "Instagram", icon: Instagram, href: company?.instagramUrl || "#" },
    { name: "YouTube", icon: LucideYoutube, href: company?.youtubeUrl || "#" },
  ]

  return (
    <footer className="hidden md:block bg-gradient-to-r from-slate-900 to-blue-900 text-white pb-16 md:pb-0">
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
              {company ? company.companyName : "Ananta Realty"}
            </h3>
            <p className="text-blue-100 mb-6 leading-relaxed">
              {company ? (company.aboutDescription || "") : "Discover your dream home with our expert team, dedicated to providing exceptional real estate services tailored to your unique needs and preferences."}
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-amber-400" />
                <span className="text-blue-100">
                  {company
                    ? `${company.streetAddress}, ${company.city}, ${company.state} ${company.postalCode}`
                    : "123 Estate Lane, City, ST 12345"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-400" />
                <a
                  href={company ? `tel:${company.primaryPhone}` : "tel:+1234567890"}
                  className="text-blue-100 hover:text-amber-400 transition-colors"
                >
                  {company ? company.primaryPhone : "(123) 456-7890"}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-400" />
                <a
                  href={company ? `mailto:${company.primaryEmail}` : "mailto:info@anantarealty.com"}
                  className="text-blue-100 hover:text-amber-400 transition-colors"
                >
                  {company ? company.primaryEmail : "info@anantarealty.com"}
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
                if (!social.href || social.href === "#") return null
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
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
            © 2025 {company ? company.companyName : "Ananta Realty"}. All rights reserved. |{" "}
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

    </footer>
  )
}
