import { useQuery } from "@tanstack/react-query";
import { getCartApi } from "../api/cart.api.js";

export default function useCart() { return useQuery({ queryKey: ["cart"], queryFn: getCartApi }); }
