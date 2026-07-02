import { get, post } from './http'
import { wbiSign } from '@/utils/wbi'

// 收藏夹列表
export async function getFavFolderList(upMid: number) {
  return get<{ data: any }>('/x/v3/fav/folder/created/list-all', { up_mid: upMid })
}

// 收藏夹详情（含视频列表）
export async function getFavResourceList(params: {
  mediaId: number
  pn?: number
  ps?: number
  keyword?: string
  order?: string
}) {
  const query: Record<string, any> = {
    media_id: params.mediaId,
    pn: params.pn || 1,
    ps: params.ps || 20,
  }
  if (params.keyword) query.keyword = params.keyword
  if (params.order) query.order = params.order
  return get<{ data: any }>('/x/v3/fav/resource/list', query)
}

// 收藏视频
export async function favResource(rid: number, addMediaIds: number[], delMediaIds: number[], csrf: string) {
  return post('/x/v3/fav/resource/deal', undefined, {
    data: new URLSearchParams({
      rid: String(rid),
      type: '2',
      add_media_ids: addMediaIds.join(','),
      del_media_ids: delMediaIds.join(','),
      csrf,
    }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

// 创建收藏夹
export async function createFavFolder(title: string, csrf: string, intro = '', privacy = 0) {
  return post('/x/v3/fav/folder/add', undefined, {
    data: new URLSearchParams({
      title, intro, privacy: String(privacy), csrf,
    }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

// 编辑收藏夹
export async function editFavFolder(mediaId: number, title: string, csrf: string, intro = '', privacy = 0) {
  return post('/x/v3/fav/folder/edit', undefined, {
    data: new URLSearchParams({
      media_id: String(mediaId), title, intro, privacy: String(privacy), csrf,
    }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

// 删除收藏夹
export async function delFavFolder(mediaIds: number[], csrf: string) {
  return post('/x/v3/fav/folder/del', undefined, {
    data: new URLSearchParams({
      media_ids: mediaIds.join(','),
      csrf,
    }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

// 清空失效收藏
export async function cleanFavResources(mediaId: number, resources: string, csrf: string) {
  return post('/x/v3/fav/resource/batch-del', undefined, {
    data: new URLSearchParams({
      media_id: String(mediaId),
      resources,
      csrf,
    }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

// 视频是否被收藏
export async function isFavByAid(aid: number) {
  return get<{ data: any }>('/x/v2/fav/video/favoured', { aid })
}

// 收藏夹元数据（用于判断是否已收藏）
export async function getFavFolderInfo(mediaId: number) {
  return get<{ data: any }>('/x/v3/fav/folder/info', { media_id: mediaId })
}
