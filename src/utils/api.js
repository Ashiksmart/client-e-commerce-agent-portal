import axios from "axios";

var token;
if (typeof window !== "undefined") {
  token = localStorage.getItem("token") || "";
}
let axiosInstance = axios.create({
  // baseURL: process.env.APP_BASE_URL,
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 180000,
});

if (token !== undefined) {
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (config) => {
    return config;
  },
  (e) => {
    return Promise.reject(e);
  }
);
export default axiosInstance;
export const getDefaultAdapter = () => axios.defaults.adapter;
