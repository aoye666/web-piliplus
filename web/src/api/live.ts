import { get, liveHttp } from './http'

// 直播间信息
export async function getLiveRoomInfo(roomId: number) {
  return get<{ data: any }>('/room/v1/Room/get_info', { room_id: roomId })
}

// 直播流地址
export async function getLivePlayUrl(roomId: number, quality = 4) {
  return get<{ data: any }>('/room/v1/Room/playUrl', {
    cid: roomId,
    platform: 'h5',
    quality,
  })
}

// 直播间详细信息
export async function getLiveRoomInfoH5(roomId: number) {
  return get<{ data: any }>('/room/v1/Room/get_info', { room_id: roomId })
}

// 直播分区列表
export async function getLiveAreaList() {
  return get<{ data: any }>('/room/v1/Area/getList')
}

// 直播推荐/首页
export async function getLiveFeedIndex(page = 1, platform = 'web') {
  return liveHttp.get('/xlive/web-interface/v1/second/getList', {
    params: { platform, parent_area_id: 0, area_id: 0, page, sort_type: '', web_location: 1550103 },
  })
}

// 直播关注
export async function getLiveFollow(page = 1) {
  return liveHttp.get('/xlive/web-ucenter/v1/xfetter/GetWebList', {
    params: { page, page_size: 30 },
  })
}

// 直播二级列表（分区）
export async function getLiveSecondList(params: {
  parentAreaId: number
  areaId: number
  page?: number
  sortType?: string
}) {
  return liveHttp.get('/xlive/web-interface/v1/second/getList', {
    params: {
      platform: 'web',
      parent_area_id: params.parentAreaId,
      area_id: params.areaId,
      page: params.page || 1,
      sort_type: params.sortType || '',
      web_location: 1550103,
    },
  })
}

// 直播搜索
export async function searchLive(keyword: string, page = 1) {
  return liveHttp.get('/xlive/web-interface/v1/search/getSearch', {
    params: { keyword, page, page_size: 30 },
  })
}

// 直播弹幕信息
export async function getLiveDanmakuToken(roomId: number) {
  return liveHttp.get('/xlive/web-room/v1/index/getDanmuInfo', {
    params: { id: roomId },
  })
}

// 直播表情
export async function getLiveEmoticons() {
  return liveHttp.get('/xlive/web-ucenter/v2/emoticon/GetEmoticons')
}

// 直播点赞上报
export async function liveLikeReport(roomId: number, uid: number, csrf: string) {
  return liveHttp.post('/xlive/app-ucenter/v1/like_info/v3/like/likeReportV3', undefined, {
    params: { room_id: roomId, uid, like_id: 0, click_time: 0, csrf },
  })
}

// 直播贡献榜
export async function getLiveContributionRank(roomId: number, type: string, page = 1) {
  return liveHttp.get('/xlive/general-interface/v1/guard/GuardTab', {
    params: { roomid: roomId, ruid: 0, page, page_size: 20, type },
  })
}

// 直播大航海/醒目留言
export async function getSuperChatMsg(roomId: number) {
  return liveHttp.get('/xlive/app-room/v1/SuperChat/getInfo', {
    params: { room_id: roomId },
  })
}

// 直播勋章墙
export async function getMedalWall(uid: number) {
  return liveHttp.get('/xlive/web-ucenter/v1/user_medal/GetMedalWall', {
    params: { target_id: uid },
  })
}
