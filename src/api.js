import axios from 'axios'

const api = axios.create({
  baseURL: 'https://tributasmart-backend.onrender.com'
})

export default api