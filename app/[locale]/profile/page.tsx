"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Eye,
  Search,
  Edit,
  Save,
  X,
  User,
  Trash2,
  Share2,
  Heart,
  Square,
  Bath,
  Bed,
  Users,
  Gift,
  Copy,
  DollarSign,
  TrendingUp,
  UserPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import type { AdvancedSearchRequest, Property, WishlistItem } from "@/lib/interfaces"
import { useWishlist } from "@/hooks/user-wishlist"
import { useToast } from "@/hooks/use-toast"
import { useCompanyDetails } from "@/hooks/use-company-details"
import Image from "next/image"
import { useTranslations } from "next-intl"

interface Inquiry {
  id: number
  name: string
  email: string
  mobile: string | null
  message: string
  property: string | null
  status: string
  source: string
  appointmentDate: string | null
  createdAt: string
  updatedAt: string
}

interface SiteVisit {
  id: number
  name: string
  email: string
  mobile: string | null
  message: string
  property: string | null
  status: string
  source: string
  appointmentDate: string | null
  createdAt: string
  updatedAt: string
}

interface ReferralData {
  id: number
  referredEmail: string
  referredName: string
  status:"completed"
  referralAmount: number
  createdAt: string
  completedAt?: string
}

interface ApiResponse<T> {
  totalRecords: number
  data: T[]
  totalPages: number
  currentPage: number
}

