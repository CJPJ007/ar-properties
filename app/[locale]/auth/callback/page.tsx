// app/auth/callback/page.tsx (Server Component)

import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const session = await getServerSession()

  if (!session) {
    redirect("/auth/login")
  }

  const referralCode = searchParams?.ref as string | undefined
  console.log("Referral Code : ",referralCode);
  if (referralCode && session.user?.email) {
    try {
      await fetch(`${process.env.BACKEND_URL}/api/public/referrals/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          referredEmail: session.user.email,
          referredName: session.user.name || "",
          referredMobile: (session.user as any).mobile || "",
          referralCode: referralCode,
          status: "completed",
          referralAmount: 1000,
        }),
      })
    } catch (error) {
      console.error("Error processing referral:", error)
    }
  }

  // Always redirect home after processing
  redirect("/")
}
