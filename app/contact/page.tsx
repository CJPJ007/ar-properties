"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ChatBot from "@/components/chatbot"
import { Slider } from "@/components/slider"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
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
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message")
      }
      toast({
        title: "Message Sent!",
        description: "Thank you for your message. We'll get back to you soon.",
      })

      setFormData({ name: "", email: "", phone: "", message: "" })
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-16 md:pb-0">
      <Header />

      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden mt-0 md:mt-16">
        <div className="absolute inset-0 z-0">
          <Slider/>
        </div>

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
      </section>

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
                <ContactInfo icon={MapPin} title="Address" content="123 Estate Lane, City, ST 12345" />
                <ContactInfo icon={Phone} title="Phone" content="(123) 456-7890" href="tel:+1234567890" />
                <ContactInfo
                  icon={Mail}
                  title="Email"
                  content="info@anantarealty.com"
                  href="mailto:info@anantarealty.com"
                />
                <ContactInfo icon={Clock} title="Office Hours" content="Monday - Sunday: 9 AM - 6 PM" />
              </div>

              {/* Map */}
              <motion.div
                className="rounded-lg overflow-hidden shadow-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.086093285335!2d-122.4194156846813!3d37.77492977975966!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808f5e3b3b1b%3A0x4b2b3b3b3b3b3b3b!2s123%20Estate%20Lane%2C%20City%2C%20ST%2012345!5e0!3m2!1sen!2sus!4v1634567890123!5m2!1sen!2sus"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-slate-800">Send Us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
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

                    <div>
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
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                        Phone
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="h-12 border-slate-200 focus:border-blue-500"
                        placeholder="(123) 456-7890"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={5}
                        className="border-slate-200 focus:border-blue-500"
                        placeholder="Tell us about your real estate needs..."
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
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
      <ChatBot />
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
