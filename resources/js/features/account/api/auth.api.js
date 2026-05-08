import axiosClient from "../../../shared/api/axios.client.js";
import apiRoutes from "../../../shared/api/api.routes.js";

export async function loginApi(payload) { const { data } = await axiosClient.post(apiRoutes.account.login, payload); return data; }
export async function adminLoginApi(payload) { const { data } = await axiosClient.post(apiRoutes.account.adminLogin, payload); return data; }
export async function registerApi(payload) { const { data } = await axiosClient.post(apiRoutes.account.register, payload); return data; }
export async function adminRegisterApi(payload) { const { data } = await axiosClient.post(apiRoutes.account.adminRegister, payload); return data; }
export async function logoutApi() { const { data } = await axiosClient.post(apiRoutes.account.logout); return data; }

