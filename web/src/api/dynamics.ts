import { get, post } from './http'

// 关注动态
export async function getFollowDynamic(params: { offset?: string; type?: string } = {}) {
  const data: Record<string, any> = {
    features: 'itemOpusStyle,listOnlyfans,opusMultiView,onlyfansReturn,decorationCard,onlyfansAssets,ugcDelete,commentsNewVersion,web-zhengce,replaceOgvDyn',
    ...(params.offset && { offset: params.offset }),
  }
  if (params.type === 'up') {
    // UP主动态
  } else {
    data.type = params.type || 'all'
  }
  return get<{ data: any }>('/x/polymer/web-dynamic/v1/feed/all', data)
}

// UP主动态
export async function getUpDynamic(hostMid: number, offset?: string) {
  const params: Record<string, any> = {
    host_mid: hostMid,
    features: 'itemOpusStyle,listOnlyfans,opusMultiView,onlyfansReturn,decorationCard,onlyfansAssets,ugcDelete,commentsNewVersion,web-zhengce,replaceOgvDyn',
  }
  if (offset) params.offset = offset
  return get<{ data: any }>('/x/polymer/web-dynamic/v1/feed/space', params)
}

// 动态详情
export async function getDynamicDetail(dynamicId: string) {
  return get<{ data: any }>('/x/polymer/web-dynamic/v1/detail', { id: dynamicId })
}

// 动态评论
export async function getDynamicReply(oid: number, pn = 1, mode = 3) {
  return get<{ data: any }>('/x/v2/reply/main', {
    oid,
    type: 17,
    mode,
    pn,
    ps: 20,
  })
}

// 转发详情
export async function getDynamicRepost(dynamicId: string, offset?: string) {
  const params: Record<string, any> = { dynamic_id: dynamicId }
  if (offset) params.offset = offset
  return get<{ data: any }>('/x/polymer/web-dynamic/v1/detail/repost', params)
}

// 发布动态（文字）
export async function postDynamic(content: string, csrf: string) {
  const formData = new URLSearchParams()
  formData.append('dynamic_id', '0')
  formData.append('type', '4')
  formData.append('rid', '0')
  formData.append('content', content)
  formData.append('csrf', csrf)
  return post('/x/dynamic/feed/create/dyn', undefined, {
    data: formData,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}
