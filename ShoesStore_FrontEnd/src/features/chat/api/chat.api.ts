import type {
  ChatConversation,
  ChatConversationDto,
  ChatMessage,
  ChatMessageDto,
  SendAdminChatMessageRequest,
  SendCustomerChatMessageRequest,
} from "@/features/chat/types/chat.types";
import axiosClient from "@/shared/api/axiosClient";

const getMyConversation = async (): Promise<ChatConversationDto> => {
  return axiosClient.get("/chat/my-conversation");
};

const getAdminConversations = async (): Promise<ChatConversationDto[]> => {
  return axiosClient.get("/chat/admin/conversations");
};

const sendCustomerMessage = async (
  request: SendCustomerChatMessageRequest,
): Promise<ChatMessageDto> => {
  return axiosClient.post("/chat/customer/send", request);
};

const sendAdminMessage = async (
  request: SendAdminChatMessageRequest,
): Promise<ChatMessageDto> => {
  return axiosClient.post("/chat/admin/send", request);
};

const markConversationAsRead = async (otherUserId: string): Promise<void> => {
  return axiosClient.patch(`/chat/read/${otherUserId}`);
};

const formatMessageTime = (value: string) =>
  new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

export const mapMessageDtoToChatMessage = (
  message: ChatMessageDto,
): ChatMessage => ({
  id: message.id,
  conversationId: getConversationId(message.fromUserId, message.toUserId),
  senderId: message.fromUserId,
  senderRole: message.senderRole === "Admin" ? "admin" : "customer",
  content: message.message,
  createdAt: formatMessageTime(message.sentAt),
  status: message.isRead ? "read" : "delivered",
});

export const mapConversationDtoToChatConversation = (
  conversation: ChatConversationDto,
  adminId?: string,
): ChatConversation => {
  const messages = conversation.messages.map(mapMessageDtoToChatMessage);
  const firstAdminMessage = conversation.messages.find(
    (message) => message.senderRole === "Admin",
  );
  const inferredAdminId = adminId ?? firstAdminMessage?.fromUserId ?? "admin";

  return {
    id: conversation.customerId,
    customer: {
      id: conversation.customerId,
      name: conversation.customerName,
      role: "customer",
      email: conversation.customerEmail,
      avatarUrl: conversation.customerAvatarUrl,
      initials: getInitials(conversation.customerName),
      isOnline: false,
    },
    admin: {
      id: inferredAdminId,
      name: "Shoe Store Support",
      role: "admin",
      initials: "SS",
      isOnline: true,
    },
    messages,
    unreadCount: conversation.unreadCount,
    lastMessageAt: conversation.lastMessageAt
      ? formatMessageTime(conversation.lastMessageAt)
      : "",
    orderHint: conversation.customerEmail ?? "Ho tro khach hang",
  };
};

const getConversationId = (firstUserId: string, secondUserId: string) =>
  [firstUserId, secondUserId].sort().join(":");

const getInitials = (name: string) => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const initials = words.slice(-2).map((word) => word[0]).join("");
  return initials.toUpperCase() || "KH";
};

export const chatApi = {
  getMyConversation,
  getAdminConversations,
  sendCustomerMessage,
  sendAdminMessage,
  markConversationAsRead,
};
