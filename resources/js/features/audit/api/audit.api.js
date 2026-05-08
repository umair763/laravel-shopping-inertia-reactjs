import axiosClient from "../../../shared/api/axios.client.js";
import apiRoutes from "../../../shared/api/api.routes.js";

export async function listAuditApi() { const { data } = await axiosClient.get(apiRoutes.audit.root); return data; }

