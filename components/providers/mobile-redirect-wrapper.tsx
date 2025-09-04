"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function MobileRedirectWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isMobile = useMediaQuery("(max-width:768px)");

  useEffect(() => {
    // Wait until session is fully loaded
    if (status === "loading") return;

    if (isMobile && !pathname.includes("/auth/login") && status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [router, status, pathname, isMobile]);

  return <>{children}</>;
}
