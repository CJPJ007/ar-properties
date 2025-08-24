"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Heart,
  Search,
  Filter,
  MapPin,
  Bed,
  Bath,
  Square,
  Trash2,
  Share2,
  Eye,
  Calendar,
  SlidersHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ChatBot from "@/components/chatbot"
import Link from "next/link"

interface WishlistProperty {
  id: string
  title: string
  price: string
  beds: number
  baths: number
  sqft: string
  location: string
  image: string
  type: string
  featured: boolean
  addedDate: string
  status: "available" | "sold" | "pending"
  priceChange?: {
    type: "increase" | "decrease"
    amount: string
    percentage: string
  }
}

interface ApiResponse<T> {
  totalRecords: number
  data: T[]
  totalPages: number
  currentPage: number
}

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

export default function WishlistPage() {
  const [wishlistData, setWishlistData] = useState<ApiResponse<WishlistProperty> | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [currentPage, setCurrentPage] = useState(1)
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
  const { toast } = useToast()

  // Mock wishlist data
  const mockWishlistData: WishlistProperty[] = [
    {
      id: "1",
      title: "Modern Family Home",
      price: "$450,000",
      beds: 4,
      baths: 3,
      sqft: "2,800 sq ft",
      location: "Highland Park",
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
      type: "house",
      featured: true,
      addedDate: "2024-01-15T10:30:00Z",
      status: "available",
      priceChange: {
        type: "decrease",
        amount: "$10,000",
        percentage: "2.2%",
      },
    },
    {
      id: "2",
      title: "Luxury Condo",
      price: "$320,000",
      beds: 2,
      baths: 2,
      sqft: "1,400 sq ft",
      location: "Downtown",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
      type: "condo",
      featured: true,
      addedDate: "2024-01-12T09:15:00Z",
      status: "available",
    },
    {
      id: "3",
      title: "Cozy Townhouse",
      price: "$280,000",
      beds: 3,
      baths: 2,
      sqft: "1,800 sq ft",
      location: "Riverside",
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
      type: "townhouse",
      featured: true,
      addedDate: "2024-01-10T16:45:00Z",
      status: "pending",
    },
    {
      id: "4",
      title: "Luxury Villa",
      price: "$650,000",
      beds: 5,
      baths: 4,
      sqft: "4,200 sq ft",
      location: "Beverly Hills",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      type: "luxury",
      featured: true,
      addedDate: "2024-01-08T14:20:00Z",
      status: "available",
      priceChange: {
        type: "increase",
        amount: "$25,000",
        percentage: "4.0%",
      },
    },
    {
      id: "5",
      title: "Luxury Waterfront Villa",
      price: "$750,000",
      beds: 5,
      baths: 4,
      sqft: "5,200 sq ft",
      location: "Beverly Hills",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      type: "luxury",
      featured: false,
      addedDate: "2024-01-05T11:30:00Z",
      status: "available",
    },
    {
      id: "6",
      title: "Mountain Retreat Cabin",
      price: "$550,000",
      beds: 3,
      baths: 2,
      sqft: "2,400 sq ft",
      location: "Mountain View",
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
      type: "luxury",
      featured: false,
      addedDate: "2024-01-03T09:45:00Z",
      status: "sold",
    },
    {
      id: "7",
      title: "Urban Loft",
      price: "$380,000",
      beds: 2,
      baths: 1,
      sqft: "1,200 sq ft",
      location: "Arts District",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
      type: "condo",
      featured: false,
      addedDate: "2024-01-01T15:20:00Z",
      status: "available",
    },
    {
      id: "8",
      title: "Suburban Family Home",
      price: "$425,000",
      beds: 4,
      baths: 3,
      sqft: "2,600 sq ft",
      location: "Westfield",
      image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
      type: "house",
      featured: false,
      addedDate: "2023-12-28T12:10:00Z",
      status: "available",
    },
  ]

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch wishlist data
  const fetchWishlistData = useCallback(
    async (page = 1, search?: string, type?: string, status?: string, sort?: string) => {
      setLoading(true)
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        let filteredData = [...mockWishlistData]

        // Apply filters
        if (search) {
          filteredData = filteredData.filter(
            (property) =>
              property.title.toLowerCase().includes(search.toLowerCase()) ||
              property.location.toLowerCase().includes(search.toLowerCase()),
          )
        }

        if (type && type !== "all") {
          filteredData = filteredData.filter((property) => property.type === type)
        }

        if (status && status !== "all") {
          filteredData = filteredData.filter((property) => property.status === status)
        }

        // Apply sorting
        switch (sort) {
          case "recent":
            filteredData.sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime())
            break
          case "oldest":
            filteredData.sort((a, b) => new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime())
            break
          case "price-low":
            filteredData.sort(
              (a, b) => Number.parseInt(a.price.replace(/[$,]/g, "")) - Number.parseInt(b.price.replace(/[$,]/g, "")),
            )
            break
          case "price-high":
            filteredData.sort(
              (a, b) => Number.parseInt(b.price.replace(/[$,]/g, "")) - Number.parseInt(a.price.replace(/[$,]/g, "")),
            )
            break
          case "beds":
            filteredData.sort((a, b) => b.beds - a.beds)
            break
        }

        const pageSize = 6
        const startIndex = (page - 1) * pageSize
        const endIndex = startIndex + pageSize
        const paginatedData = filteredData.slice(startIndex, endIndex)

        setWishlistData({
          totalRecords: filteredData.length,
          data: paginatedData,
          totalPages: Math.ceil(filteredData.length / pageSize),
          currentPage: page,
        })
      } catch (error) {
        console.error("Error fetching wishlist data:", error)
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  // Effect to fetch data when filters change
  useEffect(() => {
    fetchWishlistData(currentPage, debouncedSearchQuery, selectedType, selectedStatus, sortBy)
  }, [currentPage, debouncedSearchQuery, selectedType, selectedStatus, sortBy, fetchWishlistData])

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    setCurrentPage(1) // Reset to first page when searching
  }, [])

  // Handle filter changes
  const handleTypeChange = useCallback((type: string) => {
    setSelectedType(type)
    setCurrentPage(1)
  }, [])

  const handleStatusChange = useCallback((status: string) => {
    setSelectedStatus(status)
    setCurrentPage(1)
  }, [])

  const handleSortChange = useCallback((sort: string) => {
    setSortBy(sort)
    setCurrentPage(1)
  }, [])

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  // Remove from wishlist
  const removeFromWishlist = async (propertyId: string, propertyTitle: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      toast({
        title: "Removed from Wishlist",
        description: `${propertyTitle} has been removed from your wishlist.`,
      })

      // Refresh data
      fetchWishlistData(currentPage, debouncedSearchQuery, selectedType, selectedStatus, sortBy)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove property from wishlist.",
        variant: "destructive",
      })
    }
  }

  // Share property
  const shareProperty = (property: WishlistProperty) => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this amazing property: ${property.title}`,
        url: `${window.location.origin}/property/${property.id}`,
      })
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/property/${property.id}`)
      toast({
        title: "Link Copied!",
        description: "Property link copied to clipboard.",
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "sold":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const propertyTypes = ["all", "house", "condo", "townhouse", "luxury"]
  const statusOptions = ["all", "available", "pending", "sold"]
  const sortOptions = [
    { value: "recent", label: "Recently Added" },
    { value: "oldest", label: "Oldest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "beds", label: "Most Bedrooms" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-16 md:pb-0">
      <Header />

      {/* Back Button */}
      <div className="pt-20 md:pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/">
            <Button variant="outline" className="mb-6 bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>

      {/* Header */}
      <section className="px-4 mb-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Heart className="w-8 h-8 text-red-500 fill-current" />
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800">My Wishlist</h1>
            </div>
            <p className="text-xl text-slate-600">{wishlistData?.totalRecords || 0} properties saved for later</p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search wishlist..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 h-12 bg-white border-slate-200 focus:border-blue-500"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4 items-center flex-wrap">
              <Select value={selectedType} onValueChange={handleTypeChange}>
                <SelectTrigger className="w-40 h-12 bg-white border-slate-200">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-40 h-12 bg-white border-slate-200">
                  <Eye className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-40 h-12 bg-white border-slate-200">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Wishlist Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <WishlistCardSkeleton key={i} />
              ))}
            </div>
          ) : !wishlistData?.data || wishlistData.data.length === 0 ? (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Heart className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Your Wishlist is Empty</h3>
              <p className="text-slate-600 mb-6">Start exploring properties and save your favorites here</p>
              <Link href="/properties">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Browse Properties
                </Button>
              </Link>
            </motion.div>
          ) : (
            <>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                <AnimatePresence>
                  {wishlistData.data.map((property) => (
                    <WishlistCard
                      key={property.id}
                      property={property}
                      onRemove={() => removeFromWishlist(property.id, property.title)}
                      onShare={() => shareProperty(property)}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Pagination */}
              {wishlistData.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2"
                  >
                    ← Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, wishlistData.totalPages) }, (_, i) => {
                      let pageNum
                      if (wishlistData.totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= wishlistData.totalPages - 2) {
                        pageNum = wishlistData.totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          onClick={() => handlePageChange(pageNum)}
                          className="w-10 h-10"
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === wishlistData.totalPages}
                    className="flex items-center gap-2"
                  >
                    Next →
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
      <ChatBot />
    </div>
  )

  function WishlistCard({
    property,
    onRemove,
    onShare,
  }: {
    property: WishlistProperty
    onRemove: () => void
    onShare: () => void
  }) {
    return (
      <motion.div variants={fadeInUp} whileHover={{ y: -10, rotateX: 5, rotateY: 5 }} className="group" layout>
        <Card className="overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform-gpu perspective-1000">
          <div className="relative overflow-hidden">
            <img
              src={property.image || "/placeholder.svg"}
              alt={property.title}
              className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Status Badge */}
            <Badge className={`absolute top-4 left-4 ${getStatusColor(property.status)}`}>
              {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
            </Badge>

            {/* Featured Badge */}
            {property.featured && (
              <Badge className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                Featured
              </Badge>
            )}

            {/* Price Change Indicator */}
            {property.priceChange && (
              <div
                className={`absolute bottom-4 left-4 px-2 py-1 rounded-full text-xs font-medium ${
                  property.priceChange.type === "decrease" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {property.priceChange.type === "decrease" ? "↓" : "↑"} {property.priceChange.amount} (
                {property.priceChange.percentage})
              </div>
            )}

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                onClick={onShare}
                variant="ghost"
                size="sm"
                className="bg-black/20 text-white hover:bg-black/40 backdrop-blur-sm"
              >
                <Share2 className="w-4 h-4" />
              </Button>
              <Button
                onClick={onRemove}
                variant="ghost"
                size="sm"
                className="bg-black/20 text-white hover:bg-red-500 backdrop-blur-sm"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                {property.title}
              </h3>
              <Heart className="w-5 h-5 text-red-500 fill-current flex-shrink-0" />
            </div>

            <p className="text-2xl font-bold text-amber-600 mb-3">{property.price}</p>

            <div className="flex items-center gap-4 text-slate-600 mb-4">
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                <span>{property.beds}</span>
              </div>
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                <span>{property.baths}</span>
              </div>
              <div className="flex items-center gap-1">
                <Square className="w-4 h-4" />
                <span>{property.sqft}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-500 mb-4">
              <MapPin className="w-4 h-4" />
              <span>{property.location}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
              <Calendar className="w-3 h-3" />
              <span>Added {formatDate(property.addedDate)}</span>
            </div>

            <div className="flex gap-2">
              <Link href={`/property/${property.id}`} className="flex-1">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300 transform hover:scale-105">
                  View Details
                </Button>
              </Link>
              <Button
                onClick={onRemove}
                variant="outline"
                size="sm"
                className="px-3 hover:bg-red-50 hover:border-red-200 hover:text-red-600 bg-transparent"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  function WishlistCardSkeleton() {
    return (
      <Card className="overflow-hidden">
        <div className="w-full h-64 bg-slate-200 animate-pulse" />
        <CardContent className="p-6">
          <div className="h-6 bg-slate-200 rounded mb-2 animate-pulse" />
          <div className="h-8 bg-slate-200 rounded w-1/2 mb-3 animate-pulse" />
          <div className="flex gap-4 mb-4">
            <div className="h-4 bg-slate-200 rounded w-12 animate-pulse" />
            <div className="h-4 bg-slate-200 rounded w-12 animate-pulse" />
            <div className="h-4 bg-slate-200 rounded w-16 animate-pulse" />
          </div>
          <div className="h-4 bg-slate-200 rounded w-2/3 mb-4 animate-pulse" />
          <div className="h-4 bg-slate-200 rounded w-1/2 mb-4 animate-pulse" />
          <div className="flex gap-2">
            <div className="h-10 bg-slate-200 rounded flex-1 animate-pulse" />
            <div className="h-10 w-10 bg-slate-200 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    )
  }
}
