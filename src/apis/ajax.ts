import axios from 'axios'
import { showToast } from 'vant'

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_AXIOS_BASE_URL,
})
/**
 * 请求拦截
 */
instance.interceptors.request.use((config) => {
  const { method, params } = config
  // 附带鉴权的token
  const headers: any = {
    token: localStorage.getItem('token'),
  }
  // 不缓存get请求
  if (method === 'get') {
    headers['Cache-Control'] = 'no-cache'
  }
  // delete请求参数放入body中
  if (method === 'delete') {
    headers['Content-type'] = 'application/json;'
    Object.assign(config, {
      data: params,
      params: {},
    })
  }

  return {
    ...config,
    headers,
  }
})

/**
 * 响应拦截
 */
instance.interceptors.response.use((v) => {
  if (v.data?.code === 401) {
    localStorage.removeItem('token')
    // 未登录
    window.location.href = '/'
    return v.data
  }
  if (v.status === 200) {
    if (v.data.code !== 0) {
      showToast(v.data?.msg)
      return Promise.reject(v.data)
    }
    return v.data
  }
  return v.data
}, (err) => {
  showToast(err?.message)
  return Promise.reject(err)
})
export default instance
