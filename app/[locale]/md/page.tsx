"use client"

import { motion } from "framer-motion"
import { Mail, Phone, Facebook, Twitter, Instagram, Linkedin, CheckSquare, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ChatBot from "@/components/chatbot"
import Link from "next/link"
import { useEffect, useState } from "react"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const experiences = [
  {
    title: "Sales and Acquisition Success",
    description:
      "Over the years, I have played a pivotal role in facilitating numerous successful real estate transactions, including property sales, acquisitions, and leasing agreements. My ability to understand market dynamics and leverage opportunities has led to consistently positive outcomes for both clients and the organizations I have been associated with.",
  },
  {
    title: "Client Relationship Management",
    description:
      "Building and maintaining strong client relationships has been a cornerstone of my approach. I take pride in understanding the unique needs of clients, providing tailored solutions, and ensuring a smooth and transparent transaction process. This commitment to client satisfaction has resulted in a high rate of repeat business and referrals.",
  },
  {
    title: "Market Research and Analysis",
    description:
      "A keen interest in market trends and an analytical mindset have empowered me to conduct in-depth market research. This has not only facilitated informed decision-making for clients but has also contributed to the strategic positioning of properties in the competitive real estate landscape.",
  },
  {
    title: "Team Collaboration",
    description:
      "I have had the privilege of working collaboratively with diverse and skilled teams, fostering an environment of innovation and mutual support. Effective communication and teamwork have been integral to the success of various projects, ensuring seamless coordination from initial concept to final execution.",
  },
]

const expertiseAreas = [
  "Residential and Commercial Real Estate",
  "Property Valuation and Pricing",
  "Market Research and Analysis",
  "Client Relationship Management",
  "Negotiation and Deal Closure",
  "Team Leadership and Collaboration",
  "Regulatory Compliance and Legal Understanding",
]

export default function ManagingDirectorPage() {
    const [mdStory, setMdStory] = useState<string | null>(null);
  
    useEffect(() => {
        fetch('/api/public/company-details/about-us')
          .then(res => res.json())
          .then(data => {
            if (Array.isArray(data) && data.length > 0) {
            const mdStorySection = data.find((c) => c.section === "md_story");
            setMdStory(mdStorySection?.content || null);
            }
          })
      }, [])
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Back Navigation */}
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to About
          </Link>

          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-slate-800 dark:text-white mb-4">Managing Director</h1>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20">
        <div dangerouslySetInnerHTML={{__html:mdStory}}></div>
      </section>

      <Footer />
      {/* <ChatBot /> */}
    </div>
  )
}
