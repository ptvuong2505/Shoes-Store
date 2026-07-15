import { Link } from "@tanstack/react-router";
import { Menu, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/features/auth/model/auth.store";
import { UserDropdown } from "@/app/shell/UserDropdown";
import useAuth from "@/features/auth/hooks/useAuth";
import logo from "@/shared/assets/logo.webp";

const NAV_ITEMS = [
  { label: "Home", path: "/" },
  { label: "Shop", path: "/products" },
  { label: "Chat", path: "/chat" },
] as const;

function PublicHeader() {
  const { isAuthenticated, user } = useAuthStore();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-2.5">
          <img
            src={logo}
            alt="Shoes Store"
            className="size-8 rounded-lg object-cover transition-transform duration-200 group-hover:scale-105"
          />
          <span className="text-[17px] font-extrabold tracking-tight">
            Shoes Store
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="relative rounded-lg px-3.5 py-2 text-[13px] font-medium text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
              activeProps={{
                className: "bg-accent text-foreground font-semibold",
              }}
              activeOptions={{ exact: item.path === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          {/* Cart */}
          <Link
            to="/cart"
            className="relative rounded-lg p-2 text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
          >
            <ShoppingCart className="size-4.5" />
          </Link>

          {/* Auth desktop */}
          <div className="hidden md:flex">
            {!isAuthenticated ? (
              <div className="ml-1.5 flex items-center gap-1.5">
                <Link
                  to="/auth/login"
                  className="rounded-lg px-3.5 py-2 text-[13px] font-medium text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
                >
                  Sign in
                </Link>
                <Link
                  to="/auth/register"
                  className="rounded-lg bg-foreground px-4 py-2 text-[13px] font-semibold text-background transition-all duration-150 hover:bg-foreground/90 active:scale-[0.98]"
                >
                  Sign up
                </Link>
              </div>
            ) : (
              <div className="ml-1.5">
                <UserDropdown user={user} logout={logout} />
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="rounded-lg p-2 text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
          mobileOpen ? "max-h-112 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="space-y-0.5 border-t border-border/40 px-4 pb-4 pt-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-[14px] font-medium text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
              activeProps={{
                className: "bg-accent text-foreground font-semibold",
              }}
              activeOptions={{ exact: item.path === "/" }}
            >
              {item.label}
            </Link>
          ))}

          <div className="mt-3! border-t border-border/40 pt-3">
            {!isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <Link
                  to="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg border border-border px-3.5 py-2.5 text-center text-[14px] font-medium transition-colors duration-150 hover:bg-accent"
                >
                  Sign in
                </Link>
                <Link
                  to="/auth/register"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg bg-foreground px-3.5 py-2.5 text-center text-[14px] font-semibold text-background transition-all duration-150 hover:bg-foreground/90 active:scale-[0.98]"
                >
                  Sign up
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3 px-3 py-2">
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt=""
                      className="size-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                      {user?.fullName?.charAt(0)?.toUpperCase() ?? "U"}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {user?.fullName ?? "User"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user?.email ?? ""}
                    </p>
                  </div>
                </div>
                <Link
                  to="/account"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-[14px] font-medium text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
                >
                  My Account
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="rounded-lg px-3 py-2.5 text-left text-[14px] font-medium text-red-500 transition-colors duration-150 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default PublicHeader;
