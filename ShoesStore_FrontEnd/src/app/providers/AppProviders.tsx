import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, type PropsWithChildren } from "react";
import { useAuthStore } from "@/features/auth/model/auth.store";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: { retry: 0 },
  },
});

function AuthBootstrap({ children }: PropsWithChildren) {
  const bootstrap = useAuthStore((state) => state.bootstrap);
  const clearSession = useAuthStore((state) => state.clearSession);
  const status = useAuthStore((state) => state.status);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    void bootstrap().finally(() => setStarted(true));

    const handleExpiredSession = () => clearSession();
    window.addEventListener("auth:session-expired", handleExpiredSession);
    return () =>
      window.removeEventListener("auth:session-expired", handleExpiredSession);
  }, [bootstrap, clearSession]);

  if (!started || status === "checking") {
    return (
      <div className="grid min-h-dvh place-items-center bg-background px-6">
        <div className="h-1 w-24 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
        </div>
      </div>
    );
  }

  return children;
}

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthBootstrap>{children}</AuthBootstrap>
    </QueryClientProvider>
  );
}
