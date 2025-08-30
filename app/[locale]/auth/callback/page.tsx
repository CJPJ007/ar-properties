"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()

  useEffect(() => {
    const processReferral = async () => {
      const referralEmail = searchParams.get("ref")

      if (referralEmail && session?.user?.email) {
        try {
          const response = await fetch("/api/referrals/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              referredEmail: session.user.email,
              referredName: session.user.name || "",
              referredMobile: session.user.mobile,
              email: referralEmail,
              status: "completed",
              referralAmount: 1000,
            }),
          })

          if (response.ok) {
            toast({
              title: "Referral Activated! 🎉",
              description: "Your referral bonus has been processed successfully!",
            })
          } else {
            console.warn("Failed to process referral:", response.status)
          }
        } catch (error) {
          console.error("Error processing referral:", error)
        }
      }

      // Redirect to home after processing
      router.push("/")
    }

    if (status === "authenticated") {
      processReferral()
    } else if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [session, status, searchParams, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Processing your login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p className="text-slate-600">Redirecting...</p>
      </div>
    </div>
  )
}
