"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Users, Home, TrendingUp, Award } from "lucide-react"
import { useEffect, useState } from "react"
import { useCompanyDetails } from "@/hooks/use-company-details"

interface StatItem {
  icon: React.ReactNode
  label: string
  value: number
  suffix?: string
  description?: string
}

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

export default function StatsSection() {
  const [stats, setStats] = useState<StatItem[]>([])
  const [displayValues, setDisplayValues] = useState<number[]>([0,0,0])
    const {company} = useCompanyDetails();
  useEffect(() => {

    fetch('/api/properties/sold')
      .then(res => res.text())
      .then(data => {
        setDisplayValues(prev => [parseInt(data), ...prev.slice(1)]);
      }).finally(()=>{
        fetch('/api/public/company-details/team-members')
      .then(res => res.json())
      .then(data => Array.isArray(data) ? setDisplayValues(prev => {
        prev[1]=data?.length;
        return [...prev];
        }):[])
    
      })

    setDisplayValues(prev => [
      ...prev.slice(0,2),
      company?.establishedYear ? new Date().getFullYear() - company.establishedYear : 0
    ]);

      
    const statsData: StatItem[] = [
      {
        icon: <Home className="w-8 h-8" />,
        label: "Properties Sold",
        value: 1250,
        suffix: "+",
        description: "Successful transactions",
      },
      {
        icon: <Users className="w-8 h-8" />,
        label: "Team Members",
        value: 85,
        suffix: "+",
        description: "Expert professionals",
      },
      {
        icon: <Award className="w-8 h-8" />,
        label: "Years Experience",
        value: 15,
        suffix: "+",
        description: "Industry expertise",
      },
    ]
    setStats(statsData)
  }, [])

//   useEffect(() => {
//     if (stats.length === 0) return

//     const timers = stats.map((stat, index) => {
//       const increment = stat.value / 50
//       let current = 0

//       const timer = setInterval(() => {
//         current += increment
//         if (current >= stat.value) {
//           current = stat.value
//           clearInterval(timer)
//         }
//         setDisplayValues((prev) => {
//           const newValues = [...prev]
//           newValues[index] = Math.floor(current)
//           return newValues
//         })
//       }, 30)

//       return timer
//     })

//     return () => timers.forEach(clearInterval)
//   }, [stats])

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div className="text-center mb-16" {...fadeInUp}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Impact</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mb-6" />
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Trusted by thousands of clients, our team has consistently delivered exceptional results in the real estate
            industry.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={fadeInUp} className="group relative">
              {/* Card Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />

              {/* Card Content */}
              <div className="relative bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-8 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 h-full flex flex-col items-center text-center">
                {/* Icon */}
                <div className="mb-6 p-4 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>

                {/* Value with Animation */}
                <div className="mb-2">
                  <span className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                    {displayValues[index]}
                  </span>
                  <span className="text-2xl font-bold text-amber-500 ml-1">{stat.suffix}</span>
                </div>

                {/* Label */}
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{stat.label}</h3>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
