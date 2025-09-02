"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession, signIn } from "next-auth/react"
import { Phone, Mail, User, Camera, ArrowLeft, Loader2, Gift, Car } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/hooks/use-toast"
import { sendOTP, verifyOTPAndSignIn, uploadAvatar } from "@/lib/auth"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { Customer } from "@/lib/interfaces"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState("mobile")
  const [isLoading, setIsLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [referralEmail, setReferralEmail] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const recaptchaContainerRef = useRef<HTMLDivElement>(null)
  const [customerExists, setCustomerExists] = useState<Customer>();
  // Mobile OTP form state
  const [mobileForm, setMobileForm] = useState({
    mobile: "",
    otp: "",
    name: "",
    email: "",
    avatar: "",
  })

  // Check for referral parameter on component mount
  useEffect(() => {
    const ref = searchParams.get("ref")
    if (ref) {
      setReferralEmail(ref)
      toast({
        title: "Referral Detected! 🎉",
        description: `You've been referred by ${ref}. Complete registration to activate your referral bonus!`,
      })
    }
  }, [searchParams])


  useEffect(()=>{
    const fetchCustomer = async ()=>{
      try {
          const response = await fetch(
            `/api/customer/${encodeURIComponent("+91"+mobileForm.mobile)}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            },
          )
          console.log("After calling customerData api")
          if (response.ok) {
            const customerData = await response.json()
            console.log("Response for customer data api : ", customerData)
            if (customerData && customerData.email) {
              setCustomerExists(customerData);
            }
          } 
        } catch (fetchError) {
          console.error("Error fetching customer mobile in JWT callback:", fetchError)
        }
    }

    fetchCustomer();
  },[otpSent])



  // Redirect if already authenticated
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    )
  }

  if (session) {
    router.push("/")
    return null
  }

  const handleReferralSubmission = async (userEmail: string, userName: string) => {
    if (!referralEmail) return

    try {
      const response = await fetch("/api/public/referrals/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          referredEmail: userEmail,
          referredName: userName,
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

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10)
    setMobileForm((prev) => ({ ...prev, mobile: value }))
  }

  const handleSendOTP = async () => {
    if (!mobileForm.mobile || mobileForm.mobile.length !== 10) {
      toast({
        title: "Invalid mobile number",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const containerId = recaptchaContainerRef.current?.id || "recaptcha-container"
      await sendOTP(mobileForm.mobile, containerId)
      setOtpSent(true)
      setCountdown(121)
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      toast({
        title: "OTP Sent!",
        description: "Please check your mobile for the OTP",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send OTP",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const avatarUrl = await uploadAvatar(file)
      setMobileForm((prev) => ({ ...prev, avatar: avatarUrl }))
      toast({
        title: "Avatar uploaded!",
        description: "Your profile picture has been uploaded successfully",
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload avatar",
        variant: "destructive",
      })
    }
  }

  const handleMobileLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!mobileForm.otp || mobileForm.otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      })
      return
    }
    setIsLoading(true)
    try {
      const result = await verifyOTPAndSignIn(mobileForm.otp, mobileForm.name, mobileForm.email, mobileForm.avatar)

      if (result?.ok) {
        // Process referral if present
        if (referralEmail && mobileForm.email) {
          await handleReferralSubmission(mobileForm.email, mobileForm.name)
        }

        toast({
          title: "Login successful!",
          description: "Welcome back!",
        })
        router.push("/")
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid OTP or mobile number",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    // Include referral email in the callback URL for Google login
    const callbackUrl = referralEmail ? `/auth/callback?ref=${encodeURIComponent(referralEmail)}` : "/"

    signIn("google", { callbackUrl })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 via-blue-900 to-gray-900 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 relative overflow-hidden">
  {/* Background Decorative Elements */}
  <div className="absolute inset-0 overflow-hidden">
    {/* City Buildings */}
    <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-gray-900/50 to-transparent">
      <div className="absolute bottom-0 left-8 w-12 h-32 bg-gray-700/20 rounded-t-lg"></div>
      <div className="absolute bottom-0 left-24 w-16 h-40 bg-gray-600/30 rounded-t-lg"></div>
      <div className="absolute bottom-0 left-44 w-14 h-36 bg-gray-600/25 rounded-t-lg"></div>
      <div className="absolute bottom-0 right-8 w-18 h-44 bg-gray-700/20 rounded-t-lg"></div>
      <div className="absolute bottom-0 right-28 w-12 h-28 bg-gray-600/30 rounded-t-lg"></div>
    </div>

    {/* Car Icon */}
    <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
      <Car className="w-8 h-8 text-white/50" />
    </div>

    {/* Floating Elements */}
    <div className="absolute top-20 right-8 w-4 h-4 bg-white/20 rounded-full animate-pulse"></div>
    <div className="absolute top-32 left-12 w-3 h-3 bg-white/15 rounded-full animate-pulse delay-1000"></div>
    <div className="absolute top-48 right-16 w-2 h-2 bg-white/10 rounded-full animate-pulse delay-500"></div>
  </div>

  <div className="relative z-10 min-h-screen flex flex-col">
    {/* Header */}
    <div className="flex items-center justify-between p-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back</span>
      </Link>
    </div>

    {/* Main Content */}
    <div className="flex-1 flex items-center justify-center px-6 pb-8">
      <div className="w-full max-w-sm">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">HELLO</h1>
          <p className="text-white/70 text-sm leading-relaxed">
            Welcome to Ananta Realty
            <br />
            Sign in to continue your journey
          </p>
        </motion.div>

        {/* Referral Banner */}
        {referralEmail && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl"
          >
            <div className="flex items-center gap-2 text-white">
              <Gift className="w-4 h-4" />
              <span className="text-sm font-medium">Referred by: {referralEmail}</span>
            </div>
            <p className="text-xs text-white/70 mt-1">
              Complete registration to activate your referral bonus!
            </p>
          </motion.div>
        )}

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gray-800/95 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden dark:bg-gray-900/90">
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-700 rounded-2xl p-1">
                  <TabsTrigger
                    value="mobile"
                    className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="hidden sm:inline text-white">Mobile</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="google"
                    className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="hidden sm:inline text-white">Google</span>
                  </TabsTrigger>
                </TabsList>

                {/* Mobile Login */}
                <TabsContent value="mobile" className="space-y-4">
                  <form onSubmit={handleMobileLogin} className="space-y-4">
                    <div ref={recaptchaContainerRef} id="recaptcha-container" className="hidden" />

                    {/* Mobile Input */}
                    <div className="space-y-2">
                      <Label htmlFor="mobile" className="text-gray-200 font-medium">
                        Mobile Number
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          id="mobile"
                          type="tel"
                          placeholder="Enter 10-digit mobile number"
                          value={mobileForm.mobile}
                          onChange={handleMobileChange}
                          className="pl-12 h-12 rounded-2xl border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-blue-500"
                          disabled={otpSent}
                        />
                      </div>
                    </div>

                    {/* Send OTP */}
                    {!otpSent ? (
                      <Button
                        type="button"
                        onClick={handleSendOTP}
                        disabled={!mobileForm.mobile || mobileForm.mobile.length !== 10 || isLoading}
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-2xl font-semibold text-white shadow-lg"
                      >
                        {isLoading && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
                        Send OTP
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={handleSendOTP}
                        disabled={countdown > 0 || isLoading}
                        variant="outline"
                        className="w-full h-12 rounded-2xl border-2 border-gray-600 dark:text-white text-gray-600 hover:border-blue-500 font-semibold"
                      >
                        {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
                      </Button>
                    )}

                    {/* OTP Input */}
                    {otpSent && (
                      <div className="space-y-2">
                        <Label htmlFor="otp" className="text-gray-200 font-medium">
                          Enter OTP
                        </Label>
                        <Input
                          id="otp"
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          value={mobileForm.otp}
                          onChange={(e) =>
                            setMobileForm((prev) => ({
                              ...prev,
                              otp: e.target.value.replace(/\D/g, "").slice(0, 6),
                            }))
                          }
                          className="text-center text-xl font-mono tracking-widest h-12 rounded-2xl border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-blue-500"
                          maxLength={6}
                        />
                      </div>
                    )}

                    {/* User Details */}
                    {otpSent && !customerExists && (
                      <AnimatePresence>
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4 pt-4 border-t border-gray-600"
                        >
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-gray-200 font-medium">
                              Full Name
                            </Label>
                            <div className="relative">
                              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                              <Input
                                id="name"
                                type="text"
                                placeholder="Enter your full name"
                                value={mobileForm.name}
                                onChange={(e) =>
                                  setMobileForm((prev) => ({ ...prev, name: e.target.value }))
                                }
                                className="pl-12 h-12 rounded-2xl border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-blue-500"
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-200 font-medium">
                              Email
                            </Label>
                            <div className="relative">
                              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                              <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={mobileForm.email}
                                onChange={(e) =>
                                  setMobileForm((prev) => ({ ...prev, email: e.target.value }))
                                }
                                className="pl-12 h-12 rounded-2xl border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-blue-500"
                                required
                              />
                            </div>
                            {referralEmail && (
                              <p className="text-xs text-blue-400">
                                Email is required to process your referral bonus
                              </p>
                            )}
                          </div>

                          {/* Avatar Upload
                          <div className="space-y-2">
                            <Label className="text-gray-200 font-medium">Profile Picture (Optional)</Label>
                            <div className="flex items-center gap-4">
                              <Avatar className="w-16 h-16 border-2 border-gray-600">
                                <AvatarImage src={mobileForm.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="bg-gray-700">
                                  <User className="w-6 h-6 text-gray-400" />
                                </AvatarFallback>
                              </Avatar>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 rounded-2xl border-2 border-gray-600 hover:border-blue-500"
                              >
                                <Camera className="w-4 h-4" />
                                Upload
                              </Button>
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                className="hidden"
                              />
                            </div>
                          </div> */}
                        </motion.div>
                      </AnimatePresence>
                    )}

                    {/* Login Button */}
                    {otpSent && (
                      <Button
                        type="submit"
                        disabled={
                          !mobileForm.otp ||
                          mobileForm.otp.length !== 6 ||
                          (!mobileForm.name && !customerExists) ||
                          (referralEmail && !mobileForm.email && !customerExists) ||
                          isLoading
                        }
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-2xl font-semibold text-white shadow-lg"
                      >
                        {isLoading && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
                        Sign In
                      </Button>
                    )}
                  </form>
                </TabsContent>

                {/* Google Login */}
                <TabsContent value="google" className="space-y-6">
                  <div className="text-center space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-white">Continue with Google</h3>
                      <p className="text-gray-300 text-sm">
                        Sign in with your Google account for quick access
                      </p>
                    </div>

                    {referralEmail && (
                      <div className="p-3 bg-gray-700 border border-gray-600 rounded-2xl">
                        <p className="text-xs text-blue-400">
                          Your referral will be automatically processed after Google login
                        </p>
                      </div>
                    )}

                    <Button
                      onClick={handleGoogleLogin}
                      variant="outline"
                      className="w-full h-12 flex items-center justify-center gap-3 bg-gray-800 border-2 border-gray-600 hover:border-gray-500 rounded-2xl font-semibold text-white"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Continue with Google
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Terms */}
              <div className="mt-6 text-center text-xs text-gray-400">
                By signing in, you agree to our{" "}
                <Link href="/terms" className="text-blue-400 hover:underline font-medium">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-blue-400 hover:underline font-medium">
                  Privacy Policy
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  </div>
</div>

  )
}
