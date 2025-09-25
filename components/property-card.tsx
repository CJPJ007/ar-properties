"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Bed, Bath, Square, Heart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useWishlist } from "@/hooks/user-wishlist"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Property } from "@/lib/interfaces"
import { useSession } from "next-auth/react"
import { useTranslations } from "next-intl"

interface PropertyCardProps {
  property: Property
  showWishlistButton?: boolean
}

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
}

export default function PropertyCard({ property, showWishlistButton = true }: PropertyCardProps) {
const {data:session} = useSession();
    const { toggleWishlist, isInWishlist, loading } = useWishlist()
  const { toast } = useToast()
  const [isLiked, setIsLiked] = useState(isInWishlist(property.id))

  useEffect(() => {
  setIsLiked(isInWishlist(property.id))
}, [property.id, isInWishlist])
  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation when clicking heart
    e.stopPropagation()

    if (!session || !session.user) {
      toast({
        title: "Login Required",
        description: "Please login to add properties to your wishlist.",
        variant: "destructive",
      })
      return
    }

    const success = await toggleWishlist(property.id, property.title)
    if (success) {
      setIsLiked(!isLiked)
    }
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const propertyUrl = `${window.location.origin}/property/${property.slug}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Check out this amazing property: ${property.title}`,
          url: propertyUrl,
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      try {
        await navigator.clipboard.writeText(propertyUrl)
        toast({
          title: "Link Copied!",
          description: "Property link copied to clipboard.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to copy link to clipboard.",
          variant: "destructive",
        })
      }
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

  const formatArea = (area: number) => {
    return new Intl.NumberFormat("en-US").format(area)
  }

    const  t  = useTranslations();


  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -10, rotateX: 5, rotateY: 5 }}
      className="group"
    >
      <Card className="overflow-hidden bg-white dark:bg-gray-900 shadow-lg hover:shadow-2xl transition-all duration-500 transform-gpu perspective-1000">
        <div className="relative overflow-hidden">
          <img
            src={property.thumbnailImage ? `/images/${property.thumbnailImage}` : "/placeholder.svg?height=300&width=400"}
            alt={property.title}
            className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Status Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {property.featured && (
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                {t("PropertyCard.featured")}
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button onClick={handleShare} variant="ghost" size="sm" className="bg-black/20 z-50 text-white hover:bg-black/40 backdrop-blur-sm">
              <Share2 className="w-4 h-4" />
            </Button>

            {session?.user && showWishlistButton && (
              <Button onClick={handleWishlistToggle} disabled={loading} variant="ghost" size="sm" className="bg-black/20 z-50 text-white hover:bg-black/40 backdrop-blur-sm">
                <Heart className={`w-4 h-4 transition-colors ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
            )}
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-blue-600 transition-colors">
            {property.title}
          </h3>
          <p className="text-2xl font-bold text-amber-600 mb-3">
            {property.type === "Plot"
              ? `${property.cents?.split("#CENTS#")[0]}`
              : formatPrice(property.price)}
          </p>

          <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300 mb-4">
            {property.type !== "Plot" && (
              <>
                <div className="flex items-center gap-1">
                  <Bed className="w-4 h-4" />
                  <span>{property.bedrooms}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bath className="w-4 h-4" />
                  <span>{property.bathrooms}</span>
                </div>
              </>
            )}
            <div className="flex items-center gap-1">
              <Square className="w-4 h-4" />
              <span>{property.areaSqft} sq ft</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-4">
            <MapPin className="w-4 h-4" />
            <span>{property.location}</span>
          </div>

          <div className="flex gap-2">
            <Link href={`/properties/${property.slug}`} className="flex-1">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300 transform hover:scale-105" disabled={property.sold}>
                {property.sold ? t("PropertyCard.sold") : t("PropertyCard.viewDetails")}
              </Button>
            </Link>

            {session?.user && showWishlistButton && (
              <Button
                onClick={handleWishlistToggle}
                disabled={loading}
                variant="outline"
                size="sm"
                className={`px-3 transition-all duration-300 ${
                  isLiked
                    ? "bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800"
                    : "hover:bg-slate-50 dark:hover:bg-gray-800 bg-transparent"
                }`}
              >
                <Heart className={`w-4 h-4 transition-colors ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>

  );
}
