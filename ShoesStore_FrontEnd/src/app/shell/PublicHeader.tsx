import { Link, NavLink } from "react-router-dom";
import logo from "@/shared/assets/logo.webp";
import { GiHamburgerMenu } from "react-icons/gi";
import { useAuthStore } from "@/shared/state/auth.store";
import { DropdownMenuAvatar } from "@/app/shell/DropdownMenuAvatar";
import useAuth from "@/features/auth/hooks/useAuth";

type Props = {
  onOpenMenu: () => void;
};

function PublicHeader({ onOpenMenu }: Props) {
  const { isAuthenticated, user } = useAuthStore();
  const { logout } = useAuth();
  const Menu = [
    { label: "Home", path: "/" },
    { label: "Find", path: "/products" },
  ];
  const activeStyle = ({ isActive }: { isActive: boolean }) => {
    return (
      "font-semibold leading-normal hover:text-primary transition-colors p-2 " +
      (isActive ? "text-primary dark:text-primary/50" : "")
    );
  };
  return (
    <>
      <header className="sticky w-full top-0 h-20 flex justify-between items-center bg-background z-50 px-4 border-b">
        <div className="h-full flex justify-around items-center w-full lg:w-1/2">
          <NavLink className="h-full flex items-center" to="/">
            <img src={logo} className="h-full" alt="Logo" />
            <h2 className="text-foreground ml-3 font-black text-2xl w-auto">
              Shoes Store
            </h2>
          </NavLink>
        </div>

        <div className="hidden md:flex justify-around items-center flex-1">
          <nav className="flex justify-between gap-4">
            {Menu.map((item, index) => {
              return (
                <NavLink key={index} to={item.path} className={activeStyle}>
                  {item.label}
                </NavLink>
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
              <span className="material-symbols-outlined">shopping_cart</span>
            </Link>
            <>
              {!isAuthenticated ? (
                <>
                  <NavLink
                    to="/auth/login"
                    className="bg-primary px-3 py-2 rounded text-white text-sm font-bold"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/auth/register"
                    className="bg-primary px-3 py-2 rounded text-white text-sm font-bold"
                  >
                    Register
                  </NavLink>
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
        <button
          className="border rounded p-2 m-3 md:hidden"
          onClick={() => onOpenMenu()}
        >
          {<GiHamburgerMenu className="size-5" />}
        </button>
      </header>
    </>
  );
}

export default PublicHeader;
