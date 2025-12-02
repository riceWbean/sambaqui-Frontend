import axios from 'axios'

const api = axios.create({
  baseURL: 'https://acervo-api.productionapp3.fabricadesoftware.ifc.edu.br/api',
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
