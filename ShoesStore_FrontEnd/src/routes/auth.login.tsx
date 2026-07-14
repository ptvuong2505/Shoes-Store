import { createFileRoute } from "@tanstack/react-router";
import LoginPage from "@/features/auth/pages/LoginPage";

interface LoginSearch {
  redirect?: string;
}

export const Route = createFileRoute("/auth/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  component: LoginRoute,
});

function LoginRoute() {
  return <LoginPage redirectTo={Route.useSearch().redirect} />;
}
