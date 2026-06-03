import * as signalR from "@microsoft/signalr";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { mapMessageDtoToChatMessage } from "@/features/chat/api/chat.api";
import type {
  ChatMessageDto,
  ChatMessage,
  ConnectionStatus,
  SendChatMessageInput,
} from "@/features/chat/types/chat.types";

interface UseChatConnectionOptions {
  conversationId: string;
  initialMessages: ChatMessage[];
  token?: string;
  mode: "customer" | "admin";
  onReceiveMessage?: (message: ChatMessage) => void;
}

export const useChatConnection = ({
  conversationId,
  initialMessages,
  token,
  mode,
  onReceiveMessage,
}: UseChatConnectionOptions) => {
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const onReceiveMessageRef = useRef(onReceiveMessage);
  const [status, setStatus] = useState<ConnectionStatus>("idle");
  const [localMessagesByConversation, setLocalMessagesByConversation] =
    useState<Record<string, ChatMessage[]>>({});

  useEffect(() => {
    onReceiveMessageRef.current = onReceiveMessage;
  }, [onReceiveMessage]);

  useEffect(() => {
    if (!token) {
      const disconnectedTimer = window.setTimeout(() => {
        setStatus("disconnected");
      }, 0);

      return () => window.clearTimeout(disconnectedTimer);
    }

    const hubUrl = `${getApiRootUrl()}/hubs/chat`;
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    connectionRef.current = connection;

    connection.on("ReceiveMessage", (messageDto: ChatMessageDto) => {
      const message = mapMessageDtoToChatMessage(messageDto);
      const nextConversationId =
        mode === "admin"
          ? getAdminConversationId(message, token)
          : conversationId;

      setLocalMessagesByConversation((currentMessages) => {
        const currentConversationMessages =
          currentMessages[nextConversationId] ?? [];
        const alreadyExists = currentConversationMessages.some(
          (currentMessage) => currentMessage.id === message.id,
        );

        if (alreadyExists) return currentMessages;

        return {
          ...currentMessages,
          [nextConversationId]: [...currentConversationMessages, message],
        };
      });

      onReceiveMessageRef.current?.(message);
    });

    connection.onreconnecting(() => setStatus("reconnecting"));
    connection.onreconnected(() => setStatus("connected"));
    connection.onclose(() => setStatus("disconnected"));

    const connectingTimer = window.setTimeout(() => {
      setStatus("connecting");
    }, 0);

    void connection
      .start()
      .then(() => setStatus("connected"))
      .catch(() => setStatus("disconnected"));

    return () => {
      window.clearTimeout(connectingTimer);
      connectionRef.current = null;
      void connection.stop();
    };
  }, [conversationId, mode, token]);

  const messages =
    localMessagesByConversation[conversationId] ?? initialMessages;

  const sendMessage = useCallback(
    async (input: SendChatMessageInput) => {
      if (!connectionRef.current || status !== "connected") {
        throw new Error("Chat connection is not ready.");
      }

      if (mode === "admin") {
        if (!input.toUserId) {
          throw new Error("Customer id is required.");
        }

        await connectionRef.current.invoke("SendAdminMessage", {
          toUserId: input.toUserId,
          message: input.content,
        });
      } else {
        await connectionRef.current.invoke("SendCustomerMessage", {
          message: input.content,
        });
      }
    },
    [mode, status],
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

const getApiRootUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL as string;
  return apiUrl.replace(/\/api\/?$/, "");
};

const getAdminConversationId = (message: ChatMessage, token: string) => {
  const currentUserId = getUserIdFromJwt(token);
  return message.senderRole === "customer" || message.senderId !== currentUserId
    ? message.senderId
    : message.conversationId.split(":").find((id) => id !== currentUserId) ??
        message.conversationId;
};

const getUserIdFromJwt = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1] ?? ""));
    return (
      payload[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ] ??
      payload.nameid ??
      payload.sub ??
      ""
    );
  } catch {
    return "";
  }
};
