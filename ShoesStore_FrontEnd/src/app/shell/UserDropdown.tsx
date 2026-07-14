import { Link } from "@tanstack/react-router";
import { LogOut, Settings, ShoppingBag, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { User as UserType } from "@/entities/user/model/user.types";

interface UserDropdownProps {
  user: UserType | null;
  logout: () => void;
}

export function UserDropdown({ user, logout }: UserDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const initials = user?.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "U";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="group relative flex items-center gap-2 rounded-full p-0.5 transition-all duration-150 hover:ring-2 hover:ring-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.fullName ?? "User"}
            className="size-8 rounded-full object-cover"
          />
        ) : (
          <div className="flex size-8 items-center justify-center rounded-full bg-foreground text-[11px] font-bold text-background">
            {initials}
          </div>
        )}
      </button>

      {/* Dropdown */}
      <div
        className={`absolute right-0 top-full z-50 mt-2 w-64 origin-top-right transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open
            ? "scale-100 opacity-100 pointer-events-auto"
            : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        <div className="overflow-hidden rounded-xl border border-border/60 bg-popover shadow-lg shadow-black/5">
          {/* User info */}
          <div className="border-b border-border/40 px-4 py-3">
            <p className="text-sm font-semibold leading-none">
              {user?.fullName ?? "User"}
            </p>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {user?.email ?? ""}
            </p>
          </div>

          {/* Menu items */}
          <div className="p-1.5">
            <DropdownItem
              to="/account"
              icon={User}
              label="My Account"
              onClick={() => setOpen(false)}
            />
            <DropdownItem
              to="/account/order-history"
              icon={ShoppingBag}
              label="Order History"
              onClick={() => setOpen(false)}
            />
            <DropdownItem
              to="/account/security"
              icon={Settings}
              label="Security"
              onClick={() => setOpen(false)}
            />
          </div>

          {/* Sign out */}
          <div className="border-t border-border/40 p-1.5">
            <button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-500 transition-colors duration-150 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <LogOut className="size-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DropdownItem({
  to,
  icon: Icon,
  label,
  onClick,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
      activeProps={{
        className: "bg-accent text-foreground font-medium",
      }}
    >
      <Icon className="size-4" />
      {label}
    </Link>
  );
}
