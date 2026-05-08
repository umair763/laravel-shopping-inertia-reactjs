import axiosClient from "../../../shared/api/axios.client.js";
import apiRoutes from "../../../shared/api/api.routes.js";

export async function createPaymentApi(payload) { const { data } = await axiosClient.post(apiRoutes.payments.root, payload); return data; }
export async function processPaymentApi(payload) { const { data } = await axiosClient.post(apiRoutes.payments.process, payload); return data; }

