import { useQuery } from "@tanstack/react-query";
import { listOrdersApi } from "../api/orders.api.js";

export default function useOrders() { return useQuery({ queryKey: ["orders"], queryFn: listOrdersApi }); }
