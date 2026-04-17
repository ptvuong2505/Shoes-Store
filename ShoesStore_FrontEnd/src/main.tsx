import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/app/styles/globals.css";
import { RouterProvider } from "react-router-dom";
import { router } from "@/app/router";
import logo from "@/shared/assets/logo.webp";

const faviconLink =
  document.querySelector<HTMLLinkElement>("link[rel='icon']") ??
  document.createElement("link");
faviconLink.rel = "icon";
faviconLink.type = "image/webp";
faviconLink.href = logo;

if (!faviconLink.parentNode) {
  document.head.appendChild(faviconLink);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
