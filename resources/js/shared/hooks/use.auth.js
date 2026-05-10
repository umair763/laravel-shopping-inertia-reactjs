import { usePage } from "@inertiajs/react";

export default function useAuth() {
  const page = usePage();
  const user = page?.props?.auth?.user || null;
  return {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isCustomer: user?.role === "customer"
  };
}
