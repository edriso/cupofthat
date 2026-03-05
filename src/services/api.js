import axios from 'axios'
import storejs from 'storejs'
import common from '@/helpers/common'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = storejs.get(common.STORAGE_TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storejs.remove(common.STORAGE_TOKEN_KEY)
      window.location.replace('/login')
    }
    return Promise.reject(error)
  },
)

export default api
