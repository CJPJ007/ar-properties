"use client"

import { motion } from "framer-motion"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="pt-16 md:pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-8 text-center">
              Privacy Policy
            </h1>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">1. Information We Collect</h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  We collect information you provide directly to us, such as when you:
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                  <li>Fill out contact forms or property inquiries</li>
                  <li>Sign up for our newsletter</li>
                  <li>Create an account or profile</li>
                  <li>Request property viewings or consultations</li>
                  <li>Contact us for customer support</li>
                </ul>
                <p className="text-slate-600 leading-relaxed mt-4">
                  The types of information we may collect include your name, email address, phone number, 
                  property preferences, and any other information you choose to provide.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">2. How We Use Your Information</h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process and respond to your inquiries and requests</li>
                  <li>Send you marketing communications (with your consent)</li>
                  <li>Personalize your experience on our website</li>
                  <li>Analyze usage patterns and trends</li>
                  <li>Protect against fraud and ensure security</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">3. Information Sharing</h2>
                <p className="text-slate-600 leading-relaxed">
                  We do not sell, trade, or otherwise transfer your personal information to third parties 
                  without your consent, except in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4 mt-4">
                  <li>With your explicit consent</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights and property</li>
                  <li>In connection with a business transfer or merger</li>
                  <li>With trusted service providers who assist us in operating our website</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">4. Cookies and Tracking Technologies</h2>
                <p className="text-slate-600 leading-relaxed">
                  We use cookies and similar tracking technologies to enhance your browsing experience, 
                  analyze website traffic, and understand where our visitors are coming from. You can 
                  control cookie settings through your browser preferences.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">5. Data Security</h2>
                <p className="text-slate-600 leading-relaxed">
                  We implement appropriate security measures to protect your personal information against 
                  unauthorized access, alteration, disclosure, or destruction. However, no method of 
                  transmission over the internet or electronic storage is 100% secure.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">6. Your Rights</h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                  <li>Access and review your personal information</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Withdraw consent for data processing</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">7. Third-Party Services</h2>
                <p className="text-slate-600 leading-relaxed">
                  Our website may contain links to third-party websites or services. We are not responsible 
                  for the privacy practices of these third parties. We encourage you to review their privacy 
                  policies before providing any personal information.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">8. Children's Privacy</h2>
                <p className="text-slate-600 leading-relaxed">
                  Our services are not intended for children under the age of 13. We do not knowingly collect 
                  personal information from children under 13. If you believe we have collected information 
                  from a child under 13, please contact us immediately.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">9. Changes to This Policy</h2>
                <p className="text-slate-600 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by 
                  posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">10. Contact Us</h2>
                <p className="text-slate-600 leading-relaxed">
                  If you have any questions about this Privacy Policy or our data practices, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                  <p className="text-slate-700">
                    <strong>Email:</strong> privacy@anantarealty.com<br />
                    <strong>Phone:</strong> (123) 456-7890<br />
                    <strong>Address:</strong> 123 Estate Lane, City, ST 12345
                  </p>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-200">
                <p className="text-sm text-slate-500">
                  <strong>Last updated:</strong> January 2025
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 