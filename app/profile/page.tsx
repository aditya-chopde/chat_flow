"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Camera, Bell, Shield, Moon, Globe, MessageCircle, Edit3, Save } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "Software developer passionate about creating amazing user experiences.",
    status: "Available",
  })

  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    onlineStatus: true,
    readReceipts: true,
  })

  const handleSave = () => {
    setIsEditing(false)
    // Here you would typically save to a backend
  }

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white border-b border-gray-200 p-4"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/chat">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Chat
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Profile Settings</span>
            </div>
          </div>
          <Button
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            ) : (
              <>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </>
            )}
          </Button>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Profile Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Manage your personal information and how others see you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" />
                    <AvatarFallback className="text-2xl">
                      {profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold">{profile.name}</h3>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {profile.status}
                    </Badge>
                  </div>
                  <p className="text-gray-600">{profile.email}</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50" : ""}
                  placeholder="Tell others about yourself..."
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Privacy & Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Settings</CardTitle>
              <CardDescription>Control your privacy and notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-gray-500">Receive notifications for new messages</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(checked) => handleSettingChange("notifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Moon className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Dark Mode</p>
                      <p className="text-sm text-gray-500">Switch to dark theme</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.darkMode}
                    onCheckedChange={(checked) => handleSettingChange("darkMode", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Show Online Status</p>
                      <p className="text-sm text-gray-500">Let others see when you're online</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.onlineStatus}
                    onCheckedChange={(checked) => handleSettingChange("onlineStatus", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Read Receipts</p>
                      <p className="text-sm text-gray-500">Show when you've read messages</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.readReceipts}
                    onCheckedChange={(checked) => handleSettingChange("readReceipts", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
              <CardDescription>Manage your account and data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" className="flex-1">
                  Change Password
                </Button>
                <Button variant="outline" className="flex-1">
                  Download Data
                </Button>
                <Button variant="destructive" className="flex-1">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
