"use client";

import type React from "react";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Camera,
  Bell,
  Shield,
  Moon,
  Globe,
  Smartphone,
  Save,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Profile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
}

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<Profile>({
    id: "",
    name: "",
    email: "",
    avatar: "",
    bio: "",
  });
  const router = useRouter();

  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    onlineStatus: true,
    readReceipts: true,
    twoFactor: false,
  });

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate save process
    const { data, error } = await supabase
      .from("users")
      .update({
        name: profileData.name,
        email: profileData.email,
        avatar: profileData.avatar,
        bio: profileData.bio,
      })
      .eq("id", profileData.id);

    if (error) {
      toast.error("Error Updataing Profile");
    } else {
      toast.success("Profile Updataed Successfully");
    }

    setIsLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    toast.error("Please upload a valid image file (JPEG, PNG, GIF, or WebP)");
    return;
  }

  const maxSize = 1 * 1024 * 1024; 
  if (file.size > maxSize) {
    toast.error("File size must be less than 1MB");
    return;
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `avatar_${Date.now()}.${fileExt}`;
  const filePath = fileName;

  try {
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    console.log("Available buckets:", buckets);
    
    if (bucketError) {
      console.error("Bucket listing error:", bucketError);
      toast.error("Storage configuration error");
      return;
    }

    const { data, error } = await supabase.storage
      .from("avatars") 
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      toast.error(`Upload failed: ${error.message}`);
      console.error("Upload error:", error);
      return;
    }

    console.log("Upload success:", data);

    const { data: publicUrlData } = supabase.storage
      .from("avatars") 
      .getPublicUrl(data.path);

    if (!publicUrlData?.publicUrl) {
      toast.error("Failed to generate public URL");
      console.error("Missing public URL from Supabase");
      return;
    }

    setProfileData((prev) => ({
      ...prev,
      avatar: publicUrlData.publicUrl,
    }));

    toast.success("Image uploaded!");
    console.log("Public URL:", publicUrlData.publicUrl);

  } catch (error) {
    toast.error("An unexpected error occurred");
    console.error("Unexpected error:", error);
  }
};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSettingChange = (setting: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  const fetchDetails = async () => {
    const {
      data: { session },
      error: SessionError,
    } = await supabase.auth.getSession();
    console.log("Console...");
    if (session) {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user?.id)
        .single();

      if (error) {
        console.error("Error fetching user:", error.message);
      } else {
        setProfileData(data);
      }
    } else {
      router.push("/login");
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/chat">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Chat
              </Link>
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              Profile Settings
            </h1>
          </div>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Profile Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">P</span>
                </div>
                <span>Profile Information</span>
              </CardTitle>
              <CardDescription>
                Update your personal information and profile picture
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profileData.avatar} alt="Profile" />
                    <AvatarFallback className="text-2xl">
                      {profileData.name}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={() =>
                      document.getElementById("avatarInput")?.click()
                    }
                  >
                    <Camera className="h-4 w-4 text-white" />
                  </Button>

                  <input
                    type="file"
                    accept="image/*"
                    id="avatarInput"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {profileData.name}
                  </h3>
                  <p className="text-gray-600">{profileData.email}</p>
                  <Badge variant="secondary" className="mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                    Online
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={profileData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself..."
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-blue-600" />
                <span>Notifications</span>
              </CardTitle>
              <CardDescription>
                Manage your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Push Notifications
                  </h4>
                  <p className="text-sm text-gray-600">
                    Receive notifications on your device
                  </p>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) =>
                    handleSettingChange("notifications", checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Read Receipts</h4>
                  <p className="text-sm text-gray-600">
                    Let others know when you've read their messages
                  </p>
                </div>
                <Switch
                  checked={settings.readReceipts}
                  onCheckedChange={(checked) =>
                    handleSettingChange("readReceipts", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Privacy & Security */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span>Privacy & Security</span>
              </CardTitle>
              <CardDescription>
                Control your privacy and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Online Status</h4>
                  <p className="text-sm text-gray-600">
                    Show when you're online to other users
                  </p>
                </div>
                <Switch
                  checked={settings.onlineStatus}
                  onCheckedChange={(checked) =>
                    handleSettingChange("onlineStatus", checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Two-Factor Authentication
                  </h4>
                  <p className="text-sm text-gray-600">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch
                  checked={settings.twoFactor}
                  onCheckedChange={(checked) =>
                    handleSettingChange("twoFactor", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Moon className="h-5 w-5 text-purple-600" />
                <span>Appearance</span>
              </CardTitle>
              <CardDescription>
                Customize the look and feel of your app
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Dark Mode</h4>
                  <p className="text-sm text-gray-600">
                    Switch to dark theme for better viewing in low light
                  </p>
                </div>
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={(checked) =>
                    handleSettingChange("darkMode", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Connected Devices */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Smartphone className="h-5 w-5 text-orange-600" />
                <span>Connected Devices</span>
              </CardTitle>
              <CardDescription>
                Manage devices that have access to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Globe className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Web Browser</h4>
                    <p className="text-sm text-gray-600">
                      Chrome on macOS • Active now
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">Current</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Smartphone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">iPhone</h4>
                    <p className="text-sm text-gray-600">
                      iOS App • Last seen 2 hours ago
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
