export type ChatSenderRole = "customer" | "admin";

export type ConnectionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected";

export interface ChatParticipant {
  id: string;
  name: string;
  role: ChatSenderRole;
  email?: string;
  avatarUrl?: string;
  initials: string;
  isOnline: boolean;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: ChatSenderRole;
  content: string;
  createdAt: string;
  status?: "sent" | "delivered" | "read";
}

export interface ChatConversation {
  id: string;
  customer: ChatParticipant;
  admin: ChatParticipant;
  messages: ChatMessage[];
  unreadCount: number;
  lastMessageAt: string;
  orderHint?: string;
  isTyping?: boolean;
}

export interface SendChatMessageInput {
  conversationId: string;
  senderId: string;
  senderRole: ChatSenderRole;
  content: string;
}
