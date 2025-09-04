"use client"

import type React from "react"

import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Clock, HelpCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ChatBot from "@/components/chatbot"
import { Slider } from "@/components/slider"
import InquiryForm from "@/components/inquiry-form"
import { useCompanyDetails } from "@/hooks/use-company-details"
import { use } from "react"
import { useTranslations } from "next-intl"
import FaqList from "@/components/faq-list"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" as const },
}

export default function ContactPage() {

  const {company} = useCompanyDetails();



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
const t  = useTranslations('Contact');
  return (
    <div
      className="min-h-screen 
                bg-gradient-to-br from-gray-50 to-blue-50 
                dark:from-slate-900 dark:to-blue-950 
                pb-16 md:pb-0 transition-colors duration-300"
    >
      <Header />

      {/* Hero Section */}
      <Slider className="w-full h-[220px] md:h-[387px]" showSearch={false} page="Contact" />

      {/* Contact Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              {...fadeInUp}
              className="space-y-8 text-gray-800 dark:text-gray-100"
            >
              <div>
                <h2 className="text-3xl font-bold mb-6">{t("contact.title")}</h2>
                <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
                  {t("contact.description")}
                </p>
              </div>

              <div className="space-y-6">
                <ContactInfo icon={MapPin} title={t("contact.address")} content={company?.streetAddress} />
                <ContactInfo
                  icon={Phone}
                  title={t("contact.phone")}
                  content={company?.primaryPhone}
                  href={`tel:${company?.primaryPhone}`}
                />
                <ContactInfo
                  icon={Mail}
                  title={t("contact.email")}
                  content={company?.primaryEmail}
                  href={`mailto:${company?.primaryEmail || "info@anantarealty.com"}`}
                />
                <ContactInfo
                  icon={Clock}
                  title={t("contact.officeHours")}
                  content={company?.businessHoursWeekday}
                />
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm transition-colors duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {t("form.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <InquiryForm />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* FAQs */}
           <div className="mt-16">
      {/* Header with icon */}
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          {t("faq.title")}
        </h2>
      </div>

      {/* Description paragraph */}
      <p className="text-slate-600 dark:text-slate-300 mb-6">
        {t(
          "faq.description"
        )}
      </p>

      {/* FAQ list component */}
      <FaqList />
    </div>
        </div>
      </section>

      <Footer />
    </div>

  )
}

function ContactInfo({
  icon: Icon,
  title,
  content,
  href,
}: {
  icon: any
  title: string
  content: string
  href?: string
}) {
  return (
    <motion.div
      className="flex items-start gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-lg hover:bg-white/80 transition-all duration-300"
      whileHover={{ x: 5 }}
    >
      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <h3 className="font-semibold text-slate-800 mb-1">{title}</h3>
        {href ? (
          <a href={href} className="text-slate-600 hover:text-blue-600 transition-colors">
            {content}
          </a>
        ) : (
          <p className="text-slate-600">{content}</p>
        )}
      </div>
    </motion.div>
  )
}
