import { get, post } from './http'
import { wbiSign } from '@/utils/wbi'

// 当前用户信息
export async function getNavInfo() {
  return get<{ data: any }>('/x/web-interface/nav')
}

// 用户空间信息
export async function getUserInfo(mid: number) {
  const params = await wbiSign({ mid })
  return get<{ data: any }>('/x/space/wbi/acc/info', params)
}

// 用户关系（关注/粉丝/黑名单状态）
export async function getUserRelation(mid: number) {
  return get<{ data: any }>('/x/relation', { vmid: mid })
}

// 关注列表
export async function getFollowings(vmid: number, pn = 1, ps = 20, order?: string) {
  return get<{ data: any }>('/x/relation/followings', {
    vmid, pn, ps, ...(order && { order }),
  })
}

// 粉丝列表
export async function getFollowers(vmid: number, pn = 1, ps = 20) {
  return get<{ data: any }>('/x/relation/followers', { vmid, pn, ps })
}

// 关注/取关
export async function modifyRelation(fid: number, act: 1 | 2, csrf: string) {
  return post('/x/relation/modify', undefined, {
    data: new URLSearchParams({ fid: String(fid), act: String(act), re_src: '11', csrf }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

// 稍后再看列表
export async function getToViewList() {
  return get<{ data: any }>('/x/v2/history/toview/web')
}

// 添加稍后再看
export async function addToView(aid: number, csrf: string) {
  return post('/x/v2/history/toview/add', undefined, {
    data: new URLSearchParams({ aid: String(aid), csrf }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

// 删除稍后再看
export async function delFromView(aids: string, csrf: string) {
  return post('/x/v2/history/toview/del', undefined, {
    data: new URLSearchParams({ viewed: aids, csrf }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

// 清空稍后再看
export async function clearToView(csrf: string) {
  return post('/x/v2/history/toview/clear', undefined, {
    data: new URLSearchParams({ csrf }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

// 历史记录
export async function getHistory(params: { max?: number; viewAt?: number; type?: string } = {}) {
  const query: Record<string, any> = { wbi_mode: 0 }
  if (params.max) query.max = params.max
  if (params.viewAt) query.view_at = params.viewAt
  if (params.type) query.type = params.type
  return get<{ data: any }>('/x/web-interface/history/cursor', query)
}

// 删除历史记录
export async function delHistory(kid: string, csrf: string) {
  return post('/x/v2/history/delete', undefined, {
    data: new URLSearchParams({ kid, csrf }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

// 暂停历史记录
export async function pauseHistory(switch_: boolean, csrf: string) {
  return post('/x/history/v2/pause', undefined, {
    data: new URLSearchParams({ switch: String(switch_), csrf }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

// 清空历史记录
export async function clearHistory(csrf: string) {
  return post('/x/v2/history/clear', undefined, {
    data: new URLSearchParams({ csrf }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

// 用户稿件
export async function getUserVideos(mid: number, pn = 1, ps = 30, order = 'pubdate') {
  const params = await wbiSign({ mid, pn, ps, order, web_location: 1550103 })
  return get<{ data: any }>('/x/space/wbi/arc/search', params)
}

// 用户动态
export async function getUserDynamics(hostMid: number, offset?: string) {
  return get<{ data: any }>('/x/polymer/web-dynamic/v1/feed/space', {
    host_mid: hostMid,
    ...(offset && { offset }),
    features: 'itemOpusStyle,listOnlyfans,opusMultiView,onlyfansReturn,decorationCard,onlyfansAssets,ugcDelete,commentsNewVersion',
  })
}

// 获取硬币数
export async function getCoin() {
  return get<{ data: { money: number } }>('/x/web-interface/nav')
}

// 投币
export async function coinVideo(aid: number, multiply: number, selectLike: boolean, csrf: string) {
  return post('/x/web-interface/coin/add', undefined, {
    data: new URLSearchParams({
      aid: String(aid),
      multiply: String(multiply),
      select_like: selectLike ? '1' : '0',
      csrf,
    }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

// 点赞视频
export async function likeVideo(aid: number, like: 1 | 2, csrf: string) {
  return post('/x/web-interface/archive/like', undefined, {
    data: new URLSearchParams({ aid: String(aid), like: String(like), csrf }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}
