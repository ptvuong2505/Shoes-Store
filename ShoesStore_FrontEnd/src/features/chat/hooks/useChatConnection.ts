import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  ChatMessage,
  ConnectionStatus,
  SendChatMessageInput,
} from "@/features/chat/types/chat.types";

interface UseChatConnectionOptions {
  conversationId: string;
  initialMessages: ChatMessage[];
  token?: string;
}

export const useChatConnection = ({
  conversationId,
  initialMessages,
}: UseChatConnectionOptions) => {
  const [connectedConversationId, setConnectedConversationId] = useState<
    string | null
  >(null);
  const [localMessagesByConversation, setLocalMessagesByConversation] =
    useState<Record<string, ChatMessage[]>>({});

  useEffect(() => {
    const connectionTimer = window.setTimeout(() => {
      setConnectedConversationId(conversationId);
    }, 300);

    return () => {
      window.clearTimeout(connectionTimer);
    };
  }, [conversationId]);

  const messages =
    localMessagesByConversation[conversationId] ?? initialMessages;
  const status: ConnectionStatus =
    connectedConversationId === conversationId ? "connected" : "connecting";

  const sendMessage = useCallback(
    async (input: SendChatMessageInput) => {
      const nextMessage: ChatMessage = {
        id: `local-${Date.now()}`,
        conversationId: input.conversationId,
        senderId: input.senderId,
        senderRole: input.senderRole,
        content: input.content,
        createdAt: new Intl.DateTimeFormat("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date()),
        status: "sent",
      };

      setLocalMessagesByConversation((currentMessages) => ({
        ...currentMessages,
        [input.conversationId]: [
          ...(currentMessages[input.conversationId] ?? initialMessages),
          nextMessage,
        ],
      }));

      return nextMessage;
    },
    [initialMessages],
  );

  return useMemo(
    () => ({
      status,
      messages,
      sendMessage,
      isConnected: status === "connected",
    }),
    [messages, sendMessage, status],
  );
};
