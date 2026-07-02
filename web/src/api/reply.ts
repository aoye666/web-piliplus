import { get, post } from './http'

// 评论列表（主评论）
export async function getReplyList(params: {
  oid: number
  type?: number
  mode?: number
  pn?: number
  ps?: number
  next?: number
  paginationStr?: string
}) {
  const query: Record<string, any> = {
    oid: params.oid,
    type: params.type || 1,
    mode: params.mode || 3,
    pn: params.pn || 1,
    ps: params.ps || 20,
    web_location: 1315875,
  }
  if (params.paginationStr) {
    query.pagination_str = params.paginationStr
  }
  if (params.next) query.next = params.next
  return get<{ data: any }>('/x/v2/reply/main', query)
}

// 楼中楼（子评论）
export async function getReplyReply(params: {
  oid: number
  root: number
  pn?: number
  ps?: number
  type?: number
}) {
  return get<{ data: any }>('/x/v2/reply/reply', {
    oid: params.oid,
    root: params.root,
    pn: params.pn || 1,
    ps: params.ps || 20,
    type: params.type || 1,
  })
}

// 评论操作（点赞/踩）
export async function replyAction(oid: number, rpid: number, action: 0 | 1 | 2, csrf: string) {
  return post('/x/v2/reply/action', undefined, {
    data: new URLSearchParams({
      oid: String(oid),
      rpid: String(rpid),
      action: String(action),
      type: '1',
      csrf,
    }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

// 发送评论
export async function addReply(params: {
  oid: number
  message: string
  type?: number
  root?: number
  parent?: number
  csrf: string
}) {
  const data: Record<string, string> = {
    oid: String(params.oid),
    type: String(params.type || 1),
    message: params.message,
    csrf: params.csrf,
  }
  if (params.root) data.root = String(params.root)
  if (params.parent) data.parent = String(params.parent)

  return post('/x/v2/reply/add', undefined, {
    data: new URLSearchParams(data),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

// 删除评论
export async function delReply(oid: number, rpid: number, csrf: string) {
  return post('/x/v2/reply/del', undefined, {
    data: new URLSearchParams({
      oid: String(oid),
      rpid: String(rpid),
      type: '1',
      csrf,
    }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

// 评论置顶
export async function topReply(oid: number, rpid: number, action: boolean, csrf: string) {
  return post('/x/v2/reply/top', undefined, {
    data: new URLSearchParams({
      oid: String(oid),
      rpid: String(rpid),
      action: action ? '1' : '0',
      type: '1',
      csrf,
    }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}
