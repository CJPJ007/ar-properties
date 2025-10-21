"use client"

import { useState, useEffect, use } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, MapPin, Bed, Bath, Square, Star, ChevronLeft, ChevronRight, Play, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ChatBot from "@/components/chatbot"
import { Property, Testimonial } from "@/lib/interfaces"
import Image from "next/image"
import Link from "next/link"
import { Slider } from "@/components/slider"
import PropertyCard from "@/components/property-card"
import { useTranslations } from "next-intl"
import { useWishlist } from "@/hooks/user-wishlist"
import StatsSection from "@/components/stats-section"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [currentVideo, setCurrentVideo] = useState("")
  const [totalTestimonials, setTotalTestimonials] = useState(0);
  const [spotlightProperties, setSpotlightProperties] = useState<Property[]>([]);
  // const {loadWishlist} = useWishlist();
  useEffect(() => {
    fetchProperties()
    fetchTestimonials()
    fetchSpotLighProperties();
    // loadWishlist();
  }, [])

  const fetchProperties = async () => {
    try {
      const response = await fetch("/api/properties/featured")
      const data = await response.json()
      setProperties(data)
    } catch (error) {
      console.error("Error fetching properties:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSpotLighProperties = async () => {
      try {
        const response = await fetch(`/api/properties?sortBy=id&sortDirection=desc&page=1&size=2`,{
          method:"POST",
          body:JSON.stringify({
            criteriaList: [{
              key: "propertyOfTheMonth",
              operation: "equals",
              value: true
            }],
            operations: [],
          }),
        });
        const data = await response.json();
        setSpotlightProperties(data.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`/api/testimonials?page=${currentTestimonial+1}&size=3`,{
        method:"POST",
        headers:{
          "Content-type":"application/json"
        },
        body:JSON.stringify({
          criteriaList:[],
          operations:[]
        })
      })
      const data = await response.json()
      setTotalTestimonials(data.totalRecords);
      setTestimonials(data.data)
    } catch (error) {
      console.error("Error fetching testimonials:", error)
    }
  }

  useEffect(()=>{
    fetchTestimonials();
  }, [currentTestimonial])
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    try {
      const response = await fetch(`/api/properties/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      setSearchResults(data.data)
    } catch (error) {
      console.error("Error searching properties:", error)
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
  }

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % totalTestimonials)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + totalTestimonials) % totalTestimonials)
  }

  const openVideoModal = (videoLink: string) => {
    setCurrentVideo(videoLink.split("#VIDEO#")[0])
    setVideoModalOpen(true)
  }

  const closeVideoModal = () => {
    setVideoModalOpen(false)
    setCurrentVideo("")
  }

  const featuredProperties = properties.filter((p) => p.featured).slice(0, 4)

  const t = useTranslations();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-16 md:pb-0">
      <Header />
      <Slider className="w-full h-[522px]" showSearch page="Home" />

      {/* Search Section */}
      <motion.div
        className="absolute md:block hidden inset-0 text-center px-4 max-w-4xl mx-auto text-slate-900 dark:text-white"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 450 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <motion.div
          className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300 w-5 h-5" />
            <Input
              type="text"
              placeholder={t("Home.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10 h-12 border-0 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-300 bg-white/90 dark:bg-gray-800/70 backdrop-blur-sm"
            />
          </div>
          <Button
            onClick={handleSearch}
            className="h-12 px-8 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold transition-all duration-300 transform hover:scale-105"
          >
            {t("Home.searchButton")}
          </Button>
          {searchQuery && (
            <Button
              onClick={clearSearch}
              variant="outline"
              className="h-12 px-6 bg-white/20 dark:bg-gray-700/50 backdrop-blur-sm border border-white/30 dark:border-gray-500 text-slate-900 dark:text-white hover:bg-white/30 dark:hover:bg-gray-600/60"
            >
              {t("Home.clearButton")}
            </Button>
          )}
        </motion.div>

        {/* Search Results */}
        <AnimatePresence>
          {searchResults.length > 0 && (
            <motion.div
              className="grid relative grid-cols-1 gap-6 max-w-6xl mx-auto my-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="max-h-[400px] overflow-y-auto border rounded-lg bg-white/80 dark:bg-gray-800/80 shadow p-4 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-200 dark:scrollbar-track-gray-900">
                {searchResults.map((property) => {
                  const regex = new RegExp(`(${searchQuery})`, "ig");
                  const highlight = (text) =>
                    text.split(regex).map((part, i) =>
                      regex.test(part) ? (
                        <mark key={i} className="bg-yellow-300 dark:bg-yellow-500 text-gray-900 dark:text-gray-900 rounded px-1">
                          {part}
                        </mark>
                      ) : (
                        <span key={i}>{part}</span>
                      )
                    );

                  return (
                    <div
                      key={property.id}
                      className="flex items-center justify-between gap-4 border-b last:border-b-0 py-2 border-gray-300 dark:border-gray-700"
                    >
                      <div className="flex gap-2 min-w-0 text-sm text-slate-900 dark:text-gray-200">
                        <span className="font-medium truncate">{t("Home.title")}: {highlight(property.title)}</span>
                        <span className="font-medium truncate">{t("Home.location")}: {highlight(property.location)}</span>
                        <span className="font-medium truncate">{t("Home.pincode")}: {highlight(property.pinCode.toString())}</span>
                        <span className="font-medium truncate">{t("Home.type")}: {highlight(property.type)}</span>
                        <span className="text-amber-600 dark:text-amber-400 font-semibold">{property.price} INR</span>
                      </div>
                      <Link href={`/properties/${property.slug}`}>
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                          {t("Home.viewDetails")}
                        </Button>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Explore Properties */}
        {searchResults.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1 }}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              onClick={() => document.getElementById("properties")?.scrollIntoView({ behavior: "smooth" })}
            >
              {t("Home.exploreProperties")}
            </Button>
          </motion.div>
        )}
      </motion.div>

      <StatsSection />

      
      {/* Featured Properties */}
      <section
  id="properties"
  className="py-20 px-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
>
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-16" {...fadeInUp}>
      <h2 className="text-4xl md:text-5xl font-bold mb-4">{t("Home.featuredProperties")}</h2>
      <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mb-6" />
      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
  {t("Home.featuredDescription")}
      </p>
    </div>

    {loading ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[...Array(4)].map((_, i) => (
          <PropertyCardSkeleton key={i} dark />
        ))}
      </div>
    ) : (
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        {featuredProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    )}
  </div>
</section>



      {/* Spotlight Section */}
      <section className="py-20 bg-white dark:bg-gradient-to-r dark:from-slate-900 dark:to-blue-900 text-gray-900 dark:text-white">
  <div className="max-w-7xl mx-auto px-4">
    <motion.div className="text-center mb-16" {...fadeInUp}>
      <h2 className="text-4xl md:text-5xl font-bold mb-4">{t("Home.spotlightProperties")}</h2>
      <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mb-6" />
    </motion.div>

    <motion.div
      className="grid grid-cols-1 lg:grid-cols-2 gap-12"
      variants={staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
    >
      {spotlightProperties.map((property) => (
        <SpotlightCard key={property.id} property={property} />
      ))}
    </motion.div>
  </div>
</section>


      {/* Virtual Tours */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  <div className="max-w-7xl mx-auto">
    <motion.div className="text-center mb-16" {...fadeInUp}>
      <h2 className="text-4xl md:text-5xl font-bold mb-4">
        {t("Home.virtualTours")}
      </h2>
      <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mb-6" />
      <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
  {t("Home.virtualToursDescription")}
      </p>
    </motion.div>

    <div
      className="grid grid-cols-1 md:grid-cols-3 gap-8"
      variants={staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
    >
      {featuredProperties.map((property) => {
        if (!property.virtualTourLink) return null;
        return (
          <VideoCard
            key={property.id}
            property={property}
            dark={true} // Optional: let VideoCard handle dark mode internally
            onPlay={() => openVideoModal(property.virtualTourLink)}
          />
        );
      })}
    </div>
  </div>
</section>




      {/* Testimonials */}
    <section className="py-20 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  <div className="max-w-4xl mx-auto px-4">
    <motion.div className="text-center mb-16" {...fadeInUp}>
      <h2 className="text-4xl md:text-5xl font-bold mb-4">{t("Home.clientStories")}</h2>
      <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mb-6" />
      <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
  {t("Home.testimonialsDescription")}
      </p>
    </motion.div>

    <div className="relative">
      <AnimatePresence mode="wait">
        <div className="flex flex-wrap md:flex-nowrap justify-center gap-8">
          {testimonials.length > 0 &&
            testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                testimonial={testimonial}
                // Remove dark prop if TestimonialCard uses theme automatically
                onPlay={() => openVideoModal(testimonial.youtubeUrl)}
              />
            ))}
        </div>
      </AnimatePresence>

      <div className="flex justify-center gap-4 mt-8">
        <Button
          onClick={prevTestimonial}
          variant="outline"
          size="sm"
          className="bg-gray-200/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-gray-300 dark:hover:bg-gray-700"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button
          onClick={nextTestimonial}
          variant="outline"
          size="sm"
          className="bg-gray-200/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-gray-300 dark:hover:bg-gray-700"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  </div>
</section>



      {/* Video Modal */}
      <AnimatePresence>
        {videoModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeVideoModal}
          >
            <motion.div
              className="relative w-full max-w-4xl mx-4 aspect-video bg-black rounded-lg overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                onClick={closeVideoModal}
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
              >
                <X className="w-6 h-6" />
              </Button>
              <iframe
                src={currentVideo}
                className="w-full h-full"
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

function PropertyCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="w-full h-64" />
      <CardContent className="p-6">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-8 w-1/2 mb-3" />
        <div className="flex gap-4 mb-4">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-4 w-2/3 mb-4" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  )
}

function SpotlightCard({ property }: { property: Property }) {
  return (
    <motion.div
  variants={fadeInUp}
  whileHover={{ scale: 1.03, rotateX: 2, rotateY: 2 }}
  className="group perspective-1000"
>
  <Card className="dark:bg-gray-900/20 backdrop-blur-md border text-black border-gray-700 dark:text-white overflow-hidden hover:bg-gray-300/30 transition-all duration-500">
    {/* Image Section */}
    <div className="relative overflow-hidden">
      <img
        src={`/images/${property.thumbnailImage}` || "/placeholder.svg"}
        alt={property.title}
        className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
      />
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
    </div>

    {/* Card Content */}
    <CardContent className="p-8">
      <h3 className="text-2xl font-bold mb-2 ">{property.title}</h3>
      <p className="text-3xl font-extrabold  text-amber-600 mb-4">
        {property.type==="Plot"? property.cents?.split("#CENTS#")[0] :`${property.price} INR`}
      </p>

      {/* Key Features */}
      <div className="flex items-center gap-6 text-blue-600 dark:text-white mb-6">
        {property.type!=="Plot" && <><div className="flex items-center gap-2">
          <Bed className="w-5 h-5" />
          <span>{property.bedrooms} Beds</span>
        </div>
        <div className="flex items-center gap-2">
          <Bath className="w-5 h-5" />
          <span>{property.bathrooms || 0} Baths</span>
        </div></>}
        {property.areaSqft && (
          <div className="flex items-center gap-2">
            <Square className="w-5 h-5" />
            <span>{property.areaSqft} sq ft</span>
          </div>
        )}
      </div>

      {/* Action Button */}
      <Link href={`/properties/${property.slug}`}>
        <Button
          size="lg"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold transition-all duration-300 transform hover:scale-105"
        >
          Schedule a Viewing
        </Button>
      </Link>
    </CardContent>
  </Card>
</motion.div>

  )
}

function VideoCard({ property, onPlay }: { property: Property; onPlay: () => void }) {
  return (
    <motion.div
  variants={fadeInUp}
  whileHover={{ y: -5, rotateX: 3, rotateY: 3 }}
  className="group cursor-pointer perspective-1000"
  onClick={onPlay}
>
  <Card className="overflow-hidden bg-gray-900/20 backdrop-blur-md border border-gray-700 shadow-md hover:shadow-2xl transition-all duration-500">
    <div className="relative">
      <iframe
        src={property.virtualTourLink.split("#VIDEO#")[0]}
        className="w-full h-64 rounded-md"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />

      {/* Overlay Play Button */}
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-16 h-16 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300">
          <Play className="w-8 h-8 text-white ml-1" />
        </div>
      </div>
    </div>

    {/* Optional: Uncomment if you want property details below the video */}
    {/*
    <CardContent className="p-6">
      <h3 className="text-lg font-bold text-white mb-3">{property.title}</h3>
      <div className="flex items-center gap-4 text-sm text-gray-300 mb-3">
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4 text-gray-300" />
          <span>{property.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Square className="w-4 h-4 text-gray-300" />
          <span>{property.areaSqft} sqft</span>
        </div>
        <div className="flex items-center gap-1">
          <Bed className="w-4 h-4 text-gray-300" />
          <span>{property.bedrooms} Beds</span>
        </div>
      </div>
      <p className="text-gray-400 text-sm">{property.description}</p>
    </CardContent>
    */}
  </Card>
</motion.div>

  )
}

function TestimonialCard({ testimonial, onPlay  }: { testimonial: Testimonial, onPlay: () => void }) {
  return (
    <motion.div
  initial={{ opacity: 0, x: 50 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: -50 }}
  transition={{ duration: 0.5 }}
  onClick={onPlay}
  className="group cursor-pointer perspective-1000"
>
  <Card className="bg-gray-900/20 backdrop-blur-md shadow-xl border border-gray-700 hover:shadow-2xl transition-all duration-500">
    <div className="text-center rounded-lg overflow-hidden relative">
      <iframe
        src={testimonial.youtubeUrl}
        className="w-full h-72 rounded-md"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />

      {/* Overlay Play Button */}
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-16 h-16 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300">
          <Play className="w-8 h-8 text-white ml-1" />
        </div>
      </div>

      {/* Optional testimonial details */}
      {/*
      <div className="absolute bottom-4 left-0 right-0 px-4 text-center">
        <h4 className="text-white font-bold text-lg">{testimonial.customer.name}</h4>
        <p className="text-gray-300 text-sm">{testimonial.role}</p>
        <p className="text-gray-400 italic mt-2">"{testimonial.review}"</p>
      </div>
      */}
    </div>
  </Card>
</motion.div>

  )
}
