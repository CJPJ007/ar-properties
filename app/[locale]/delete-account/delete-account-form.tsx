"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Trash2, CheckCircle, XCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useTranslations } from "next-intl"
import { signOut } from "next-auth/react"

interface DeleteAccountFormProps {
  email: string
  isConfirmed: boolean
}

export default function DeleteAccountForm({ email, isConfirmed }: DeleteAccountFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [confirmationText, setConfirmationText] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isDeleted, setIsDeleted] = useState(false)
  const [error, setError] = useState("")

  const confirmationPhrase = "DELETE MY ACCOUNT"
  const isConfirmationValid = confirmationText === confirmationPhrase

  const handleDeleteAccount = async () => {
    if (!isConfirmationValid || !agreedToTerms) {
      setError("Please complete all confirmation steps")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/deleteAccount/${encodeURIComponent(email)}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete account")
      }

      setIsDeleted(true)
      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
      })

      // Redirect to home page after 3 seconds
      setTimeout(() => {
        signOut({ callbackUrl: "/" });
        
      }, 3000)
    } catch (error) {
      console.error("Error deleting account:", error)
      setError(error instanceof Error ? error.message : "Failed to delete account")
      toast({
        title: "Deletion Failed",
        description: "There was an error deleting your account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

const t = useTranslations("confirmDeletion");
  if (isDeleted) {
    return (
          <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
      <CardContent className="pt-6">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
            {t("title2")}
          </h3>
          <p className="text-green-600 dark:text-green-300 mb-4">
            {t("message")}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            {t("redirect")}
          </p>
        </div>
      </CardContent>
    </Card>

    )
  }

  return (
    <Card className="border-red-200 dark:border-red-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200">
          <Trash2 className="w-5 h-5" />
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Step 1 */}
        <div className="space-y-2">
          <Label htmlFor="confirmation" className="text-sm font-medium">
            {t("step1")}{" "}
            <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-red-600">
              {confirmationPhrase}
            </span>{" "}
            {t("toConfirm")}
          </Label>
          <Input
            id="confirmation"
            type="text"
            placeholder={t("placeholder")}
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            className={`font-mono ${
              confirmationText && !isConfirmationValid
                ? "border-red-300 focus:border-red-500"
                : confirmationText && isConfirmationValid
                ? "border-green-300 focus:border-green-500"
                : ""
            }`}
          />
          {confirmationText && !isConfirmationValid && (
            <p className="text-sm text-red-600">{t("mismatch")}</p>
          )}
          {isConfirmationValid && (
            <p className="text-sm text-green-600">✓ {t("match")}</p>
          )}
        </div>

        {/* Step 2 */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">{t("step2")}</Label>
          <div className="flex items-start space-x-3">
            <Checkbox
              id="agreement"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
            />
            <Label
              htmlFor="agreement"
              className="text-sm leading-relaxed cursor-pointer"
            >
              {t("agreement.text")}
              <ul className="mt-2 ml-4 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                <li>• {t("agreement.item1")}</li>
                <li>• {t("agreement.item2")}</li>
                <li>• {t("agreement.item3")}</li>
                <li>• {t("agreement.item4")}</li>
              </ul>
            </Label>
          </div>
        </div>

        {/* Error */}
        {error && (
          <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Delete button */}
        <div className="pt-4 border-t">
          <Button
            onClick={handleDeleteAccount}
            disabled={!isConfirmationValid || !agreedToTerms || isLoading}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                {t("deleting")}
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                {t("deleteButton")}
              </>
            )}
          </Button>
          <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-2">
            {t("cannotUndo")}
          </p>
        </div>
      </CardContent>
    </Card>

  )
}
