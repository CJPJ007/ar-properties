"use client"

import { motion } from "framer-motion"
import { Award, Heart, Handshake } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ChatBot from "@/components/chatbot"
import { Slider } from "@/components/slider"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import InquiryModal from "@/components/inquiry-modal"
import InquiryForm from "@/components/inquiry-form"
import { useTranslations } from "next-intl"
import { set } from "date-fns"
import Link from "next/link"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const iconMap: Record<string, any> = {
  heart: Heart,
  award: Award,
  handshake: Handshake,
}

export default function AboutPage() {
  const [story, setStory] = useState<string | null>(null)
  const [storyLoading, setStoryLoading] = useState(true)
  const [team, setTeam] = useState<any[]>([])
  const [teamLoading, setTeamLoading] = useState(true)
  const [values, setValues] = useState<any[]>([])
  const [valuesLoading, setValuesLoading] = useState(true)
  const [mdStory, setMdStory] = useState<string | null>(null);
  useEffect(() => {
    fetch('/api/public/company-details/about-us')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
        const storySection = data.find((c) => c.section === "our_story");
        const mdStorySection = data.find((c) => c.section === "md_story");
        setStory(storySection?.content)
        setMdStory(mdStorySection?.content || null);
        }
      })
      .finally(() => setStoryLoading(false))
    fetch('/api/public/company-details/team-members')
      .then(res => res.json())
      .then(data => setTeam(Array.isArray(data) ? data : []))
      .finally(() => setTeamLoading(false))
    fetch('/api/public/company-details/company-values')
      .then(res => res.json())
      .then(data => setValues(Array.isArray(data) ? data : []))
      .finally(() => setValuesLoading(false))
  }, [])

    const t = useTranslations("About");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 dark:from-slate-900 to-blue-50 dark:to-blue-900 pb-16 md:pb-0 text-slate-900 dark:text-slate-100">
      <Header />

      {/* Hero Section */}
      <Slider className="w-full h-[220px] md:h-[300px]" showSearch={false} page="About" />

      {/* Our Story */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t("story.title")}</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mb-6" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div>
              {storyLoading ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="animate-spin w-8 h-8 text-blue-400" />
                </div>
              ) : story ? (
                <div
                  className="prose prose-lg max-w-none dark:prose-invert dark:text-slate-50"
                  dangerouslySetInnerHTML={{ __html: story }}
                />
              ) : (
                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t("story.noStory")}
                </p>
              )}
            </motion.div>

            <motion.div className="relative">
              <img
                src="https://images.unsplash.com/photo-1600585153490-76fb20a32601?auto=format&fit=crop&w=600&q=80"
                alt={t("story.imageAlt")}
                className="rounded-lg shadow-2xl w-full h-80 object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Us Markdown Link */}
      <section className="flex justify-center py-4">
        <Link
          href="/md"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-lg shadow hover:from-amber-600 hover:to-orange-600 transition-all duration-300"
        >
          {t("mdLink")}
        </Link>
      </section>

      {/* Our Team */}
      <section className="py-20 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t("team.title")}</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mb-6" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamLoading ? (
              <div className="col-span-full flex justify-center items-center h-32">
                <Loader2 className="animate-spin w-8 h-8 text-blue-400" />
              </div>
            ) : team.length > 0 ? (
              team.map((member, index) => (
                <TeamCard key={member.id || member.name} member={member} index={index} />
              ))
            ) : (
              <p className="col-span-full text-center text-slate-500 dark:text-slate-400">{t("team.noMembers")}</p>
            )}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t("values.title")}</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mb-6" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valuesLoading ? (
              <div className="col-span-full flex justify-center items-center h-32">
                <Loader2 className="animate-spin w-8 h-8 text-blue-400" />
              </div>
            ) : values.length > 0 ? (
              values.map((value, index) => (
                <ValueCard key={value.id || value.title} value={value} index={index} />
              ))
            ) : (
              <p className="col-span-full text-center text-slate-500 dark:text-slate-400">{t("values.noValues")}</p>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t("contact.title")}</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mb-6" />
          </motion.div>

          <InquiryForm
            showAppointmentDate={false}
            className="bg-transparent dark:bg-slate-900/20 backdrop-blur-sm text-black dark:text-white border-2 border-white/20 dark:border-slate-700 p-4 rounded-md"
          />
        </div>
      </section>

      <Footer />
    </div>

  )
}

function TeamCard({ member, index }: { member: any; index: number }) {
  return (
   <motion.div
  variants={fadeInUp}
  transition={{ delay: index * 0.1 }}
  whileHover={{ y: -10, rotateX: 5, rotateY: 5 }}
  className="group"
>
  <Card className="overflow-hidden bg-white dark:bg-slate-900 shadow-lg dark:shadow-gray-800 hover:shadow-2xl transition-all duration-500 transform-gpu perspective-1000">
    <div className="relative overflow-hidden">
      <img
        src={`/images/${member.imageUrl}` || "/placeholder.svg"}
        alt={member.name}
        className="w-full h-64 transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
        <div className="text-white">
          <h3 className="text-lg font-bold">{member.name}</h3>
          <p className="text-blue-200">{member.position}</p>
        </div>
      </div>
    </div>
    <CardContent className="p-6">
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">{member.name}</h3>
      <p className="text-amber-600 dark:text-amber-400 font-medium mb-3">{member.position}</p>
      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{member.description}</p>
    </CardContent>
  </Card>
</motion.div>

  )
}

function ValueCard({ value, index }: { value: any; index: number }) {
  const Icon = iconMap[(value.iconName || '').toLowerCase()] || Heart
  return (
    <motion.div
  variants={fadeInUp}
  transition={{ delay: index * 0.1 }}
  whileHover={{ y: -10, rotateX: 5, rotateY: 5 }}
  className="group"
>
  <Card className="h-full bg-white dark:bg-slate-900 shadow-lg dark:shadow-gray-800 hover:shadow-2xl transition-all duration-500 transform-gpu perspective-1000">
    <CardContent className="p-8 text-center">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300"
        style={{ background: value.iconColor || '#6366f1' }}
      >
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">{value.title}</h3>
      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{value.description}</p>
    </CardContent>
  </Card>
</motion.div>

  )
}
