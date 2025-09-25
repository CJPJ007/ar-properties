"use client"

import { useState, useCallback, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import type { AdvancedSearchRequest, WishlistItem } from "@/lib/interfaces"
import { useSession } from "next-auth/react"

export function useWishlist() {
  const [wishlistItems, setWishlistItems] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { data: session, status } = useSession();

  // Add to wishlist
  const addToWishlist = useCallback(
    async (propertyId: number, propertyTitle: string) => {
      if (!session || !session.user) {
        toast({
          title: "Login Required",
          description: "Please login to add properties to your wishlist.",
          variant: "destructive",
        })
        return false
      }

      setLoading(true)
      try {
        const response = await fetch("/api/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer :{
            email: session.user.email,
            },
            property :{
            id: propertyId,
            }
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to add to wishlist")
        }

        // Update local state
        setWishlistItems((prev) => new Set([...prev, propertyId]))

        toast({
          title: "Added to Wishlist",
          description: `${propertyTitle} has been added to your wishlist.`,
        })

        return true
      } catch (error) {
        console.error("Error adding to wishlist:", error)
        toast({
          title: "Error",
          description: "Failed to add property to wishlist. Please try again.",
          variant: "destructive",
        })
        return false
      } finally {
        setLoading(false)
      }
    },
    [session?.user.email, toast],
  )

  // Remove from wishlist
  const removeFromWishlist = useCallback(
    async (propertyId: number, propertyTitle: string) => {
      if (!session || !session.user) {
        return false
      }

      setLoading(true)
      try {
        const response = await fetch(`/api/wishlist?email=${session.user.email}&propertyId=${propertyId}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error("Failed to remove from wishlist")
        }

        // Update local state
        setWishlistItems((prev) => {
          const newSet = new Set(prev)
          newSet.delete(propertyId)
          return newSet
        })

        toast({
          title: "Removed from Wishlist",
          description: `${propertyTitle} has been removed from your wishlist.`,
        })

        return true
      } catch (error) {
        console.error("Error removing from wishlist:", error)
        toast({
          title: "Error",
          description: "Failed to remove property from wishlist. Please try again.",
          variant: "destructive",
        })
        return false
      } finally {
        setLoading(false)
      }
    },
    [session?.user.email, toast],
  )

  // Toggle wishlist status
  const toggleWishlist = useCallback(
    async (propertyId: number, propertyTitle: string) => {
      const isInWishlist = wishlistItems.has(propertyId)

      if (isInWishlist) {
        return await removeFromWishlist(propertyId, propertyTitle)
      } else {
        return await addToWishlist(propertyId, propertyTitle)
      }
    },
    [wishlistItems, addToWishlist, removeFromWishlist],
  )

  // Check if property is in wishlist
  const isInWishlist = useCallback(
    (propertyId: number) => {
      return wishlistItems.has(propertyId)
    },
    [wishlistItems],
  )

  // Load user's wishlist
  useEffect(() => {
   const fetchWishList = async ()=>{ if (!session || !session.user) {
      setWishlistItems(new Set())
      return
    }

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
      
            const response = await fetch(`/api/wishlistSearch?page=${1}&size=100`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(requestBody),
            });
      
            if (!response.ok) {
              throw new Error("Failed to fetch wishlist");
            }
      
        if (response.ok) {
        const data: WishlistItem[] = (await response.json()).data;
        const propertyIds = data.map((item) => item.property.id)
        setWishlistItems(new Set(propertyIds))
      }
    } catch (error) {
      console.error("Error loading wishlist:", error)
    }
    }
    fetchWishList();
  }, [session?.user.email])

  return {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
  }
}
