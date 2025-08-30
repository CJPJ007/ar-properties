"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNotificationContext } from "@/components/providers/notifications-provider"
import { formatDistanceToNow } from "date-fns"

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, permissionStatus, requestPermission } = useNotificationContext()

  const handleNotificationClick = async (notificationId: string, actionUrl?: string) => {
    await markAsRead(notificationId)
    if (actionUrl) {
      window.location.href = actionUrl
    }
  }

  const handleEnableNotifications = async () => {
    await requestPermission()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && <span className="text-xs text-muted-foreground">{unreadCount} unread</span>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {permissionStatus !== "granted" && (
          <>
            <DropdownMenuItem onClick={handleEnableNotifications} className="text-blue-600">
              <Bell className="mr-2 h-4 w-4" />
              Enable Browser Notifications
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {notifications.length === 0 ? (
          <DropdownMenuItem disabled>
            <span className="text-muted-foreground">No notifications</span>
          </DropdownMenuItem>
        ) : (
          <>
            {notifications.slice(0, 5).map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                onClick={() => handleNotificationClick(notification.id, notification.actionUrl)}
                className={`cursor-pointer ${!notification.read ? "bg-blue-50" : ""}`}
              >
                <div className="flex flex-col space-y-1 w-full">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{notification.title}</span>
                    {!notification.read && <div className="h-2 w-2 bg-blue-500 rounded-full" />}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}
            {notifications.length > 5 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => (window.location.href = "/profile?tab=notifications")}>
                  <span className="text-blue-600">View all notifications</span>
                </DropdownMenuItem>
              </>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
