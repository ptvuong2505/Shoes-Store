import { useNavigate, useRouter } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/features/auth/model/auth.store";
import { toApiClientError } from "@/shared/api/api-error";

export default function useAuth() {
  const navigate = useNavigate();
  const router = useRouter();
  const clearSession = useAuthStore((state) => state.clearSession);

  const mutation = useMutation({
    mutationFn: authApi.logout,
    onSettled: async () => {
      clearSession();
      await router.invalidate();
      await navigate({ to: "/", replace: true });
    },
  });

  const error = mutation.error ? toApiClientError(mutation.error).message : null;

  return { logout: mutation.mutate, loading: mutation.isPending, error };
}
