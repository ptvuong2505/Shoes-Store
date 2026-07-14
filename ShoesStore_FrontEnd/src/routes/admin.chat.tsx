import { createFileRoute } from "@tanstack/react-router";
import { AdminChatPage } from "@/features/admin/pages/AdminChatPage";

export const Route = createFileRoute("/admin/chat")({
  component: AdminChatPage,
});
