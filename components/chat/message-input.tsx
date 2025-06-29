"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Smile, Paperclip, Sparkles } from "lucide-react"

interface MessageInputProps {
  onSendMessage: (message: string) => void
  onAiClick: () => void
  aiGeneratedMessage?: string
}

export function MessageInput({ onSendMessage, onAiClick, aiGeneratedMessage }: MessageInputProps) {
  const [newMessage, setNewMessage] = useState(aiGeneratedMessage || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    onSendMessage(newMessage)
    setNewMessage("")
  }

  // Update message when AI generates one
  useState(() => {
    if (aiGeneratedMessage) {
      setNewMessage(aiGeneratedMessage)
    }
  })

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white/90 backdrop-blur-sm border-t border-gray-200 p-3 sm:p-4"
    >
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <Button type="button" variant="ghost" size="sm" className="hidden sm:flex p-2">
          <Paperclip className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" className="hidden sm:flex p-2">
          <Smile className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onAiClick}
          className="bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 p-2"
        >
          <Sparkles className="h-4 w-4 text-purple-600" />
        </Button>
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 h-9 sm:h-10"
        />
        <Button
          type="submit"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-2 sm:px-4"
          disabled={!newMessage.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </motion.div>
  )
}
