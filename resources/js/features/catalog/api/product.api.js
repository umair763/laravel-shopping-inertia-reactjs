import axiosClient from "../../../shared/api/axios.client.js";
import apiRoutes from "../../../shared/api/api.routes.js";

export async function listProductsApi(params = {}) { const { data } = await axiosClient.get(apiRoutes.catalog.products, { params }); return data; }
export async function getProductApi(slug) { const { data } = await axiosClient.get(apiRoutes.catalog.productBySlug(slug)); return data; }

