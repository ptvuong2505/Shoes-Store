import { createBrowserRouter } from "react-router-dom";
import Register from "./pages/auth/Register";
import Women from "./pages/products/Women";
import Men from "./pages/products/Men";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import { OtpVerification } from "./pages/auth/OtpVerification";
import { ResetPassword } from "./pages/auth/ResetPassword";
import AppLayout from "./layouts/AppLayout";
import AuthLayout from "./layouts/AuthLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "men", element: <Men /> },
      { path: "women", element: <Women /> },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "otp-verification", element: <OtpVerification /> },
      { path: "reset-password", element: <ResetPassword /> },
    ],
  },
]);
