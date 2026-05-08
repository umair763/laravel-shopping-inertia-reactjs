import { useSelector } from "react-redux";

export default function useAuth() {
  const user = useSelector((state) => state.auth.user);
  return { user, isAuthenticated: Boolean(user), isAdmin: user?.role === "admin" };
}
