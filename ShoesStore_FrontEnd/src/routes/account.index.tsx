import { createFileRoute } from "@tanstack/react-router";
import ProfilePage from "@/features/account/pages/ProfilePage";

export const Route = createFileRoute("/account/")({ component: ProfilePage });
