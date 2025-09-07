"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
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
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import type {
  AdvancedSearchRequest,
  Property,
  WishlistItem,
} from "@/lib/interfaces";
import { useWishlist } from "@/hooks/user-wishlist";
import { useToast } from "@/hooks/use-toast";
import { useCompanyDetails } from "@/hooks/use-company-details";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface Inquiry {
  id: number;
  name: string;
  email: string;
  mobile: string | null;
  message: string;
  property: string | null;
  status: string;
  source: string;
  appointmentDate: string | null;
  createdAt: string;
  updatedAt: string;
}

interface SiteVisit {
  id: number;
  name: string;
  email: string;
  mobile: string | null;
  message: string;
  property: string | null;
  status: string;
  source: string;
  appointmentDate: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ReferralData {
  id: number;
  referredEmail: string;
  referredName: string;
  status: "completed";
  referralAmount: number;
  createdAt: string;
  completedAt?: string;
}

interface ApiResponse<T> {
  totalRecords: number;
  data: T[];
  totalPages: number;
  currentPage: number;
}

interface ReferralStats {
  totalReferrals: number;
  completedReferrals: number;
  pendingReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("inquiries");
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    mobile: session?.user?.mobile || "",
    avatar: session?.user?.image || "",
  });

  // Pagination states
  const [inquiriesPage, setInquiriesPage] = useState(1);
  const [siteVisitsPage, setSiteVisitsPage] = useState(1);
  const [wishlistPage, setWishlistPage] = useState(1);
  const [referralsPage, setReferralsPage] = useState(1);

  const [inquiriesData, setInquiriesData] =
    useState<ApiResponse<Inquiry> | null>(null);
  const [siteVisitsData, setSiteVisitsData] =
    useState<ApiResponse<SiteVisit> | null>(null);
  const [wishlistData, setWishlistData] =
    useState<ApiResponse<WishlistItem> | null>(null);
  const [referralsData, setReferralsData] =
    useState<ApiResponse<ReferralData> | null>(null);
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(
    null
  );

  const [isLoadingInquiries, setIsLoadingInquiries] = useState(false);
  const [isLoadingSiteVisits, setIsLoadingSiteVisits] = useState(false);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);
  const [isLoadingReferrals, setIsLoadingReferrals] = useState(false);

  const { removeFromWishlist } = useWishlist();
  const { toast } = useToast();
  const { company: companyDetails } = useCompanyDetails();

  // Debounced search state
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Generate referral link
  const referralLink = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/auth/login?ref=${session?.user?.referralCode}`;

  // Fetch inquiries data
  const fetchInquiries = async (page = 1, search?: string) => {
    setIsLoadingInquiries(true);
    try {
      const requestBody: AdvancedSearchRequest = {
        criteriaList: [
          {
            key: "appointmentDate",
            operation: "isEmpty",
            value: null,
          }
        ],
        operations: [],
      };

      if(session?.user.email){
        requestBody.criteriaList.push(
          {
            key: "email",
            operation: "equals",
            value: session?.user?.email,
          }
        );
        requestBody.operations.push("AND");
      }
      if(session?.user.mobile){
        requestBody.criteriaList.push({
            key: "mobile",
            operation: "equals",
            value: session?.user?.mobile,
          });

        if(session.user.email)
          requestBody.operations.push("OR");
        else
          requestBody.operations.push("AND");
      }

      if (search) {
        requestBody.criteriaList.push({
          key: "property",
          operation: "contains",
          value: search,
        });
        requestBody.operations.push("AND");
      }

      const response = await fetch(`/api/user/inquiries?page=${page}&size=10`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch inquiries");
      }

      const data = await response.json();
      setInquiriesData(data);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    } finally {
      setIsLoadingInquiries(false);
    }
  };

  // Fetch site visits data
  const fetchSiteVisits = async (page = 1, search?: string) => {
    setIsLoadingSiteVisits(true);
    try {
      const requestBody: AdvancedSearchRequest = {
        criteriaList: [
          {
            key: "appointmentDate",
            operation: "isNotEmpty",
          }
        ],
        operations: [],
      };

      if(session?.user.email){
        requestBody.criteriaList.push(
          {
            key: "email",
            operation: "equals",
            value: session?.user?.email,
          }
        );
        requestBody.operations.push("AND")
      }
      if(session?.user.mobile){
        requestBody.criteriaList.push({
            key: "mobile",
            operation: "equals",
            value: session?.user?.mobile,
          });
        if(session.user.email)
          requestBody.operations.push("OR");
        else
          requestBody.operations.push("AND");
      }
      if (search) {
        requestBody.criteriaList.push({
          key: "property",
          operation: "contains",
          value: search,
        });
        requestBody.operations.push("AND");
      }

      const response = await fetch(`/api/site-visits?page=${page}&size=10`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch site visits");
      }

      const data = await response.json();
      setSiteVisitsData(data);
    } catch (error) {
      console.error("Error fetching site visits:", error);
    } finally {
      setIsLoadingSiteVisits(false);
    }
  };

  // Fetch wishlist data
  const fetchWishlist = async (page = 1, search?: string) => {
    setIsLoadingWishlist(true);
    try {
      const requestBody: AdvancedSearchRequest = {
        criteriaList: [
          
        ],
        operations: [],
      };

      if(session?.user.email){
        requestBody.criteriaList.push(
          {
            key: "customer.email",
            operation: "equals",
            value: session?.user?.email,
          }
        );

      }
      if(session?.user.mobile){
        requestBody.criteriaList.push({
            key: "customer.mobile",
            operation: "equals",
            value: session?.user?.mobile,
          });
          if(session.user.email)
          requestBody.operations.push("OR");
      }

      if (search) {
        requestBody.criteriaList.push({
          key: "property.title",
          operation: "contains",
          value: search,
        });
        requestBody.operations.push("AND");
      }

      const response = await fetch(`/api/wishlistSearch?page=${page}&size=10`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch wishlist");
      }

      const data = await response.json();
      setWishlistData(data);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setIsLoadingWishlist(false);
    }
  };

  // Fetch referrals data
  const fetchReferrals = async (page = 1, search?: string) => {
    setIsLoadingReferrals(true);
    try {
      const requestBody: AdvancedSearchRequest = {
        criteriaList: [
          
        ],
        operations: [],
      };
      if(session?.user.email){
        requestBody.criteriaList.push(
          {
            key: "email",
            operation: "equals",
            value: session?.user?.email,
          }
        );

      }
      if(session?.user.mobile){
        requestBody.criteriaList.push({
            key: "mobile",
            operation: "equals",
            value: session?.user?.mobile,
          });
          if(session.user.email)
          requestBody.operations.push("OR");
      }
      if (search) {
        requestBody.criteriaList.push({
          key: "referredName",
          operation: "contains",
          value: search,
        });
        requestBody.operations.push("AND");
      }

      const response = await fetch(`/api/referrals?page=${page}&size=10`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch referrals");
      }

      const data = await response.json();
      setReferralsData(data);
    } catch (error) {
      console.error("Error fetching referrals:", error);
    } finally {
      setIsLoadingReferrals(false);
    }
  };

  // Fetch referral stats
  const fetchReferralStats = async () => {
    try {
      const response = await fetch(
        `/api/user/referrals/stats?email=${session?.user?.email}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch referral stats");
      }
      const data = await response.json();
      setReferralStats(data);
    } catch (error) {
      console.error("Error fetching referral stats:", error);
    }
  };

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle search with debouncing
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
      case "scheduled":
        return "bg-yellow-100 text-yellow-800";
      case "responded":
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
      case "paid":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatPrice = (price: number) => {
    // console.log("price : ",companyDetails?.referralAmount, companyDetails?.googleMapsUrl);
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatArea = (area: number) => {
    return new Intl.NumberFormat("en-US").format(area);
  };

  // Handle page changes
  const handleInquiriesPageChange = (page: number) => {
    setInquiriesPage(page);
  };

  const handleSiteVisitsPageChange = (page: number) => {
    setSiteVisitsPage(page);
  };

  const handleWishlistPageChange = (page: number) => {
    setWishlistPage(page);
  };

  const handleReferralsPageChange = (page: number) => {
    setReferralsPage(page);
  };

  const handleSave = async () => {
    setIsLoading(true);
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
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      const result = await response.json();
      console.log("Profile updated successfully:", result);

      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      mobile: session?.user?.mobile || "",
      avatar: session?.user?.image || "",
    });
    setIsEditing(false);
  };

  // Handle wishlist removal
  const handleRemoveFromWishlist = async (
    propertyId: number,
    propertyTitle: string
  ) => {
    const success = await removeFromWishlist(propertyId, propertyTitle);
    if (success) {
      // Refresh wishlist data
      fetchWishlist(wishlistPage, debouncedSearchQuery);
    }
  };

  // Share property
  const shareProperty = (property: Property) => {
    const propertyUrl = `${window.location.origin}/properties/${property.slug}`;

    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this amazing property: ${property.title}`,
        url: propertyUrl,
      });
    } else {
      navigator.clipboard.writeText(propertyUrl);
      toast({
        title: "Link Copied!",
        description: "Property link copied to clipboard.",
      });
    }
  };

  // Copy referral link
  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Referral Link Copied!",
      description: "Share this link with friends to earn referral rewards.",
    });
  };

  // Share referral link
  const shareReferralLink = () => {
    if (navigator.share) {
      navigator.share({
        title: "Join our platform and get amazing deals!",
        text: `I'm inviting you to join our real estate platform. Use my referral link to get started!`,
        url: referralLink,
      });
    } else {
      copyReferralLink();
    }
  };

  // Reset page on tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchQuery(""); // Clear search query

    // Reset pagination to page 1
    setInquiriesPage(1);
    setSiteVisitsPage(1);
    setWishlistPage(1);
    setReferralsPage(1);
  };

  useEffect(() => {
    // Reset to page 1 when searching
    console.log("activeTab : ",activeTab);
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

  // useEffect to fetch data when component mounts or search changes
  useEffect(() => {
    console.log("activeTab : ",activeTab,"status : ",status);
    if (status === "loading") return;
    if (activeTab === "inquiries") {
      fetchInquiries(inquiriesPage, debouncedSearchQuery);
    } else if (activeTab === "site-visits") {
      fetchSiteVisits(siteVisitsPage, debouncedSearchQuery);
    } else if (activeTab === "wishlist") {
      fetchWishlist(wishlistPage, debouncedSearchQuery);
    } else if (activeTab === "referrals") {
      fetchReferrals(referralsPage, debouncedSearchQuery);
      fetchReferralStats();
    }
  }, [
    activeTab,
    inquiriesPage,
    siteVisitsPage,
    wishlistPage,
    referralsPage,
    debouncedSearchQuery,
    status
  ]);

  const handleGoogleLogin = () => {
    if (session) {
      signOut({ callbackUrl: "/" });
    } else {
      signIn("google", { callbackUrl: "/" });
    }
  };
  const t = useTranslations("Profile");

  // Redirect if not authenticated
  if (status === "loading") {
    return <div className="flex items-center justify-center h-screen"><Loader2 /></div>;
  }

  if (status === "unauthenticated") {
    redirect("/auth/login");
  }
  return (
    <div className="min-h-screen bg-gradient-to-br mt-4 from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 pb-16 md:pb-0">
      {/* <Header /> */}

      {/* Back Button */}
      <div className="pt-20 md:pt-24 px-4">
        <div className="max-w-4xl mx-auto flex justify-between">
          <Link href="/">
            <Button
              variant="outline"
              className="mb-6 bg-transparent dark:border-gray-600 dark:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("backToHome")}
            </Button>
          </Link>
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 border-red-300 hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/40"
          >
            <span className="text-sm font-medium text-red-600 dark:text-red-400">
              {"SignOut"}
            </span>
          </Button>
        </div>
      </div>

      {/* Profile Header */}
      <section className="px-4 mb-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0 dark:from-blue-800 dark:to-blue-900">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="relative">
                    {session?.user?.image ? (
                      <Avatar className="w-24 h-24 border-4 border-white/20 dark:border-gray-700">
                        <AvatarImage
                          src={session.user.image || "/placeholder.svg"}
                        />
                        <AvatarFallback className="text-2xl bg-white/20 text-white dark:text-gray-200">
                          {session.user.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar className="w-24 h-24 border-4 border-white/20 bg-white/20 dark:bg-gray-800 dark:border-gray-700">
                        <AvatarFallback className="text-2xl text-white dark:text-gray-200">
                          {session?.user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-between mb-2">
                      <h1 className="text-3xl font-bold dark:text-white">
                        {session?.user?.name || "User"}
                      </h1>
                      {!isEditing && (
                        null
                        // <Button
                        //   onClick={() => setIsEditing(true)}
                        //   variant="ghost"
                        //   size="sm"
                        //   className="text-white hover:bg-white/20 dark:text-gray-200 dark:hover:bg-gray-700"
                        // >
                        //   <Edit className="w-4 h-4 mr-2" />
                        //   {t("editProfile")}
                        // </Button>
                      )}
                    </div>
                    <p className="text-blue-100 text-lg mb-4 dark:text-blue-200">
                      {session?.user?.email}
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 text-sm dark:text-gray-300">
                      {session?.user?.mobile && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{session.user.mobile}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{session?.user?.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Edit Profile Form */}
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="mt-6 dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 dark:text-white">
                      <Edit className="w-5 h-5" />
                      {t("editProfileInfo")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                          <User className="w-4 h-4 inline mr-2" />
                          {t("fullName")}
                        </label>
                        <Input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="Enter your full name"
                          className="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                          <Mail className="w-4 h-4 inline mr-2" />
                          {t("emailAddress")}
                        </label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="Enter your email"
                          className="w-full dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                          disabled
                        />
                        <p className="text-xs text-slate-500 mt-1 dark:text-gray-400">
                          Email cannot be changed
                        </p>
                      </div>

                      {/* Mobile */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                          <Phone className="w-4 h-4 inline mr-2" />
                          {t("mobileNumber")}
                        </label>
                        <Input
                          type="tel"
                          value={formData.mobile}
                          onChange={(e) =>
                            setFormData({ ...formData, mobile: e.target.value })
                          }
                          placeholder="Enter your mobile number"
                          className="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
                          disabled
                        />
                      </div>

                      {/* Avatar URL */}
                      {/* s */}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        {isLoading ? t("saving") : t("saveChanges")}
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="flex items-center gap-2 bg-transparent dark:text-gray-200 dark:border-gray-600"
                      >
                        <X className="w-4 h-4" />
                        {t("cancel")}
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
      <section className="px-4 mb-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <CardTitle className="text-2xl dark:text-white">
                    {t("myActivity")}
                  </CardTitle>

                  {/* Search */}
                  <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder={
                        activeTab === "referrals"
                          ? "Search referrals..."
                          : "Search properties..."
                      }
                      value={searchQuery}
                      onChange={(e) => {
                        handleSearch(e.target.value);
                        setSearchQuery(e.target.value);
                      }}
                      className="pl-10 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <Tabs
                  value={activeTab}
                  onValueChange={handleTabChange}
                  className="w-full"
                >
                  <div className="w-full overflow-x-auto">
                    <div className="flex min-w-max gap-1 p-1 bg-muted rounded-lg">
                      <button
                        onClick={() => setActiveTab("inquiries")}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                          activeTab === "inquiries"
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <MessageSquare className="w-4 h-4" />
                        {t("inquiries")} ({inquiriesData?.totalRecords || 0})
                      </button>

                      <button
                        onClick={() => setActiveTab("site-visits")}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                          activeTab === "site-visits"
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <MessageSquare className="w-4 h-4" />
                        {t("siteVisits")} ({siteVisitsData?.totalRecords || 0})
                      </button>

                      <button
                        onClick={() => setActiveTab("wishlist")}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                          activeTab === "wishlist"
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Heart className="w-4 h-4" />
                        {t("wishlist")} ({wishlistData?.totalRecords || 0})
                      </button>

                      <button
                        onClick={() => setActiveTab("referrals")}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                          activeTab === "referrals"
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Users className="w-4 h-4" />
                        {t("referrals")} ({referralsData?.totalRecords || 0})
                      </button>
                    </div>
                  </div>

                  {/* Tabs Content */}
                  <TabsContent value="inquiries" className="mt-6">
                    <div className="space-y-4">
                      {isLoadingInquiries ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4 dark:border-blue-400"></div>
                          <p className="text-slate-500 dark:text-slate-400">
                            {t("loadingInquiries")}
                          </p>
                        </div>
                      ) : !inquiriesData?.data ||
                        inquiriesData.data.length === 0 ? (
                        <div className="text-center py-8">
                          <MessageSquare className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-200 mb-2">
                            {t("noInquiries")}
                          </h3>
                          <p className="text-slate-500 dark:text-slate-400">
                            {t("inquiryPrompt")}
                          </p>
                          <Link href="/properties">
                            <Button className="mt-4">
                              {t("browseProperties")}
                            </Button>
                          </Link>
                        </div>
                      ) : (
                        <>
                          {inquiriesData.data.map((inquiry) => (
                            <Card
                              key={inquiry.id}
                              className="hover:shadow-md transition-shadow bg-white dark:bg-gray-800 border dark:border-gray-700"
                            >
                              <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-4">
                                  <div className="flex-1">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-3">
                                      <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                                        {inquiry.property || "General Inquiry"}
                                      </h3>
                                      <Badge
                                        className={getStatusColor(
                                          inquiry.status
                                        )}
                                      >
                                        {inquiry.status}
                                      </Badge>
                                    </div>

                                    <p className="text-slate-600 dark:text-slate-300 text-sm mb-3 line-clamp-2">
                                      {inquiry.message}
                                    </p>

                                    <div className="flex flex-col md:flex-row md:items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                                      <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        <span>
                                          {t("inquired")}{" "}
                                          {formatDate(inquiry.createdAt)}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <span>
                                          {t("by")} {inquiry.name}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}

                          {/* Pagination */}
                          {inquiriesData.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-8">
                              <Button
                                variant="outline"
                                onClick={() =>
                                  handleInquiriesPageChange(inquiriesPage - 1)
                                }
                                disabled={inquiriesPage === 1}
                                className="flex items-center gap-2 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600"
                              >
                                ← Previous
                              </Button>

                              <Button
                                variant="outline"
                                onClick={() =>
                                  handleInquiriesPageChange(inquiriesPage + 1)
                                }
                                disabled={
                                  inquiriesPage === inquiriesData.totalPages
                                }
                                className="flex items-center gap-2 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600"
                              >
                                Next →
                              </Button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="site-visits" className="mt-6">
                    <div className="space-y-4">
                      {isLoadingSiteVisits ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4 dark:border-blue-400"></div>
                          <p className="text-slate-500 dark:text-slate-400">
                            {t("loadingSiteVisits")}
                          </p>
                        </div>
                      ) : !siteVisitsData?.data ||
                        siteVisitsData.data.length === 0 ? (
                        <div className="text-center py-8">
                          <Eye className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-200 mb-2">
                            {t("noSiteVisits")}
                          </h3>
                          <p className="text-slate-500 dark:text-slate-400">
                            {t("siteVisitPrompt")}
                          </p>
                          <Link href="/properties">
                            <Button className="mt-4">
                              {t("browseProperties")}
                            </Button>
                          </Link>
                        </div>
                      ) : (
                        <>
                          {siteVisitsData.data.map((visit) => (
                            <Card
                              key={visit.id}
                              className="hover:shadow-md transition-shadow bg-white dark:bg-gray-800 border dark:border-gray-700"
                            >
                              <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-4">
                                  <div className="flex-1">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-3">
                                      <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                                        {visit.property || "General Site Visit"}
                                      </h3>
                                      <Badge
                                        className={getStatusColor(visit.status)}
                                      >
                                        {visit.status}
                                      </Badge>
                                    </div>

                                    <p className="text-slate-600 dark:text-slate-300 text-sm mb-3 line-clamp-2">
                                      {visit.message}
                                    </p>

                                    <div className="flex flex-col md:flex-row md:items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                                      <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>
                                          {t("scheduled")}{" "}
                                          {visit.appointmentDate
                                            ? formatDate(visit.appointmentDate)
                                            : "Not scheduled"}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        <span>
                                          {t("created")}{" "}
                                          {formatDate(visit.createdAt)}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <span>
                                          {t("by")} {visit.name}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}

                          {/* Pagination */}
                          {siteVisitsData.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-8">
                              <Button
                                variant="outline"
                                onClick={() =>
                                  handleSiteVisitsPageChange(siteVisitsPage - 1)
                                }
                                disabled={siteVisitsPage === 1}
                                className="flex items-center gap-2 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600"
                              >
                                ← Previous
                              </Button>

                              <Button
                                variant="outline"
                                onClick={() =>
                                  handleSiteVisitsPageChange(siteVisitsPage + 1)
                                }
                                disabled={
                                  siteVisitsPage === siteVisitsData.totalPages
                                }
                                className="flex items-center gap-2 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600"
                              >
                                Next →
                              </Button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="wishlist" className="mt-6">
                    <div className="space-y-4">
                      {isLoadingWishlist ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4 dark:border-blue-400"></div>
                          <p className="text-slate-500 dark:text-slate-400">
                            {t("loadingWishlist")}
                          </p>
                        </div>
                      ) : !wishlistData?.data ||
                        wishlistData.data.length === 0 ? (
                        <div className="text-center py-8">
                          <Heart className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-200 mb-2">
                            {t("emptyWishlist")}
                          </h3>
                          <p className="text-slate-500 dark:text-slate-400">
                            {t("wishlistPrompt")}
                          </p>
                          <Link href="/properties">
                            <Button className="mt-4">
                              {t("browseProperties")}
                            </Button>
                          </Link>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {wishlistData.data.map((wishlist) => (
                              <WishlistCard
                                key={wishlist.property.id}
                                property={wishlist.property}
                                onRemove={() =>
                                  handleRemoveFromWishlist(
                                    wishlist.property.id,
                                    wishlist.property.title
                                  )
                                }
                                onShare={() => shareProperty(wishlist.property)}
                              />
                            ))}
                          </div>

                          {/* Pagination */}
                          {wishlistData.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-8">
                              <Button
                                variant="outline"
                                onClick={() =>
                                  handleWishlistPageChange(wishlistPage - 1)
                                }
                                disabled={wishlistPage === 1}
                                className="flex items-center gap-2 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600"
                              >
                                ← Previous
                              </Button>

                              <Button
                                variant="outline"
                                onClick={() =>
                                  handleWishlistPageChange(wishlistPage + 1)
                                }
                                disabled={
                                  wishlistPage === wishlistData.totalPages
                                }
                                className="flex items-center gap-2 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600"
                              >
                                Next →
                              </Button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="referrals" className="mt-6">
                    <div className="space-y-6">
                      {/* Referral Stats */}
                      {referralStats && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-blue-100 text-sm">
                                    {t("totalReferrals")}
                                  </p>
                                  <p className="text-2xl font-bold">
                                    {referralStats.totalReferrals}
                                  </p>
                                </div>
                                <Users className="w-8 h-8 text-blue-200" />
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-green-100 text-sm">
                                    {t("completed")}
                                  </p>
                                  <p className="text-2xl font-bold">
                                    {referralStats.completedReferrals}
                                  </p>
                                </div>
                                <UserPlus className="w-8 h-8 text-green-200" />
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-amber-100 text-sm">
                                    {t("totalEarnings")}
                                  </p>
                                  <p className="text-2xl font-bold">
                                    {formatPrice(referralStats.totalEarnings)}
                                  </p>
                                </div>
                                <DollarSign className="w-8 h-8 text-amber-200" />
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-purple-100 text-sm">
                                    {t("pendingEarnings")}
                                  </p>
                                  <p className="text-2xl font-bold">
                                    {formatPrice(referralStats.pendingEarnings)}
                                  </p>
                                </div>
                                <TrendingUp className="w-8 h-8 text-purple-200" />
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}

                      {/* Referral Link Section */}
                      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 dark:from-indigo-900 dark:to-purple-900 dark:border-indigo-700">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <Gift className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-200">
                              {t("earnPerReferral")} :{" "}
                              {formatPrice(
                                Number.parseInt(
                                  companyDetails?.referralAmount || "0"
                                ) || 0
                              )}
                            </h3>
                          </div>
                          <p className="text-indigo-700 dark:text-indigo-300 mb-4">
                            {t("referralPrompt")}
                          </p>

                          <div className="flex flex-col md:flex-row gap-3">
                            <div className="flex-1">
                              <Input
                                value={referralLink}
                                readOnly
                                className="bg-white dark:bg-slate-800 border-indigo-200 dark:border-indigo-700 text-slate-900 dark:text-slate-100"
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={copyReferralLink}
                                variant="outline"
                                className="flex items-center gap-2 border-indigo-200 dark:border-indigo-700 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-800 bg-transparent"
                              >
                                <Copy className="w-4 h-4" />
                                {t("copy")}
                              </Button>
                              <Button
                                onClick={shareReferralLink}
                                className="flex items-center gap-2 bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-800"
                              >
                                <Share2 className="w-4 h-4" />
                                {t("shareReferral")}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Referrals List */}
                      <div className="space-y-4">
                        {isLoadingReferrals ? (
                          <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
                            <p className="text-slate-500 dark:text-slate-400">
                              Loading referrals...
                            </p>
                          </div>
                        ) : !referralsData?.data ||
                          referralsData.data.length === 0 ? (
                          <div className="text-center py-8">
                            <Users className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-200 mb-2">
                              No Referrals Yet
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400">
                              Start sharing your referral link to earn rewards
                            </p>
                            <Button
                              onClick={shareReferralLink}
                              className="mt-4"
                            >
                              {t("shareReferral")}
                            </Button>
                          </div>
                        ) : (
                          <>
                            {referralsData.data.map((referral) => (
                              <Card
                                key={referral.id}
                                className="hover:shadow-md transition-shadow dark:bg-slate-800"
                              >
                                <CardContent className="p-6">
                                  <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1">
                                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-3">
                                        <div>
                                          <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                                            {referral.referredName}
                                          </h3>
                                          <p className="text-slate-600 dark:text-slate-300 text-sm">
                                            {referral.referredEmail}
                                          </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Badge
                                            className={getStatusColor(
                                              referral.status
                                            )}
                                          >
                                            {referral.status}
                                          </Badge>
                                          <span className="font-semibold text-green-600 dark:text-green-400">
                                            {formatPrice(
                                              referral.referralAmount
                                            )}
                                          </span>
                                        </div>
                                      </div>

                                      <div className="flex flex-col md:flex-row md:items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                                        <div className="flex items-center gap-1">
                                          <Clock className="w-3 h-3" />
                                          <span>
                                            {t("referred")}{" "}
                                            {formatDate(referral.createdAt)}
                                          </span>
                                        </div>
                                        {referral.completedAt && (
                                          <div className="flex items-center gap-1">
                                            <span>
                                              {t("completed")}{" "}
                                              {formatDate(referral.completedAt)}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}

                            {/* Pagination */}
                            {referralsData.totalPages > 1 && (
                              <div className="flex items-center justify-center gap-2 mt-8">
                                <Button
                                  variant="outline"
                                  onClick={() =>
                                    handleReferralsPageChange(referralsPage - 1)
                                  }
                                  disabled={referralsPage === 1}
                                  className="flex items-center gap-2 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600"
                                >
                                  ← Previous
                                </Button>

                                <Button
                                  variant="outline"
                                  onClick={() =>
                                    handleReferralsPageChange(referralsPage + 1)
                                  }
                                  disabled={
                                    referralsPage === referralsData.totalPages
                                  }
                                  className="flex items-center gap-2 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600"
                                >
                                  Next →
                                </Button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                <div className="border-t pt-6 mt-6">
      <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
          {t("title")}
        </h4>
        <p className="text-sm text-red-600 dark:text-red-400 mb-4">
          {t("description")}
        </p>
        <Link
          href={`/delete-account?email=${encodeURIComponent(session?.user.email || "")}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
        >
          <Trash2 className="w-4 h-4" />
          {t("deleteButton")}
        </Link>
      </div>
    </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        
      </section>

      

      {/* <Footer /> */}
    </div>
  );

  function WishlistCard({
    property,
    onRemove,
    onShare,
  }: {
    property: Property;
    onRemove: () => void;
    onShare: () => void;
  }) {
    return (
      <Card className="overflow-hidden bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 group">
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
      className={`absolute top-3 left-3 ${
        property.sold
          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      }`}
    >
      {property.sold ? t("sold") : t("available")}
    </Badge>

    {/* Featured Badge */}
    {property.featured && (
      <Badge className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md">
        {t("featured")}
      </Badge>
    )}

    {/* Action Buttons (show on hover) */}
    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <Button
        onClick={onShare}
        variant="ghost"
        size="sm"
        className="bg-black/20 dark:bg-white/20 text-white hover:bg-black/40 dark:hover:bg-white/40 backdrop-blur-sm"
      >
        <Share2 className="w-4 h-4" />
      </Button>
      <Button
        onClick={onRemove}
        variant="ghost"
        size="sm"
        className="bg-black/20 dark:bg-white/20 text-white hover:bg-red-500 dark:hover:bg-red-600 backdrop-blur-sm"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  </div>

  <CardContent className="p-4">
    <div className="flex items-start justify-between mb-2">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 line-clamp-1">
        {property.title}
      </h3>
      <Heart className="w-5 h-5 text-red-500 fill-current flex-shrink-0" />
    </div>

    <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mb-3">
      {formatPrice(property.price)}
    </p>

    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 mb-3">
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

    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-3">
      <MapPin className="w-4 h-4" />
      <span className="text-sm">{property.location}</span>
    </div>

    <div className="flex gap-2">
      <Link href={`/properties/${property.slug}`} className="flex-1">
        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm">
          {t("viewDetails")}
        </Button>
      </Link>
      <Button
        onClick={onRemove}
        variant="outline"
        size="sm"
        className="px-3 bg-transparent border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-900 hover:border-red-200 dark:hover:border-red-600 hover:text-red-600 dark:hover:text-red-300"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  </CardContent>
</Card>

    );
  }
}
