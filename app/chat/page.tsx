"use client";

import { useState, useEffect } from "react";
import type { Contact, Message, SearchUser } from "@/types/chat";
import { Sidebar } from "@/components/chat/sidebar";
import { ChatHeader } from "@/components/chat/chat-header";
import { MessageList } from "@/components/chat/message-list";
import { MessageInput } from "@/components/chat/message-input";
import { AddContactModal } from "@/components/chat/add-contact-modal";
import { WelcomeScreen } from "@/components/chat/welcome-screen";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles, Loader2, Check, LogOut } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { generateAIMessage } from "@/lib/gemini";

// Initial contacts data
const initialContacts: Contact[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    lastMessage: "Hey! How are you doing?",
    timestamp: "2 min ago",
    unreadCount: 2,
    email: "sarah.johnson@example.com",
  },
  {
    id: "2",
    name: "Mike Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    lastMessage: "The project looks great!",
    timestamp: "1 hour ago",
    unreadCount: 0,
    email: "mike.chen@example.com",
  },
  {
    id: "3",
    name: "Emily Davis",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "away",
    lastMessage: "Let's catch up tomorrow",
    timestamp: "3 hours ago",
    unreadCount: 1,
    email: "emily.davis@example.com",
  },
  {
    id: "4",
    name: "Alex Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
    lastMessage: "Thanks for the help!",
    timestamp: "1 day ago",
    unreadCount: 0,
    email: "alex.wilson@example.com",
  },
];

// Initial chat messages
const initialChatMessages: Record<string, Message[]> = {
  "1": [
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
  ],
  "2": [
    {
      id: "1",
      senderId: "2",
      content: "The project looks great!",
      timestamp: "9:15 AM",
      type: "received",
    },
    {
      id: "2",
      senderId: "me",
      content: "Thank you! I put a lot of effort into it.",
      timestamp: "9:20 AM",
      type: "sent",
    },
  ],
  "3": [
    {
      id: "1",
      senderId: "3",
      content: "Let's catch up tomorrow",
      timestamp: "7:45 AM",
      type: "received",
    },
  ],
  "4": [
    {
      id: "1",
      senderId: "4",
      content: "Thanks for the help!",
      timestamp: "Yesterday",
      type: "received",
    },
    {
      id: "2",
      senderId: "me",
      content: "You're welcome! Happy to help anytime.",
      timestamp: "Yesterday",
      type: "sent",
    },
  ],
};

