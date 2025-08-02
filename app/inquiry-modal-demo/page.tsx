"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"
import InquiryModal from "@/components/inquiry-modal"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" as const },
}

export default function InquiryModalDemoPage() {
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
              Inquiry Modal Demo
            </h1>
            <p className="text-xl text-slate-600">
              See how the InquiryModal component works with different configurations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Basic Modal */}
            <motion.div {...fadeInUp}>
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-slate-800">
                    Basic Modal
                  </CardTitle>
                  <p className="text-slate-600">
                    Simple contact modal with default settings
                  </p>
                </CardHeader>
                <CardContent className="text-center">
                  <InquiryModal 
                    buttonText="Contact Us"
                    modalTitle="Get in Touch"
                    modalDescription="We'd love to hear from you!"
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Property Inquiry Modal */}
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-slate-800">
                    Property Inquiry Modal
                  </CardTitle>
                  <p className="text-slate-600">
                    Modal with property field and appointment date
                  </p>
                </CardHeader>
                <CardContent className="text-center">
                  <InquiryModal 
                    buttonText="Inquire About Property"
                    buttonVariant="outline"
                    modalTitle="Property Inquiry"
                    modalDescription="Tell us about your interest in this property."
                    property="Luxury Villa in Downtown"
                    showAppointmentDate={true}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Consultation Modal */}
            <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-slate-800">
                    Consultation Modal
                  </CardTitle>
                  <p className="text-slate-600">
                    Large button with appointment scheduling
                  </p>
                </CardHeader>
                <CardContent className="text-center">
                  <InquiryModal 
                    buttonText="Schedule Consultation"
                    buttonSize="lg"
                    buttonClassName="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                    modalTitle="Schedule a Consultation"
                    modalDescription="Tell us about your real estate needs and we'll schedule a personalized consultation."
                    showAppointmentDate={true}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Service Inquiry Modal */}
            <motion.div {...fadeInUp} transition={{ delay: 0.6 }}>
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-slate-800">
                    Service Inquiry Modal
                  </CardTitle>
                  <p className="text-slate-600">
                    Small button for service inquiries
                  </p>
                </CardHeader>
                <CardContent className="text-center">
                  <InquiryModal 
                    buttonText="Learn More"
                    buttonSize="sm"
                    buttonVariant="secondary"
                    modalTitle="Property Management Services"
                    modalDescription="Tell us about your interest in our property management services."
                    property="Property Management"
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Custom Submit Handler Example */}
          <motion.div {...fadeInUp} transition={{ delay: 0.8 }} className="mt-12">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800">
                  Custom Submit Handler
                </CardTitle>
                <p className="text-slate-600">
                  Modal with custom submit logic (check console for data)
                </p>
              </CardHeader>
              <CardContent className="text-center">
                <InquiryModal 
                  buttonText="Custom Submit"
                  buttonVariant="destructive"
                  modalTitle="Custom Form"
                  modalDescription="This form has custom submit handling."
                  onSubmit={async (data) => {
                    console.log("Custom submit handler:", data)
                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 1000))
                    alert("Custom submit completed! Check console for data.")
                  }}
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 