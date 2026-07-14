import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { authApi } from "@/features/auth/api/auth.api";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/features/auth/schemas/auth.schemas";
import {
  AuthAlert,
  AuthFormHeader,
  AuthInput,
  AuthSubmitButton,
  PasswordInput,
} from "@/features/auth/ui/AuthForm";
import { toApiClientError } from "@/shared/api/api-error";

export default function RegisterPage() {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });
  const mutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: () => form.reset(),
  });
  const error = mutation.error ? toApiClientError(mutation.error) : null;

  return (
    <div className="space-y-7">
      <AuthFormHeader
        title="Create your account"
        description="Save favorites, track every order and check out faster on your next visit."
      />

      {error && (
        <AuthAlert>
          {error.message}
          {error.details?.registration && (
            <ul className="mt-1 list-disc pl-4">
              {error.details.registration.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          )}
        </AuthAlert>
      )}
      {mutation.isSuccess && (
        <AuthAlert variant="success">
          Account created. You can now sign in.
        </AuthAlert>
      )}

      <form
        className="space-y-4"
        noValidate
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      >
        <AuthInput
          id="fullName"
          label="Full name"
          placeholder="Your full name"
          autoComplete="name"
          error={form.formState.errors.fullName?.message}
          {...form.register("fullName")}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <AuthInput
            id="registerEmail"
            type="email"
            label="Email address"
            placeholder="you@example.com"
            autoComplete="email"
            error={form.formState.errors.email?.message}
            {...form.register("email")}
          />
          <AuthInput
            id="phone"
            type="tel"
            label="Phone number"
            placeholder="Your phone number"
            autoComplete="tel"
            error={form.formState.errors.phone?.message}
            {...form.register("phone")}
          />
        </div>
        <PasswordInput
          id="registerPassword"
          label="Password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          error={form.formState.errors.password?.message}
          {...form.register("password")}
        />
        <PasswordInput
          id="confirmPassword"
          label="Confirm password"
          placeholder="Enter the password again"
          autoComplete="new-password"
          error={form.formState.errors.confirmPassword?.message}
          {...form.register("confirmPassword")}
        />
        <AuthSubmitButton loading={mutation.isPending}>
          {mutation.isPending ? "Creating account..." : "Create account"}
        </AuthSubmitButton>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/auth/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
