"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useRef, useEffect } from "react"
import type { Message } from "@/types/chat"

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
      <AnimatePresence>
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`flex ${message.type === "sent" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 py-2 sm:px-4 sm:py-2 rounded-2xl ${
                message.type === "sent"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : "bg-white shadow-sm border border-gray-200 text-gray-900"
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
              <p className={`text-xs mt-1 ${message.type === "sent" ? "text-blue-100" : "text-gray-500"}`}>
                {message.timestamp}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <div ref={messagesEndRef} />
    </div>
  )
}
