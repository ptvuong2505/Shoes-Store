import { Outlet } from "@tanstack/react-router";
import PublicHeader from "@/app/shell/PublicHeader";

const AppLayout = () => {
  return (
    <div className="flex min-h-dvh flex-col">
      <PublicHeader />
      <main className="top-20 flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
