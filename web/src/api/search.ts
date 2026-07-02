import { get, post, searchHttp } from './http'
import { wbiSign } from '@/utils/wbi'

// 搜索建议
export async function getSearchSuggest(term: string) {
  return searchHttp.get('/main/suggest', {
    params: { term, main_ver: 'v1', highlight: term },
  })
}

// 热搜榜
export async function getSearchSquare() {
  return get<{ data: any }>('/x/web-interface/wbi/search/square')
}

// 搜索推荐
export async function getSearchRecommend() {
  return get<{ data: any }>('/x/web-interface/search/recommend')
}

// 分类搜索
export type SearchType = 'video' | 'bangumi' | 'pgc' | 'livestream' | 'article' | 'bili_user'

export async function searchByType(params: {
  searchType: SearchType
  keyword: string
  page: number
  order?: string
  duration?: number
  tids?: number
  orderSort?: number
  userType?: number
  categoryId?: number
  pubBegin?: number
  pubEnd?: number
  gaiaVtoken?: string
}) {
  const signParams = await wbiSign({
    search_type: params.searchType,
    keyword: params.keyword,
    page: params.page,
    page_size: 20,
    platform: 'pc',
    web_location: 1430654,
    ...(params.order && { order: params.order }),
    ...(params.duration != null && { duration: params.duration }),
    ...(params.tids != null && { tids: params.tids }),
    ...(params.orderSort != null && { order_sort: params.orderSort }),
    ...(params.userType != null && { user_type: params.userType }),
    ...(params.categoryId != null && { category_id: params.categoryId }),
    ...(params.pubBegin != null && { pubtime_begin_s: params.pubBegin }),
    ...(params.pubEnd != null && { pubtime_end_s: params.pubEnd }),
  })

  const headers: Record<string, string> = {
    origin: 'https://search.bilibili.com',
    referer: `https://search.bilibili.com/${params.searchType}?keyword=${encodeURIComponent(params.keyword)}`,
  }
  if (params.gaiaVtoken) {
    headers.cookie = `x-bili-gaia-vtoken=${params.gaiaVtoken}`
  }

  return get<{ data: any }>('/x/web-interface/wbi/search/type', signParams, { headers })
}
