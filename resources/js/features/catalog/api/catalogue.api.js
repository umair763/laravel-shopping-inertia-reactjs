import axiosClient from "../../../shared/api/axios.client.js";
import apiRoutes from "../../../shared/api/api.routes.js";

export async function listCataloguesApi() { const { data } = await axiosClient.get(apiRoutes.catalog.catalogues); return data; }

