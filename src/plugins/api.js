import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  if (config.headers?.skipAuth) return config;
  
  const token = localStorage.getItem('access');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    return config
  }

  return Promise.reject(new axios.Cancel("Sessão expirada"));
});

export default api
