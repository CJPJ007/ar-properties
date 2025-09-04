"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Home,
  TrendingUp,
  Calculator,
  Key,
  Search,
  Users,
  DollarSign,
  MapPin,
  Building,
  Briefcase,
  Shield,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Slider } from "@/components/slider"
import InquiryModal from "@/components/inquiry-modal"
import Link from "next/link"
import { useTranslations } from "next-intl"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" as const },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

// Icon mapping for different service types
const iconMap: { [key: string]: any } = {
  home: Home,
  trending: TrendingUp,
  calculator: Calculator,
  key: Key,
  search: Search,
  users: Users,
  dollar: DollarSign,
  map: MapPin,
  building: Building,
  briefcase: Briefcase,
  shield: Shield,
  file: FileText,
}

interface Service {
  id: number
  title: string
  description: string
  shortDescription: string
  imageUrl: string
  iconName: string
  keyFeatures: string
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/public/company-details/services")

      if (!response.ok) {
        throw new Error("Failed to fetch services")
      }

      const data = await response.json()
      setServices(data)
    } catch (error) {
      console.error("Error fetching services:", error)
      setError("Failed to load services. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-16 md:pb-0">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Unable to Load Services</h2>
            <p className="text-slate-600 mb-6">{error}</p>
            <Button onClick={fetchServices} className="bg-blue-600 hover:bg-blue-700">
              Try Again
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
  const t = useTranslations("Services");

  return (
<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 pb-16 md:pb-0">
      <Header />

      {/* Hero Section */}
      <Slider className="w-full h-[220px] md:h-[387px]" showSearch={false} page="Services" />

      {/* Services Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-4">
              {t("section.title")}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mb-6" />
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              {t("section.description")}
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <ServiceCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {services.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 to-blue-900 text-white dark:from-slate-800 dark:to-blue-950">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{t("cta.title")}</h2>
            <p className="text-xl text-blue-100 dark:text-blue-200 mb-8 max-w-2xl mx-auto">
              {t("cta.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <InquiryModal
                buttonText={t("cta.scheduleButton")}
                buttonSize="lg"
                buttonClassName="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                modalTitle={t("cta.modalTitle")}
                modalDescription={t("cta.modalDescription")}
                showAppointmentDate={true}
                className="text-black dark:text-slate-100"
              />
              <Link href={"/properties"} passHref>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white dark:text-slate-200 hover:bg-white/10 dark:hover:bg-slate-700/30 px-8 py-4 text-lg font-semibold transition-all duration-300 bg-transparent"
                >
                  {t("cta.viewProperties")}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>

  )
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  // Get icon from iconMap or default to Briefcase
  const Icon = iconMap[service.iconName?.toLowerCase()] || Briefcase

  // Parse key features from string (assuming comma-separated)
  const features = service.keyFeatures ? service.keyFeatures.split("#FEATURES#").map((f) => f.trim()) : []

  return (
    <motion.div
  variants={fadeInUp}
  transition={{ delay: index * 0.1 }}
  whileHover={{ y: -10, rotateX: 5, rotateY: 5 }}
  className="group h-full"
>
  <Card className="h-full overflow-hidden bg-white dark:bg-slate-800 shadow-lg dark:shadow-gray-900 hover:shadow-2xl dark:hover:shadow-gray-700 transition-all duration-500 transform-gpu perspective-1000">
    <div className="relative overflow-hidden">
      <img
        src={`/images/${service.imageUrl}` || "/placeholder.svg?height=300&width=400"}
        alt={service.title}
        className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
        onError={(e) => {
          const target = e.target as HTMLImageElement
          target.src = "/placeholder.svg?height=300&width=400"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute top-4 left-4 w-12 h-12 bg-white/90 dark:bg-slate-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
      </div>
    </div>

    <CardContent className="flex-grow p-6 flex flex-col">
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {service.title}
      </h3>
      <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">{service.shortDescription || service.description}</p>

      {features.length > 0 && (
        <div className="mb-6 flex-grow">
          <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">Key Features:</h4>
          <ul className="space-y-1">
            {features.slice(0, 4).map((feature: string, idx: number) => (
              <li key={idx} className="text-sm text-slate-600 dark:text-slate-300 flex items-center">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2 flex-shrink-0" />
                <span className="line-clamp-1">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-auto">
        <InquiryModal
          buttonText="Contact"
          buttonSize="lg"
          buttonClassName="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white dark:text-white transition-all duration-300 transform hover:scale-105"
          modalTitle={`Inquiry about ${service.title}`}
          modalDescription={service.description}
          showAppointmentDate={true}
          className="text-black dark:text-slate-100"
        />
      </div>
    </CardContent>
  </Card>
</motion.div>

  )
}

function ServiceCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden bg-white dark:bg-slate-800 shadow-lg dark:shadow-gray-900 animate-pulse">
  <Skeleton className="w-full h-48 bg-slate-200 dark:bg-slate-700" />
  <CardContent className="p-6">
    <Skeleton className="h-6 w-3/4 mb-3 bg-slate-300 dark:bg-slate-600" />
    <Skeleton className="h-4 w-full mb-2 bg-slate-300 dark:bg-slate-600" />
    <Skeleton className="h-4 w-2/3 mb-4 bg-slate-300 dark:bg-slate-600" />

    <div className="mb-6">
      <Skeleton className="h-5 w-1/3 mb-2 bg-slate-300 dark:bg-slate-600" />
      <div className="space-y-1">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-4 w-full bg-slate-300 dark:bg-slate-600" />
        ))}
      </div>
    </div>

    <Skeleton className="h-10 w-full bg-blue-300 dark:bg-blue-600" />
  </CardContent>
</Card>

  )
}
