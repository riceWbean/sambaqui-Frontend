import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  timeout: 10000,
  headers: {
    skipAuth: true
  }
})

api.interceptors.request.use((config) => {
  if (localStorage.getItem("access") != null) {
    const token = localStorage.getItem('access');
    config.headers.Authorization = `Bearer ${token}`
  }
  if (config.headers?.skipAuth) return config;

  return Promise.reject(new axios.Cancel("Sessão expirada"));
});

export default api
