import { NavLink } from "react-router-dom";
import logo from "@/shared/assets/logo.webp";
import { useAuthStore } from "@/shared/state/auth.store";

const AccountHeader = () => {
  const { user } = useAuthStore();
  return (
    <header className="sticky h-20 top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e7d5cf] dark:border-[#3d2a23] px-10 bg-white dark:bg-background-dark">
      <NavLink className="h-full flex items-center" to="/">
        <img src={logo} className="h-full" alt="Logo" />
        <h2 className="text-foreground ml-3 font-black text-2xl w-auto">
          Shoes Store
        </h2>
      </NavLink>
      <div className="flex flex-1 justify-end gap-8">
        <div className="items-center gap-9 hidden md:flex">
          <NavLink
            className="text-sm font-medium leading-normal hover:text-primary transition-colors"
            to={"/"}
          >
            Shop
          </NavLink>
          <a
            className="text-sm font-medium leading-normal hover:text-primary transition-colors"
            href="#"
          >
            Support
          </a>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center justify-center p-2 text-[#9a5f4c] dark:text-[#b08e84] hover:text-primary transition-colors">
            <span className="material-symbols-outlined">shopping_cart</span>
          </button>
          <button className="size-9 rounded-full overflow-hidden border-2 border-primary">
            <img
              alt="User profile"
              className="w-full h-full object-cover"
              src={
                user?.avatarUrl ||
                "https://lh3.googleusercontent.com/aida-public/AB6AXuAJJxi1c0TcmIzQtI9_iCAlFrUWKjfJDfG7pEhbtFpyQryl91Ht3ahxtM2yFPtwELsVgR9VWDvdc4t7aGJqa03CegzR0Ei7cqEH6ZISzlo5JkiRouIgmGF1GAcxq4MwRnyE4ZnwL6neg3pCzwf--SJHdvWHVoLdIhroDHxrRbw9mhPFTQg1MyXTHsVsN0x02U7QgnMkojEkIB9zm9OMFe2RfkdhAoUeq6PU0csq-TyJ2YVjbAxWovSsHa-vmUcWnndez_N58U-ULYs"
              }
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AccountHeader;
