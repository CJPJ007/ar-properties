"use client"

import { useEffect, useState } from "react"
import { HelpCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

type Faq = {
  id: number
  question: string
  answer: string
}

export default function FaqList() {
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/api/faqs", { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to load FAQs")
        const data: Faq[] = await res.json()
        if (!cancelled) setFaqs(data)
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Something went wrong")
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm transition-colors duration-300">
      <CardHeader className="flex flex-row items-center gap-2">
        <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <CardTitle className="text-xl">Frequently Asked Questions</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading FAQs...
          </div>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : faqs.length === 0 ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">No FAQs available right now.</p>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={`faq-${faq.id}`} className="border-slate-200 dark:border-slate-700">
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-slate-600 dark:text-slate-300">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  )
}
