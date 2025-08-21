// public/sw.js
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installed");
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activated");
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const actionUrl = event.notification.data?.actionUrl;
  if (actionUrl) {
    event.waitUntil(
      clients.openWindow(actionUrl)
    );
  }
});
