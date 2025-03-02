import axios from 'axios'
import Interceptor from '@/interceptors/interceptor'

// Request interceptor
axios.interceptors.request.use(
  (config) => {
    // Modify the request config if needed (e.g., add headers)
    console.log("Request Interceptor:", config);
    return config;
  },
  (error) => {
    // Handle request error
    console.error("Request Error Interceptor:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axios.interceptors.response.use(Interceptor.onResponse, Interceptor.onError);
