"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { Notification } from "@/lib/interfaces"
import { NotificationService } from "@/lib/notification-service"
import { useSession } from "next-auth/react"

interface UseNotificationsReturn {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  error: string | null
  markAsRead: (notificationId: string) => Promise<void>
  requestPermission: () => Promise<NotificationPermission>
  permissionStatus: NotificationPermission
  isSupported: boolean
}

export function useNotifications(pollingInterval = 3000): UseNotificationsReturn {
  const { data:session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>("default")

  const notificationService = NotificationService.getInstance()
  const intervalRef = useRef<NodeJS.Timeout | null>(null);


  const fetchNotifications = useCallback(async () => {
    if (!session || !session.user) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/notifications?userId=${session.user.email}&limit=20`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch notifications")
      }

      const data = await response.json()
      setNotifications(data.notifications)
      setUnreadCount(data.unreadCount)

      // Show browser notifications for new unread notifications
      if (permissionStatus === "granted") {
        const displayedNotifications = new Set(JSON.parse(localStorage.getItem("displayedNotifications") || "[]"))
        const newNotifications = data.notifications.filter(
          (notification: Notification) => !notification.read && !displayedNotifications.has(notification.id),
        )

        for (const notification of newNotifications) {
          if(displayedNotifications.size>=9){
            displayedNotifications.delete([...displayedNotifications][0]) // Remove oldest if limit exceeded
          }
          localStorage.setItem("displayedNotifications", JSON.stringify([...displayedNotifications, notification.id]))
          await notificationService.showNotification(notification)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }, [session?.user.email, permissionStatus, notificationService])

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificationId,
          markAsRead: true,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to mark notification as read")
      }

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId ? { ...notification, read: true } : notification,
        ),
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update notification")
    }
  }, [])

  const requestPermission = useCallback(async () => {
    const permission = await notificationService.requestPermission()
    setPermissionStatus(permission)
    return permission
  }, [notificationService])

  // Initialize permission status
  useEffect(() => {
    if (notificationService.isSupported()) {
      const currentPermission = notificationService.getPermissionStatus()
      console.log("Initial permission status:", currentPermission)
      setPermissionStatus(currentPermission)

      // Auto-request permission if it's default (not yet asked)
      if (currentPermission === "default" && session?.user.email) {
        console.log("Auto-requesting notification permission...")
        setTimeout(() => {
          requestPermission()
        }, 2000) // Wait 2 seconds after page load
      }
    } else {
      console.log("Notifications not supported in this browser")
    }
  }, [notificationService, session?.user.email, requestPermission])

  // Set up polling
  useEffect(() => {
    if (!session || !session.user) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      return
    }

    // Initial fetch
    fetchNotifications()

    // Set up polling
    intervalRef.current = setInterval(fetchNotifications, pollingInterval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [fetchNotifications, pollingInterval, session?.user.email])

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    requestPermission,
    permissionStatus,
    isSupported: notificationService.isSupported(),
  }
}
