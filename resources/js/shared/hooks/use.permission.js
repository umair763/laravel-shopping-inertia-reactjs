import { useSelector } from "react-redux";

export default function usePermission(role) {
  const userRole = useSelector((state) => state.auth.user?.role);
  return userRole === role;
}
