import { useQuery } from "@tanstack/react-query";
import { listCategoriesApi } from "../api/category.api.js";

export default function useCategories() { return useQuery({ queryKey: ["categories"], queryFn: listCategoriesApi }); }
