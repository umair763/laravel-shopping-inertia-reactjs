import axiosClient from "../../../shared/api/axios.client.js";
import apiRoutes from "../../../shared/api/api.routes.js";

export async function getCartApi() { const { data } = await axiosClient.get(apiRoutes.cart.root); return data; }
export async function addToCartApi(payload) { const { data } = await axiosClient.post(apiRoutes.cart.items, payload); return data; }
export async function checkoutApi(payload) { const { data } = await axiosClient.post(apiRoutes.cart.checkout, payload); return data; }

