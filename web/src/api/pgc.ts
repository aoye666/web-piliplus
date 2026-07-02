import { get, post } from './http'
import { wbiSign } from '@/utils/wbi'

// 番剧/影视详情
export async function getPgcSeasonInfo(seasonId: number) {
  return get<{ data: any }>('/pgc/view/web/season', { season_id: seasonId })
}

// 番剧/影视详情（通过 ep_id）
export async function getPgcEpisodeInfo(epId: number) {
  return get<{ data: any }>('/pgc/view/web/season', { ep_id: epId })
}

// 番剧视频流
export async function getPgcPlayUrl(params: {
  bvid: string
  cid: number
  qn?: number
  fnval?: number
}) {
  return get<{ data: any }>('/pgc/player/web/v2/playurl', {
    bvid: params.bvid,
    cid: params.cid,
    qn: params.qn || 80,
    fnval: params.fnval || 4048,
  })
}

// PGC 排行榜
export async function getPgcRank(seasonType: number, day = 3) {
  return get<{ data: any }>('/pgc/web/rank/list', { season_type: seasonType, day })
}

// PGC 时间线
export async function getPgcTimeline(type: number) {
  return get<{ data: any }>('/pgc/web/timeline', { types: type })
}

// PGC 排行榜（更多）
export async function getPgcRankList(params: {
  seasonType: number
  pageNum?: number
  pageSize?: number
  order?: string
}) {
  return get<{ data: any }>('/pgc/season/rank/web/list', {
    season_type: params.seasonType,
    page_num: params.pageNum || 1,
    page_size: params.pageSize || 20,
    order: params.order || '0',
  })
}

// PGC 索引
export async function getPgcIndex(params: {
  seasonType: number
  page?: number
  pageSize?: number
  sort?: number
  area?: number
  isFinish?: number
  seasonMonth?: number
  year?: string
}) {
  return get<{ data: any }>('/pgc/season/index/result', {
    season_type: params.seasonType,
    page: params.page || 1,
    page_size: params.pageSize || 20,
    sort: params.sort || 0,
    ...(params.area && { area: params.area }),
    ...(params.isFinish != null && { is_finish: params.isFinish }),
    ...(params.seasonMonth && { season_month: params.seasonMonth }),
    ...(params.year && { year: params.year }),
  })
}

// 番剧/影视搜索（分类搜索 bangumi/pgc）
export async function searchPgc(keyword: string, page = 1, seasonType?: number) {
  const params = await wbiSign({
    search_type: 'bangumi',
    keyword,
    page,
    page_size: 20,
    platform: 'pc',
    web_location: 1430654,
    ...(seasonType && { season_type: String(seasonType) }),
  })
  return get<{ data: any }>('/x/web-interface/wbi/search/type', params)
}

// 番剧收藏状态
export async function getPgcFavStatus(seasonId: number) {
  return get<{ data: any }>('/pgc/season/follow/info', { season_id: seasonId })
}

// 追番/追剧
export async function followPgc(seasonId: number, csrf: string) {
  return post('/pgc/app/follow/add', undefined, {
    data: new URLSearchParams({ season_id: String(seasonId), csrf }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

// 取消追番/追剧
export async function unfollowPgc(seasonId: number, csrf: string) {
  return post('/pgc/app/follow/del', undefined, {
    data: new URLSearchParams({ season_id: String(seasonId), csrf }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}
