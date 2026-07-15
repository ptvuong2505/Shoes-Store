import { accountApi } from "@/features/account/api/account.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toApiClientError } from "@/shared/api/api-error";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/features/account/schemas/account.schemas";
import { Loader2 } from "lucide-react";

function SecurityPage() {
  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: ChangePasswordFormValues) =>
      accountApi.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }),
    onSuccess: () => form.reset(),
  });

  const error = mutation.error ? toApiClientError(mutation.error) : null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Security Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your password and account security.
        </p>
      </div>

      <div className="rounded-xl border border-border/60 bg-card">
        <div className="border-b border-border/40 px-6 py-4">
          <h2 className="text-base font-semibold">Change Password</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Use a strong, unique password that you don&apos;t use elsewhere.
          </p>
        </div>

        <form
          className="p-6"
          noValidate
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          <div className="max-w-md space-y-5">
            <PasswordField
              label="Current Password"
              placeholder="Enter current password"
              error={form.formState.errors.currentPassword?.message}
              {...form.register("currentPassword")}
            />
            <PasswordField
              label="New Password"
              placeholder="At least 8 characters"
              error={form.formState.errors.newPassword?.message}
              {...form.register("newPassword")}
            />
            <PasswordField
              label="Confirm New Password"
              placeholder="Re-enter new password"
              error={form.formState.errors.confirmPassword?.message}
              {...form.register("confirmPassword")}
            />
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
              {error.message}
            </div>
          )}
          {mutation.isSuccess && (
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-600 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400">
              Password updated successfully.
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-all duration-150 hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
            >
              {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
              {mutation.isPending ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { forwardRef, type InputHTMLAttributes } from "react";

interface PasswordFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ label, error, ...props }, ref) => (
    <div className="space-y-1.5">
      <label className="text-[13px] font-medium text-foreground/80">{label}</label>
      <input
        ref={ref}
        type="password"
        aria-invalid={Boolean(error)}
        className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors duration-150 focus:border-foreground/30 focus:outline-none focus:ring-2 focus:ring-foreground/10 aria-invalid:border-red-500 aria-invalid:focus:border-red-500 aria-invalid:focus:ring-red-500/10"
        {...props}
      />
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  ),
);
PasswordField.displayName = "PasswordField";

export default SecurityPage;
