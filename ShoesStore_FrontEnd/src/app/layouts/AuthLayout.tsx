import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen">
      <main className="top-20 flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
