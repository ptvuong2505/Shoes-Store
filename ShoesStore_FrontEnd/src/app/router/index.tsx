import { createBrowserRouter } from "react-router-dom";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import HomePage from "@/features/home/pages/HomePage";
import LoginPage from "@/features/auth/pages/LoginPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import { OtpVerificationPage } from "@/features/auth/pages/OtpVerificationPage";
import { ResetPasswordPage } from "@/features/auth/pages/ResetPasswordPage";
import AppLayout from "@/app/layouts/AppLayout";
import AuthLayout from "@/app/layouts/AuthLayout";
import ProfilePage from "@/features/account/pages/ProfilePage";
import AccountLayout from "@/features/account/layouts/AccountLayout";
import OrderHistoryPage from "@/features/account/pages/OrderHistoryPage";
import AddressesPage from "@/features/account/pages/AddressesPage";
import SecurityPage from "@/features/account/pages/SecurityPage";
import OrderDetailPage from "@/features/order/pages/OrderDetailPage";
import ProductsPage from "@/features/product/pages/ProductsPage";
import ProductDetailPage from "@/features/product/pages/ProductDetailPage";
import OrderCheckoutPage from "@/features/order/pages/OrderCheckoutPage";
import CartPage from "@/features/cart/pages/CartPage";
import AdminLayout from "@/features/admin/layouts/AdminLayout";
import AdminDashboardPage from "@/features/admin/pages/AdminDashboardPage";
import AdminProductsPage from "@/features/admin/pages/AdminProductsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "products/:id", element: <ProductDetailPage /> },
      { path: "cart", element: <CartPage /> },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
      { path: "otp-verification", element: <OtpVerificationPage /> },
      { path: "reset-password", element: <ResetPasswordPage /> },
    ],
  },
  {
    path: "/account",
    element: <AccountLayout />,
    children: [
      { index: true, element: <ProfilePage /> },
      { path: "order-history", element: <OrderHistoryPage /> },
      { path: "addresses", element: <AddressesPage /> },
      { path: "security", element: <SecurityPage /> },
    ],
  },
  {
    path: "/orders",
    element: <AppLayout />,
    children: [
      { path: ":id", element: <OrderDetailPage /> },
      {
        path: "checkout/:id",
        element: <OrderCheckoutPage />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: "products", element: <AdminProductsPage /> },
    ],
  },
]);
