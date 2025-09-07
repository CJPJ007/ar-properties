"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { InquiryFormProps, InquiryFormData } from "@/lib/interfaces"
import { useTranslations } from "next-intl"
import { useSession } from "next-auth/react"

export default function InquiryForm({
  property,
  showAppointmentDate = false,
  className = "",
}: InquiryFormProps) {
  const {data: session} = useSession();
  const [formData, setFormData] = useState<InquiryFormData>({
    name: "",
    email: "",
    mobile: "",
    property: property || "",
    appointmentDate: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
        const requestFormData = {...formData, mobile:`+91${formData.mobile}`}
        if(!requestFormData.email && session?.user.email){
          requestFormData.email = session?.user.email;
        }
        // Default behavior - send to inquiries API
        const response = await fetch("/api/inquiries", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestFormData),
        })

        if (!response.ok) {
          throw new Error("Failed to send message")
        }

      toast({
        title: "Message Sent!",
        description: "Thank you for your message. We'll get back to you soon.",
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        mobile: "",
        property: property || "",
        appointmentDate: "",
        message: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

    const t = useTranslations("InquiryForm");

  return (

    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2"
        >
          {t("name")} *
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleInputChange}
          placeholder={t("placeholders.name")}
          className="h-12 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-300"
        />
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor="mobile"
          className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2"
        >
          {t("phone")} *
        </label>
        <Input
          id="mobile"
          name="mobile"
          type="tel"
          value={formData.mobile}
          onChange={handleInputChange}
          placeholder={t("placeholders.phone")}
          required
          maxLength={10}
          className="h-12 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-300"
        />
      </div>

      {/* Property (if available) */}
      {property && (
        <div>
          <label
            htmlFor="property"
            className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2"
          >
            {t("property")}
          </label>
          <Input
            id="property"
            name="property"
            type="text"
            value={formData.property}
            disabled
            placeholder={property}
            className="h-12 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 cursor-not-allowed placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
      )}

      {/* Appointment Date (optional) */}
      {showAppointmentDate && (
        <div>
          <label
            htmlFor="appointmentDate"
            className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2"
          >
            {t("appointmentDate")}
          </label>
          <Input
            id="appointmentDate"
            name="appointmentDate"
            type="datetime-local"
            value={formData.appointmentDate}
            onChange={handleInputChange}
            className="h-12 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-300"
          />
        </div>
      )}

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2"
        >
          {t("message")}
        </label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          rows={5}
          placeholder={
            property
              ? t("placeholders.messageProperty", { property })
              : t("placeholders.messageGeneral")
          }
          className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-300"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            {t("sending")}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            {t("sendMessage")}
          </div>
        )}
      </Button>
    </form>

  )
} 