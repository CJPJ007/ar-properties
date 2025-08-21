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

export default function TermsPage() {
  const [termsContent, setTermsContent] = useState<LegalContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTermsContent()
  }, [])

  const fetchTermsContent = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/public/company-details/legal-content")

      if (!response.ok) {
        throw new Error("Failed to fetch terms of service")
      }

      const data = await response.json()

      // Find terms of service content
      const termsOfService = data.find((item: LegalContent) => item.type === "terms" && item.active)

      if (termsOfService) {
        setTermsContent(termsOfService)
      } else {
        setError("Terms of service not found")
      }
    } catch (err) {
      console.error("Error fetching terms content:", err)
      setError("Failed to load terms of service. Please try again later.")
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
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-8 text-center">Terms of Service</h1>

              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>

                <div className="mt-8 text-center">
                  <button
                    onClick={fetchTermsContent}
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
              {termsContent?.title || "Terms of Service"}
            </h1>

            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              {termsContent?.content ? (
                <div
                  className="prose prose-slate max-w-none prose-headings:text-slate-800 prose-headings:font-bold prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600 prose-strong:text-slate-700"
                  dangerouslySetInnerHTML={{ __html: termsContent.content }}
                />
              ) : (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">1. Acceptance of Terms</h2>
                    <p className="text-slate-600 leading-relaxed">
                      By accessing and using this website, you accept and agree to be bound by the terms and provision
                      of this agreement.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">2. Use License</h2>
                    <p className="text-slate-600 leading-relaxed">
                      Permission is granted to temporarily download one copy of the materials on Ananta Realty's website
                      for personal, non-commercial transitory viewing only.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">3. Disclaimer</h2>
                    <p className="text-slate-600 leading-relaxed">
                      The materials on Ananta Realty's website are provided on an 'as is' basis. Ananta Realty makes no
                      warranties, expressed or implied, and hereby disclaims and negates all other warranties including
                      without limitation, implied warranties or conditions of merchantability, fitness for a particular
                      purpose, or non-infringement of intellectual property or other violation of rights.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">4. Contact Information</h2>
                    <p className="text-slate-600 leading-relaxed">
                      If you have any questions about these Terms of Service, please contact us.
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-8 border-t border-slate-200 mt-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <p className="text-sm text-slate-500">
                    <strong>Last updated:</strong>{" "}
                    {termsContent?.lastUpdated ? formatDate(termsContent.lastUpdated) : "Recently"}
                  </p>
                  {termsContent?.version && (
                    <p className="text-sm text-slate-500">
                      <strong>Version:</strong> {termsContent.version}
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
