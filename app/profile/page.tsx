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
  Building,
  MessageSquare,
  Eye,
  Search,
  Filter,
  Edit,
  Save,
  X,
  User
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
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { AdvancedSearchRequest } from "@/lib/interfaces";

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

interface ApiResponse<T> {
  totalRecords: number;
  data: T[];
  totalPages: number;
  currentPage: number;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("inquiries");
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    mobile: session?.user?.mobile || '',
    avatar: session?.user?.image || ''
  });

  // Pagination states
  const [inquiriesPage, setInquiriesPage] = useState(1);
  const [siteVisitsPage, setSiteVisitsPage] = useState(1);
  const [inquiriesData, setInquiriesData] = useState<ApiResponse<Inquiry> | null>(null);
  const [siteVisitsData, setSiteVisitsData] = useState<ApiResponse<SiteVisit> | null>(null);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(false);
  const [isLoadingSiteVisits, setIsLoadingSiteVisits] = useState(false);
  
  // Debounced search state
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Fetch inquiries data
  const fetchInquiries = async (page: number = 1, search?: string) => {
    setIsLoadingInquiries(true);
    try {
      const requestBody:AdvancedSearchRequest = {
        criteriaList: [
          {
            key: "appointmentDate",
            operation: "isEmpty",
            value: null
          }
        ],
        operations: []
      };

      if (search) {
        requestBody.criteriaList.push({
          key: "property",
          operation: "contains",
          value: search
        });
        requestBody.operations.push("AND");
      }

      const response = await fetch(`/api/inquiries?page=${page}&size=10`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch inquiries');
      }

      const data = await response.json();
      setInquiriesData(data);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setIsLoadingInquiries(false);
    }
  };

  // Fetch site visits data
  const fetchSiteVisits = async (page: number = 1, search?: string) => {
    setIsLoadingSiteVisits(true);
    try {
      const requestBody:AdvancedSearchRequest = {
        criteriaList: [
          {
            key: "appointmentDate",
            operation: "isNotEmpty"
          }
        ],
        operations: []
      };

      if (search) {
        requestBody.criteriaList.push({
          key: "property",
          operation: "contains",
          value: search
        });
        requestBody.operations.push("AND");
      }

      const response = await fetch(`/api/site-visits?page=${page}&size=10`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch site visits');
      }

      const data = await response.json();
      setSiteVisitsData(data);
    } catch (error) {
      console.error('Error fetching site visits:', error);
    } finally {
      setIsLoadingSiteVisits(false);
    }
  };

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // useEffect to fetch data when component mounts or search changes
  useEffect(() => {
    if (status === "loading") return;
    
    if (activeTab === "inquiries") {
      fetchInquiries(inquiriesPage, debouncedSearchQuery);
    } else {
      fetchSiteVisits(siteVisitsPage, debouncedSearchQuery);
    }
  }, [activeTab, inquiriesPage, siteVisitsPage, debouncedSearchQuery, status]);

  // Redirect if not authenticated
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    redirect("/auth/login");
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'responded':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };





  // Handle search with debouncing
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    // Reset to page 1 when searching
    if (activeTab === "inquiries") {
      setInquiriesPage(1);
    } else {
      setSiteVisitsPage(1);
    }
  }, [activeTab]);

  // Handle page changes
  const handleInquiriesPageChange = useCallback((page: number) => {
    setInquiriesPage(page);
  }, []);

  const handleSiteVisitsPageChange = useCallback((page: number) => {
    setSiteVisitsPage(page);
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          mobile: formData.mobile,
          avatar: formData.avatar
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const result = await response.json();
      console.log('Profile updated successfully:', result);
      
      // In a real app, you might want to refresh the session here
      // or update the session data with the new information
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      // You could add a toast notification here to show the error
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: session?.user?.name || '',
      email: session?.user?.email || '',
      mobile: session?.user?.mobile || '',
      avatar: session?.user?.image || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-16 md:pb-0">
      <Header />

      {/* Back Button */}
      <div className="pt-20 md:pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/">
            <Button variant="outline" className="mb-6 bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
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
                         <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0">
               <CardContent className="p-8">
                 <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                   <div className="relative">
                     {session?.user?.image ? (
                       <Avatar className="w-24 h-24 border-4 border-white/20">
                         <AvatarImage src={session.user.image} />
                         <AvatarFallback className="text-2xl bg-white/20 text-white">
                           {session.user.name?.charAt(0) || 'U'}
                         </AvatarFallback>
                       </Avatar>
                     ) : (
                       <Avatar className="w-24 h-24 border-4 border-white/20 bg-white/20">
                         <AvatarFallback className="text-2xl text-white">
                           {session?.user?.name?.charAt(0) || 'U'}
                         </AvatarFallback>
                       </Avatar>
                     )}
                   </div>
                   
                   <div className="flex-1 text-center md:text-left">
                     <div className="flex items-center justify-between mb-2">
                       <h1 className="text-3xl font-bold">{session?.user?.name || 'User'}</h1>
                       {!isEditing && (
                         <Button
                           onClick={() => setIsEditing(true)}
                           variant="ghost"
                           size="sm"
                           className="text-white hover:bg-white/20"
                         >
                           <Edit className="w-4 h-4 mr-2" />
                           Edit Profile
                         </Button>
                       )}
                     </div>
                     <p className="text-blue-100 text-lg mb-4">{session?.user?.email}</p>
                     
                     <div className="flex flex-col md:flex-row gap-4 text-sm">
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
                 <Card className="mt-6">
                   <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                       <Edit className="w-5 h-5" />
                       Edit Profile Information
                     </CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">
                           <User className="w-4 h-4 inline mr-2" />
                           Full Name
                         </label>
                         <Input
                           type="text"
                           value={formData.name}
                           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                           placeholder="Enter your full name"
                           className="w-full"
                         />
                       </div>
                       
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">
                           <Mail className="w-4 h-4 inline mr-2" />
                           Email Address
                         </label>
                         <Input
                           type="email"
                           value={formData.email}
                           onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                           placeholder="Enter your email"
                           className="w-full"
                           disabled
                         />
                         <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                       </div>
                       
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">
                           <Phone className="w-4 h-4 inline mr-2" />
                           Mobile Number
                         </label>
                         <Input
                           type="tel"
                           value={formData.mobile}
                           onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                           placeholder="Enter your mobile number"
                           className="w-full"
                         />
                       </div>
                       
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">
                           Profile Picture URL
                         </label>
                         <Input
                           type="url"
                           value={formData.avatar}
                           onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                           placeholder="Enter profile picture URL"
                           className="w-full"
                         />
                       </div>
                     </div>
                     
                     <div className="flex gap-3 pt-4">
                       <Button
                         onClick={handleSave}
                         disabled={isLoading}
                         className="flex items-center gap-2"
                       >
                         <Save className="w-4 h-4" />
                         {isLoading ? 'Saving...' : 'Save Changes'}
                       </Button>
                       <Button
                         onClick={handleCancel}
                         variant="outline"
                         className="flex items-center gap-2"
                       >
                         <X className="w-4 h-4" />
                         Cancel
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
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <CardTitle className="text-2xl">My Activity</CardTitle>
                  
                  {/* Search */}
                  <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search properties..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="inquiries" className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Inquiries ({inquiriesData?.totalRecords || 0})
                    </TabsTrigger>
                    <TabsTrigger value="site-visits" className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Site Visits ({siteVisitsData?.totalRecords || 0})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="inquiries" className="mt-6">
                    <div className="space-y-4">
                      {isLoadingInquiries ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                          <p className="text-slate-500">Loading inquiries...</p>
                        </div>
                      ) : !inquiriesData?.data || inquiriesData.data.length === 0 ? (
                        <div className="text-center py-8">
                          <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-slate-600 mb-2">No Inquiries Found</h3>
                          <p className="text-slate-500">Start exploring properties to make inquiries</p>
                          <Link href="/properties">
                            <Button className="mt-4">Browse Properties</Button>
                          </Link>
                        </div>
                      ) : (
                        <>
                          {inquiriesData.data.map((inquiry) => (
                            <Card key={inquiry.id} className="hover:shadow-md transition-shadow">
                              <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-4">
                                  <div className="flex-1">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-3">
                                      <h3 className="font-semibold text-slate-800">
                                        {inquiry.property || 'General Inquiry'}
                                      </h3>
                                      <Badge className={getStatusColor(inquiry.status)}>
                                        {inquiry.status}
                                      </Badge>
                                    </div>
                                    
                                    <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                                      {inquiry.message}
                                    </p>
                                    
                                    <div className="flex flex-col md:flex-row md:items-center gap-4 text-xs text-slate-500">
                                      <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        <span>Inquired: {formatDate(inquiry.createdAt)}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <span>By: {inquiry.name}</span>
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
                                onClick={() => handleInquiriesPageChange(inquiriesPage - 1)}
                                disabled={inquiriesPage === 1}
                                className="flex items-center gap-2"
                              >
                                ← Previous
                              </Button>
                              
                              <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, inquiriesData.totalPages) }, (_, i) => {
                                  let pageNum;
                                  if (inquiriesData.totalPages <= 5) {
                                    pageNum = i + 1;
                                  } else if (inquiriesPage <= 3) {
                                    pageNum = i + 1;
                                  } else if (inquiriesPage >= inquiriesData.totalPages - 2) {
                                    pageNum = inquiriesData.totalPages - 4 + i;
                                  } else {
                                    pageNum = inquiriesPage - 2 + i;
                                  }
                                  
                                  return (
                                    <Button
                                      key={pageNum}
                                      variant={inquiriesPage === pageNum ? "default" : "outline"}
                                      onClick={() => handleInquiriesPageChange(pageNum)}
                                      className="w-10 h-10"
                                    >
                                      {pageNum}
                                    </Button>
                                  );
                                })}
                              </div>
                              
                              <Button
                                variant="outline"
                                onClick={() => handleInquiriesPageChange(inquiriesPage + 1)}
                                disabled={inquiriesPage === inquiriesData.totalPages}
                                className="flex items-center gap-2"
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
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                          <p className="text-slate-500">Loading site visits...</p>
                        </div>
                      ) : !siteVisitsData?.data || siteVisitsData.data.length === 0 ? (
                        <div className="text-center py-8">
                          <Eye className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-slate-600 mb-2">No Site Visits Found</h3>
                          <p className="text-slate-500">Schedule site visits for properties you're interested in</p>
                          <Link href="/properties">
                            <Button className="mt-4">Browse Properties</Button>
                          </Link>
                        </div>
                      ) : (
                        <>
                          {siteVisitsData.data.map((visit) => (
                            <Card key={visit.id} className="hover:shadow-md transition-shadow">
                              <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-4">
                                  <div className="flex-1">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-3">
                                      <h3 className="font-semibold text-slate-800">
                                        {visit.property || 'General Site Visit'}
                                      </h3>
                                      <Badge className={getStatusColor(visit.status)}>
                                        {visit.status}
                                      </Badge>
                                    </div>
                                    
                                    <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                                      {visit.message}
                                    </p>
                                    
                                    <div className="flex flex-col md:flex-row md:items-center gap-4 text-xs text-slate-500">
                                      <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>Scheduled: {visit.appointmentDate ? formatDate(visit.appointmentDate) : 'Not scheduled'}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        <span>Created: {formatDate(visit.createdAt)}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <span>By: {visit.name}</span>
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
                                onClick={() => handleSiteVisitsPageChange(siteVisitsPage - 1)}
                                disabled={siteVisitsPage === 1}
                                className="flex items-center gap-2"
                              >
                                ← Previous
                              </Button>
                              
                              <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, siteVisitsData.totalPages) }, (_, i) => {
                                  let pageNum;
                                  if (siteVisitsData.totalPages <= 5) {
                                    pageNum = i + 1;
                                  } else if (siteVisitsPage <= 3) {
                                    pageNum = i + 1;
                                  } else if (siteVisitsPage >= siteVisitsData.totalPages - 2) {
                                    pageNum = siteVisitsData.totalPages - 4 + i;
                                  } else {
                                    pageNum = siteVisitsPage - 2 + i;
                                  }
                                  
                                  return (
                                    <Button
                                      key={pageNum}
                                      variant={siteVisitsPage === pageNum ? "default" : "outline"}
                                      onClick={() => handleSiteVisitsPageChange(pageNum)}
                                      className="w-10 h-10"
                                    >
                                      {pageNum}
                                    </Button>
                                  );
                                })}
                              </div>
                              
                              <Button
                                variant="outline"
                                onClick={() => handleSiteVisitsPageChange(siteVisitsPage + 1)}
                                disabled={siteVisitsPage === siteVisitsData.totalPages}
                                className="flex items-center gap-2"
                              >
                                Next →
                              </Button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 