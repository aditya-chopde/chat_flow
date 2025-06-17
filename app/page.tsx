"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, Users, Shield, Zap } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const features = [
    {
      icon: MessageCircle,
      title: "Real-time Messaging",
      description: "Instant messaging with real-time delivery and read receipts",
    },
    {
      icon: Users,
      title: "Group Chats",
      description: "Create and manage group conversations with ease",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "End-to-end encryption keeps your conversations safe",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized for speed with instant message delivery",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex justify-between items-center p-6 max-w-7xl mx-auto"
      >
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">ChatFlow</span>
        </div>
        <div className="flex space-x-4">
          <Link href="/login">
            <Button variant="ghost" className="hover:bg-blue-50 transition-colors">
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-blue-600 hover:bg-blue-700 transition-colors">Sign Up</Button>
          </Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Connect with
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}
              Everyone
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience seamless communication with our modern chat platform. Fast, secure, and beautifully designed for
            the way you connect.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 transition-all transform hover:scale-105">
                Get Started Free
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="hover:bg-gray-50 transition-all transform hover:scale-105">
                Sign In
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to start chatting?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of users already connecting on ChatFlow</p>
          <Link href="/signup">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              Create Your Account
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
