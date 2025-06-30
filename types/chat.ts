export interface Contact {
  id: string
  name: string
  avatar: string
  status: "online" | "offline" | "away"
  lastMessage: string
  timestamp: string
  unreadCount: number
  email?: string
}
  
export interface Message {
  id: string
  senderId: string
  content: string
  timestamp: string
  type: "sent" | "received"
}

export interface SearchUser {
  id: string
  name: string
  email: string
  avatar: string
  status: "online" | "offline" | "away"
  isContact: boolean
}
