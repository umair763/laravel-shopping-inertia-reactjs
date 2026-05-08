import axios from "axios";
import setupInterceptors from "./interceptors.js";
import store from "../../app/store/index.js";

const axiosClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

setupInterceptors(axiosClient, store);

export default axiosClient;
