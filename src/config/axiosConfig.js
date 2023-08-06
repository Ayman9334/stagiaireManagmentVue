import axios from 'axios'

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/',
  withCredentials: true
})

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ACCESS_TOKEN')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const { response } = error
    if (response.status === 403) {
      localStorage.removeItem('ACCESS_TOKEN')
      window.location.href = '/'
    } else if (response.status === 404) {
      window.location.href = '/page-non-trouvee'
    }
    throw error
  }
)

export default axiosClient
