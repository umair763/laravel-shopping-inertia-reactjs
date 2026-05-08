import { useMutation } from "@tanstack/react-query";
import { updateAdminOrderStatusApi } from "./orders.api.js";

export default function useUpdateAdminOrderStatus() {
  return useMutation({ mutationFn: updateAdminOrderStatusApi });
}