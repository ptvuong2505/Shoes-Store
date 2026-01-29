import Header from "@/components/header/Header";
import MobileSidebar from "@/components/header/MobileSidebar";
import { useState } from "react";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex min-h-screen flex-col">
      <Header onOpenMenu={() => setSidebarOpen(true)} />
      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="top-20 flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
