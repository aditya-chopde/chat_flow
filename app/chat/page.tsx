"use client";

import type React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Smile,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  Search,
  Settings,
  LogOut,
  MessageCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline" | "away";
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: "sent" | "received";
}

const contacts: Contact[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    lastMessage: "Hey! How are you doing?",
    timestamp: "2 min ago",
    unreadCount: 2,
  },
  {
    id: "2",
    name: "Mike Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    lastMessage: "The project looks great!",
    timestamp: "1 hour ago",
    unreadCount: 0,
  },
  {
    id: "3",
    name: "Emily Davis",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "away",
    lastMessage: "Let's catch up tomorrow",
    timestamp: "3 hours ago",
    unreadCount: 1,
  },
  {
    id: "4",
    name: "Alex Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
    lastMessage: "Thanks for the help!",
    timestamp: "1 day ago",
    unreadCount: 0,
  },
];

const initialMessages: Message[] = [
  {
    id: "1",
    senderId: "1",
    content: "Hey! How are you doing?",
    timestamp: "10:30 AM",
    type: "received",
  },
  {
    id: "2",
    senderId: "me",
    content:
      "I'm doing great! Just working on some new projects. How about you?",
    timestamp: "10:32 AM",
    type: "sent",
  },
  {
    id: "3",
    senderId: "1",
    content: "That sounds exciting! I'd love to hear more about it.",
    timestamp: "10:33 AM",
    type: "received",
  },
];

export default function ChatPage() {
  const [selectedContact, setSelectedContact] = useState<Contact>(contacts[0]);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isloggingOut, setIsloggingOut] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: "me",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "sent",
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");

    // Simulate response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        senderId: selectedContact.id,
        content: "Thanks for your message! I'll get back to you soon.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: "received",
      };
      setMessages((prev) => [...prev, response]);
    }, 1000);
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  useEffect(() => {
    // Check auth only on initial load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/login");
      }
    });

    // Scroll to bottom when messages change
    scrollToBottom();
  }, [messages]);

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-80 bg-white/80 backdrop-blur-sm border-r border-gray-200 flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ChatFlow
              </h1>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/profile">
                  <Settings className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                asChild
                onClick={() => setIsDialogOpen(true)}
              >
                <div>
                  <LogOut className="h-4 w-4" />
                </div>
              </Button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence>
            {filteredContacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                className={`p-4 cursor-pointer border-b border-gray-100 ${
                  selectedContact.id === contact.id ? "bg-blue-50" : ""
                }`}
                onClick={() => setSelectedContact(contact)}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={contact.avatar || "/placeholder.svg"}
                        alt={contact.name}
                      />
                      <AvatarFallback>
                        {contact.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(
                        contact.status
                      )}`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {contact.name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {contact.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {contact.lastMessage}
                    </p>
                  </div>

                  {contact.unreadCount > 0 && (
                    <Badge className="bg-blue-600 text-white">
                      {contact.unreadCount}
                    </Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={selectedContact.avatar || "/placeholder.svg"}
                    alt={selectedContact.name}
                  />
                  <AvatarFallback>
                    {selectedContact.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(
                    selectedContact.status
                  )}`}
                />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">
                  {selectedContact.name}
                </h2>
                <p className="text-sm text-gray-500 capitalize">
                  {selectedContact.status}
                </p>
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
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`flex ${
                  message.type === "sent" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.type === "sent"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "bg-white shadow-sm border border-gray-200 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.type === "sent"
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {message.timestamp}
                  </p>
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
          className="bg-white/80 backdrop-blur-sm border-t border-gray-200 p-4"
        >
          <form
            onSubmit={handleSendMessage}
            className="flex items-center space-x-2"
          >
            <Button type="button" variant="ghost" size="sm">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm">
              <Smile className="h-4 w-4" />
            </Button>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              disabled={!newMessage.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </motion.div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <p>Are you sure you wanted to logout from the dashboard ?</p>
          </DialogHeader>
          <DialogFooter>
            <Button variant={"outline"} onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={isloggingOut}
              onClick={async () => {
                setIsloggingOut(true);
                await supabase.auth.signOut();
                setIsDialogOpen(false);
                setIsDialogOpen(false);
                toast.success("Logged Out")
                router.push("/login");
              }}
              variant={"destructive"}
            >
              {isloggingOut ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging Out...
                </>
              ) : (
                "Logout"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
