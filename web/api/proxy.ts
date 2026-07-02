import type { VercelRequest, VercelResponse } from '@vercel/node'

const TARGET_MAP: Record<string, string> = {
  'bilibili': 'https://api.bilibili.com',
  'app': 'https://app.bilibili.com',
  'live': 'https://api.live.bilibili.com',
  'passport': 'https://passport.bilibili.com',
  'comment': 'https://comment.bilibili.com',
  'search': 'https://s.search.bilibili.com',
  'vc': 'https://api.vc.bilibili.com',
  'message': 'https://message.bilibili.com',
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', '*')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // 从 query 中获取 service 和 path
  const service = (req.query.__service as string) || 'bilibili'
  const targetPath = req.query.__path as string

  if (!targetPath) {
    return res.status(400).json({ error: 'Missing __path parameter' })
  }

  const baseUrl = TARGET_MAP[service]
  if (!baseUrl) {
    return res.status(400).json({ error: `Unknown service: ${service}` })
  }

  // 构建目标 URL（去掉 __service 和 __path 参数）
  const params = { ...req.query }
  delete params.__service
  delete params.__path

  const queryString = Object.entries(params)
    .flatMap(([k, v]) =>
      Array.isArray(v) ? v.map((val) => `${k}=${val}`) : [`${k}=${v}`]
    )
    .join('&')

  const targetUrl = `${baseUrl}/${targetPath}${queryString ? '?' + queryString : ''}`

  try {
    // 构建请求头
    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      'Referer': 'https://www.bilibili.com',
    }

    // 转发 Cookie
    const cookie = req.headers.cookie || req.headers['x-bili-cookie'] as string
    if (cookie) {
      headers['Cookie'] = cookie
    }

    // 构建 fetch 选项
    const fetchOptions: RequestInit = {
      method: req.method,
      headers,
    }

    // POST 请求转发 body
    if (req.method === 'POST' && req.body) {
      const contentType = req.headers['content-type'] || ''
      if (contentType.includes('application/json')) {
        fetchOptions.body = JSON.stringify(req.body)
        headers['Content-Type'] = 'application/json'
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        fetchOptions.body = new URLSearchParams(req.body).toString()
        headers['Content-Type'] = 'application/x-www-form-urlencoded'
      } else {
        fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body)
      }
    }

    const response = await fetch(targetUrl, fetchOptions)

    // 转发响应头
    const responseContentType = response.headers.get('content-type')
    if (responseContentType) {
      res.setHeader('Content-Type', responseContentType)
    }

    // 处理响应
    if (responseContentType?.includes('application/json')) {
      const data = await response.json()
      return res.status(response.status).json(data)
    } else {
      const text = await response.text()
      return res.status(response.status).send(text)
    }
  } catch (error: any) {
    console.error('[Proxy Error]', error.message)
    return res.status(502).json({ error: 'Proxy request failed', message: error.message })
  }
}
