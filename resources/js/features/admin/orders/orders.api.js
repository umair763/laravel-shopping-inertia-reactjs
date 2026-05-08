import axiosClient from "../../../shared/api/axios.client.js";
import apiRoutes from "../../../shared/api/api.routes.js";

export async function listAdminOrdersApi() {
  const { data } = await axiosClient.get(apiRoutes.admin.orders);
  return data;
}

export async function getAdminOrderApi(orderId) {
  const { data } = await axiosClient.get(apiRoutes.admin.orderById(orderId));
  return data;
}

export async function updateAdminOrderStatusApi({ orderId, order_status }) {
  const { data } = await axiosClient.put(apiRoutes.admin.orderStatus(orderId), { order_status });
  return data;
}