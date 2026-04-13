import { NavLink, Outlet } from "react-router-dom";

const AdminLayout = () => {
  const base =
    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors";

  const activeStyle = ({ isActive }: { isActive: boolean }) =>
    `${base} ${
      isActive
        ? "bg-primary/10 text-primary"
        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
    }`;
  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark/50 flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary size-10 rounded-lg flex items-center justify-center text-white">
              <span className="material-symbols-outlined">directions_run</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-slate-900 dark:text-white text-base font-bold leading-none">
                Shoe Admin
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                v2.4.0 Management
              </p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <NavLink className={activeStyle} end to="">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              dashboard
            </span>
            <span className="text-sm font-bold">Dashboard</span>
          </NavLink>
          <NavLink className={activeStyle} to="products">
            <span className="material-symbols-outlined">inventory_2</span>
            <span className="text-sm font-medium">Products</span>
          </NavLink>
          <NavLink className={activeStyle} to="orders">
            <span className="material-symbols-outlined">shopping_cart</span>
            <span className="text-sm font-medium">Orders</span>
          </NavLink>
          <NavLink className={activeStyle} to="customers">
            <span className="material-symbols-outlined">group</span>
            <span className="text-sm font-medium">Customers</span>
          </NavLink>
          <NavLink className={activeStyle} to="reports">
            <span className="material-symbols-outlined">analytics</span>
            <span className="text-sm font-medium">Reports</span>
          </NavLink>
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2">
            <div
              className="size-8 rounded-full bg-slate-200 overflow-hidden"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDz5OicLohowxdIspy_D-Mgoxne91DQGGNtpX_GW8KhqsHjg3HSKamic9m82aGmwYCCpFeQ8_cv6bKqJ-XhxIz2lA0ageBg8Eur4fUnqbos1yuzm7x1kD98uu5CYPkHPCydaqpVBCeIwo4AI6Pnewgwb57vIdHvQ0EFeZsHr3wE_tlbXsvV075ks4X849owdw6EiSI-Me2ONGkn-4GmQOH-srE4wc-nLTH_6FPnbKTwf3FAC72wdY-0j7t7xcEF7Z_Yu1tDxhmcS_g")',
                backgroundSize: "cover",
              }}
            />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate">Alex Morgan</p>
              <p className="text-xs text-slate-500 truncate">Store Manager</p>
            </div>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <span className="material-symbols-outlined text-xl">
                settings
              </span>
            </button>
          </div>
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
