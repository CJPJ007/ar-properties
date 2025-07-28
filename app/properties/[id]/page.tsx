"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Bed,
  Bath,
  Square,
  Car,
  Calendar,
  Eye,
  Play,
  X,
  Phone,
  Mail,
  Share2,
  Heart,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ChatBot from "@/components/chatbot"
import Link from "next/link"

interface PropertyDetail {
  id: string
  title: string
  price: string
  beds: number
  baths: number
  sqft: string
  location: string
  images: string[]
  type: string
  featured: boolean
  description: string
  features: string[]
  yearBuilt: number
  parking: number
  lotSize: string
  propertyType: string
  status: string
  virtualTourLink?: string
  agent: {
    name: string
    phone: string
    email: string
    image: string
  }
}

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
}

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState<PropertyDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showVirtualTour, setShowVirtualTour] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchPropertyDetails()
  }, [params.id])

  const fetchPropertyDetails = async () => {
    try {
      const response = await fetch(`/api/properties/${params.id}`)
      const data = await response.json()
      setProperty(data)
    } catch (error) {
      console.error("Error fetching property details:", error)
    } finally {
      setLoading(false)
    }
  }

  const nextImage = () => {
    if (property) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length)
    }
  }

  const prevImage = () => {
    if (property) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)
    }
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Message Sent!",
        description: "The agent will contact you soon.",
      })

      setContactForm({ name: "", email: "", phone: "", message: "" })
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setContactForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title,
        text: `Check out this amazing property: ${property?.title}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link Copied!",
        description: "Property link copied to clipboard.",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-16 md:pb-0">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-16 md:pb-0">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Property Not Found</h1>
            <Link href="/properties">
              <Button>Back to Properties</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-16 md:pb-0">
      <Header />

      {/* Back Button */}
      <div className="pt-20 md:pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/properties">
            <Button variant="outline" className="mb-6 bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Properties
            </Button>
          </Link>
        </div>
      </div>

      {/* Image Carousel */}
      <section className="px-4 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={property.images[currentImageIndex] || "/placeholder.svg"}
                alt={`${property.title} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>

            {/* Navigation Arrows */}
            {property.images.length > 1 && (
              <>
                <Button
                  onClick={prevImage}
                  variant="ghost"
                  size="sm"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/20 text-white hover:bg-black/40"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  onClick={nextImage}
                  variant="ghost"
                  size="sm"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/20 text-white hover:bg-black/40"
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {property.images.length}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                onClick={() => setIsLiked(!isLiked)}
                variant="ghost"
                size="sm"
                className="bg-black/20 text-white hover:bg-black/40"
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
              <Button
                onClick={handleShare}
                variant="ghost"
                size="sm"
                className="bg-black/20 text-white hover:bg-black/40"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Virtual Tour Button */}
            {property.virtualTourLink && (
              <Button
                onClick={() => setShowVirtualTour(true)}
                className="absolute bottom-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Virtual Tour
              </Button>
            )}

            {/* Status Badge */}
            <Badge className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              {property.status}
            </Badge>
          </div>

          {/* Thumbnail Strip */}
          {property.images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {property.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentImageIndex ? "border-blue-500" : "border-transparent"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Property Details */}
      <section className="px-4 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Details */}
            <div className="lg:col-span-2">
              <motion.div {...fadeInUp}>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">{property.title}</h1>
                    <div className="flex items-center gap-2 text-slate-600 mb-4">
                      <MapPin className="w-5 h-5" />
                      <span className="text-lg">{property.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl md:text-4xl font-bold text-amber-600">{property.price}</p>
                    {property.featured && (
                      <Badge className="mt-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white">Featured</Badge>
                    )}
                  </div>
                </div>

                {/* Key Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                    <Bed className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold text-slate-800">{property.beds}</p>
                      <p className="text-sm text-slate-600">Bedrooms</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                    <Bath className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold text-slate-800">{property.baths}</p>
                      <p className="text-sm text-slate-600">Bathrooms</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                    <Square className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold text-slate-800">{property.sqft}</p>
                      <p className="text-sm text-slate-600">Square Feet</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                    <Car className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold text-slate-800">{property.parking}</p>
                      <p className="text-sm text-slate-600">Parking</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <Card className="mb-8">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Description</h2>
                    <p className="text-slate-600 leading-relaxed">{property.description}</p>
                  </CardContent>
                </Card>

                {/* Features */}
                <Card className="mb-8">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Features & Amenities</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {property.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full" />
                          <span className="text-slate-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Property Details */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Property Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex justify-between py-2 border-b border-slate-200">
                        <span className="text-slate-600">Property Type</span>
                        <span className="font-medium text-slate-800">{property.propertyType}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-200">
                        <span className="text-slate-600">Year Built</span>
                        <span className="font-medium text-slate-800">{property.yearBuilt}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-200">
                        <span className="text-slate-600">Lot Size</span>
                        <span className="font-medium text-slate-800">{property.lotSize}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-200">
                        <span className="text-slate-600">Status</span>
                        <span className="font-medium text-slate-800">{property.status}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
                {/* Agent Card */}
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">Contact Agent</h3>
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={property.agent.image || "/placeholder.svg"}
                        alt={property.agent.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-slate-800">{property.agent.name}</h4>
                        <p className="text-slate-600">Real Estate Agent</p>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3 mb-6">
                      <a
                        href={`tel:${property.agent.phone}`}
                        className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Phone className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-blue-600">{property.agent.phone}</span>
                      </a>
                      <a
                        href={`mailto:${property.agent.email}`}
                        className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Mail className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-blue-600">{property.agent.email}</span>
                      </a>
                    </div>

                    {/* Contact Form */}
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <Input
                        name="name"
                        placeholder="Your Name"
                        value={contactForm.name}
                        onChange={handleInputChange}
                        required
                      />
                      <Input
                        name="email"
                        type="email"
                        placeholder="Your Email"
                        value={contactForm.email}
                        onChange={handleInputChange}
                        required
                      />
                      <Input
                        name="phone"
                        type="tel"
                        placeholder="Your Phone"
                        value={contactForm.phone}
                        onChange={handleInputChange}
                      />
                      <Textarea
                        name="message"
                        placeholder="I'm interested in this property..."
                        value={contactForm.message}
                        onChange={handleInputChange}
                        rows={4}
                        required
                      />
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Schedule Viewing */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">Schedule a Viewing</h3>
                    <Button className="w-full mb-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Appointment
                    </Button>
                    {property.virtualTourLink && (
                      <Button onClick={() => setShowVirtualTour(true)} variant="outline" className="w-full">
                        <Eye className="w-4 h-4 mr-2" />
                        Virtual Tour
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Virtual Tour Modal */}
      <AnimatePresence>
        {showVirtualTour && property.virtualTourLink && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowVirtualTour(false)}
          >
            <motion.div
              className="relative w-full max-w-6xl mx-4 aspect-video bg-black rounded-lg overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                onClick={() => setShowVirtualTour(false)}
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
              >
                <X className="w-6 h-6" />
              </Button>
              <iframe
                src={property.virtualTourLink}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
      <ChatBot />
    </div>
  )
}
