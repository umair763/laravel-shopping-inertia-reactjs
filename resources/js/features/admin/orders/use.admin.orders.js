import { useQuery } from "@tanstack/react-query";
import { listAdminOrdersApi } from "./orders.api.js";

export default function useAdminOrders() {
  return useQuery({ queryKey: ["admin", "orders"], queryFn: listAdminOrdersApi });
}