import { useQuery } from "@tanstack/react-query";
import { listProductsApi } from "../api/product.api.js";

export default function useProducts(params) { return useQuery({ queryKey: ["products", params], queryFn: () => listProductsApi(params) }); }
