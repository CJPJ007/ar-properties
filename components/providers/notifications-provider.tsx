"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useNotifications } from "@/hooks/use-notifications"
import type { Notification } from "@/lib/interfaces"

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  error: string | null
  markAsRead: (notificationId: string) => Promise<void>
  requestPermission: () => Promise<NotificationPermission>
  permissionStatus: NotificationPermission
  isSupported: boolean
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function useNotificationContext() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotificationContext must be used within a NotificationProvider")
  }
  return context
}

interface NotificationProviderProps {
  children: ReactNode
  pollingInterval?: number
}

export default function NotificationProvider({ children, pollingInterval = 30000 }: NotificationProviderProps) {
  const notificationData = useNotifications(pollingInterval)

  return <NotificationContext.Provider value={notificationData}>{children}</NotificationContext.Provider>
}
