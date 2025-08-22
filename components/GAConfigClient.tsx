// components/GoogleAnalytics.tsx
"use client";
import { useEffect } from "react";

export default function GoogleAnalytics({ userId }: { userId: number }) {
  useEffect(() => {
    const loadGA = async () => {
      // Fetch GA Tracking ID from backend
      const res = await fetch(`/api/ga-config?userId=${userId}`);
      const data = await res.json();
      const trackingId = data.trackingId;
      if (!trackingId) return;

      // Inject GA script
      const script = document.createElement("script");
      script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
      script.async = true;
      document.head.appendChild(script);

      // Initialize GA
      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) { window.dataLayer.push(args); }
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', trackingId, { page_path: window.location.pathname });
    };

    loadGA();
  }, [userId]);

  return null;
}
