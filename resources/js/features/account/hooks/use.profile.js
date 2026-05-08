import { useQuery } from "@tanstack/react-query";
import { profileApi } from "../api/user.api.js";

export default function useProfile() {
  return useQuery({ queryKey: ["profile"], queryFn: profileApi });
}
