"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Settings,
  LogOut,
  MessageCircle,
  X,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import type { Contact } from "@/types/chat";
import { useEffect } from "react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  contacts: Contact[];
  selectedContact: Contact | null;
  onContactSelect: (contact: Contact) => void;
  onAddContactClick: () => void;
  onLogoutClick: () => void;
}

export function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  searchQuery,
  setSearchQuery,
  contacts,
  selectedContact,
  onContactSelect,
  onAddContactClick,
  onLogoutClick,
}: SidebarProps) {
  const filteredContacts = contacts.filter((contact) =>
    contact.name?.toLowerCase().includes(searchQuery.toLowerCase())
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

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
      className={`
        fixed lg:relative 
        w-full sm:w-80 
        bg-white/90 backdrop-blur-sm 
        border-r border-gray-200 
        flex flex-col 
        z-50 h-full 
        transition-transform duration-300 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0
      `}
    >
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <MessageCircle className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ChatFlow
            </h1>
          </div>
          <div className="flex space-x-1 sm:space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="hidden lg:flex"
              asChild
            >
              <Link href="/profile">
                <Settings className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="hidden lg:flex"
              onClick={onLogoutClick}
            >
              <LogOut className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Add New Contact Button */}
        <div className="mb-3">
          <Button
            onClick={onAddContactClick}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white text-sm h-9"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add New Contact
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-9 sm:h-10"
          />
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                className={`p-3 sm:p-4 cursor-pointer border-b border-gray-100 ${
                  selectedContact?.id === contact.id ? "bg-blue-50" : ""
                }`}
                onClick={() => onContactSelect(contact)}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                      <AvatarImage
                        src={contact.avatar || "/placeholder.svg"}
                        alt={contact.name}
                      />
                      <AvatarFallback className="text-sm">
                        {contact.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white ${getStatusColor(
                        contact.status
                      )}`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                        {contact.name}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      {contact.email}
                    </p>
                  </div>

                  {contact.unreadCount > 0 && (
                    <Badge className="bg-blue-600 text-white text-xs px-1.5 py-0.5">
                      {contact.unreadCount}
                    </Badge>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center text-sm text-gray-500 py-6">
              No contacts added yet.
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
