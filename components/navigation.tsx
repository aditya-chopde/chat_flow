"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { LogOut } from "lucide-react"

export function Navigation() {
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200"
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ChatFlow
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
            Home
          </Link>
          <Link href="/chat" className="text-gray-600 hover:text-gray-900 transition-colors">
            Chat
          </Link>
          <Link href="/profile" className="text-gray-600 hover:text-gray-900 transition-colors">
            Profile
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => setLogoutDialogOpen(true)}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
          <Button
            asChild
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </div>
      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <LogOut className="h-5 w-5 text-red-600" />
              <span>Confirm Logout</span>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to log out? You'll be redirected to the home page.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setLogoutDialogOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button
              asChild
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white w-full sm:w-auto"
            >
              <Link href="/">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.nav>
  )
}
