// resources/js/utils/axios.ts
import axios from 'axios'

const baseURL =
  process.env.MIX_API_BASE || 'http://127.0.0.1:8000/api';   // fallback p/ mesmo host

const api = axios.create({ baseURL });

// —— Request: injeta Bearer —— //
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('jwt')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

// —— Response: lida com expiração —— //
let refreshing = false
let queue: ((t: string) => void)[] = []

api.interceptors.response.use(
  r => r,
  async err => {
    const { config, response } = err
    if (response?.status === 401 && !config._retry) {
      config._retry = true

      // dispara refresh apenas uma vez
      if (!refreshing) {
        refreshing = true
        try {
          const { data } = await api.post('/auth/refresh')
          localStorage.setItem('jwt', data.access_token)
          queue.forEach(cb => cb(data.access_token))
          queue = []
        } catch (e) {
          localStorage.removeItem('jwt')
          window.location.href = '/login'
          return Promise.reject(e)
        } finally {
          refreshing = false
        }
      }

      // aguarda o refresh concluir
      return new Promise(resolve => {
        queue.push(token => {
          config.headers.Authorization = `Bearer ${token}`
          resolve(api(config))
        })
      })
    }
    return Promise.reject(err)
  }
)

export default api
