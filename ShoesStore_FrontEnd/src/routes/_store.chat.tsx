import { createFileRoute } from "@tanstack/react-router";
import { Chat } from "@/features/chat/pages/Chat";

export const Route = createFileRoute("/_store/chat")({ component: Chat });
