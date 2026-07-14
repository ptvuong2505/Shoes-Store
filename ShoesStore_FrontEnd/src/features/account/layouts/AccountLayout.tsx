import PublicHeader from "@/app/shell/PublicHeader";
import useAuth from "@/features/auth/hooks/useAuth";
import { Link, Outlet } from "@tanstack/react-router";

const AccountLayout = () => {
  const { logout } = useAuth();
  const linkClass = "flex items-center gap-3 px-6 py-4 text-sm transition-all";
  const activeProps = {
    className:
      "border-r-4 border-primary bg-primary/10 font-bold text-primary",
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <PublicHeader />
      <main className="top-20 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-5 w-full">
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
                  <Link className={linkClass} activeProps={activeProps} to="/account" activeOptions={{ exact: true }}>
                    <span className="material-symbols-outlined text-xl">
                      person
                    </span>
                    Personal Info
                  </Link>
                </li>
                <li>
                  <Link className={linkClass} activeProps={activeProps} to="/account/order-history">
                    <span className="material-symbols-outlined text-xl">
                      shopping_bag
                    </span>
                    Order History
                  </Link>
                </li>
                <li>
                  <Link className={linkClass} activeProps={activeProps} to="/account/addresses">
                    <span className="material-symbols-outlined text-xl">
                      location_on
                    </span>
                    Addresses
                  </Link>
                </li>
                <li>
                  <Link className={linkClass} activeProps={activeProps} to="/account/security">
                    <span className="material-symbols-outlined text-xl">
                      security
                    </span>
                    Security
                  </Link>
                </li>
              </ul>
              <div className="p-6 mt-4 border-t border-[#e7d5cf] dark:border-[#3d2a23]">
                <button
                  onClick={logout}
                  className="flex items-center gap-3 text-sm text-red-500 font-semibold hover:opacity-80 transition-opacity"
                >
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
    </div>
  );
};

export default AccountLayout;
