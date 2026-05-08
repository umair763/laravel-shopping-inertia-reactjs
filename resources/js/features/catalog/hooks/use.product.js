import { useQuery } from "@tanstack/react-query";
import { getProductApi } from "../api/product.api.js";

export default function useProduct(slug) { return useQuery({ queryKey: ["product", slug], queryFn: () => getProductApi(slug), enabled: Boolean(slug) }); }
