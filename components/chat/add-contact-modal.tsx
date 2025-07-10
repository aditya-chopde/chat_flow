"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { UserPlus, Mail, Loader2, Check, Plus } from "lucide-react"
import type { SearchUser } from "@/types/chat"
import { searchUsers } from "@/services/user-service"

interface AddContactModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddContact: (user: SearchUser) => void
}

export function AddContactModal({ open, onOpenChange, onAddContact }: AddContactModalProps) {
  const [userSearchQuery, setUserSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchUser[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Search users when query changes
  useEffect(() => {
    const searchUsersDebounced = async () => {
      if (userSearchQuery.trim().length >= 2) {
        setIsSearching(true)
        try {
          const results = await searchUsers(userSearchQuery)
          setSearchResults(results)
        } catch (error) {
          console.error("Error searching users:", error)
          setSearchResults([])
        } finally {
          setIsSearching(false)
        }
      } else {
        setSearchResults([])
      }
    }

    const debounceTimer = setTimeout(searchUsersDebounced, 500)
    return () => clearTimeout(debounceTimer)
  }, [userSearchQuery])

  const handleAddContact = async (user: SearchUser) => {
    await onAddContact(user)
    // Update search results to show user is now a contact
    setSearchResults((prev) => prev.map((result) => (result.id === user.id ? { ...result, isContact: true } : result)))
  }

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

  const handleClose = () => {
    onOpenChange(false)
    setUserSearchQuery("")
    setSearchResults([])
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md mx-4 w-[calc(100vw-2rem)] sm:w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-base sm:text-lg">
            <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            <span>Add New Contact</span>
          </DialogTitle>
          <DialogDescription className="text-sm">
            Search for users by name or email address to add them to your contacts.
            <br />
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Search Results */}
          <div className="max-h-60 overflow-y-auto space-y-2">
            {isSearching && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                <span className="ml-2 text-sm text-gray-600">Searching users...</span>
              </div>
            )}

            {!isSearching && searchResults.length === 0 && userSearchQuery.length >= 2 && (
              <div className="text-center py-4 text-gray-500 text-sm">No users found matching "{userSearchQuery}"</div>
            )}

            {!isSearching && userSearchQuery.length > 0 && userSearchQuery.length < 2 && (
              <div className="text-center py-4 text-gray-500 text-sm">Type at least 2 characters to search</div>
            )}

            <AnimatePresence>
              {searchResults.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback className="text-sm">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(user.status)}`}
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm truncate">{user.name}</h4>
                      <p className="text-xs text-gray-600 truncate">{user.email}</p>
                    </div>
                  </div>

                  {user.isContact ? (
                    <Badge variant="secondary" className="text-xs">
                      <Check className="h-3 w-3 mr-1" />
                      Added
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleAddContact(user)}
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white text-xs px-3 py-1"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} className="w-full sm:w-auto text-sm bg-transparent">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
