import { get, post, commentHttp } from './http'

// 私信会话列表
export async function getSessionList(params: { sessionType?: number; build?: number; mobiApp?: string } = {}) {
  return get<{ data: any }>('/session_svr/get_sessions', {
    session_type: params.sessionType || 0,
    group_fold: 1,
    unfollow_fold: 0,
    sort_rule: 2,
    build: params.build || 0,
    mobi_app: params.mobiApp || 'web',
  })
}

// 私信历史消息
export async function getMsgHistory(params: {
  talkerId: number
  msgSeqno?: number
  size?: number
}) {
  return get<{ data: any }>('/session_svr/get_msgs', {
    talker_id: params.talkerId,
    session_type: 1,
    msg_seqno: params.msgSeqno || 0,
    size: params.size || 20,
  })
}

// 发送私信
export async function sendMsg(params: {
  receiverId: number
  msgType: number
  content: string
  csrf: string
}) {
  return post('/web_im/v1/web_im/send_msg', undefined, {
    data: new URLSearchParams({
      msg_type: String(params.msgType),
      receiver_id: String(params.receiverId),
      content: params.content,
      csrf: params.csrf,
    }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

// 系统通知列表
export async function getSysMsgList(pn = 1, ps = 20) {
  return get<{ data: any }>('/message_center/notify/get', { pn, ps })
}

// 回复我的
export async function getReplyMe(pn = 1, ps = 20) {
  return get<{ data: any }>('/message_center/reply', { pn, ps })
}

// @我的
export async function getAtMe(pn = 1, ps = 20) {
  return get<{ data: any }>('/message_center/at', { pn, ps })
}

// 收到的赞
export async function getLikeMe(pn = 1, ps = 20) {
  return get<{ data: any }>('/message_center/like', { pn, ps })
}

// 未读消息数
export async function getUnreadCount() {
  return get<{ data: any }>('/x/msgfeed/unread/count')
}

// 弹幕 XML
export async function getDanmakuXml(cid: number) {
  return commentHttp.get(`/${cid}.xml`, { responseType: 'text' })
}

// 历史弹幕
export async function getHistoryDanmaku(cid: number, date: string) {
  return get<{ data: any }>('/x/v1/dm/history', { type: 1, oid: cid, date })
}

// 弹幕屏蔽词
export async function getDanmakuBlockList() {
  return get<{ data: any }>('/x/dm/block/list')
}

// 添加弹幕屏蔽词
export async function addDanmakuBlock(keyword: string, csrf: string) {
  return post('/x/dm/block/add', undefined, {
    data: new URLSearchParams({ keyword, csrf }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

// 删除弹幕屏蔽词
export async function delDanmakuBlock(keyword: string, csrf: string) {
  return post('/x/dm/block/del', undefined, {
    data: new URLSearchParams({ keyword, csrf }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}
