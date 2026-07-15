import PublicHeader from "@/app/shell/PublicHeader";
import { useAuthStore } from "@/features/auth/model/auth.store";
import useAuth from "@/features/auth/hooks/useAuth";
import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { MapPin, MessageSquare, Package, Shield, User, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Personal Info", path: "/account", icon: User },
  { label: "Order History", path: "/account/order-history", icon: Package },
  { label: "Addresses", path: "/account/addresses", icon: MapPin },
  { label: "My Reviews", path: "/account/reviews", icon: MessageSquare },
  { label: "Security", path: "/account/security", icon: Shield },
] as const;

function AccountLayout() {
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const location = useLocation();
  const [mobileNav, setMobileNav] = useState(false);

  const initials = (user?.fullName ?? "U")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex min-h-dvh flex-col">
      <PublicHeader />

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-6 sm:px-6 lg:px-8">
        {/* Mobile nav toggle */}
        <button
          className="fixed bottom-4 right-4 z-40 flex size-12 items-center justify-center rounded-full bg-foreground text-background shadow-lg lg:hidden"
          onClick={() => setMobileNav(!mobileNav)}
          aria-label={mobileNav ? "Close menu" : "Open menu"}
        >
          {mobileNav ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

        {/* Sidebar overlay (mobile) */}
        {mobileNav && (
          <div
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={() => setMobileNav(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-72 transform bg-background pt-16 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:static lg:z-auto lg:w-64 lg:transform-none lg:pt-0 ${
            mobileNav ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="flex h-full flex-col overflow-y-auto border-r border-border/40 px-3 py-6 lg:sticky lg:top-16 lg:h-[calc(100dvh-4rem)] lg:border-r-0 lg:pr-0">
            {/* User info */}
            <div className="mb-6 flex items-center gap-3 px-3">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName ?? "User"}
                  className="size-10 rounded-full object-cover ring-2 ring-border"
                />
              ) : (
                <div className="flex size-10 items-center justify-center rounded-full bg-foreground text-sm font-bold text-background">
                  {initials}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{user?.fullName ?? "User"}</p>
                <p className="truncate text-xs text-muted-foreground">{user?.email ?? ""}</p>
              </div>
            </div>

            {/* Nav links */}
            <nav className="flex-1 space-y-0.5">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.path === "/account"
                    ? location.pathname === "/account"
                    : location.pathname.startsWith(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileNav(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
                      isActive
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    }`}
                  >
                    <item.icon className="size-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Sign out */}
            <div className="mt-auto border-t border-border/40 pt-4">
              <button
                onClick={logout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 transition-colors duration-150 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <LogOut className="size-4" />
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 lg:max-w-3xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AccountLayout;
