"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ZoomIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ChatBot from "@/components/chatbot"
import { Slider } from "@/components/slider"

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

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<any>(null)
  const [filter, setFilter] = useState("all")
  const [galleryItems, setGalleryItems] = useState<any[]>([])

  useEffect(() => {
    fetch(`/api/galleryItems?folder=${filter}`)
      .then((response) => response.json())
      .then((data) => {
        // Assuming the data is in the same format as galleryItems
        setGalleryItems(data);
      })
      .catch((error) => console.error("Error fetching gallery items:", error));
  }, [filter]);
  const openLightbox = (item: any) => {
    setSelectedImage(item)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
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
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Explore Our Stunning Properties</h1>
          <p className="text-xl md:text-2xl text-blue-100">
            Discover the beauty and luxury of Ananta Realty's exclusive homes
          </p>
        </motion.div>
      </section>

      {/* Filter Buttons */}
      <section className="py-8 bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center gap-4 flex-wrap">
            {["all", "interior", "exterior"].map((category) => (
              <Button
                key={category}
                onClick={() => setFilter(category)}
                variant={filter === category ? "default" : "outline"}
                className={`transition-all duration-300 ${
                  filter === category ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : "hover:bg-blue-50"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-12" {...fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Property Gallery</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto" />
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <AnimatePresence>
              {galleryItems.map((item) => (
                <GalleryCard key={item.id} item={item} onClick={() => openLightbox(item)} />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <motion.div
              className="relative max-w-4xl w-full bg-white rounded-lg overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                onClick={closeLightbox}
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 z-10 bg-black/20 text-white hover:bg-black/40"
              >
                <X className="w-6 h-6" />
              </Button>

              <img
                src={`data:image/jpeg;base64,${selectedImage.content}` || "/placeholder.svg"}
                alt={selectedImage.title}
                className="w-full h-96 object-cover"
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

function byteArrayToDataURL(byteArray: number[] | Uint8Array, mimeType = "image/jpeg") {
  if (!byteArray) return null
  const binary = typeof byteArray === "string"
    ? byteArray
    : String.fromCharCode(...byteArray)
  const base64 = btoa(binary)
  return `data:${mimeType};base64,${base64}`
}

function GalleryCard({ item, onClick }: { item: any; onClick: () => void }) {
const imageSrc = item.content
    ? `data:image/jpeg;base64,${item.content}`
    : "/placeholder.svg";
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -5, rotateX: 3, rotateY: 3 }}
      className="group cursor-pointer"
      onClick={onClick}
      layout
    >
      <Card className="overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform-gpu perspective-1000">
        <div className="relative overflow-hidden">
          <img
            src={imageSrc}
            alt={item.title}
            className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
              <ZoomIn className="w-6 h-6 text-slate-800" />
            </div>
          </div>
          
        </div>
      </Card>
    </motion.div>
  )
}
