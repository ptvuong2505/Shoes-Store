import { accountApi } from "@/features/account/api/account.api";
import { useAuthStore } from "@/features/auth/model/auth.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { profileSchema, type ProfileFormValues } from "@/features/account/schemas/account.schemas";
import { toApiClientError } from "@/shared/api/api-error";
import { BadgeCheck, Camera, Loader2 } from "lucide-react";

function ProfilePage() {
  const setAuthUser = useAuthStore((s) => s.setUser);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: accountApi.getProfile,
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: user
      ? {
          fullName: user.fullName ?? "",
          phone: user.phone ?? "",
          birthDate: user.birthDate?.slice(0, 10) ?? "",
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: (values: ProfileFormValues) =>
      accountApi.updateProfile({
        fullName: values.fullName,
        phone: values.phone,
        birthDate: values.birthDate || undefined,
      }),
    onSuccess: (updated) => {
      setAuthUser(updated);
      queryClient.setQueryData(["profile"], updated);
    },
  });

  const avatarMutation = useMutation({
    mutationFn: (file: File) => accountApi.uploadAvatar(file),
    onSuccess: ({ avatarUrl }) => {
      const updated = { ...user!, avatarUrl };
      setAuthUser(updated);
      queryClient.setQueryData(["profile"], updated);
    },
  });

  const error = mutation.error ? toApiClientError(mutation.error) : null;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    avatarMutation.mutate(file);
  };

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const initials = (user.fullName ?? user.userName ?? "U")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Personal Information</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your personal details and how we contact you.
        </p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative group">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.fullName ?? "Avatar"}
              className="size-20 rounded-full object-cover ring-2 ring-border"
            />
          ) : (
            <div className="flex size-20 items-center justify-center rounded-full bg-muted text-xl font-bold text-muted-foreground ring-2 ring-border">
              {initials}
            </div>
          )}
          {avatarMutation.isPending && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
              <Loader2 className="size-5 animate-spin text-white" />
            </div>
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-0.5 -right-0.5 flex size-7 items-center justify-center rounded-full bg-foreground text-background shadow-sm transition-transform duration-150 hover:scale-110"
          >
            <Camera className="size-3.5" />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
        </div>
        <div>
          <p className="text-sm font-semibold">{user.fullName ?? "User"}</p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            {user.email}
            {user.emailConfirmed && <BadgeCheck className="size-3.5 text-emerald-500" />}
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        noValidate
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        className="space-y-6"
      >
        <div className="rounded-xl border border-border/60 bg-card p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <ProfileField
              label="Full Name"
              placeholder="Your full name"
              error={form.formState.errors.fullName?.message}
              {...form.register("fullName")}
            />
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-foreground/80">Email</label>
              <input
                type="email"
                value={user.email ?? ""}
                disabled
                className="h-10 w-full rounded-lg border border-border bg-muted px-3 text-sm text-muted-foreground cursor-not-allowed"
              />
            </div>
            <ProfileField
              label="Phone Number"
              placeholder="Your phone number"
              type="tel"
              error={form.formState.errors.phone?.message}
              {...form.register("phone")}
            />
            <ProfileField
              label="Date of Birth"
              type="date"
              error={form.formState.errors.birthDate?.message}
              {...form.register("birthDate")}
            />
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
            {error.message}
          </div>
        )}
        {mutation.isSuccess && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-600 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400">
            Profile updated successfully.
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-all duration-150 hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
          >
            {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

import { forwardRef, type InputHTMLAttributes } from "react";

interface ProfileFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const ProfileField = forwardRef<HTMLInputElement, ProfileFieldProps>(
  ({ label, error, ...props }, ref) => (
    <div className="space-y-1.5">
      <label className="text-[13px] font-medium text-foreground/80">{label}</label>
      <input
        ref={ref}
        aria-invalid={Boolean(error)}
        className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors duration-150 focus:border-foreground/30 focus:outline-none focus:ring-2 focus:ring-foreground/10 aria-invalid:border-red-500 aria-invalid:focus:border-red-500 aria-invalid:focus:ring-red-500/10"
        {...props}
      />
      {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}
    </div>
  ),
);
ProfileField.displayName = "ProfileField";

export default ProfilePage;