export default function ChatPage() {
  // State management
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [contactList, setContactList] = useState<Contact[]>(initialContacts);
  const [chatMessages, setChatMessages] =
    useState<Record<string, Message[]>>(initialChatMessages);
  const [approveMessage, setApproveMessage] = useState("");

  // Modal states
  const [addContactModalOpen, setAddContactModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  // AI states
  const [aiPrompt, setAiPrompt] = useState("");
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else if (!selectedContact) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [selectedContact]);

  // Load messages when contact is selected
  useEffect(() => {
    if (selectedContact) {
      setMessages(chatMessages[selectedContact.id] || []);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    }
  }, [selectedContact, chatMessages]);

  // Handle contact selection
  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
  };

  // Handle sending messages
  const handleSendMessage = (messageContent: string) => {
    if (!selectedContact) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: "me",
      content: messageContent,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "sent",
    };

    // Update messages state
    setMessages((prev) => [...prev, message]);

    // Update chat messages store
    setChatMessages((prev) => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), message],
    }));

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
      setChatMessages((prev) => ({
        ...prev,
        [selectedContact.id]: [...(prev[selectedContact.id] || []), response],
      }));
    }, 1000);
  };

  // Handle adding new contact
  const handleAddContact = async (user: SearchUser) => {
    // Simulate API call
    const {error} = await supabase.rpc("add_contact", {
      new_contact_id: user.id,
    })

    if(error){
      console.log("Error Ocurred: ", error.message)
    }else{
      toast.success(`${user.name} is added to contacts`)
    }

    const newContact: Contact = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      status: user.status,
      lastMessage: "Contact added",
      timestamp: "now",
      unreadCount: 0,
    };

    // Add to contact list
    setContactList((prev) => [newContact, ...prev]);

    // Initialize empty chat for new contact
    setChatMessages((prev) => ({
      ...prev,
      [user.id]: [],
    }));

    // Close modal
    setAddContactModalOpen(false);
  };

  // Handle AI message generation
  const handleGenerateMessage = async () => {
    try {
      if (!aiPrompt.trim()) return;

      setIsGenerating(true);

      // Simulate AI message generation
      const msg = await generateAIMessage(aiPrompt);

      setGeneratedMessage(msg);
      setIsGenerating(false);
    } catch (error: any) {
      toast.error("Error Generating the Message: " + error.message);
    }
  };

  const handleApproveMessage = () => {
    setApproveMessage(generatedMessage);
    setAiModalOpen(false);
    setAiPrompt("");
    setGeneratedMessage("");
    // The generated message will be passed to MessageInput component
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Logged Out Successfully");
      setLogoutDialogOpen(false);
      router.push("/login");
    }
    setIsLoggingOut(false);
    setLogoutDialogOpen(false);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        contacts={contactList}
        selectedContact={selectedContact}
        onContactSelect={handleContactSelect}
        onAddContactClick={() => setAddContactModalOpen(true)}
        onLogoutClick={() => setLogoutDialogOpen(true)}
      />

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedContact ? (
          <>
            <ChatHeader
              contact={selectedContact}
              onBackClick={() => setSidebarOpen(true)}
            />
            <MessageList messages={messages} />
            <MessageInput
              onSendMessage={handleSendMessage}
              onAiClick={() => setAiModalOpen(true)}
              aiGeneratedMessage={approveMessage}
            />
          </>
        ) : (
          <WelcomeScreen onOpenSidebar={() => setSidebarOpen(true)} />
        )}
      </div>

      {/* Add Contact Modal */}
      <AddContactModal
        open={addContactModalOpen}
        onOpenChange={setAddContactModalOpen}
        onAddContact={handleAddContact}
      />

      {/* AI Message Generation Modal */}
      <Dialog open={aiModalOpen} onOpenChange={setAiModalOpen}>
        <DialogContent className="sm:max-w-md mx-4 w-[calc(100vw-2rem)] sm:w-full">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-base sm:text-lg">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              <span>Generate Message with AI</span>
            </DialogTitle>
            <DialogDescription className="text-sm">
              Describe what you want to say and AI will generate a message for
              you.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="prompt"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Your prompt
              </label>
              <Textarea
                id="prompt"
                placeholder="e.g., Write a friendly follow-up message about the project..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="min-h-[80px] sm:min-h-[100px] text-sm"
              />
            </div>

            {generatedMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 sm:p-4 bg-gray-50 rounded-lg border"
              >
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Generated message
                </label>
                <p className="text-gray-900 text-sm leading-relaxed">
                  {generatedMessage}
                </p>
              </motion.div>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {!generatedMessage ? (
              <Button
                onClick={handleGenerateMessage}
                disabled={!aiPrompt.trim() || isGenerating}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white w-full sm:w-auto text-sm"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Message
                  </>
                )}
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={() => {
                    setGeneratedMessage("");
                    setAiPrompt("");
                  }}
                  className="w-full sm:w-auto text-sm"
                >
                  Regenerate
                </Button>
                <Button
                  onClick={handleApproveMessage}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white w-full sm:w-auto text-sm"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Use Message
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="sm:max-w-md mx-4 w-[calc(100vw-2rem)] sm:w-full">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-base sm:text-lg">
              <LogOut className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
              <span>Confirm Logout</span>
            </DialogTitle>
            <DialogDescription className="text-sm">
              Are you sure you want to log out? You'll need to sign in again to
              access your conversations.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setLogoutDialogOpen(false)}
              className="w-full sm:w-auto text-sm"
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white w-full sm:w-auto text-sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
              variant={"destructive"}
            >
              {isLoggingOut ? (
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
