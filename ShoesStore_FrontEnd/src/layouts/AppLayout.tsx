import MobileSidebar from "@/components/header/MobileSidebar";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import PublicHeader from "@/components/header/PublicHeader";

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader onOpenMenu={() => setSidebarOpen(true)} />
      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="top-20 flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
