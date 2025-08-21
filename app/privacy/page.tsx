"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface LegalContent {
  id: number
  title: string
  content: string
  type: string
  lastUpdated: string
  active: boolean
  version: string
}

export default function PrivacyPage() {
  const [privacyContent, setPrivacyContent] = useState<LegalContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPrivacyContent()
  }, [])

  const fetchPrivacyContent = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/public/company-details/legal-content")

      if (!response.ok) {
        throw new Error("Failed to fetch privacy policy")
      }

      const data = await response.json()

      // Find privacy policy content
      const privacyPolicy = data.find((item: LegalContent) => item.type === "privacy" && item.active)

      if (privacyPolicy) {
        setPrivacyContent(privacyPolicy)
      } else {
        setError("Privacy policy not found")
      }
    } catch (err) {
      console.error("Error fetching privacy content:", err)
      setError("Failed to load privacy policy. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return "Recently updated"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <main className="pt-16 md:pt-32 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <Skeleton className="h-12 w-96 mx-auto mb-4" />
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-8">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <main className="pt-16 md:pt-32 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-8 text-center">Privacy Policy</h1>

              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>

                <div className="mt-8 text-center">
                  <button
                    onClick={fetchPrivacyContent}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      <main className="pt-16 md:pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-8 text-center">
              {privacyContent?.title || "Privacy Policy"}
            </h1>

            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              {privacyContent?.content ? (
                <div
                  className="prose prose-slate max-w-none prose-headings:text-slate-800 prose-headings:font-bold prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600 prose-strong:text-slate-700"
                  dangerouslySetInnerHTML={{ __html: privacyContent.content }}
                />
              ) : (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">1. Information We Collect</h2>
                    <p className="text-slate-600 leading-relaxed mb-4">
                      We collect information you provide directly to us, such as when you:
                    </p>
                    <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                      <li>Fill out contact forms or property inquiries</li>
                      <li>Sign up for our newsletter</li>
                      <li>Create an account or profile</li>
                      <li>Request property viewings or consultations</li>
                      <li>Contact us for customer support</li>
                    </ul>
                    <p className="text-slate-600 leading-relaxed mt-4">
                      The types of information we may collect include your name, email address, phone number, property
                      preferences, and any other information you choose to provide.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">2. How We Use Your Information</h2>
                    <p className="text-slate-600 leading-relaxed mb-4">We use the information we collect to:</p>
                    <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                      <li>Provide, maintain, and improve our services</li>
                      <li>Process and respond to your inquiries and requests</li>
                      <li>Send you marketing communications (with your consent)</li>
                      <li>Personalize your experience on our website</li>
                      <li>Analyze usage patterns and trends</li>
                      <li>Protect against fraud and ensure security</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">3. Information Sharing</h2>
                    <p className="text-slate-600 leading-relaxed">
                      We do not sell, trade, or otherwise transfer your personal information to third parties without
                      your consent, except in the following circumstances:
                    </p>
                    <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4 mt-4">
                      <li>With your explicit consent</li>
                      <li>To comply with legal obligations</li>
                      <li>To protect our rights and property</li>
                      <li>In connection with a business transfer or merger</li>
                      <li>With trusted service providers who assist us in operating our website</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">4. Contact Us</h2>
                    <p className="text-slate-600 leading-relaxed">
                      If you have any questions about this Privacy Policy or our data practices, please contact us.
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-8 border-t border-slate-200 mt-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <p className="text-sm text-slate-500">
                    <strong>Last updated:</strong>{" "}
                    {privacyContent?.lastUpdated ? formatDate(privacyContent.lastUpdated) : "Recently"}
                  </p>
                  {privacyContent?.version && (
                    <p className="text-sm text-slate-500">
                      <strong>Version:</strong> {privacyContent.version}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