interface ReferralStats {
  totalReferrals: number
  completedReferrals: number
  pendingReferrals: number
  totalEarnings: number
  pendingEarnings: number
  paidEarnings: number
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState("inquiries")
  const [searchQuery, setSearchQuery] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    mobile: session?.user?.mobile || "",
    avatar: session?.user?.image || "",
  })

  // Pagination states
  const [inquiriesPage, setInquiriesPage] = useState(1)
  const [siteVisitsPage, setSiteVisitsPage] = useState(1)
  const [wishlistPage, setWishlistPage] = useState(1)
  const [referralsPage, setReferralsPage] = useState(1)

  const [inquiriesData, setInquiriesData] = useState<ApiResponse<Inquiry> | null>(null)
  const [siteVisitsData, setSiteVisitsData] = useState<ApiResponse<SiteVisit> | null>(null)
  const [wishlistData, setWishlistData] = useState<ApiResponse<WishlistItem> | null>(null)
  const [referralsData, setReferralsData] = useState<ApiResponse<ReferralData> | null>(null)
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null)

  const [isLoadingInquiries, setIsLoadingInquiries] = useState(false)
  const [isLoadingSiteVisits, setIsLoadingSiteVisits] = useState(false)
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false)
  const [isLoadingReferrals, setIsLoadingReferrals] = useState(false)

  const { removeFromWishlist } = useWishlist()
  const { toast } = useToast()
  const { company:companyDetails } = useCompanyDetails()

  // Debounced search state
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")

  // Generate referral link
  const referralLink = `${typeof window !== "undefined" ? window.location.origin : ""}/auth/login?ref=${session?.user?.email}`

  // Fetch inquiries data
  const fetchInquiries = async (page = 1, search?: string) => {
    setIsLoadingInquiries(true)
    try {
      const requestBody: AdvancedSearchRequest = {
        criteriaList: [
          {
            key: "appointmentDate",
            operation: "isEmpty",
            value: null,
          },
        ],
        operations: [],
      }

      if (search) {
        requestBody.criteriaList.push({
          key: "property",
          operation: "contains",
          value: search,
        })
        requestBody.operations.push("AND")
      }

      const response = await fetch(`/api/user/inquiries?page=${page}&size=10`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch inquiries")
      }

      const data = await response.json()
      setInquiriesData(data)
    } catch (error) {
      console.error("Error fetching inquiries:", error)
    } finally {
      setIsLoadingInquiries(false)
    }
  }

  // Fetch site visits data
  const fetchSiteVisits = async (page = 1, search?: string) => {
    setIsLoadingSiteVisits(true)
    try {
      const requestBody: AdvancedSearchRequest = {
        criteriaList: [
          {
            key: "appointmentDate",
            operation: "isNotEmpty",
          },
        ],
        operations: [],
      }

      if (search) {
        requestBody.criteriaList.push({
          key: "property",
          operation: "contains",
          value: search,
        })
        requestBody.operations.push("AND")
      }

      const response = await fetch(`/api/site-visits?page=${page}&size=10`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch site visits")
      }

      const data = await response.json()
      setSiteVisitsData(data)
    } catch (error) {
      console.error("Error fetching site visits:", error)
    } finally {
      setIsLoadingSiteVisits(false)
    }
  }

  // Fetch wishlist data
  const fetchWishlist = async (page = 1, search?: string) => {
    setIsLoadingWishlist(true)
    try {
      const requestBody: AdvancedSearchRequest = {
        criteriaList: [
          {
            key: "customer.email",
            operation: "equals",
            value: session?.user?.email,
          },
        ],
        operations: [],
      }

      if (search) {
        requestBody.criteriaList.push({
          key: "property.title",
          operation: "contains",
          value: search,
        })
        requestBody.operations.push("AND")
      }

      const response = await fetch(`/api/wishlistSearch?page=${page}&size=10`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch wishlist")
      }

      const data = await response.json()
      setWishlistData(data)
    } catch (error) {
      console.error("Error fetching wishlist:", error)
    } finally {
      setIsLoadingWishlist(false)
    }
  }

  // Fetch referrals data
  const fetchReferrals = async (page = 1, search?: string) => {
    setIsLoadingReferrals(true)
    try {
      const requestBody: AdvancedSearchRequest = {
        criteriaList: [
          {
            key: "email",
            operation: "equals",
            value: session?.user?.email,
          },
        ],
        operations: [],
      }

      if (search) {
        requestBody.criteriaList.push({
          key: "referredName",
          operation: "contains",
          value: search,
        })
        requestBody.operations.push("AND")
      }

      const response = await fetch(`/api/referrals?page=${page}&size=10`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch referrals")
      }

      const data = await response.json()
      setReferralsData(data)
    } catch (error) {
      console.error("Error fetching referrals:", error)
    } finally {
      setIsLoadingReferrals(false)
    }
  }

  // Fetch referral stats
  const fetchReferralStats = async () => {
    try {
      const response = await fetch(`/api/user/referrals/stats?email=${session?.user?.email}`)
      if (!response.ok) {
        throw new Error("Failed to fetch referral stats")
      }
      const data = await response.json()
      setReferralStats(data)
    } catch (error) {
      console.error("Error fetching referral stats:", error)
    }
  }

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 500) // 500ms delay

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Handle search with debouncing
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  // useEffect to fetch data when component mounts or search changes
  useEffect(() => {
    if (status === "loading") return
    if (activeTab === "inquiries") {
      fetchInquiries(inquiriesPage, debouncedSearchQuery)
    } else if (activeTab === "site-visits") {
      fetchSiteVisits(siteVisitsPage, debouncedSearchQuery)
    } else if (activeTab === "wishlist") {
      fetchWishlist(wishlistPage, debouncedSearchQuery)
    } else if (activeTab === "referrals") {
      fetchReferrals(referralsPage, debouncedSearchQuery)
      fetchReferralStats()
    }
  }, [activeTab, inquiriesPage, siteVisitsPage, wishlistPage, referralsPage, debouncedSearchQuery])

  // Redirect if not authenticated
  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (status === "unauthenticated") {
    redirect("/auth/login")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
      case "scheduled":
        return "bg-yellow-100 text-yellow-800"
      case "responded":
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
      case "paid":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatPrice = (price: number) => {
    // console.log("price : ",companyDetails?.referralAmount, companyDetails?.googleMapsUrl);
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatArea = (area: number) => {
    return new Intl.NumberFormat("en-US").format(area)
  }

  // Handle page changes
  const handleInquiriesPageChange = useCallback((page: number) => {
    setInquiriesPage(page)
  }, [])

  const handleSiteVisitsPageChange = useCallback((page: number) => {
    setSiteVisitsPage(page)
  }, [])

  const handleWishlistPageChange = useCallback((page: number) => {
    setWishlistPage(page)
  }, [])

  const handleReferralsPageChange = useCallback((page: number) => {
    setReferralsPage(page)
  }, [])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          mobile: formData.mobile,
          avatar: formData.avatar,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update profile")
      }

      const result = await response.json()
      console.log("Profile updated successfully:", result)

      setIsEditing(false)
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      mobile: session?.user?.mobile || "",
      avatar: session?.user?.image || "",
    })
    setIsEditing(false)
  }

  // Handle wishlist removal
  const handleRemoveFromWishlist = async (propertyId: number, propertyTitle: string) => {
    const success = await removeFromWishlist(propertyId, propertyTitle)
    if (success) {
      // Refresh wishlist data
      fetchWishlist(wishlistPage, debouncedSearchQuery)
    }
  }

  // Share property
  const shareProperty = (property: Property) => {
    const propertyUrl = `${window.location.origin}/properties/${property.slug}`

    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this amazing property: ${property.title}`,
        url: propertyUrl,
      })
    } else {
      navigator.clipboard.writeText(propertyUrl)
      toast({
        title: "Link Copied!",
        description: "Property link copied to clipboard.",
      })
    }
  }

  // Copy referral link
  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
    toast({
      title: "Referral Link Copied!",
      description: "Share this link with friends to earn referral rewards.",
    })
  }

  // Share referral link
  const shareReferralLink = () => {
    if (navigator.share) {
      navigator.share({
        title: "Join our platform and get amazing deals!",
        text: `I'm inviting you to join our real estate platform. Use my referral link to get started!`,
        url: referralLink,
      })
    } else {
      copyReferralLink()
    }
  }

  // Reset page on tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setSearchQuery("") // Clear search query

    // Reset pagination to page 1
    setInquiriesPage(1)
    setSiteVisitsPage(1)
    setWishlistPage(1)
    setReferralsPage(1)
  }

  useEffect(() => {
    // Reset to page 1 when searching
    if (activeTab === "inquiries") {
      setInquiriesPage(1)
    } else if (activeTab === "site-visits") {
      setSiteVisitsPage(1)
    } else if (activeTab === "wishlist") {
      setWishlistPage(1)
    } else if (activeTab === "referrals") {
      setReferralsPage(1)
    }
  }, [activeTab, handleSearch])

    const  t  = useTranslations("Profile");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 pb-16 md:pb-0">
      <Header />

      {/* Back Button */}
      <div className="pt-20 md:pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/">
            <Button variant="outline" className="mb-6 bg-transparent dark:border-gray-600 dark:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('backToHome')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Profile Header */}
      <section className="px-4 mb-8">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0 dark:from-blue-800 dark:to-blue-900">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24 border-4 border-white/20 dark:border-gray-700">
                      <AvatarImage src={formData.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-2xl bg-white/20 text-white dark:text-gray-200">
                        {formData.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-between mb-2">
                      <h1 className="text-3xl font-bold dark:text-white">{formData.name || t('user')}</h1>
                      {!isEditing && (
                        <Button
                          onClick={() => setIsEditing(true)}
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20 dark:text-gray-200 dark:hover:bg-gray-700"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          {t('editProfile')}
                        </Button>
                      )}
                    </div>
                    <p className="text-blue-100 text-lg mb-4 dark:text-blue-200">{formData.email}</p>

                    <div className="flex flex-col md:flex-row gap-4 text-sm dark:text-gray-300">
                      {formData.mobile && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{formData.mobile}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{formData.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Edit Profile Form */}
            {isEditing && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Card className="mt-6 dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 dark:text-white">
                      <Edit className="w-5 h-5" />
                      {t('editProfileInfo')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                          <User className="w-4 h-4 inline mr-2" />
                          {t('fullName')}
                        </label>
                        <Input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder={t('fullName')}
                          className="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                          <Mail className="w-4 h-4 inline mr-2" />
                          {t('emailAddress')}
                        </label>
                        <Input
                          type="email"
                          value={formData.email}
                          disabled
                          className="w-full dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                        />
                        <p className="text-xs text-slate-500 mt-1 dark:text-gray-400">{t('emailNote')}</p>
                      </div>

                      {/* Mobile */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                          <Phone className="w-4 h-4 inline mr-2" />
                          {t('mobileNumber')}
                        </label>
                        <Input
                          type="tel"
                          value={formData.mobile}
                          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                          placeholder={t('mobileNumber')}
                          className="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        />
                      </div>

                      {/* Avatar URL */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                          {t('profilePicture')}
                        </label>
                        <Input
                          type="url"
                          value={formData.avatar}
                          onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                          placeholder={t('profilePicture')}
                          className="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button onClick={handleSave} disabled={isLoading} className="flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        {isLoading ? t('saving') : t('saveChanges')}
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="flex items-center gap-2 bg-transparent dark:text-gray-200 dark:border-gray-600"
                      >
                        <X className="w-4 h-4" />
                        {t('cancel')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Tabs Section */}
<section className="px-4">
  <div className="max-w-4xl mx-auto">
    <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
      <TabsList className="grid grid-cols-4">
        <TabsTrigger value="inquiries">{t('tabInquiries')}</TabsTrigger>
        <TabsTrigger value="siteVisits">{t('tabSiteVisits')}</TabsTrigger>
        <TabsTrigger value="wishlist">{t('tabWishlist')}</TabsTrigger>
        <TabsTrigger value="referrals">{t('tabReferrals')}</TabsTrigger>
      </TabsList>

      {/* Inquiries Tab */}
      <TabsContent value="inquiries">
        <div className="flex justify-between mb-4">
          <Input
            placeholder={t('searchInquiries')}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full md:w-1/3"
          />
        </div>

        {inquiriesData?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-slate-200 dark:border-gray-700">
              <thead className="bg-slate-100 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2">{t('inquiryId')}</th>
                  <th className="px-4 py-2">{t('clientName')}</th>
                  <th className="px-4 py-2">{t('status')}</th>
                  <th className="px-4 py-2">{t('date')}</th>
                  <th className="px-4 py-2">{t('amount')}</th>
                </tr>
              </thead>
              <tbody>
                {inquiriesData.map((inq) => (
                  <tr key={inq.id} className="odd:bg-white even:bg-slate-50 dark:odd:bg-gray-800 dark:even:bg-gray-700">
                    <td className="px-4 py-2">{inq.id}</td>
                    <td className="px-4 py-2">{inq.clientName}</td>
                    <td className="px-4 py-2">
                      <Badge className={`px-2 py-1 rounded ${getStatusColor(inq.status)}`}>
                        {t(`status.${inq.status.toLowerCase()}`)}
                      </Badge>
                    </td>
                    <td className="px-4 py-2">{formatDate(inq.date)}</td>
                    <td className="px-4 py-2">{formatPrice(inq.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center py-10 dark:text-gray-300">{t('noInquiries')}</p>
        )}
      </TabsContent>

      {/* Site Visits Tab */}
      <TabsContent value="siteVisits">
        {siteVisitsData?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-slate-200 dark:border-gray-700">
              <thead className="bg-slate-100 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2">{t('visitId')}</th>
                  <th className="px-4 py-2">{t('propertyName')}</th>
                  <th className="px-4 py-2">{t('visitDate')}</th>
                  <th className="px-4 py-2">{t('visitor')}</th>
                  <th className="px-4 py-2">{t('status')}</th>
                </tr>
              </thead>
              <tbody>
                {siteVisitsData.map((visit) => (
                  <tr key={visit.id} className="odd:bg-white even:bg-slate-50 dark:odd:bg-gray-800 dark:even:bg-gray-700">
                    <td className="px-4 py-2">{visit.id}</td>
                    <td className="px-4 py-2">{visit.propertyName}</td>
                    <td className="px-4 py-2">{formatDate(visit.date)}</td>
                    <td className="px-4 py-2">{visit.visitorName}</td>
                    <td className="px-4 py-2">
                      <Badge className={`px-2 py-1 rounded ${getStatusColor(visit.status)}`}>
                        {t(`status.${visit.status.toLowerCase()}`)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center py-10 dark:text-gray-300">{t('noSiteVisits')}</p>
        )}
      </TabsContent>

      {/* Wishlist Tab */}
      <TabsContent value="wishlist">
        {wishlistData?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-slate-200 dark:border-gray-700">
              <thead className="bg-slate-100 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2">{t('propertyId')}</th>
                  <th className="px-4 py-2">{t('propertyName')}</th>
                  <th className="px-4 py-2">{t('addedOn')}</th>
                  <th className="px-4 py-2">{t('price')}</th>
                </tr>
              </thead>
              <tbody>
                {wishlistData.map((wish) => (
                  <tr key={wish.id} className="odd:bg-white even:bg-slate-50 dark:odd:bg-gray-800 dark:even:bg-gray-700">
                    <td className="px-4 py-2">{wish.id}</td>
                    <td className="px-4 py-2">{wish.propertyName}</td>
                    <td className="px-4 py-2">{formatDate(wish.addedOn)}</td>
                    <td className="px-4 py-2">{formatPrice(wish.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center py-10 dark:text-gray-300">{t('noWishlistItems')}</p>
        )}
      </TabsContent>

      {/* Referrals Tab */}
      <TabsContent value="referrals">
        <div className="mb-4 flex flex-col md:flex-row gap-2 items-start md:items-center justify-between">
          <Input
            readOnly
            value={referralLink}
            className="flex-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
          <div className="flex gap-2 mt-2 md:mt-0">
            <Button onClick={copyReferralLink} className="flex items-center gap-2">
              <Copy className="w-4 h-4" /> {t('copy')}
            </Button>
            {navigator.share && (
              <Button onClick={shareReferralLink} className="flex items-center gap-2">
                <Share2 className="w-4 h-4" /> {t('share')}
              </Button>
            )}
          </div>
        </div>

        {referralsData?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-slate-200 dark:border-gray-700">
              <thead className="bg-slate-100 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2">{t('referralId')}</th>
                  <th className="px-4 py-2">{t('name')}</th>
                  <th className="px-4 py-2">{t('email')}</th>
                  <th className="px-4 py-2">{t('mobile')}</th>
                  <th className="px-4 py-2">{t('joinedOn')}</th>
                  <th className="px-4 py-2">{t('status')}</th>
                </tr>
              </thead>
              <tbody>
                {referralsData.map((ref) => (
                  <tr key={ref.id} className="odd:bg-white even:bg-slate-50 dark:odd:bg-gray-800 dark:even:bg-gray-700">
                    <td className="px-4 py-2">{ref.id}</td>
                    <td className="px-4 py-2">{ref.name}</td>
                    <td className="px-4 py-2">{ref.email}</td>
                    <td className="px-4 py-2">{ref.mobile}</td>
                    <td className="px-4 py-2">{formatDate(ref.joinedOn)}</td>
                    <td className="px-4 py-2">
                      <Badge className={`px-2 py-1 rounded ${getStatusColor(ref.status)}`}>
                        {t(`status.${ref.status.toLowerCase()}`)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Referral Stats */}
            {referralStats && (
              <div className="mt-4 flex flex-wrap gap-4">
                <div className="bg-slate-100 dark:bg-gray-800 p-4 rounded">
                  <p>{t('totalReferrals')}: {referralStats.total}</p>
                </div>
                <div className="bg-slate-100 dark:bg-gray-800 p-4 rounded">
                  <p>{t('successfulReferrals')}: {referralStats.successful}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center py-10 dark:text-gray-300">{t('noReferrals')}</p>
        )}
      </TabsContent>
    </Tabs>
  </div>
</section>

      <Footer />
    </div>


  )

  function WishlistCard({
    property,
    onRemove,
    onShare,
  }: {
    property: Property
    onRemove: () => void
    onShare: () => void
  }) {
    return (
      <Card className="overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="relative overflow-hidden">
          <Image
            src={`/images/${property.thumbnailImage}` || "/placeholder.svg"}
            alt={property.title}
            width={400}
            height={192}
            className="w-full h-48 object-cover"
          />

          {/* Status Badge */}
          <Badge
            className={`absolute top-3 left-3 ${property.sold ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
          >
            {property.sold ? "Sold" : "Available"}
          </Badge>

          {/* Featured Badge */}
          {property.featured && (
            <Badge className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              Featured
            </Badge>
          )}

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
        </div>

        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{property.title}</h3>
            <Heart className="w-5 h-5 text-red-500 fill-current flex-shrink-0" />
          </div>

          <p className="text-xl font-bold text-amber-600 mb-3">{formatPrice(property.price)}</p>

          <div className="flex items-center gap-3 text-slate-600 mb-3">
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span className="text-sm">{property.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              <span className="text-sm">{property.bathrooms || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Square className="w-4 h-4" />
              <span className="text-sm">{property.areaSqft} sqft</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-500 mb-3">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{property.location}</span>
          </div>

          <div className="flex gap-2">
            <Link href={`/properties/${property.slug}`} className="flex-1">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm">
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
    )
  }
}
