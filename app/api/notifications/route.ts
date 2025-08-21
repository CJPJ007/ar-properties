import { NextResponse } from "next/server"
import type { Notification } from "@/lib/interfaces"

// Mock notifications data - in real app, this would come from a database
const mockNotifications: Notification[] = [
  {
    id: "1",
    userId: "jaipalchauhan52@gmail.com",
    title: "New Inquiry Received",
    message: "You have received a new inquiry for Luxury Villa in Mumbai",
    type: "inquiry",
    read: false,
    actionUrl: "/profile?tab=inquiries",
    createdAt: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
    updatedAt: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: "2",
    userId: "jaipalchauhan52@gmail.com",
    title: "Site Visit Scheduled",
    message: "Your site visit for Modern Apartment has been confirmed for tomorrow at 2 PM",
    type: "site_visit",
    read: false,
    actionUrl: "/profile?tab=visits",
    createdAt: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
    updatedAt: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: "3",
    userId: "jaipalchauhan52@gmail.com",
    title: "Property Price Updated",
    message: "The price for Cozy Studio Apartment has been updated",
    type: "property_update",
    read: true,
    actionUrl: "/property/3",
    createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    updatedAt: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago (marked as read)
  },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const unreadOnly = searchParams.get("unreadOnly") === "true"
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const result =await fetch(`${process.env.BACKEND_URL}/api/public/recentNotifications`)

    if(!result.ok){
      return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
    }

    const notifications = await result.json();

    return NextResponse.json({
      notifications
    })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { notificationId, markAsRead } = await request.json()

    if (!notificationId) {
      return NextResponse.json({ error: "Notification ID is required" }, { status: 400 })
    }

    const notification = mockNotifications.find((n) => n.id === notificationId)
    if (!notification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 })
    }

    // Update the notification
    notification.read = markAsRead
    notification.updatedAt = new Date().toISOString()

    return NextResponse.json({ success: true, notification })
  } catch (error) {
    console.error("Error updating notification:", error)
    return NextResponse.json({ error: "Failed to update notification" }, { status: 500 })
  }
}
