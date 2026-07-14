import { Link } from "@tanstack/react-router";
import logo from "@/shared/assets/logo.webp";
import { ShoppingCart } from "lucide-react";
import { useAuthStore } from "@/features/auth/model/auth.store";
import { DropdownMenuAvatar } from "@/app/shell/DropdownMenuAvatar";
import useAuth from "@/features/auth/hooks/useAuth";

function PublicHeader() {
  const { isAuthenticated, user } = useAuthStore();
  const { logout } = useAuth();
  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Find", path: "/products" },
    { label: "Chat", path: "/chat" },
  ] as const;
  return (
    <>
      <header className="sticky w-full top-0 h-20 flex justify-between items-center bg-background z-50 px-4 border-b">
        <div className="h-full flex justify-around items-center w-full lg:w-1/2">
          <Link className="h-full flex items-center" to="/">
            <img src={logo} className="h-full" alt="Logo" />
            <h2 className="text-foreground ml-3 font-black text-2xl w-auto">
              Shoes Store
            </h2>
          </Link>
        </div>

        <div className="hidden md:flex justify-around items-center flex-1">
          <nav className="flex justify-between gap-4">
            {menuItems.map((item) => {
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="p-2 font-semibold leading-normal transition-colors hover:text-primary"
                  activeProps={{ className: "text-primary" }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <nav className="flex justify-between items-center gap-4">
            <button className="flex items-center justify-center p-2 text-[#9a5f4c] dark:text-[#b08e84] hover:text-primary transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <Link
              to="/cart"
              className="flex items-center justify-center p-2 text-[#9a5f4c] dark:text-[#b08e84] hover:text-primary transition-colors"
            >
              <ShoppingCart className="size-5" aria-hidden="true" />
            </Link>
            <>
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/auth/login"
                    className="bg-primary px-3 py-2 rounded text-white text-sm font-bold"
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth/register"
                    className="bg-primary px-3 py-2 rounded text-white text-sm font-bold"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <DropdownMenuAvatar
                    urlAvatar={user?.avatarUrl}
                    logOut={logout}
                  />
                </>
              )}
            </>
          </nav>
        </div>
      </header>
    </>
  );
}

export default PublicHeader;
