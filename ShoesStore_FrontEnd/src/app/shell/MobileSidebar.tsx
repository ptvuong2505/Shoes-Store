import { IoMdCart } from "react-icons/io";
import { Button } from "@/shared/ui/button";
import { NavLink } from "react-router-dom";

type Props = {
  open: boolean;
  onClose: () => void;
};

const MobileSidebar = ({ open, onClose }: Props) => {
  const menu = [
    { label: "Home", path: "/" },
    { label: "Products", path: "/products" },
    { label: "Cart", path: "/cart" },
  ];
  const activeStyle = ({ isActive }: { isActive: boolean }) => {
    return (
      "font-semibold leading-normal hover:text-[#ee5b2b] transition-colors p-2 " +
      (isActive ? "text-[#ee5b2b]" : "")
    );
  };
  return (
    <div
      className={`fixed inset-0 top-20 z-50 ${open ? "visible" : "invisible"}`}
    >
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => onClose()}
      />
      <aside
        className={`absolute left-0 top-0 h-full w-2/4 bg-white dark:bg-black transition-transform transform ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Button
          className="absolute right-0 top-0 m-2"
          onClick={() => onClose()}
        >
          x
        </Button>
        <nav className="flex flex-col items-start ml-5 mt-10 gap-1">
          {menu.map((item, index) => {
            return (
              <NavLink key={index} to={item.path} className={activeStyle}>
                {item.label}
              </NavLink>
            );
          })}
          <NavLink className="bg-[#fdf6f3] p-2 rounded m-2" to="/cart">
            <IoMdCart />
          </NavLink>
          <NavLink
            to="/auth/login"
            className="bg-primary dark:bg-primary-foreground px-3 py-2 rounded text-white dark:text-primary-foreground text-sm font-bold w-20"
          >
            Login
          </NavLink>
          <NavLink
            to="/auth/register"
            className="bg-primary dark:bg-primary-foreground px-3 py-2 rounded text-white dark:text-primary-foreground text-sm font-bold w-20"
          >
            Register
          </NavLink>
        </nav>
      </aside>
    </div>
  );
};

export default MobileSidebar;
