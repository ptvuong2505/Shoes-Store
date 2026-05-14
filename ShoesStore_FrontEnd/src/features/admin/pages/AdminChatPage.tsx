import { useMemo, useState, type KeyboardEvent } from "react";
import {
  CheckCheck,
  Clock3,
  MessageCircle,
  MoreVertical,
  Search,
  Send,
  UserRound,
} from "lucide-react";
import { adminConversations } from "@/features/chat/data/chat.mock";
import { useChatConnection } from "@/features/chat/hooks/useChatConnection";
import type {
  ChatConversation,
  ChatMessage,
} from "@/features/chat/types/chat.types";
import { Avatar, AvatarBadge, AvatarFallback } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { cn } from "@/shared/lib/utils";

export const AdminChatPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeConversationId, setActiveConversationId] = useState(
    adminConversations[0]?.id ?? "",
  );
  const [messageText, setMessageText] = useState("");

  const filteredConversations = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    if (!normalizedTerm) return adminConversations;

    return adminConversations.filter((conversation) => {
      const customer = conversation.customer;

      return (
        customer.name.toLowerCase().includes(normalizedTerm) ||
        customer.email?.toLowerCase().includes(normalizedTerm) ||
        conversation.orderHint?.toLowerCase().includes(normalizedTerm)
      );
    });
  }, [searchTerm]);

  const activeConversation =
    adminConversations.find(
      (conversation) => conversation.id === activeConversationId,
    ) ?? adminConversations[0];

  const initialMessages = useMemo(
    () => activeConversation?.messages ?? [],
    [activeConversation],
  );
  const { messages, sendMessage, status, isConnected } = useChatConnection({
    conversationId: activeConversation?.id ?? "",
    initialMessages,
  });

  const handleSendMessage = async () => {
    const content = messageText.trim();

    if (!content || !activeConversation) return;

    await sendMessage({
      conversationId: activeConversation.id,
      senderId: activeConversation.admin.id,
      senderRole: "admin",
      content,
    });

    setMessageText("");
  };

  const handleComposerKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSendMessage();
    }
  };

  return (
    <div className="flex h-full min-h-screen flex-col bg-background">
      <div className="border-b border-slate-200 bg-white px-8 py-6 dark:border-slate-800 dark:bg-background-dark/40">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Customer Chat
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Quan ly cac cong chat ho tro khach hang theo thoi gian thuc.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            <span
              className={cn(
                "size-2 rounded-full",
                isConnected ? "bg-green-500" : "bg-amber-500",
              )}
            />
            SignalR {status}
          </div>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="flex min-h-0 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-background-dark/30">
          <div className="border-b border-slate-200 p-4 dark:border-slate-800">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Tim customer, email, ma don..."
                className="h-10 rounded-lg bg-slate-50 pl-9 shadow-none dark:bg-slate-900"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            <div className="mb-3 flex items-center justify-between px-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Cong chat
              </p>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                {filteredConversations.length}
              </span>
            </div>

            <div className="space-y-2">
              {filteredConversations.map((conversation) => (
                <ConversationPortal
                  key={conversation.id}
                  conversation={conversation}
                  isActive={conversation.id === activeConversation?.id}
                  onSelect={() => setActiveConversationId(conversation.id)}
                />
              ))}
            </div>
          </div>
        </aside>

        {activeConversation ? (
          <section className="flex min-h-0 flex-col bg-slate-50/80 dark:bg-slate-950/20">
            <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-background-dark/50">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar size="lg" className="bg-slate-100">
                  <AvatarFallback className="bg-slate-100 font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {activeConversation.customer.initials}
                  </AvatarFallback>
                  {activeConversation.customer.isOnline && (
                    <AvatarBadge className="bg-green-500" />
                  )}
                </Avatar>

                <div className="min-w-0">
                  <h3 className="truncate text-base font-extrabold text-slate-950 dark:text-white">
                    {activeConversation.customer.name}
                  </h3>
                  <p className="truncate text-sm text-slate-500">
                    {activeConversation.customer.email} -{" "}
                    {activeConversation.orderHint}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <UserRound />
                  Ho so
                </Button>
                <Button variant="ghost" size="icon-sm">
                  <MoreVertical />
                  <span className="sr-only">Tuy chon</span>
                </Button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto px-5 py-6">
              <div className="mx-auto flex max-w-4xl flex-col gap-4">
                <div className="self-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  Cuoc hoi thoai voi {activeConversation.customer.name}
                </div>

                {messages.map((message) => (
                  <AdminMessageBubble key={message.id} message={message} />
                ))}

                {activeConversation.isTyping && (
                  <div className="flex items-end gap-2">
                    <Avatar size="sm">
                      <AvatarFallback className="bg-slate-100 text-[10px] font-bold text-slate-700">
                        {activeConversation.customer.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-1 rounded-lg rounded-bl-sm border border-slate-200 bg-white px-3 py-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                      <span className="size-1.5 rounded-full bg-slate-400" />
                      <span className="size-1.5 rounded-full bg-slate-400" />
                      <span className="size-1.5 rounded-full bg-slate-400" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <footer className="border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-background-dark/60">
              <div className="mx-auto flex max-w-4xl items-end gap-3">
                <Textarea
                  value={messageText}
                  onChange={(event) => setMessageText(event.target.value)}
                  onKeyDown={handleComposerKeyDown}
                  placeholder={`Tra loi ${activeConversation.customer.name}...`}
                  className="max-h-32 min-h-11 resize-none rounded-lg bg-slate-50 text-sm shadow-none dark:bg-slate-900"
                />
                <Button
                  size="icon-lg"
                  onClick={() => void handleSendMessage()}
                  disabled={!messageText.trim()}
                  className="shrink-0 rounded-lg"
                >
                  <Send />
                  <span className="sr-only">Gui phan hoi</span>
                </Button>
              </div>
            </footer>
          </section>
        ) : (
          <div className="flex items-center justify-center bg-slate-50 p-8 dark:bg-slate-950/20">
            <div className="text-center">
              <MessageCircle className="mx-auto mb-3 size-10 text-slate-300" />
              <p className="font-bold text-slate-700 dark:text-slate-200">
                Chua co cuoc chat nao
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ConversationPortal = ({
  conversation,
  isActive,
  onSelect,
}: {
  conversation: ChatConversation;
  isActive: boolean;
  onSelect: () => void;
}) => {
  const lastMessage = conversation.messages.at(-1);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all",
        isActive
          ? "border-primary/30 bg-primary/10 shadow-sm"
          : "border-transparent hover:border-slate-200 hover:bg-slate-50 dark:hover:border-slate-800 dark:hover:bg-slate-900/60",
      )}
    >
      <Avatar size="lg" className="bg-slate-100">
        <AvatarFallback
          className={cn(
            "font-bold",
            isActive
              ? "bg-primary text-white"
              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
          )}
        >
          {conversation.customer.initials}
        </AvatarFallback>
        {conversation.customer.isOnline && (
          <AvatarBadge className="bg-green-500" />
        )}
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-extrabold text-slate-900 dark:text-white">
            {conversation.customer.name}
          </p>
          <span className="shrink-0 text-[11px] font-semibold text-slate-400">
            {conversation.lastMessageAt}
          </span>
        </div>

        <p className="mt-0.5 truncate text-xs font-medium text-slate-500">
          {conversation.orderHint}
        </p>

        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="truncate text-xs text-slate-500">
            {lastMessage?.content}
          </p>
          {conversation.unreadCount > 0 && (
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

const AdminMessageBubble = ({ message }: { message: ChatMessage }) => {
  const isAdmin = message.senderRole === "admin";

  return (
    <div
      className={cn(
        "flex items-end gap-2",
        isAdmin ? "justify-end" : "justify-start",
      )}
    >
      {!isAdmin && (
        <Avatar size="sm">
          <AvatarFallback className="bg-slate-100 text-[10px] font-bold text-slate-700">
            KH
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "max-w-[72%] rounded-lg px-4 py-3 text-sm leading-relaxed shadow-sm",
          isAdmin
            ? "rounded-br-sm bg-primary text-white"
            : "rounded-bl-sm border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100",
        )}
      >
        <p>{message.content}</p>
        <div
          className={cn(
            "mt-1 flex items-center justify-end gap-1 text-[10px] font-semibold",
            isAdmin ? "text-white/75" : "text-slate-400",
          )}
        >
          <Clock3 className="size-3" />
          <span>{message.createdAt}</span>
          {isAdmin && <CheckCheck className="size-3" />}
        </div>
      </div>
    </div>
  );
};
