import axiosClient from "../../../shared/api/axios.client.js";
import apiRoutes from "../../../shared/api/api.routes.js";

export async function listReviewsApi(productId) { const { data } = await axiosClient.get(apiRoutes.reviews.product(productId)); return data; }

