import { useMemo, useState, type KeyboardEvent } from "react";
import {
  ArrowLeft,
  CheckCheck,
  MessageCircle,
  Send,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { customerConversation } from "@/features/chat/data/chat.mock";
import { useChatConnection } from "@/features/chat/hooks/useChatConnection";
import type { ChatMessage } from "@/features/chat/types/chat.types";
import { Avatar, AvatarBadge, AvatarFallback } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { cn } from "@/shared/lib/utils";

export const Chat = () => {
  const [messageText, setMessageText] = useState("");
  const initialMessages = useMemo(
    () => customerConversation.messages,
    [],
  );
  const { messages, sendMessage, isConnected, status } = useChatConnection({
    conversationId: customerConversation.id,
    initialMessages,
  });

  const handleSendMessage = async () => {
    const content = messageText.trim();

    if (!content) return;

    await sendMessage({
      conversationId: customerConversation.id,
      senderId: customerConversation.customer.id,
      senderRole: "customer",
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
    <main className="min-h-[calc(100vh-80px)] bg-background px-4 py-6 sm:px-6 lg:px-8">
      <section className="mx-auto flex h-[calc(100vh-128px)] min-h-[620px] max-w-4xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-background-dark/40">
        <header className="flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-4 dark:border-slate-800 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Button asChild variant="ghost" size="icon-sm" className="shrink-0">
              <Link to="/">
                <ArrowLeft />
                <span className="sr-only">Quay lai</span>
              </Link>
            </Button>

            <Avatar size="lg" className="bg-primary/10 text-primary">
              <AvatarFallback className="bg-primary/10 font-bold text-primary">
                {customerConversation.admin.initials}
              </AvatarFallback>
              <AvatarBadge className="bg-green-500" />
            </Avatar>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-base font-extrabold text-slate-950 dark:text-white sm:text-lg">
                  Ho tro khach hang
                </h1>
                <ShieldCheck className="size-4 shrink-0 text-primary" />
              </div>
              <p className="truncate text-xs font-medium text-slate-500 sm:text-sm">
                {isConnected
                  ? "Dang online - thuong phan hoi trong vai phut"
                  : `Ket noi ${status}`}
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-xs font-bold text-primary sm:flex">
            <MessageCircle className="size-4" />
            {customerConversation.orderHint}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-slate-50/70 px-4 py-5 dark:bg-slate-950/20 sm:px-6">
          <div className="mx-auto flex max-w-3xl flex-col gap-4">
            <div className="self-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              Hom nay
            </div>

            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {customerConversation.isTyping && (
              <div className="flex items-end gap-2">
                <Avatar size="sm" className="bg-primary/10 text-primary">
                  <AvatarFallback className="bg-primary/10 text-[10px] font-bold text-primary">
                    {customerConversation.admin.initials}
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

        <footer className="border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-background-dark/60 sm:p-5">
          <div className="mx-auto flex max-w-3xl items-end gap-3">
            <Textarea
              value={messageText}
              onChange={(event) => setMessageText(event.target.value)}
              onKeyDown={handleComposerKeyDown}
              placeholder="Nhap tin nhan cho admin..."
              className="max-h-32 min-h-11 resize-none rounded-lg bg-slate-50 text-sm shadow-none dark:bg-slate-900"
            />
            <Button
              size="icon-lg"
              onClick={() => void handleSendMessage()}
              disabled={!messageText.trim()}
              className="shrink-0 rounded-lg"
            >
              <Send />
              <span className="sr-only">Gui tin nhan</span>
            </Button>
          </div>
        </footer>
      </section>
    </main>
  );
};

const MessageBubble = ({ message }: { message: ChatMessage }) => {
  const isCustomer = message.senderRole === "customer";

  return (
    <div
      className={cn(
        "flex items-end gap-2",
        isCustomer ? "justify-end" : "justify-start",
      )}
    >
      {!isCustomer && (
        <Avatar size="sm" className="bg-primary/10 text-primary">
          <AvatarFallback className="bg-primary/10 text-[10px] font-bold text-primary">
            SS
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "max-w-[78%] rounded-lg px-4 py-3 text-sm leading-relaxed shadow-sm",
          isCustomer
            ? "rounded-br-sm bg-primary text-white"
            : "rounded-bl-sm border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100",
        )}
      >
        <p>{message.content}</p>
        <div
          className={cn(
            "mt-1 flex items-center justify-end gap-1 text-[10px] font-semibold",
            isCustomer ? "text-white/75" : "text-slate-400",
          )}
        >
          <span>{message.createdAt}</span>
          {isCustomer && <CheckCheck className="size-3" />}
        </div>
      </div>
    </div>
  );
};
