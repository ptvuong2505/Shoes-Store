import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { authApi } from "@/features/auth/api/auth.api";
import { passwordResetSession } from "@/features/auth/model/password-reset";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/features/auth/schemas/auth.schemas";
import {
  AuthAlert,
  AuthFormHeader,
  AuthSubmitButton,
  PasswordInput,
} from "@/features/auth/ui/AuthForm";
import { toApiClientError } from "@/shared/api/api-error";

export function ResetPasswordPage() {
  const session = passwordResetSession.read();
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });
  const mutation = useMutation({
    mutationFn: (values: ResetPasswordFormValues) => {
      if (!session) throw new Error("Password reset session is missing.");
      return authApi.resetPassword({ ...session, ...values });
    },
    onSuccess: () => {
      passwordResetSession.clear();
      form.reset();
    },
  });
  const error = mutation.error ? toApiClientError(mutation.error) : null;

  return (
    <div className="space-y-8">
      <AuthFormHeader
        title="Choose a new password"
        description={`Create a secure password for ${session?.email ?? "your account"}.`}
      />
      {error && (
        <AuthAlert>
          {error.message}
          {error.details?.newPassword && (
            <ul className="mt-1 list-disc pl-4">
              {error.details.newPassword.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          )}
        </AuthAlert>
      )}
      {mutation.isSuccess && (
        <AuthAlert variant="success">Your password has been updated.</AuthAlert>
      )}

      {!mutation.isSuccess && (
        <form
          className="space-y-5"
          noValidate
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          <PasswordInput
            id="newPassword"
            label="New password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            error={form.formState.errors.newPassword?.message}
            {...form.register("newPassword")}
          />
          <PasswordInput
            id="confirmNewPassword"
            label="Confirm new password"
            placeholder="Enter the password again"
            autoComplete="new-password"
            error={form.formState.errors.confirmPassword?.message}
            {...form.register("confirmPassword")}
          />
          <AuthSubmitButton loading={mutation.isPending}>
            {mutation.isPending ? "Updating password..." : "Update password"}
          </AuthSubmitButton>
        </form>
      )}

      {mutation.isSuccess && (
        <Link
          to="/auth/login"
          className="flex h-12 w-full items-center justify-center rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground"
        >
          Continue to sign in
        </Link>
      )}
    </div>
  );
}
