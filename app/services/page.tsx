"use client"

import { motion } from "framer-motion"
import { Home, TrendingUp, Calculator, Key, Search, Users, DollarSign, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ChatBot from "@/components/chatbot"
import { Slider } from "@/components/slider"
import InquiryModal from "@/components/inquiry-modal"

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

const services = [
  {
    icon: Home,
    title: "Property Buying",
    description:
      "Our expert agents guide you through every step of the home-buying process, from property selection to closing the deal.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
    features: ["Market Analysis", "Property Tours", "Negotiation Support", "Closing Assistance"],
  },
  {
    icon: TrendingUp,
    title: "Property Selling",
    description:
      "Maximize your property's value with our strategic marketing and negotiation expertise to ensure a smooth sale.",
    image: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&w=800&q=80",
    features: ["Property Valuation", "Marketing Strategy", "Professional Photography", "Open House Events"],
  },
  {
    icon: Calculator,
    title: "Real Estate Investment",
    description: "Leverage our market insights and analysis to make informed investment decisions for maximum returns.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80",
    features: ["ROI Analysis", "Market Research", "Portfolio Management", "Investment Strategy"],
  },
  {
    icon: Key,
    title: "Property Management",
    description: "Let us handle the day-to-day operations of your rental properties, ensuring hassle-free management.",
    image: "https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?auto=format&fit=crop&w=800&q=80",
    features: ["Tenant Screening", "Rent Collection", "Maintenance Coordination", "Financial Reporting"],
  },
  {
    icon: Search,
    title: "Home Valuation",
    description:
      "Get an accurate assessment of your property's market value with our comprehensive valuation services.",
    image: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&w=800&q=80",
    features: ["Comparative Market Analysis", "Property Inspection", "Market Trends Report", "Valuation Certificate"],
  },
  {
    icon: Users,
    title: "Virtual Tours",
    description: "Explore properties from the comfort of your home with our immersive 360° virtual property tours.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
    features: ["360° Photography", "Interactive Floor Plans", "Virtual Staging", "Online Viewing"],
  },
  {
    icon: DollarSign,
    title: "Mortgage Consulting",
    description:
      "Navigate the mortgage process with ease through our partnerships with trusted lenders and expert advice.",
    image: "https://images.unsplash.com/photo-1554224154-26032fced8bd?auto=format&fit=crop&w=800&q=80",
    features: ["Loan Pre-approval", "Rate Comparison", "Application Support", "Closing Coordination"],
  },
  {
    icon: MapPin,
    title: "Relocation Services",
    description:
      "Simplify your move with our tailored relocation support, including neighborhood insights and logistics.",
    image: "https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?auto=format&fit=crop&w=800&q=80",
    features: ["Area Research", "School Information", "Moving Coordination", "Local Connections"],
  },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-16 md:pb-0">
      <Header />

      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden mt-0 md:mt-16">
        <div className="absolute inset-0 z-0">
          <Slider/>
        </div>

        <motion.div
          className="relative z-10 text-center text-white px-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Our Comprehensive Real Estate Services</h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Discover how Ananta Realty can assist you in finding, buying, selling, or investing in your dream property
            with our expert services
          </p>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Our Services</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mb-6" />
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              From buying and selling to investment and management, we provide comprehensive real estate solutions
              tailored to your needs
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {services.map((service, index) => (
              <ServiceCard key={service.title} service={service} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Contact us today to discuss your real estate needs and discover how our expert team can help you achieve
              your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <InquiryModal
                buttonText="Schedule Consultation"
                buttonSize="lg"
                buttonClassName="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                modalTitle="Schedule a Consultation"
                modalDescription="Tell us about your real estate needs and we'll schedule a personalized consultation."
                showAppointmentDate={true}
              />
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold transition-all duration-300 bg-transparent"
              >
                View Properties
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      {/* <ChatBot /> */}
    </div>
  )
}

function ServiceCard({ service, index }: { service: any; index: number }) {
  const Icon = service.icon

  return (
    <motion.div
      variants={fadeInUp}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -10, rotateX: 5, rotateY: 5 }}
      className="group h-full"
    >
      <Card className="h-full overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform-gpu perspective-1000">
        <div className="relative overflow-hidden">
          <img
            src={service.image || "/placeholder.svg"}
            alt={service.title}
            className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-4 left-4 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        <CardContent className="flex-grow p-6 flex flex-col h-full">
          <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
            {service.title}
          </h3>
          <p className="text-slate-600 mb-4 leading-relaxed">{service.description}</p>

          <div className="mb-6">
            <h4 className="font-semibold text-slate-800 mb-2">Key Features:</h4>
            <ul className="space-y-1">
              {service.features.map((feature: string, idx: number) => (
                <li key={idx} className="text-sm text-slate-600 flex items-center">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300 transform hover:scale-105"></Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
