"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Phone, Video, MoreVertical, ArrowLeft } from "lucide-react"
import type { Contact } from "@/types/chat"

interface ChatHeaderProps {
  contact: Contact
  onBackClick: () => void
}

export function ChatHeader({ contact, onBackClick }: ChatHeaderProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "offline":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white/90 backdrop-blur-sm border-b border-gray-200 p-3 sm:p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <Button variant="ghost" size="sm" className="lg:hidden p-1" onClick={onBackClick}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="relative">
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
              <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
              <AvatarFallback className="text-xs sm:text-sm">
                {contact.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div
              className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-white ${getStatusColor(contact.status)}`}
            />
          </div>
          <div className="min-w-0">
            <h2 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{contact.name}</h2>
            <p className="text-xs sm:text-sm text-gray-500 capitalize">{contact.status}</p>
          </div>
        </div>

        <div className="flex space-x-1 sm:space-x-2">
          <Button variant="ghost" size="sm" className="hidden sm:flex p-2">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="hidden sm:flex p-2">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
