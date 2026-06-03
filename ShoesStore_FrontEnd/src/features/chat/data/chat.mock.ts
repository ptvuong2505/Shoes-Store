import type {
  ChatConversation,
  ChatMessage,
  ChatParticipant,
} from "@/features/chat/types/chat.types";

export const supportAdmin: ChatParticipant = {
  id: "admin-support",
  name: "Shoe Store Support",
  role: "admin",
  email: "support@shoestore.vn",
  initials: "SS",
  isOnline: true,
};

const customerMessages: ChatMessage[] = [
  {
    id: "msg-customer-1",
    conversationId: "conversation-current-customer",
    senderId: "admin-support",
    senderRole: "admin",
    content: "Chao ban, Shoe Store co the ho tro gi cho don hang cua ban?",
    createdAt: "09:15",
    status: "read",
  },
  {
    id: "msg-customer-2",
    conversationId: "conversation-current-customer",
    senderId: "customer-current",
    senderRole: "customer",
    content: "Minh muon doi size doi Nike Air vua dat hom qua.",
    createdAt: "09:17",
    status: "read",
  },
  {
    id: "msg-customer-3",
    conversationId: "conversation-current-customer",
    senderId: "admin-support",
    senderRole: "admin",
    content:
      "Duoc ban nhe. Ban gui minh ma don hang, minh kiem tra size con hang.",
    createdAt: "09:18",
    status: "delivered",
  },
];

export const customerConversation: ChatConversation = {
  id: "conversation-current-customer",
  customer: {
    id: "customer-current",
    name: "Nguyen Minh Anh",
    role: "customer",
    email: "minhanh@example.com",
    initials: "MA",
    isOnline: true,
  },
  admin: supportAdmin,
  messages: customerMessages,
  unreadCount: 0,
  lastMessageAt: "09:18",
  orderHint: "#ORD-2405",
  isTyping: true,
};

export const adminConversations: ChatConversation[] = [
  customerConversation,
  {
    id: "conversation-lan",
    customer: {
      id: "customer-lan",
      name: "Tran Ha Lan",
      role: "customer",
      email: "halan@example.com",
      initials: "HL",
      isOnline: true,
    },
    admin: supportAdmin,
    messages: [
      {
        id: "msg-lan-1",
        conversationId: "conversation-lan",
        senderId: "customer-lan",
        senderRole: "customer",
        content: "Shop oi, giay Adidas Samba con mau trang size 38 khong?",
        createdAt: "10:02",
        status: "delivered",
      },
      {
        id: "msg-lan-2",
        conversationId: "conversation-lan",
        senderId: "admin-support",
        senderRole: "admin",
        content: "Con ban nhe, hien kho Ha Noi con 4 doi size 38.",
        createdAt: "10:04",
        status: "sent",
      },
    ],
    unreadCount: 2,
    lastMessageAt: "10:04",
    orderHint: "Dang hoi san pham",
  },
  {
    id: "conversation-khoa",
    customer: {
      id: "customer-khoa",
      name: "Le Dang Khoa",
      role: "customer",
      email: "khoa.le@example.com",
      initials: "DK",
      isOnline: false,
    },
    admin: supportAdmin,
    messages: [
      {
        id: "msg-khoa-1",
        conversationId: "conversation-khoa",
        senderId: "customer-khoa",
        senderRole: "customer",
        content: "Minh can cap nhat dia chi giao hang cho don #ORD-2388.",
        createdAt: "Hom qua",
        status: "read",
      },
    ],
    unreadCount: 0,
    lastMessageAt: "Hom qua",
    orderHint: "#ORD-2388",
  },
  {
    id: "conversation-vy",
    customer: {
      id: "customer-vy",
      name: "Pham Tuong Vy",
      role: "customer",
      email: "tuongvy@example.com",
      initials: "TV",
      isOnline: true,
    },
    admin: supportAdmin,
    messages: [
      {
        id: "msg-vy-1",
        conversationId: "conversation-vy",
        senderId: "customer-vy",
        senderRole: "customer",
        content: "Cho minh xin anh that cua doi Converse Run Star mau den.",
        createdAt: "08:42",
        status: "delivered",
      },
    ],
    unreadCount: 1,
    lastMessageAt: "08:42",
    orderHint: "Can tu van",
    isTyping: true,
  },
];
