import { useQuery } from "@tanstack/react-query";
import { getAdminOrderApi } from "./orders.api.js";

export default function useAdminOrder(orderId, enabled = true) {
  return useQuery({
    queryKey: ["admin", "orders", orderId],
    queryFn: () => getAdminOrderApi(orderId),
    enabled: Boolean(orderId) && enabled,
  });
}