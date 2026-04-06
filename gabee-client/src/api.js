import axios from "axios";

// Base URL of your backend
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });
  
// Before every request, automatically attach the JWT token if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register = (email, password) =>
  api.post("/auth/register", { email, password });

export const login = (email, password) =>
  api.post("/auth/login", { email, password });

// Home brews
export const logBrew = (data) => api.post("/brews", data);
export const getBrews = () => api.get("/brews");

// Outside drinks
export const logDrink = (data) => api.post("/drinks", data);
export const getDrinks = () => api.get("/drinks");

export default api;