import { createFileRoute, redirect } from "@tanstack/react-router";
import { OtpVerificationPage } from "@/features/auth/pages/OtpVerificationPage";

interface EmailSearch {
  email: string;
}

export const Route = createFileRoute("/auth/otp-verification")({
  validateSearch: (search: Record<string, unknown>): EmailSearch => ({
    email: typeof search.email === "string" ? search.email : "",
  }),
  beforeLoad: ({ search }) => {
    if (!search.email) throw redirect({ to: "/auth/forgot-password" });
  },
  component: OtpRoute,
});

function OtpRoute() {
  return <OtpVerificationPage email={Route.useSearch().email} />;
}
