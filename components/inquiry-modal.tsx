"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import InquiryForm from "@/components/inquiry-form"
import { InquiryFormProps } from "@/lib/interfaces"
import { Whatsapp } from "./icons/whatsapp-icon"
import { useCompanyDetails } from "@/hooks/use-company-details"

interface InquiryModalProps extends InquiryFormProps {
  buttonText?: string
  buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  buttonSize?: "default" | "sm" | "lg" | "icon"
  buttonClassName?: string
  modalTitle?: string
  modalDescription?: string
}

export default function InquiryModal({
  buttonText = "Get in Touch",
  buttonVariant = "default",
  buttonSize = "default",
  buttonClassName = "",
  modalTitle = "Contact Us",
  modalDescription = "Fill out the form below and we'll get back to you soon.",
  ...inquiryFormProps
}: InquiryModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

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
  return (
    <>
      {/* Trigger Button */}
      <Button
        onClick={openModal}
        variant={buttonVariant}
        size={buttonSize}
        className={`${buttonClassName}`}
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        {buttonText}
      </Button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="relative w-full max-w-2xl bg-white h-[90%] overflow-y-auto rounded-lg shadow-2xl overflow-hidden"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold">{modalTitle}</CardTitle>
                    <p className="text-blue-100 mt-1">{modalDescription}</p>
                    <motion.button
                              onClick={() => handleWhatsApp(company?.whatsappNumber || '1234567890')}
                              rel="noopener noreferrer"
                              className="fixed bottom-32 right-5 w-14 h-14 bg-green-500 p-2 hover:bg-green-600 rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
                            >
                              {/* WhatsApp SVG Icon */}
                              <Whatsapp className="rounded-full"/>
                            </motion.button>
                  </div>
                  <Button
                    onClick={closeModal}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>

              {/* Modal Content */}
              <CardContent className="p-6">
                <InquiryForm
                  {...inquiryFormProps}
                  
                />
              </CardContent>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 