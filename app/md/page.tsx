"use client"

import { motion } from "framer-motion"
import { Mail, Phone, Facebook, Twitter, Instagram, Linkedin, CheckSquare, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ChatBot from "@/components/chatbot"
import Link from "next/link"

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
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Profile Card */}
            <motion.div className="lg:col-span-1" variants={fadeInUp} initial="initial" animate="animate">
              <Card className="sticky top-24 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0">
                <CardContent className="p-6">
                  {/* Profile Photo */}
                  <div className="relative mb-6">
                    <div className="w-full aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
                      <img
                        src="/md.jpg"
                        alt="KATTA SUBRAMANYAM"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                        Managing Director
                      </div>
                    </div>
                  </div>

                  {/* Name and Credentials */}
                  <div className="text-center mb-6 mt-8">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">KATTA SUBRAMANYAM</h3>
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-1">
                      M.B.A, M.A. Rural Development (P.hD)
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                      <strong>Certified MCSE, ITIL, ISMS, ISO 9001 27001 Lead Auditor</strong>
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Ex: Software Engineer, 12+ Years of IT Experience
                    </p>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-3 mb-6">
                    <a
                      href="mailto:Kattasubramanyam@gmail.com"
                      className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      <span className="break-all">Kattasubramanyam@gmail.com</span>
                    </a>
                    <a
                      href="tel:+917780422692"
                      className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      <span>+91-7780422692</span>
                    </a>
                  </div>

                  {/* Social Links */}
                  <div className="flex justify-center gap-3">
                    <a
                      href="https://www.facebook.com/kattasubramanyam?mibextid=ZbWKwL"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-sky-500 hover:bg-sky-600 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-pink-600 hover:bg-pink-700 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-blue-700 hover:bg-blue-800 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Content */}
            <motion.div className="lg:col-span-3" variants={staggerContainer} initial="initial" animate="animate">
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0">
                <CardContent className="p-8">
                  {/* About Me Section */}
                  <motion.div variants={fadeInUp} className="mb-12">
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">About Me</h2>

                    <div className="prose prose-lg max-w-none text-slate-600 dark:text-slate-300 space-y-4">
                      <p>Dear Valued Investors and Future Homeowners,</p>
                      <p>
                        I am delighted to extend a warm welcome to you on behalf of Ananta Reality. As the Managing
                        Director of our esteemed company, it gives me great pleasure to share with you the unique
                        opportunities awaiting you in our residential plot offerings.
                      </p>
                      <p>
                        At Ananta Reality, we don't just sell land; we invite you to become part of a community where
                        your dreams find a foundation. Our residential plots are not mere parcels; they are canvases
                        upon which you can paint the vision of your ideal home and lifestyle.
                      </p>
                      <p>
                        As the Managing Director, I take pride in the values that define Ananta Reality — integrity,
                        innovation, and a commitment to excellence. We believe in creating not just living spaces but
                        environments that nurture growth, harmony, and lasting memories.
                      </p>
                    </div>
                  </motion.div>

                  {/* Why Choose Ananta Reality */}
                  <motion.div variants={fadeInUp} className="mb-12">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
                      Why Choose Ananta Reality for Your Residential Plot:
                    </h3>

                    <div className="space-y-4 text-slate-600 dark:text-slate-300">
                      <div>
                        <strong className="text-slate-800 dark:text-white">Prime Locations: </strong>
                        Our residential plots are strategically located in areas that offer a perfect balance between
                        tranquility and accessibility. Whether you seek the calm of suburban life or the vibrancy of
                        urban living, we have carefully chosen locations that cater to diverse preferences.
                      </div>

                      <div>
                        <strong className="text-slate-800 dark:text-white">Tailored to Your Dreams: </strong>
                        Ananta Reality understands that your home is an expression of your aspirations. Our residential
                        plots come in various sizes, ensuring that you find the perfect space to build the home you've
                        always envisioned, whether it's a cozy haven for two or a spacious abode for a growing family.
                      </div>

                      <div>
                        <strong className="text-slate-800 dark:text-white">Modern Infrastructure: </strong>
                        We prioritize the development of modern infrastructure in our projects, including well-planned
                        roads, reliable water supply, and other essential amenities. Your investment in our residential
                        plots is not just a purchase; it's a promise of enduring value and comfort.
                      </div>

                      <div>
                        <strong className="text-slate-800 dark:text-white">Community Living: </strong>
                        Ananta Reality fosters a sense of community within our developments. Green spaces, parks, and
                        recreational areas are integrated to create an environment where neighbors become friends, and
                        families thrive together.
                      </div>

                      <div>
                        <strong className="text-slate-800 dark:text-white">Transparent Transactions: </strong>
                        Trust is the foundation of our relationship with you. Our commitment to transparency ensures
                        that every transaction is clear, straightforward, and trustworthy. We value the confidence you
                        place in us and strive to exceed your expectations.
                      </div>
                    </div>

                    <p className="mt-6 text-slate-600 dark:text-slate-300">
                      Thank you for considering Ananta Reality as your partner in this significant investment. We look
                      forward to welcoming you to our growing community of satisfied homeowners.
                    </p>

                    <p className="mt-4 text-slate-600 dark:text-slate-300 font-medium">Warm regards,</p>
                  </motion.div>

                  {/* Working Experience */}
                  <motion.div variants={fadeInUp} className="mb-12">
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">Working Experience</h2>

                    <p className="text-slate-600 dark:text-slate-300 mb-8">
                      With an extensive and dynamic five-year tenure in the real estate industry, I have had the
                      privilege of contributing to and witnessing the evolution of the market. My professional journey
                      has been marked by a commitment to excellence, a passion for client satisfaction, and a dedication
                      to staying abreast of industry trends.
                    </p>

                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
                      Key Accomplishments and Contributions:
                    </h3>

                    <div className="space-y-6">
                      {experiences.map((exp, index) => (
                        <motion.div key={index} variants={fadeInUp} className="flex gap-4">
                          <div className="flex-shrink-0 mt-1">
                            <CheckSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 dark:text-white mb-2">{exp.title}</h4>
                            <p className="text-slate-600 dark:text-slate-300">{exp.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Areas of Expertise */}
                  <motion.div variants={fadeInUp}>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Areas of Expertise:</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {expertiseAreas.map((area, index) => (
                        <motion.div
                          key={index}
                          variants={fadeInUp}
                          className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg"
                        >
                          <CheckSquare className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                          <span className="text-slate-700 dark:text-slate-300 text-sm">{area}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Contact CTA */}
                  <motion.div variants={fadeInUp} className="mt-12 text-center">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                      <h3 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h3>
                      <p className="mb-6 opacity-90">
                        Let's discuss your real estate goals and find the perfect solution for you.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                          <a href="mailto:Kattasubramanyam@gmail.com">
                            <Mail className="w-4 h-4 mr-2" />
                            Send Email
                          </a>
                        </Button>
                        <Button
                          asChild
                          size="lg"
                          variant="outline"
                          className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
                        >
                          <a href="tel:+917780422692">
                            <Phone className="w-4 h-4 mr-2" />
                            Call Now
                          </a>
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
      <ChatBot />
    </div>
  )
}
