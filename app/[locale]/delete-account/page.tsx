"use client";

import { Suspense } from "react"
// import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, ArrowLeft, Shield, Clock, Database } from "lucide-react"
import Link from "next/link"
import DeleteAccountForm from "./delete-account-form"
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

interface PageProps {
  searchParams: { email?: string; confirmed?: string }
}

export default function DeleteAccountPage({ searchParams }: PageProps) {
  const email = searchParams.email
  const isConfirmed = searchParams.confirmed === "true"
 const t = useTranslations("DeleteAccount");
 const router = useRouter();
  console.log(t);
  // Redirect to home if no email provided
  if (!email) {
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back to Profile */}
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("backToProfile")}
        </Link>

        <div className="space-y-6">
          {/* Warning Header */}
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-red-800 dark:text-red-200">
                {t("deleteAccount")}
              </CardTitle>
              <CardDescription className="text-red-600 dark:text-red-400">
                {t("deleteWarning")}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                {t("accountInformation")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  {t("accountToBeDeleted")}
                </p>
                <p className="font-mono text-lg font-semibold">{email}</p>
              </div>
            </CardContent>
          </Card>

          {/* What will be deleted */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                {t("whatWillBeDeleted")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>{t("profileInfo")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>{t("savedProperties")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>{t("inquiriesHistory")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>{t("notifications")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>{t("rewards")}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Notice */}
          <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
            <Clock className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              <strong>{t("important")}</strong> {t("importantNotice")}
            </AlertDescription>
          </Alert>

          {/* Confirmation and Delete Form */}
          <Suspense fallback={<div>{t("loading")}</div>}>
            <DeleteAccountForm email={email} isConfirmed={isConfirmed} />
          </Suspense>

          {/* Support Contact */}
          <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  {t("needHelp")}
                </h3>
                <p className="text-blue-600 dark:text-blue-300 text-sm mb-4">
                  {t("supportText")}
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {t("contactSupport")}
                  </Link>
                  <Link
                    href="mailto:support@anantarealty.com"
                    className="inline-flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    {t("emailUs")}
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
