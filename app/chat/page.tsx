"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MessageCircle,
  Send,
  Search,
  MoreVertical,
  Phone,
  Video,
  Settings,
  LogOut,
  Plus,
  Smile,
  Paperclip,
} from "lucide-react"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"

interface Message {
  id: string
  text: string
  sender: "user" | "other"
  timestamp: string
  avatar?: string
  senderName?: string
}

interface Chat {
  id: string
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  unread: number
  online: boolean
}

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<string>("1")
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hey! How are you doing?",
      sender: "other",
      timestamp: "10:30 AM",
      senderName: "Alice Johnson",
    },
    {
      id: "2",
      text: "I'm doing great! Just working on some new projects. How about you?",
      sender: "user",
      timestamp: "10:32 AM",
    },
    {
      id: "3",
      text: "That sounds exciting! I'd love to hear more about it.",
      sender: "other",
      timestamp: "10:33 AM",
      senderName: "Alice Johnson",
    },
  ])

  const [chats] = useState<Chat[]>([
    {
      id: "1",
      name: "Alice Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "That sounds exciting! I'd love to hear more about it.",
      timestamp: "10:33 AM",
      unread: 2,
      online: true,
    },
    {
      id: "2",
      name: "Bob Smith",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "See you tomorrow!",
      timestamp: "Yesterday",
      unread: 0,
      online: false,
    },
    {
      id: "3",
      name: "Team Chat",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Meeting at 3 PM",
      timestamp: "Yesterday",
      unread: 5,
      online: true,
    },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, newMessage])
    setMessage("")

    // Simulate response
    setTimeout(() => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message! I'll get back to you soon.",
        sender: "other",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        senderName: "Alice Johnson",
      }
      setMessages((prev) => [...prev, responseMessage])
    }, 1000)
  }

  const selectedChatData = chats.find((chat) => chat.id === selectedChat)

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-80 bg-white border-r border-gray-200 flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">ChatFlow</span>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <LogOut className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              className="pl-10 bg-gray-50 border-0 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <Button className="w-full mb-4 bg-blue-600 hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>

            <div className="space-y-1">
              {chats.map((chat) => (
                <motion.div key={chat.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Card
                    className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                      selectedChat === chat.id ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedChat(chat.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={chat.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {chat.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {chat.online && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900 truncate">{chat.name}</h3>
                          <span className="text-xs text-gray-500">{chat.timestamp}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                          {chat.unread > 0 && <Badge className="bg-blue-600 text-white text-xs">{chat.unread}</Badge>}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChatData ? (
          <>
            {/* Chat Header */}
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white border-b border-gray-200 p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={selectedChatData.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {selectedChatData.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {selectedChatData.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">{selectedChatData.name}</h2>
                    <p className="text-sm text-gray-500">{selectedChatData.online ? "Online" : "Last seen recently"}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${msg.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                    >
                      {msg.sender === "other" && (
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={selectedChatData.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {selectedChatData.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          msg.sender === "user"
                            ? "bg-blue-600 text-white rounded-br-md"
                            : "bg-gray-100 text-gray-900 rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <p className={`text-xs mt-1 ${msg.sender === "user" ? "text-blue-100" : "text-gray-500"}`}>
                          {msg.timestamp}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white border-t border-gray-200 p-4"
            >
              <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                <Button type="button" variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="pr-10 border-gray-300 focus:border-blue-500 transition-colors"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 transition-all transform hover:scale-105"
                  disabled={!message.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </motion.div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a chat from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
