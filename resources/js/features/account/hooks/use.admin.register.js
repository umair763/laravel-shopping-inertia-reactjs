import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuth } from "../../../app/store/slices/auth.slice.js";
import { adminRegisterApi } from "../api/auth.api.js";

export default function useAdminRegister() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: adminRegisterApi,
    onSuccess: (data) => {
      dispatch(setAuth({ user: data.user, token: data.token }));
      navigate("/admin", { replace: true });
    },
  });
}