"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, MessageSquare, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"

interface TestimonialModalProps {
  buttonText: string
  buttonSize?: "sm" | "lg" | "default"
  buttonClassName?: string
  modalTitle: string
  modalDescription: string
  propertyTitle?: string
}

export default function TestimonialModal({
  buttonText,
  buttonSize = "default",
  buttonClassName = "",
  modalTitle,
  modalDescription,
  propertyTitle,
}: TestimonialModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [review, setReview] = useState("")
  const { toast } = useToast()
  const { data: session } = useSession()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit a testimonial.",
        variant: "destructive",
      })
      return
    }

    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      })
      return
    }

    if (!review.trim()) {
      toast({
        title: "Review Required",
        description: "Please write a review before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/testimonial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            email: session.user?.email,
            name: session.user?.name,
            mobile: session.user?.mobile || "",
          },
          review: review.trim(),
          rating: rating,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit testimonial")
      }

      toast({
        title: "Thank You!",
        description: "Your testimonial has been submitted successfully.",
      })

      // Reset form
      setRating(0)
      setReview("")
      setIsOpen(false)
    } catch (error) {
      console.error("Error submitting testimonial:", error)
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your testimonial. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRatingClick = (value: number) => {
    setRating(value)
  }

  const handleRatingHover = (value: number) => {
    setHoveredRating(value)
  }

  const handleRatingLeave = () => {
    setHoveredRating(0)
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        size={buttonSize}
        className={`flex items-center gap-2 ${buttonClassName}`}
      >
        <MessageSquare className="w-4 h-4" />
        {buttonText}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="shadow-2xl border-0">
                <CardHeader className="relative pb-4">
                  <Button
                    onClick={() => setIsOpen(false)}
                    variant="ghost"
                    size="sm"
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <CardTitle className="text-xl font-bold text-slate-800 pr-8">{modalTitle}</CardTitle>
                  <p className="text-slate-600 text-sm">{modalDescription}</p>
                  {propertyTitle && <p className="text-blue-600 text-sm font-medium">Property: {propertyTitle}</p>}
                </CardHeader>

                <CardContent className="pt-0">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* User Info Display */}
                    {session && (
                      <div className="bg-slate-50 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          {session.user?.image && (
                            <img
                              src={session.user.image || "/placeholder.svg"}
                              alt={session.user.name || "User"}
                              className="w-10 h-10 rounded-full"
                            />
                          )}
                          <div>
                            <p className="font-medium text-slate-800">{session.user?.name}</p>
                            <p className="text-sm text-slate-600">{session.user?.email}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Rating */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">
                        Rating <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => handleRatingClick(value)}
                            onMouseEnter={() => handleRatingHover(value)}
                            onMouseLeave={handleRatingLeave}
                            className="p-1 transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-8 h-8 transition-colors ${
                                value <= (hoveredRating || rating) ? "text-amber-400 fill-amber-400" : "text-slate-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      {rating > 0 && (
                        <p className="text-sm text-slate-600">
                          {rating === 1 && "Poor"}
                          {rating === 2 && "Fair"}
                          {rating === 3 && "Good"}
                          {rating === 4 && "Very Good"}
                          {rating === 5 && "Excellent"}
                        </p>
                      )}
                    </div>

                    {/* Review */}
                    <div className="space-y-2">
                      <Label htmlFor="review" className="text-sm font-medium text-slate-700">
                        Your Review <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="review"
                        placeholder="Share your experience with this property..."
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        rows={4}
                        className="resize-none"
                        required
                      />
                      <p className="text-xs text-slate-500">{review.length}/500 characters</p>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        className="flex-1"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting || rating === 0 || !review.trim()}
                        className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Submit Review"
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
