"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MessageCircle, Menu } from "lucide-react"

interface WelcomeScreenProps {
  onOpenSidebar: () => void
}

export function WelcomeScreen({ onOpenSidebar }: WelcomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="flex-1 flex items-center justify-center p-4 sm:p-8"
    >
      <div className="text-center max-w-md">
        <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <MessageCircle className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 sm:mb-4">
          Welcome to ChatFlow
        </h2>
        <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base px-4">
          Select a conversation from the sidebar to start chatting with your contacts. Experience seamless communication
          with beautiful animations and AI-powered features.
        </p>
        <Button
          onClick={onOpenSidebar}
          className="lg:hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        >
          <Menu className="h-4 w-4 mr-2" />
          Open Conversations
        </Button>
      </div>
    </motion.div>
  )
}
