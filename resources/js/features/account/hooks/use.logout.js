import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { clearAuth } from "../../../app/store/slices/auth.slice.js";
import { logoutApi } from "../api/auth.api.js";

export default function useLogout() {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => dispatch(clearAuth()),
  });
}
