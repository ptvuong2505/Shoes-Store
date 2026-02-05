import UserHeader from "@/components/header/UserHeader";
import { useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";

const AccountLayout = () => {
  useEffect(() => {}, []);

  const activeStyle = ({ isActive }: { isActive: boolean }) => {
    return isActive
      ? "flex items-center gap-3 px-6 py-4 text-sm transition-all bg-primary/10 text-primary border-r-4 border-primary font-bold"
      : "flex items-center gap-3 px-6 py-4 text-sm transition-all";
  };
  return (
    <>
      <UserHeader />
      <main className="top-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="md:col-span-1">
            <nav className="bg-white dark:bg-[#2c1d18] rounded-xl border border-[#e7d5cf] dark:border-[#3d2a23] overflow-hidden shadow-sm">
              <div className="p-6 border-b border-[#e7d5cf] dark:border-[#3d2a23]">
                <p className="text-xs font-bold text-[#9a5f4c] dark:text-[#b08e84] uppercase tracking-widest">
                  My Account
                </p>
              </div>
              <ul className="flex flex-col">
                <li>
                  <NavLink className={activeStyle} to={"/account"} end>
                    <span className="material-symbols-outlined text-xl">
                      person
                    </span>
                    Personal Info
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={activeStyle}
                    to={"/account/order-history"}
                  >
                    <span className="material-symbols-outlined text-xl">
                      shopping_bag
                    </span>
                    Order History
                  </NavLink>
                </li>
                <li>
                  <NavLink className={activeStyle} to={"/account/addresses"}>
                    <span className="material-symbols-outlined text-xl">
                      location_on
                    </span>
                    Addresses
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={activeStyle}
                    to={"/account/payment-methods"}
                  >
                    <span className="material-symbols-outlined text-xl">
                      payments
                    </span>
                    Payment Methods
                  </NavLink>
                </li>
                <li>
                  <NavLink className={activeStyle} to={"/account/security"}>
                    <span className="material-symbols-outlined text-xl">
                      security
                    </span>
                    Security
                  </NavLink>
                </li>
              </ul>
              <div className="p-6 mt-4 border-t border-[#e7d5cf] dark:border-[#3d2a23]">
                <button className="flex items-center gap-3 text-sm text-red-500 font-semibold hover:opacity-80 transition-opacity">
                  <span className="material-symbols-outlined text-xl">
                    logout
                  </span>
                  Sign Out
                </button>
              </div>
            </nav>
          </aside>
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default AccountLayout;
