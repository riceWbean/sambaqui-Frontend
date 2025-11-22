import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  timeout: 10000,
  headers: {
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzY0Mzc0MDY1LCJpYXQiOjE3NjM3NzQxMjUsImp0aSI6Ijc5ZmFkYmQ1OWU5MjQxMGQ5YzFhM2VhOGZhYTc1ZWViIiwidXNlcl9pZCI6IjEifQ.TTorp-7G6l15N3Sthw2zDtzuJmcVON0SOePoN4Ajt3c'
  },
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
