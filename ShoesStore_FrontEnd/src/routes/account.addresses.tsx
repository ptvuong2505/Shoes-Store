import { createFileRoute } from "@tanstack/react-router";
import AddressesPage from "@/features/account/pages/AddressesPage";

export const Route = createFileRoute("/account/addresses")({
  component: AddressesPage,
});
