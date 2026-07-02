import type { VercelRequest, VercelResponse } from '@vercel/node'

// 视频流代理 — 处理 B站 CDN 域名的视频播放
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', '*')

  if (req.method === 'OPTIONS') return res.status(200).end()

  const url = req.query.url as string
  if (!url) return res.status(400).json({ error: 'Missing url parameter' })

  try {
    // 必须带 Referer 才能从 B 站 CDN 拿到视频
    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      'Referer': 'https://www.bilibili.com',
    }

    const cookie = req.headers.cookie || req.headers['x-bili-cookie'] as string
    if (cookie) headers['Cookie'] = cookie

    // 处理 Range 请求（视频 seek 必需）
    const range = req.headers.range as string
    if (range) headers['Range'] = range

    const response = await fetch(url, { method: req.method, headers })

    // 转发关键响应头
    const passHeaders = ['content-type', 'content-length', 'content-range', 'accept-ranges', 'etag']
    for (const h of passHeaders) {
      const val = response.headers.get(h)
      if (val) res.setHeader(h.charAt(0).toUpperCase() + h.slice(1), val)
    }

    // 设置状态码（206 Partial Content for Range requests）
    res.status(response.status as number)

    // 流式转发响应体
    if (response.body) {
      const reader = (response.body as any).getReader?.()
      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          res.write(value)
        }
        res.end()
      } else {
        // fallback
        const buffer = Buffer.from(await response.arrayBuffer())
        res.end(buffer)
      }
    } else {
      res.end()
    }
  } catch (error: any) {
    console.error('[Video Proxy Error]', error.message)
    return res.status(502).json({ error: 'Video proxy failed', message: error.message })
  }
}
