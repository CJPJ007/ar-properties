"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"
import InquiryForm from "@/components/inquiry-form"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" as const },
}

export default function InquiryDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-16 md:pb-0">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 px-4 mt-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-4">
              Inquiry Form Demo
            </h1>
            <p className="text-xl text-slate-600">
              See how the reusable InquiryForm component works with different configurations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Basic Contact Form */}
            <motion.div {...fadeInUp}>
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-slate-800">
                    Basic Contact Form
                  </CardTitle>
                  <p className="text-slate-600">
                    Standard contact form without property or appointment date
                  </p>
                </CardHeader>
                <CardContent>
                  <InquiryForm />
                </CardContent>
              </Card>
            </motion.div>

            {/* Property Inquiry Form */}
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-slate-800">
                    Property Inquiry Form
                  </CardTitle>
                  <p className="text-slate-600">
                    Form with property field (disabled) and appointment date
                  </p>
                </CardHeader>
                <CardContent>
                  <InquiryForm 
                    property="Luxury Villa in Downtown"
                    showAppointmentDate={true}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Property Only Form */}
            <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-slate-800">
                    Property Only Form
                  </CardTitle>
                  <p className="text-slate-600">
                    Form with property field but no appointment date
                  </p>
                </CardHeader>
                <CardContent>
                  <InquiryForm 
                    property="Modern Apartment Complex"
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Appointment Only Form */}
            <motion.div {...fadeInUp} transition={{ delay: 0.6 }}>
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-slate-800">
                    Appointment Form
                  </CardTitle>
                  <p className="text-slate-600">
                    Form with appointment date but no specific property
                  </p>
                </CardHeader>
                <CardContent>
                  <InquiryForm 
                    showAppointmentDate={true}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 