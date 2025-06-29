import type { SearchUser } from "@/types/chat"

// Mock API function to search users
export const searchUsers = async (query: string): Promise<SearchUser[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock user database with example contact
  const allUsers: SearchUser[] = [
    // Example contact that will be found when searching "john.doe@example.com"
    {
      id: "example-user-1",
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      isContact: false,
    },
    {
      id: "5",
      name: "Jessica Brown",
      email: "jessica.brown@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      isContact: false,
    },
    {
      id: "6",
      name: "David Miller",
      email: "david.miller@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "away",
      isContact: false,
    },
    {
      id: "7",
      name: "Lisa Anderson",
      email: "lisa.anderson@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "offline",
      isContact: false,
    },
    {
      id: "8",
      name: "Robert Taylor",
      email: "robert.taylor@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      isContact: false,
    },
    {
      id: "9",
      name: "Jennifer Wilson",
      email: "jennifer.wilson@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      isContact: false,
    },
    // Additional example users for testing
    {
      id: "10",
      name: "John Smith",
      email: "john.smith@company.com",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "away",
      isContact: false,
    },
    {
      id: "11",
      name: "Jane Doe",
      email: "jane.doe@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      isContact: false,
    },
  ]

  // Filter users based on search query
  return allUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(query.toLowerCase()) || user.email.toLowerCase().includes(query.toLowerCase()),
  )
}
