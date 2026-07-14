import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { authApi } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/features/auth/model/auth.store";
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/auth.schemas";
import {
  AuthAlert,
  AuthFormHeader,
  AuthInput,
  AuthSubmitButton,
  PasswordInput,
} from "@/features/auth/ui/AuthForm";
import { toApiClientError } from "@/shared/api/api-error";

interface LoginPageProps {
  redirectTo?: string;
}

export default function LoginPage({ redirectTo }: LoginPageProps) {
  const navigate = useNavigate();
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", isRemember: false },
  });
  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: async ({ user, accessToken }) => {
      setSession(user, accessToken);
      await router.invalidate();
      if (redirectTo?.startsWith("/")) {
        window.location.replace(redirectTo);
        return;
      }
      await navigate({ to: "/", replace: true });
    },
  });

  const error = mutation.error ? toApiClientError(mutation.error) : null;

  return (
    <div className="space-y-8">
      <AuthFormHeader
        title="Welcome back"
        description="Enter your account details to continue shopping and manage your orders."
      />

      {error && <AuthAlert>{error.message}</AuthAlert>}

      <form
        className="space-y-5"
        noValidate
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      >
        <AuthInput
          id="email"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          autoComplete="email"
          error={form.formState.errors.email?.message}
          {...form.register("email")}
        />
        <PasswordInput
          id="password"
          label="Password"
          placeholder="Enter your password"
          autoComplete="current-password"
          error={form.formState.errors.password?.message}
          {...form.register("password")}
        />

        <div className="flex items-center justify-between gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              className="size-4 rounded border-input accent-primary"
              {...form.register("isRemember")}
            />
            Remember me
          </label>
          <Link
            to="/auth/forgot-password"
            className="text-sm font-semibold text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <AuthSubmitButton loading={mutation.isPending}>
          {mutation.isPending ? "Signing in..." : "Sign in"}
        </AuthSubmitButton>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        New to Shoes Store?{" "}
        <Link to="/auth/register" className="font-semibold text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
