import { useMutation } from "@tanstack/react-query";
import { updateProfileApi } from "../api/user.api.js";

export default function useUpdateProfile() {
  return useMutation({ mutationFn: updateProfileApi });
}