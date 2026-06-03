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
  toUserId?: string;
}

export interface ChatMessageDto {
  id: string;
  fromUserId: string;
  toUserId: string;
  message: string;
  isRead: boolean;
  sentAt: string;
  senderName: string;
  senderRole: "Admin" | "Customer";
}

export interface ChatConversationDto {
  customerId: string;
  customerName: string;
  customerEmail?: string;
  customerAvatarUrl?: string;
  unreadCount: number;
  lastMessageAt?: string;
  lastMessage?: ChatMessageDto;
  messages: ChatMessageDto[];
}

export interface SendCustomerChatMessageRequest {
  message: string;
}

export interface SendAdminChatMessageRequest {
  toUserId: string;
  message: string;
}
