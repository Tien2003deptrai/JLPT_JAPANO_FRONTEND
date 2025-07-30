import axios from 'axios'
import useAuthStore from '../store/authStore'

const axiosInstance = axios.create({
  // baseURL: 'http://localhost:3000/api/',
  // baseURL: 'http://13.229.137.29:3000/api/',
  baseURL: 'https://testapidata1.xyz/api/',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Request interceptor để thêm token
axiosInstance.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor để xử lý lỗi authentication
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      const { logout } = useAuthStore.getState()
      logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
