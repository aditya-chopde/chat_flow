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
import { Sparkles, Loader2, Check, LogOut, Smartphone, Monitor } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { generateAIMessage } from "@/lib/gemini";
import { fetchContacts } from "@/services/fetch-contacts";
import { connectSocket, disConnectSocket, getSocket } from "@/lib/socket";

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
  const [contactList, setContactList] = useState<Contact[]>([]);
  const [chatMessages, setChatMessages] =
    useState<Record<string, Message[]>>(initialChatMessages);
  const [approveMessage, setApproveMessage] = useState("");
  const [userId, setUserId] = useState("");

  const router = useRouter();

  // New state for mobile warning dialog
  const [mobileWarningOpen, setMobileWarningOpen] = useState(false);

  // Detect mobile device and show message if mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const userAgent =
      navigator.userAgent || navigator.vendor || (window as any).opera;
    const mobileCheck =
      /android|iphone|ipad|ipod|opera mini|iemobile|wpdesktop/i.test(
        userAgent.toLowerCase()
      );
    setIsMobile(mobileCheck);
  }, []);

  // Modal states
  const [addContactModalOpen, setAddContactModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  const fetchMessagesForContact = async (contactId: string) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(`senderId.eq.${userId},receiverId.eq.${userId}`)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error.message);
      toast.error("Failed to load messages.");
      return [];
    }

    const filteredMessages: Message[] = data
      .filter(
        (msg) =>
          (msg.senderId === userId && msg.receiverId === contactId) ||
          (msg.senderId === contactId && msg.receiverId === userId)
      )
      .map((msg: any) => ({
        id: msg.id.toString(),
        senderId: msg.senderId,
        content: msg.text,
        timestamp: new Date(msg.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        type:
          msg.senderId === userId
            ? "sent"
            : ("received" as "sent" | "received"), // ✅ Fix here
      }));

    return filteredMessages;
  };

  // Handle contact selection
  const handleContactSelect = async (contact: Contact) => {
    setSelectedContact(contact);
    const fetchedMessages = await fetchMessagesForContact(contact.id);

    setMessages(fetchedMessages);

    setChatMessages((prev) => ({
      ...prev,
      [contact.id]: fetchedMessages,
    }));

    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  // Handle sending messages
  const handleSendMessage = async (messageContent: string) => {
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

    const { data, error } = await supabase.from("messages").insert([
      {
        senderId: userId,
        receiverId: selectedContact.id,
        text: messageContent,
      },
    ]);

    if (error) {
      toast.error("Error Sending Message: " + error.message);
    } else {
      const socket = getSocket();
      socket?.emit("send_message", {
        to: selectedContact.id,
        from: userId,
        content: messageContent,
      });

      // Update messages state
      setMessages((prev) => [...prev, message]);

      // Update chat messages store
      setChatMessages((prev) => ({
        ...prev,
        [selectedContact.id]: [...(prev[selectedContact.id] || []), message],
      }));
    }
  };

  // Handle adding new contact
  const handleAddContact = async (user: SearchUser) => {
    // Simulate API call
    const { error } = await supabase.rpc("add_contact", {
      new_contact_id: user.id,
    });

    await supabase.from("user_contacts").insert([
      {
        userId: user.id,
        contactId: userId,
      },
    ]);

    if (error) {
      console.log("Error Ocurred: ", error.message);
    } else {
      toast.success(`${user.name} is added to contacts`);
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
      const msg = await generateAIMessage(aiPrompt, messages);

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
      await supabase
        .from("users")
        .update({ status: "offline" })
        .eq("id", userId);
      disConnectSocket();
      setLogoutDialogOpen(false);
      toast.success("Logged Out Successfully");
      router.push("/login");
    }
    setIsLoggingOut(false);
    setLogoutDialogOpen(false);
  };

  const loadContacts = async () => {
    try {
      const contacts = await fetchContacts();
      setContactList(contacts);
    } catch (error) {
      console.error("Error loading contacts:", error);
    }
  };

  const isUserAuthenticated = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/login");
    } else {
      const userId = session.user.id;
      await supabase
        .from("users")
        .update({ status: "online" })
        .eq("id", userId);
      const socket = connectSocket();

      socket.on("connect", () => {
        socket.emit("register", userId);
      });

      setUserId(userId);

      // 👇 Listen for real-time messages
      socket.on("receive_message", ({ from, content, timestamp }) => {
        const newMessage: Message = {
          id: Date.now().toString(),
          senderId: from,
          content,
          timestamp,
          type: "received",
        };

        setChatMessages((prev) => {
          const prevMessages = prev[from] || [];
          return {
            ...prev,
            [from]: [...prevMessages, newMessage],
          };
        });

        // 👇 If the current selected chat is the sender, show it immediately
        if (selectedContact?.id === from) {
          setMessages((prev) => [...prev, newMessage]);
        }
      });
    }
  };

  useEffect(() => {
    loadContacts();
    isUserAuthenticated();
  }, []);

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {isMobile ? (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="max-w-md text-center bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Monitor className="h-16 w-16 text-slate-600" />
                <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-1">
                  <Smartphone className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-3">
              Desktop Experience Recommended
            </h2>

            <p className="text-slate-600 mb-6 leading-relaxed">
              For the best experience and full functionality, please access this
              website on a desktop or laptop computer.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Why desktop?</span> This
                application is optimized for larger screens and enhanced
                interactions.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
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
        </>
      )}

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

      {/* Mobile Warning Dialog */}
      {/* Removed mobile warning dialog as redirect is implemented */}
    </div>
  );
}
