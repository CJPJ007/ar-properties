"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { InquiryFormProps, InquiryFormData } from "@/lib/interfaces"

export default function InquiryForm({
  property,
  showAppointmentDate = false,
  className = "",
}: InquiryFormProps) {
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
        // Default behavior - send to inquiries API
        const response = await fetch("/api/inquiries", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
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

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
          Name *
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleInputChange}
          className="h-12 border-slate-200 focus:border-blue-500"
          placeholder="Your full name"
        />
      </div>

      {/* <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
          Email *
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleInputChange}
          className="h-12 border-slate-200 focus:border-blue-500"
          placeholder="your.email@example.com"
        />
      </div> */}

      <div>
        <label htmlFor="mobile" className="block text-sm font-medium text-slate-700 mb-2">
          Phone *
        </label>
        <Input
          id="mobile"
          name="mobile"
          type="tel"
          value={formData.mobile}
          onChange={handleInputChange}
          className="h-12 border-slate-200 focus:border-blue-500"
          placeholder="(123) 456-7890"
          required
        />
      </div>

      {property && (
        <div>
          <label htmlFor="property" className="block text-sm font-medium text-slate-700 mb-2">
            Property
          </label>
          <Input
            id="property"
            name="property"
            type="text"
            value={formData.property}
            disabled
            className="h-12 border-slate-200 bg-slate-50 cursor-not-allowed"
            placeholder={property}
          />
        </div>
      )}

      {showAppointmentDate && (
        <div>
          <label htmlFor="appointmentDate" className="block text-sm font-medium text-slate-700 mb-2">
            Preferred Appointment Date
          </label>
          <Input
            id="appointmentDate"
            name="appointmentDate"
            type="datetime-local"
            value={formData.appointmentDate}
            onChange={handleInputChange}
            className="h-12 border-slate-200 focus:border-blue-500"
          />
        </div>
      )}

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
          Message
        </label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          rows={5}
          className="border-slate-200 focus:border-blue-500"
          placeholder={
            property
              ? `Tell us about your interest in ${property}...`
              : "Tell us about your real estate needs..."
          }
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Sending...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Send Message
          </div>
        )}
      </Button>
    </form>
  )
} 