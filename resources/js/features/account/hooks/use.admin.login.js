import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuth } from "../../../app/store/slices/auth.slice.js";
import { adminLoginApi } from "../api/auth.api.js";

export default function useAdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: adminLoginApi,
    onSuccess: (data) => {
      dispatch(setAuth({ user: data.user, token: data.token }));
      navigate("/admin", { replace: true });
    },
  });
}