import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'

// 判断是否生产环境（Vercel）
const isProd = import.meta.env.PROD

// API 基础域名映射
// 开发环境：通过 Vite proxy 代理
// 生产环境：通过 Vercel Serverless Function (/api/proxy) 代理
const DEV_API_MAP: Record<string, string> = {
  bilibili: '/api',
  app: '/app-api',
  live: '/live-api',
  passport: '/passport',
  comment: '/comment',
  search: '/search-suggest',
}

function createHttp(base: string = 'bilibili'): AxiosInstance {
  const http = axios.create({
    baseURL: isProd ? '' : DEV_API_MAP[base] || '/api',
    timeout: 15000,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      Referer: 'https://www.bilibili.com',
    },
  })

  // 请求拦截
  http.interceptors.request.use((config) => {
    const cookie = localStorage.getItem('bili_cookie') || ''
    if (cookie) {
      config.headers.Cookie = cookie
      // 生产环境用自定义 header 传递 cookie（避免浏览器限制）
      if (isProd) {
        config.headers['x-bili-cookie'] = cookie
      }
    }

    // 生产环境：将请求重写为 proxy 格式
    if (isProd && config.url) {
      const originalUrl = config.url
      // 根据 base 类型选择代理路径
      const proxyPath = {
        bilibili: 'api',
        app: 'app-api',
        live: 'live-api',
        passport: 'passport',
        comment: 'comment',
        search: 'search-suggest',
      }[base] || 'api'

      config.url = `/${proxyPath}${originalUrl}`
    }

    return config
  })

  // 响应拦截
  http.interceptors.response.use(
    (res) => {
      const data = res.data
      if (data.code !== undefined && data.code !== 0) {
        return Promise.reject(new Error(data.message || `API Error: ${data.code}`))
      }
      return data
    },
    (err) => {
      console.error('[HTTP Error]', err.message)
      return Promise.reject(err)
    },
  )

  return http
}

export const http = createHttp('bilibili')
export const appHttp = createHttp('app')
export const liveHttp = createHttp('live')
export const passportHttp = createHttp('passport')
export const commentHttp = createHttp('comment')
export const searchHttp = createHttp('search')

export async function get<T = any>(url: string, params?: Record<string, any>, config?: AxiosRequestConfig): Promise<T> {
  return http.get(url, { params, ...config })
}

export async function post<T = any>(url: string, data?: Record<string, any>, config?: AxiosRequestConfig): Promise<T> {
  return http.post(url, data, config)
}

export default http
