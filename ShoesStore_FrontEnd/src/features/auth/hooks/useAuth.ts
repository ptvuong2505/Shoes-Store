import { useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { authApi } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/features/auth/model/auth.store";
import { toApiClientError } from "@/shared/api/api-error";

export default function useAuth() {
  const navigate = useNavigate();
  const router = useRouter();
  const clearSession = useAuthStore((state) => state.clearSession);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await authApi.logout();
    } catch (requestError) {
      setError(toApiClientError(requestError).message);
    } finally {
      clearSession();
      await router.invalidate();
      await navigate({ to: "/", replace: true });
      setLoading(false);
    }
  };

  return { logout, loading, error };
}
