"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import InquiryForm from "@/components/inquiry-form"
import { InquiryFormProps } from "@/lib/interfaces"

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
              className="relative w-full max-w-2xl bg-white rounded-lg shadow-2xl overflow-hidden"
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