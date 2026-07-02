import { get, post } from './http'
import { wbiSign } from '@/utils/wbi'

// 推荐视频
export async function getRecommend(ps = 20, freshIdx = 1) {
  const params = await wbiSign({
    version: 1, feed_version: 'V8', homepage_ver: 1,
    ps, fresh_idx: freshIdx,
  })
  return get<{ data: { item: any[] } }>('/x/web-interface/wbi/index/top/feed/rcmd', params)
}

// 热门视频
export async function getHot(pn = 1, ps = 20) {
  return get<{ data: { list: any[] } }>('/x/web-interface/popular', { pn, ps })
}

// 热门精选
export async function getHotPrecious(pn = 1, ps = 20) {
  return get<{ data: any }>('/x/web-interface/popular/precious', { pn, ps })
}

// 入站必刷
export async function getHotSeries(seriesId: number, pageNum = 1, pageSize = 20) {
  return get<{ data: any }>('/x/web-interface/popular/series/one', {
    series_id: seriesId, pageNum, pageSize,
  })
}

// 热门系列列表
export async function getHotSeriesList() {
  return get<{ data: any }>('/x/web-interface/popular/series/list')
}

// 视频详情
export async function getVideoDetail(bvid: string) {
  return get<{ data: any }>('/x/web-interface/view', { bvid })
}

// 视频详情（超详细，含 tag 等）
export async function getVideoDetailInfo(bvid: string) {
  return get<{ data: any }>('/x/web-interface/view/detail', { bvid })
}

// 视频流
export async function getVideoPlayUrl(bvid: string, cid: number, qn = 80) {
  const params = await wbiSign({ bvid, cid, qn, fnval: 16, fourk: 1 })  // fnval:16 = FLV 单流，避免 DASH 音画分离
  return get<{ data: any }>('/x/player/wbi/playurl', params)
}

// PUGV 付费视频流
export async function getPugvPlayUrl(bvid: string, cid: number, epId?: number) {
  return get<{ data: any }>('/pugv/player/web/playurl', {
    bvid, cid, ...(epId && { ep_id: epId }),
  })
}

// 视频播放信息（字幕等）
export async function getPlayInfo(aid: number, cid: number) {
  const params = await wbiSign({ aid, cid })
  return get<{ data: any }>('/x/player/wbi/v2', params)
}

// 点赞视频
export async function likeVideo(aid: number, like: 1 | 2, csrf: string) {
  return post('/x/web-interface/archive/like', undefined, {
    data: new URLSearchParams({ aid: String(aid), like: String(like), csrf }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

// 判断是否已点赞
export async function hasLike(aid: number) {
  return get<{ data: { like: boolean } }>('/x/web-interface/archive/has/like', { aid })
}

// 投币
export async function coinVideo(aid: number, multiply: number, selectLike: boolean, csrf: string) {
  return post('/x/web-interface/coin/add', undefined, {
    data: new URLSearchParams({
      aid: String(aid), multiply: String(multiply),
      select_like: selectLike ? '1' : '0', csrf,
    }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

// 判断是否已投币
export async function hasCoin(aid: number) {
  return get<{ data: { multiply: number } }>('/x/web-interface/archive/coins', { aid })
}

// 收藏视频
export async function favVideo(rid: number, addMediaIds: number[], delMediaIds: number[], csrf: string) {
  return post('/x/v3/fav/resource/deal', undefined, {
    data: new URLSearchParams({
      rid: String(rid), type: '2',
      add_media_ids: addMediaIds.join(','),
      del_media_ids: delMediaIds.join(','),
      csrf,
    }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

// 判断是否已收藏
export async function hasFav(aid: number) {
  return get<{ data: { favoured: boolean } }>('/x/v2/fav/video/favoured', { aid })
}

// 三连（点赞+投币+收藏）
export async function tripleAction(aid: number, csrf: string) {
  return post('/x/web-interface/archive/like/triple', undefined, {
    data: new URLSearchParams({ aid: String(aid), csrf }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

// 视频TAG
export async function getVideoTags(aid: number) {
  return get<{ data: any[] }>('/x/tag/archive/tags', { aid })
}

// 相关视频推荐
export async function getRelatedVideos(bvid: string) {
  return get<{ data: any[] }>('/x/web-interface/archive/related', { bvid })
}

// AI 总结
export async function getVideoAiConclusion(bvid: number, cid: number, upMid: number) {
  return get<{ data: any }>('/x/web-interface/view/conclusion/get', {
    bvid, cid, up_mid: upMid,
  })
}

// 视频笔记列表
export async function getVideoNoteList(aid: number, pn = 1, ps = 10) {
  return get<{ data: any }>('/x/note/list/archive', { oid: aid, oid_type: 0, pn, ps })
}

// 视频截图
export async function getVideoShot(bvid: string, cid: number) {
  return get<{ data: any }>('/x/player/videoshot', { bvid, cid, index: 1 })
}

// 获取分P信息
export async function getVideoPages(bvid: string) {
  return get<{ data: any }>('/x/player/pagelist', { bvid })
}

// 稍后再看
export async function addToView(aid: number, csrf: string) {
  return post('/x/v2/history/toview/add', undefined, {
    data: new URLSearchParams({ aid: String(aid), csrf }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

// 获取弹幕（XML 解析）
export async function getDanmakuList(cid: number) {
  try {
    const resp = await fetch(`/comment/${cid}.xml`)
    const text = await resp.text()
    const parser = new DOMParser()
    const xml = parser.parseFromString(text, 'text/xml')
    const dElements = xml.querySelectorAll('d')
    return Array.from(dElements).map((el) => {
      const p = el.getAttribute('p') || ''
      const [time, mode, fontSize, color] = p.split(',')
      return {
        text: el.textContent || '',
        time: parseFloat(time) || 0,
        mode: parseInt(mode) || 1,
        fontSize: parseInt(fontSize) || 25,
        color: parseInt(color) || 0xffffff,
      }
    })
  } catch (e) {
    console.error('弹幕获取失败', e)
    return []
  }
}

// 不感兴趣
export async function dislikeRecommend(aid: number, reason: string, csrf: string) {
  return post('/x/feed/dislike', undefined, {
    data: new URLSearchParams({ aid: String(aid), reason, csrf }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

// 取消不感兴趣
export async function cancelDislike(aid: number, csrf: string) {
  return post('/x/feed/dislike/cancel', undefined, {
    data: new URLSearchParams({ aid: String(aid), csrf }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}
