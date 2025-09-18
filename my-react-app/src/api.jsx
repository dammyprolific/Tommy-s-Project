import axios from "axios";
import { jwtDecode } from 'jwt-decode';

export const BASE_URL = import.meta.env.VITE_BASE_URL || "http://127.0.0.1:8000";

const api = axios.create({
    baseURL: BASE_URL
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const current_time = Date.now() / 1000;
                if (decoded.exp > current_time) {
                    config.headers.Authorization = `Bearer ${token}`;
                } else {
                    localStorage.removeItem('access');
                }
            } catch (e) {
                localStorage.removeItem('access');
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;