import axiosClient from "../../../shared/api/axios.client.js";
import apiRoutes from "../../../shared/api/api.routes.js";

export async function listOrdersApi() { const { data } = await axiosClient.get(apiRoutes.orders.root); return data; }
export async function getOrderApi(id) { const { data } = await axiosClient.get(apiRoutes.orders.byId(id)); return data; }

