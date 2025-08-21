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

  useEffect(() => {
    fetch('/api/public/company-details/about-us')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setStory(data[0].content)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-16 md:pb-0">
      <Header />

      {/* Hero Section */}
      {/* <section className="relative h-96 flex items-center justify-center overflow-hidden mt-0 md:mt-16"> */}
        {/* <div className="absolute inset-0 z-0"> */}
          <Slider className="" showSearch={false} page="About"/>
        {/* </div> */}

        {/* <motion.div
          className="relative z-10 text-center text-white px-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">About Ananta Realty</h1>
          <p className="text-xl md:text-2xl text-blue-100">Your trusted partner in finding the perfect home</p>
        </motion.div> */}
      {/* </section> */}

      {/* Our Story */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" initial={fadeInUp.initial} animate={fadeInUp.animate} transition={{ duration: 0.6, ease: 'easeOut' }}>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Our Story</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mb-6" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={fadeInUp.initial} animate={fadeInUp.animate} transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}>
              {storyLoading ? (
                <div className="flex justify-center items-center h-32"><Loader2 className="animate-spin w-8 h-8 text-blue-400" /></div>
              ) : story ? (
                <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: story }} />
              ) : (
                <p className="text-lg text-slate-600 leading-relaxed">No story available.</p>
              )}
            </motion.div>

            <motion.div
              className="relative"
              initial={fadeInUp.initial}
              animate={fadeInUp.animate}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
            >
              <img
                src="https://images.unsplash.com/photo-1600585153490-76fb20a32601?auto=format&fit=crop&w=600&q=80"
                alt="Our Story"
                className="rounded-lg shadow-2xl w-full h-80 object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>
      {/* About Us Markdown Link */}
      <section className="flex justify-center py-4">
        <a
          href="/md"
          // target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-lg shadow hover:from-amber-600 hover:to-orange-600 transition-all duration-300"
        >
          Read story about our MD
        </a>
      </section>
      {/* Our Team */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div className="text-center mb-16" initial={fadeInUp.initial} animate={fadeInUp.animate} transition={{ duration: 0.6, ease: 'easeOut' }}>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Meet Our Team</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mb-6" />
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {teamLoading ? (
              <div className="col-span-full flex justify-center items-center h-32"><Loader2 className="animate-spin w-8 h-8 text-blue-400" /></div>
            ) : team.length > 0 ? (
              team.map((member, index) => (
                <TeamCard key={member.id || member.name} member={member} index={index} />
              ))
            ) : (
              <p className="col-span-full text-center text-slate-500">No team members found.</p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" initial={fadeInUp.initial} animate={fadeInUp.animate} transition={{ duration: 0.6, ease: 'easeOut' }}>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Our Values</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mb-6" />
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {valuesLoading ? (
              <div className="col-span-full flex justify-center items-center h-32"><Loader2 className="animate-spin w-8 h-8 text-blue-400" /></div>
            ) : values.length > 0 ? (
              values.map((value, index) => (
                <ValueCard key={value.id || value.title} value={value} index={index} />
              ))
            ) : (
              <p className="col-span-full text-center text-slate-500">No values found.</p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div className="text-center mb-16" initial={fadeInUp.initial} animate={fadeInUp.animate} transition={{ duration: 0.6, ease: 'easeOut' }}>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mb-6" />
          </motion.div>

          <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
            {/* <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">Name</label>
                    <Input
                      type="text"
                      placeholder="Your Name"
                      className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">Email</label>
                    <Input
                      type="email"
                      placeholder="Your Email"
                      className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">Mobile Number</label>
                    <Input
                      type="button"
                      placeholder="Your Mobile Number"
                      className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-blue-100 mb-2">Message</label>
                    <Textarea
                      placeholder="Your Message"
                      rows={5}
                      className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white transition-all duration-300 transform hover:scale-105"
                    >
                      Send Message
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card> */}
            <InquiryForm
              showAppointmentDate={false}
              className="bg-transparent backdrop-blur-sm text-black border-2 p-4 rounded-md border-white/20"
            />
          </motion.div>
        </div>
      </section>

      <Footer />
      {/* <ChatBot /> */}
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
      <Card className="overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform-gpu perspective-1000">
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
          <h3 className="text-xl font-bold text-slate-800 mb-2">{member.name}</h3>
          <p className="text-amber-600 font-medium mb-3">{member.position}</p>
          <p className="text-slate-600 text-sm leading-relaxed">{member.description}</p>
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
      <Card className="h-full bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform-gpu perspective-1000">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" style={{ background: value.iconColor || '#6366f1' }}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">{value.title}</h3>
          <p className="text-slate-600 leading-relaxed">{value.description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
