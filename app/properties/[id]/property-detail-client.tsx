"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ChevronLeft, ChevronRight, MapPin, Bed, Bath, Square, Play, X, Share2, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import Header from "@/components/header"
import Footer from "@/components/footer"
import InquiryModal from "@/components/inquiry-modal"
import TestimonialModal from "@/components/testimonial-modal"
import Link from "next/link"
import { Property } from "@/lib/interfaces"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" as const },
}

export default function PropertyDetailClient({ property }: { property: Property }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [showVirtualTour, setShowVirtualTour] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const { toast } = useToast()

  // Add thumbnail image to images array if not already present
  const allImages = property.images || []
  if (property.thumbnailImage && !allImages.find((img) => img.imageUrl === property.thumbnailImage)) {
    allImages.push({ imageUrl: property.thumbnailImage })
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }

  const nextVideo = () => {
    if (property.virtualTourLink) {
      const videos = property.virtualTourLink.split("#VIDEO#")
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length)
    }
  }

  const prevVideo = () => {
    if (property.virtualTourLink) {
      const videos = property.virtualTourLink.split("#")
      setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length)
    }
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



  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 dark:from-gray-900 to-blue-50 dark:to-gray-800 pb-16 md:pb-0">
  <Header />

  {/* Back Button */}
  <div className="pt-20 md:pt-24 px-4">
    <div className="max-w-7xl mx-auto">
      <Link href="/properties">
        <Button
          variant="outline"
          className="mb-6 bg-transparent dark:border-slate-600 dark:text-slate-200"
        >
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
            src={`/images/${allImages[currentImageIndex]?.imageUrl}` || "/placeholder.svg"}
            alt={`${property.title} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>

        {/* Navigation Arrows */}
        {allImages.length > 1 && (
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
          {currentImageIndex + 1} / {allImages.length}
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
            className="absolute bottom-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
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
      {allImages.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentImageIndex
                  ? "border-blue-500"
                  : "border-transparent"
              }`}
            >
              <img
                src={`/images/${image.imageUrl}` || "/placeholder.svg"}
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
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                  {property.title}
                </h1>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 mb-4">
                  <MapPin className="w-5 h-5" />
                  <span className="text-lg">{property.location}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl md:text-4xl font-bold text-amber-600">
                  {property.type === "Plot"
                    ? `${property.cents} Cent = ${formatPrice(property.price)}`
                    : formatPrice(property.price)}
                </p>
                {property.featured && (
                  <Badge className="mt-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                    Featured
                  </Badge>
                )}
              </div>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {property.type !== "Plot" && (
                <>
                  <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <Bed className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                        {property.bedrooms}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Bedrooms</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <Bath className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                        {property.bathrooms}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Bathrooms</p>
                    </div>
                  </div>
                </>
              )}
              <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <Square className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{property.areaSqft}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Square Feet</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <Card className="mb-8 dark:bg-gray-900">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Description</h2>
                <div
                  className="text-slate-600 dark:text-slate-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: property.description }}
                ></div>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card className="dark:bg-gray-900">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Property Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-300">Property Type</span>
                    <span className="font-medium text-slate-800 dark:text-slate-100">{property.type}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-300">Price</span>
                    <span className="font-medium text-slate-800 dark:text-slate-100">{property.price} INR</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-300">Status</span>
                    <span className="font-medium text-slate-800 dark:text-slate-100">
                      {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
            {/* Contact Card */}
            <Card className="mb-6 dark:bg-gray-900">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Interested in this property?</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  Get in touch with us to learn more about this property or schedule a viewing.
                </p>

                {/* Contact Button */}
                <InquiryModal
                  buttonText="Contact"
                  buttonSize="lg"
                  buttonClassName="w-full mb-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold transition-all duration-300 transform hover:scale-105"
                  modalTitle="Property Inquiry"
                  modalDescription={`Tell us about your interest in ${property?.title}`}
                  property={property?.title}
                  showAppointmentDate={true}
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  </section>

  {/* Video Carousel Section */}
      {property.virtualTourLink && (
  <section className="px-4 mb-8">
    <div className="max-w-7xl mx-auto">
      <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
        <h2 className="text-3xl font-bold text-white mb-6">Virtual Tours</h2>

        <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden bg-gray-900">
          <AnimatePresence mode="wait">
            <motion.iframe
              key={currentVideoIndex}
              src={property.virtualTourLink.split("#")[currentVideoIndex]}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>

          {/* Navigation Arrows */}
          {property.virtualTourLink.split("#").length > 1 && (
            <>
              <Button
                onClick={prevVideo}
                variant="ghost"
                size="sm"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/20 text-white hover:bg-black/40"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Button
                onClick={nextVideo}
                variant="ghost"
                size="sm"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/20 text-white hover:bg-black/40"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </>
          )}

          {/* Video Counter */}
          {property.virtualTourLink.split("#").length > 1 && (
            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentVideoIndex + 1} / {property.virtualTourLink.split("#").length}
            </div>
          )}

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              onClick={() => setShowVirtualTour(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-full shadow-lg"
            >
              <Play className="w-6 h-6 mr-2" />
              Full Screen View
            </Button>
          </div>
        </div>

        {/* Video Thumbnail Strip */}
        {property.virtualTourLink.split("#").length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {property.virtualTourLink.split("#").map((video, index) => (
              <button
                key={index}
                onClick={() => setCurrentVideoIndex(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all bg-gray-800 flex items-center justify-center ${
                  index === currentVideoIndex ? "border-blue-500" : "border-transparent"
                }`}
              >
                <Play className="w-6 h-6 text-white" />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  </section>
)}

<AnimatePresence>
  {showVirtualTour && property.virtualTourLink && (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setShowVirtualTour(false)}
    >
      <motion.div
        className="relative w-full max-w-6xl mx-4 aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-lg"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <Button
          onClick={() => setShowVirtualTour(false)}
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
        >
          <X className="w-6 h-6" />
        </Button>

        {/* Video Navigation */}
        {property.virtualTourLink.split("#").length > 1 && (
          <>
            <Button
              onClick={prevVideo}
              variant="ghost"
              size="sm"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              onClick={nextVideo}
              variant="ghost"
              size="sm"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-10">
              {currentVideoIndex + 1} / {property.virtualTourLink.split("#").length}
            </div>
          </>
        )}

        {/* Video iFrame */}
        <iframe
          src={property.virtualTourLink.split("#")[currentVideoIndex]}
          className="w-full h-full bg-black"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

  <Footer />
</div>

  )
}
