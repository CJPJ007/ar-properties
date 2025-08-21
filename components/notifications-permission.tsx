"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, BellOff, Check, X } from "lucide-react"
import { useNotificationContext } from "@/components/providers/notification-provider"

export default function NotificationPermission() {
  const { permissionStatus, requestPermission, isSupported } = useNotificationContext()
  const [requesting, setRequesting] = useState(false)

  const handleRequestPermission = async () => {
    setRequesting(true)
    try {
      await requestPermission()
    } finally {
      setRequesting(false)
    }
  }

  if (!isSupported) {
    return (
      <Card className="mb-4 border-yellow-200 bg-yellow-50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <BellOff className="h-5 w-5 text-yellow-600" />
            <CardTitle className="text-base">Notifications Not Supported</CardTitle>
          </div>
          <CardDescription>Your browser doesn't support push notifications.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (permissionStatus === "granted") {
    return (
      <Card className="mb-4 border-green-200 bg-green-50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600" />
            <CardTitle className="text-base">Notifications Enabled</CardTitle>
          </div>
          <CardDescription>You'll receive browser notifications for important updates.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (permissionStatus === "denied") {
    return (
      <Card className="mb-4 border-red-200 bg-red-50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <X className="h-5 w-5 text-red-600" />
            <CardTitle className="text-base">Notifications Blocked</CardTitle>
          </div>
          <CardDescription>Please enable notifications in your browser settings to receive updates.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="mb-4 border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-base">Enable Notifications</CardTitle>
        </div>
        <CardDescription>Get notified about inquiries, site visits, and property updates.</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Button onClick={handleRequestPermission} disabled={requesting} size="sm">
          {requesting ? "Requesting..." : "Enable Notifications"}
        </Button>
      </CardContent>
    </Card>
  )
}
