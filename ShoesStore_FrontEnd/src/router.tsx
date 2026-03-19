import { createBrowserRouter } from "react-router-dom";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import { OtpVerification } from "./pages/auth/OtpVerification";
import { ResetPassword } from "./pages/auth/ResetPassword";
import AppLayout from "./layouts/AppLayout";
import AuthLayout from "./layouts/AuthLayout";
import Profile from "./pages/account/Profile";
import AccountLayout from "./layouts/AccountLayout";
import OrderHistory from "./pages/account/OrderHistory";
import Addresses from "./pages/account/Addresses";
import PaymentMethod from "./pages/account/PaymentMethod";
import Security from "./pages/account/Security";
import Brand from "./pages/Brand";
import Chat from "./pages/Chat";
import DetailOrder from "./pages/order/DetailOrder";
import Products from "./pages/Products";
import ProductDetailPage from "./pages/product/ProductDetailPage";
import OrderCheckout from "./pages/order/OrderCheckout";
import Cart from "./pages/cart/cart";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "products", element: <Products /> },
      { path: "brand", element: <Brand /> },
      { path: "chat", element: <Chat /> },
      { path: "products/:id", element: <ProductDetailPage /> },
      { path: "/cart", element: <Cart /> },
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
  {
    path: "/account",
    element: <AccountLayout />,
    children: [
      { index: true, element: <Profile /> },
      { path: "order-history", element: <OrderHistory /> },
      { path: "addresses", element: <Addresses /> },
      { path: "payment-methods", element: <PaymentMethod /> },
      { path: "security", element: <Security /> },
    ],
  },
  {
    path: "/orders",
    element: <AppLayout />,
    children: [
      { path: ":id", element: <DetailOrder /> },
      {
        path: "checkout/:id",
        element: <OrderCheckout />,
      },
    ],
  },
]);
