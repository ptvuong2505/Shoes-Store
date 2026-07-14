import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { authApi } from "@/features/auth/api/auth.api";
import {
  emailSchema,
  type EmailFormValues,
} from "@/features/auth/schemas/auth.schemas";
import {
  AuthAlert,
  AuthFormHeader,
  AuthInput,
  AuthSubmitButton,
} from "@/features/auth/ui/AuthForm";
import { toApiClientError } from "@/shared/api/api-error";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });
  const mutation = useMutation({
    mutationFn: authApi.sendOtp,
    onSuccess: async (_, email) => {
      await navigate({
        to: "/auth/otp-verification",
        search: { email },
        replace: true,
      });
    },
  });
  const error = mutation.error ? toApiClientError(mutation.error) : null;

  return (
    <div className="space-y-8">
      <AuthFormHeader
        title="Reset your password"
        description="Enter the email linked to your account. We will send a six-digit verification code."
      />
      {error && <AuthAlert>{error.message}</AuthAlert>}
      <form
        className="space-y-5"
        noValidate
        onSubmit={form.handleSubmit(({ email }) => mutation.mutate(email))}
      >
        <AuthInput
          id="recoveryEmail"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          autoComplete="email"
          error={form.formState.errors.email?.message}
          {...form.register("email")}
        />
        <AuthSubmitButton loading={mutation.isPending}>
          {mutation.isPending ? "Sending code..." : "Send verification code"}
        </AuthSubmitButton>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Remembered your password?{" "}
        <Link to="/auth/login" className="font-semibold text-primary hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
