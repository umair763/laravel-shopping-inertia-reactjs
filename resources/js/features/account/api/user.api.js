import axiosClient from "../../../shared/api/axios.client.js";
import apiRoutes from "../../../shared/api/api.routes.js";

export async function profileApi() { const { data } = await axiosClient.get(apiRoutes.account.me); return data; }
export async function updateProfileApi(payload) {
	const isFormData = typeof FormData !== "undefined" && payload instanceof FormData;
	const { data } = await axiosClient.put(apiRoutes.account.profile, payload, isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : undefined);
	return data;
}

