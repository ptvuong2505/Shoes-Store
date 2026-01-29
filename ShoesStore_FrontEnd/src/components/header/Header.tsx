import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.webp";
import { IoMdCart } from "react-icons/io";
import { IoMdNotifications } from "react-icons/io";
import { Input } from "../ui/input";
import { GiHamburgerMenu } from "react-icons/gi";
import { useAuthStore } from "@/stores/auth/auth.store";
import { DropdownMenuAvatar } from "./DropdownMenuAvatar";
import useAuth from "@/hooks/useAuth";

type Props = {
  onOpenMenu: () => void;
};

function Header({ onOpenMenu }: Props) {
  const { isAuthenticated, user } = useAuthStore();
  const { logout } = useAuth();
  const Menu = [
    { label: "Home", path: "/" },
    { label: "Men", path: "/men" },
    { label: "Women", path: "/women" },
    { label: "Sale", path: "/sale" },
  ];
  const activeStyle = ({ isActive }: { isActive: boolean }) => {
    return (
      "font-semibold leading-normal hover:text-primary transition-colors p-2 " +
      (isActive ? "text-primary dark:text-primary/50" : "")
    );
  };
  return (
    <>
      <header className="sticky w-full top-0 h-20 flex justify-between items-center bg-background z-50 px-4">
        <div className="h-full flex justify-around items-center w-full lg:w-1/2">
          <NavLink className="h-full flex items-center" to="/">
            <img src={logo} className="h-full" alt="Logo" />
            <h2 className="text-foreground ml-3 font-black text-2xl w-auto">
              Shoes Store
            </h2>
          </NavLink>
          <Input
            className="w-1/2 bg-background font-medium text-foreground"
            type="text"
            placeholder="Search Sneakers"
          />
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
            <NavLink className="bg-background p-2 rounded" to="/notifications">
              <IoMdNotifications />
            </NavLink>
            <NavLink className="bg-background p-2 rounded" to="/cart">
              <IoMdCart />
            </NavLink>
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
                    urlAvatar={user?.urlAvatar}
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

export default Header;
