"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Play, X, ZoomIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ChatBot from "@/components/chatbot"
import { Slider } from "@/components/slider"
import { set } from "date-fns"

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
  const [filter, setFilter] = useState("Images")
  const [galleryItems, setGalleryItems] = useState<any[]>([])
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [currentVideo, setCurrentVideo] = useState("")
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/galleryItems?type=${filter}&page=${currentPage}&size=9`)
      .then((response) => response.json())
      .then((data) => {
        // Assuming the data is in the same format as galleryItems
        const galleryItems = data.body.data;
        setTotalPages(data.body.totalPages || 1);
        setGalleryItems(galleryItems);
      })
      .catch((error) => console.error("Error fetching gallery items:", error))
      .finally(() => setLoading(false));
  }, [filter, currentPage]);
  const openLightbox = (item: any) => {
    setSelectedImage(item)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }


  const openVideoModal = (videoLink: string) => {
    setCurrentVideo(videoLink)
    setVideoModalOpen(true)
  }

  const closeVideoModal = () => {
    setVideoModalOpen(false)
    setCurrentVideo("")
  }


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  };

    const PaginationComponent = () => (
      <div className="flex items-center justify-center gap-2 mt-8">
  <Button
    variant="outline"
    onClick={() => handlePageChange(currentPage - 1)}
    disabled={currentPage === 1}
    className="flex items-center gap-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
  >
    ← Previous
  </Button>

  {/* Page Numbers */}
  {/* 
  <div className="flex items-center gap-1">
    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
      let pageNum;
      if (totalPages <= 5) {
        pageNum = i + 1;
      } else if (currentPage <= 3) {
        pageNum = i + 1;
      } else if (currentPage >= totalPages - 2) {
        pageNum = totalPages - 4 + i;
      } else {
        pageNum = currentPage - 2 + i;
      }

      return (
        <Button
          key={pageNum}
          variant={currentPage === pageNum ? "default" : "outline"}
          onClick={() => handlePageChange(pageNum)}
          className={`w-10 h-10 border-slate-300 dark:border-slate-600 ${
            currentPage === pageNum
              ? "bg-blue-600 text-white dark:bg-blue-500"
              : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          } transition-colors`}
        >
          {pageNum}
        </Button>
      );
    })}
  </div>
  */}

  <Button
    variant="outline"
    onClick={() => handlePageChange(currentPage + 1)}
    disabled={currentPage === totalPages}
    className="flex items-center gap-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
  >
    Next →
  </Button>
</div>

    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 pb-16 md:pb-0">
  <Header />

  {/* Hero Section */}
  <Slider className="w-full h-[300px]" showSearch={false} page="Gallery" />

  {/* Filter Buttons */}
  <section className="py-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b dark:border-b-slate-700">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex justify-center gap-4 flex-wrap">
        {["Images", "Videos"].map((category) => (
          <Button
            key={category}
            onClick={() => setFilter(category)}
            variant={filter === category ? "default" : "outline"}
            className={`transition-all duration-300 ${
              filter === category
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                : "hover:bg-blue-50 dark:hover:bg-slate-700 dark:text-slate-200 text-slate-800"
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
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">Property Gallery</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto" />
      </motion.div>

      <div className="mb-8">
        <PaginationComponent />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="animate-spin w-8 h-8 text-blue-400 dark:text-blue-500" />
        </div>
      ) : filter === "Images" ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <AnimatePresence>
            {galleryItems.map((item, index) => (
              <GalleryCard
                key={index}
                item={item.filePath + item.filename}
                onClick={() => openLightbox(item.filePath + item.filename)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {galleryItems.map((galleryItem, index) => {
            if (!galleryItem) return null
            return (
              <VideoCard
                key={index}
                videoLink={galleryItem.youtubeUrl}
                onPlay={() => openVideoModal(galleryItem.youtubeUrl)}
              />
            )
          })}
        </motion.div>
      )}

      <PaginationComponent />
    </div>
  </section>

  {/* Lightbox Modal */}
  <AnimatePresence>
    {selectedImage && (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 dark:bg-black/95 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeLightbox}
      >
        <motion.div
          className="relative max-w-4xl w-full bg-white dark:bg-slate-900 rounded-lg overflow-hidden"
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
            src={`/images/${selectedImage}` || "/placeholder.svg"}
            alt={selectedImage}
            className="w-full h-96 object-cover"
          />
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>

  {/* Video Modal */}
  <AnimatePresence>
    {videoModalOpen && (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 dark:bg-black/95 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeVideoModal}
      >
        <motion.div
          className="relative w-full max-w-4xl mx-4 aspect-video bg-black dark:bg-slate-900 rounded-lg overflow-hidden"
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

function byteArrayToDataURL(byteArray: number[] | Uint8Array, mimeType = "image/jpeg") {
  if (!byteArray) return null
  const binary = typeof byteArray === "string"
    ? byteArray
    : String.fromCharCode(...byteArray)
  const base64 = btoa(binary)
  return `data:${mimeType};base64,${base64}`
}

function GalleryCard({ item, onClick }: { item: any; onClick: () => void }) {
const imageSrc = `/images/${item}`;
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
            alt={item}
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

function VideoCard({ videoLink, onPlay }: { videoLink: string; onPlay: () => void }) {
  return (
    <motion.div
      variants={fadeInUp}
      // whileHover={{ y: -5, rotateX: 3, rotateY: 3 }}
      className="group cursor-pointer"
      onClick={onPlay}
    >
      <Card className="overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500">
        <div className="relative">
          <iframe
                src={videoLink}
                className="w-full h-64"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-24 h-24 bg-white/90 rounded-full flex items-center justify-center">
              <Play className="w-8 h-8 text-slate-800 ml-1" />
            </div>
          </div>
        </div>
      
      </Card>
    </motion.div>
  )
}
