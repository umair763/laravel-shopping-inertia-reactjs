import { usePage } from "@inertiajs/react";

export default function usePermission(role) {
  const { props } = usePage();
  const userRole = props?.auth?.user?.role;
  return userRole === role;
}
