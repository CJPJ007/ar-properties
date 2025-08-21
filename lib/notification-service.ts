// lib/notification-service.ts
import type { Notification as AppNotification } from "./interfaces";

export class NotificationService {
  private static instance: NotificationService;
  private permission: NotificationPermission = "default";

  private constructor() {
    this.initializePermission();
    this.registerServiceWorker();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private async initializePermission() {
    if ("Notification" in window) {
      this.permission = Notification.permission;
    }
  }

  private async registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      try {
        await navigator.serviceWorker.register("/sw.js");
        console.log("Service Worker registered");
      } catch (err) {
        console.error("Service Worker registration failed:", err);
      }
    }
  }

  public async requestPermission(): Promise<NotificationPermission> {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications");
      return "denied";
    }

    if (this.permission === "default") {
      this.permission = await Notification.requestPermission();
    }

    return this.permission;
  }

  public async showNotification(notification: AppNotification): Promise<void> {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications");
      return;
    }

    if (this.permission !== "granted") {
      console.warn("Notification permission not granted");
      return;
    }

    if (!navigator.serviceWorker?.ready) {
      console.warn("Service Worker not ready yet");
      return;
    }

    const registration = await navigator.serviceWorker.ready;

    const options: NotificationOptions = {
      body: notification.message,
      icon: "/placeholder-logo.png",
      badge: "/placeholder-logo.png",
  tag: `${notification.id}-${Date.now()}`, // unique
      data: {
        notificationId: notification.id,
        actionUrl: notification.actionUrl,
      },
      requireInteraction: false,
      silent: false,
    };

    registration.addEventListener("click", (event) => {
        console.log("Notification clicked:", notification.id)
        event.preventDefault()
        window.focus()
        if (notification.actionUrl) {
          window.open(notification.actionUrl, "_blank")
        }
        // registration.close();
      });
    registration.showNotification(notification.title, options);
  }

  public getPermissionStatus(): NotificationPermission {
    return this.permission;
  }

  public isSupported(): boolean {
    if(
      typeof window=== "undefined"
    )
    return false;
    return window && "Notification" in window && "serviceWorker" in navigator;
  }
}
