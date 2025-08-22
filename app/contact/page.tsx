"use client"

import type React from "react"

import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ChatBot from "@/components/chatbot"
import { Slider } from "@/components/slider"
import InquiryForm from "@/components/inquiry-form"
import { useCompanyDetails } from "@/hooks/use-company-details"

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
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-16 md:pb-0">
      <Header />

      {/* Hero Section */}
      {/* <section className="relative h-96 flex items-center justify-center overflow-hidden mt-0 md:mt-16">
        <div className="absolute inset-0 z-0"> */}
          <Slider className="w-full h-[300px]" showSearch={false} page="Contact"/>
        {/* </div>

        <motion.div
          className="relative z-10 text-center text-white px-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Contact Ananta Realty</h1>
          <p className="text-xl md:text-2xl text-blue-100">
            We're here to help you find your dream home. Get in touch today!
          </p>
        </motion.div>
      </section> */}

      {/* Contact Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div {...fadeInUp} className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-6">Get in Touch</h2>
                <p className="text-lg text-slate-600 mb-8">
                  Our team is ready to assist you with all your real estate needs. Contact us today to start your
                  journey to finding the perfect property.
                </p>
              </div>

              <div className="space-y-6">
                <ContactInfo icon={MapPin} title="Address" content={company?.streetAddress}/>
                <ContactInfo icon={Phone} title="Phone" content={company?.primaryPhone} href={`tel:${company?.primaryPhone}`} />
                <ContactInfo
                  icon={Mail}
                  title="Email"
                  content={company?.email}
                  href="mailto:info@anantarealty.com"
                />
                <ContactInfo icon={Clock} title="Office Hours" content={company?.businessHoursWeekday} />
              </div>

              {/* Map */}
              {/* <motion.div
                className="rounded-lg overflow-hidden shadow-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <iframe
                  src={company?.googleMapsUrl}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </motion.div> */}
            </motion.div>

            {/* Contact Form */}
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-slate-800">Send Us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <InquiryForm />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
      {/* <ChatBot /> */}
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
