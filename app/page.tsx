"use client"

import { useState, useEffect } from "react"
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

  useEffect(() => {
    fetchProperties()
    fetchTestimonials()
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
  const spotlightProperties = properties.filter((p) => p.type === "Luxury").slice(0, 2)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-16 md:pb-0">
      <Header />

      {/* Hero Section
      <section className="relative h-screen flex items-center justify-center overflow-hidden mt-0 md:mt-16">
        <div className="absolute inset-0 z-0">
          <Slider className="w-full h-screen relative"/>
        </div>

        <motion.div
          className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Welcome to Ananta Realty
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-8 text-blue-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Find your dream home with our expert guidance
          </motion.p>

          {/* Search Bar */}
          {/* <motion.div
            className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search properties by city or zip code"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-white/90 backdrop-blur-sm border-0 text-slate-800 placeholder:text-slate-500"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button
              onClick={handleSearch}
              className="h-12 px-8 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Search
            </Button>
            {searchQuery && (
              <Button
                onClick={clearSearch}
                variant="outline"
                className="h-12 px-6 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
              >
                Clear
              </Button>
            )}
          </motion.div>

          {/* Search Results */}
          {/* <AnimatePresence>
            {searchResults.length > 0 && (
              <motion.div
                className="grid relative grid-cols-1 gap-6 max-w-6xl mx-auto my-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
            <div className="max-h-[400px] overflow-y-auto border rounded-lg bg-white/80 shadow p-4 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50">
              {searchResults.map((property) => {
                // Highlight search match in property title
                const regex = new RegExp(`(${searchQuery})`, "ig");
                const parts = property.title.split(regex);
                const locationParts = property.location.split(regex);
                const pinCodeParts = property.pinCode.toString().split(regex);
                const typeParts = property.type.split(regex);
                return (
                  <div key={property.id} className="flex items-center justify-between gap-4 border-b last:border-b-0 py-2">
                    <div className="flex gap-2 min-w-0 text-sm ">
                      <span className="font-medium text-slate-800 truncate">
                        Title : {parts.map((part, i) =>
                          regex.test(part) ? (
                            <mark key={i} className="bg-yellow-200 text-blue-900 rounded px-1">{part}</mark>
                          ) : (
                            <span key={i}>{part}</span>
                          )
                        )}
                      </span>
                      <span className="font-medium text-slate-800 truncate">
                        Location : {locationParts.map((part, i) =>
                          regex.test(part) ? (
                            <mark key={i} className="bg-yellow-200 text-blue-900 rounded px-1">{part}</mark>
                          ) : (
                            <span key={i}>{part}</span>
                          )
                        )}
                      </span>
                      <span className="font-medium text-slate-800 truncate">
                        Pincode : {pinCodeParts.map((part, i) =>
                          regex.test(part) ? (
                            <mark key={i} className="bg-yellow-200 text-blue-900 rounded px-1">{part}</mark>
                          ) : (
                            <span key={i}>{part}</span>
                          )
                        )}
                      </span>
                      <span className="font-medium text-slate-800 truncate">
                        Type : {typeParts.map((part, i) =>
                          regex.test(part) ? (
                            <mark key={i} className="bg-yellow-200 text-blue-900 rounded px-1">{part}</mark>
                          ) : (
                            <span key={i}>{part}</span>
                          )
                        )}
                      </span>
                      <span className="text-amber-600 font-semibold">{property.price} INR</span>
                    </div>
                    <Link href={`/properties/${property.slug}`}>
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                        View Details
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          
              </motion.div>
            )}
          </AnimatePresence> */}

          {/* {searchResults.length===0 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1 }}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              onClick={() => document.getElementById("properties")?.scrollIntoView({ behavior: "smooth" })}
            >
              Explore Properties
            </Button>
          </motion.div>}
        </motion.div> */}
      {/* </section> */}
      <Slider className="w-full h-[600px]" showSearch page="Home"/>

      {/* Featured Properties */}
      <section id="properties" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Featured Properties</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mb-6" />
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium properties
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Spotlight Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Property of the Month</h2>
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
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">360° Virtual Property Tours</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mb-6" />
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {featuredProperties.map((property) => {
              if (!property.virtualTourLink) return null
              return <VideoCard key={property.id} property={property} onPlay={() => openVideoModal(property.virtualTourLink)} />
            })}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Client Success Stories</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mb-6" />
          </motion.div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

              {testimonials.length > 0 && (
                testimonials.map((testimonial, index) => (
                  <TestimonialCard key={index} testimonial={testimonial} onPlay={() => openVideoModal(testimonial.youtubeUrl)}/>
                ))
              )}
              </div>
            </AnimatePresence>

            <div className="flex justify-center gap-4 mt-8">
              <Button
                onClick={prevTestimonial}
                variant="outline"
                size="sm"
                className="bg-white/80 backdrop-blur-sm hover:bg-white"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button
                onClick={nextTestimonial}
                variant="outline"
                size="sm"
                className="bg-white/80 backdrop-blur-sm hover:bg-white"
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
      {/* <ChatBot /> */}
    </div>
  )
}

// function PropertyCard({ property }: { property: Property }) {
//   return (
//     <motion.div variants={fadeInUp} whileHover={{ y: -10, rotateX: 5, rotateY: 5 }} className="group">
//       <Card className="overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform-gpu perspective-1000">
//         <div className="relative overflow-hidden">
//           <Image
//             src={`/images/${property.thumbnailImage}` || "/placeholder.svg"}
//             alt={property.title}
//             width={640}
//             height={64}
//             className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
//           />
//           {property.featured && (
//             <Badge className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
//               Featured
//             </Badge>
//           )}
//           <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//         </div>
//         <CardContent className="p-6">
//           <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
//             {property.title}
//           </h3>
//           <p className="text-2xl font-bold text-amber-600 mb-3">{property.price} INR</p>
//           <div className="flex items-center gap-4 text-slate-600 mb-4">
//             <div className="flex items-center gap-1">
//               <Bed className="w-4 h-4" />
//               <span>{property.bedrooms}</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <Bath className="w-4 h-4" />
//               <span>{property.bathrooms || 0}</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <Square className="w-4 h-4" />
//               <span>{property.areaSqft} sqft</span>
//             </div>
//           </div>
//           <div className="flex items-center gap-2 text-slate-500 mb-4">
//             <MapPin className="w-4 h-4" />
//             <span>{property.location}</span>
//           </div>
// <Link href={`/properties/${property.slug}`}>
//             <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300 transform hover:scale-105">
//               View Details
//             </Button>
//           </Link>
//         </CardContent>
//       </Card>
//     </motion.div>
//   )
// }

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
    <motion.div variants={fadeInUp} whileHover={{ scale: 1.02, rotateX: 2, rotateY: 2 }} className="group">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white overflow-hidden hover:bg-white/20 transition-all duration-500">
        <div className="relative overflow-hidden">
          <img
            src={`/images/${property.thumbnailImage}` || "/placeholder.svg"}
            alt={property.title}
            className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <CardContent className="p-8">
          <h3 className="text-2xl font-bold mb-2">{property.title}</h3>
          <p className="text-3xl font-bold text-amber-400 mb-4">{property.price} INR</p>
          <div className="flex items-center gap-6 text-blue-200 mb-6">
            <div className="flex items-center gap-2">
              <Bed className="w-5 h-5" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="w-5 h-5" />
              <span>{property.bathrooms || 0} Baths</span>
            </div>
          </div>
          <Link href={`/properties/${property.slug}`}>
          
          <Button
            size="lg"
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white transition-all duration-300 transform hover:scale-105"
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
      className="group cursor-pointer"
      onClick={onPlay}
    >
      <Card className="overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500">
        <div className="relative">
          <iframe
                src={property.virtualTourLink.split("#VIDEO#")[0]}
                className="w-full h-64"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
              <Play className="w-8 h-8 text-slate-800 ml-1" />
            </div>
          </div>
        </div>
        {/* <CardContent className="p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-3">{property.title}</h3>
          <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{property.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Square className="w-4 h-4" />
              <span>{property.areaSqft} sqft</span>
            </div>
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span>{property.bedrooms} Beds</span>
            </div>
          </div>
          <p className="text-slate-600 text-sm">{property.description}</p> */}
        {/* </CardContent> */}
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

    >
      <Card className="bg-white/80 shadow-xl border-0">
        <div className="text-center rounded-lg overflow-hidden">
          <iframe
                src={testimonial.youtubeUrl}
                className="w-full h-64"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
          {/* <img
            src={testimonial.customer.avatar || "/placeholder.svg"}
            alt={testimonial.customer.name}
            className="w-20 h-20 rounded-full mx-auto mb-6 object-cover"
          />
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${i < testimonial.rating ? "text-amber-400 fill-current" : "text-slate-300"}`}
              />
            ))}
          </div>
          <p className="text-lg text-slate-700 mb-6 italic leading-relaxed">"{testimonial.review}"</p>
          <h4 className="text-xl font-bold text-slate-800 mb-1">{testimonial.customer.name}</h4> */}
          {/* <p className="text-slate-600 mb-2">{testimonial.role}</p> */}
          {/* <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <span>Purchased:</span>
            <span className="font-medium">{testimonial.property}</span>
          </div> */}
        </div>
      </Card>
    </motion.div>
  )
}
