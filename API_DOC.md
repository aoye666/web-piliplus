# PiliPlus B 站 API 文档

## 基础配置

### API 域名
| 名称 | 域名 | 用途 |
|------|------|------|
| 主站 API | `https://api.bilibili.com` | 视频、用户、评论等 |
| APP API | `https://app.bilibili.com` | APP端接口 |
| 直播 API | `https://api.live.bilibili.com` | 直播相关 |
| 动态 API | `https://api.vc.bilibili.com` | 旧版动态 |
| 通行证 | `https://passport.bilibili.com` | 登录/认证 |
| 消息 | `https://message.bilibili.com` | 私信/通知 |
| 商城 | `https://mall.bilibili.com` | 购物/装扮 |

### 特殊认证
- **WBI 签名**：部分接口需要 `w_rid` + `wts` 参数签名
- **APP 签名**：APP端接口需要 `AppSign` 签名
- **CSRF**：POST 请求需要 `csrf` token（从 Cookie bili_jct 获取）

---

## 核心 API 端点

### 1. 首页推荐

#### 推荐视频（Web端）
```
GET /x/web-interface/wbi/index/top/feed/rcmd
参数：
  - version: 1
  - feed_version: V8
  - homepage_ver: 1
  - ps: 每页数量
  - fresh_idx: 刷新索引
  - wbi签名: w_rid, wts
```

#### 热门视频
```
GET /x/web-interface/popular
参数：
  - pn: 页码
  - ps: 每页数量
```

### 2. 视频详情

#### 视频信息
```
GET /x/web-interface/view
参数：
  - aid: 稿件avid（与bvid二选一）
  - bvid: 稿件bvid
```

#### 视频流地址
```
GET /x/player/wbi/playurl
参数：
  - bvid
  - cid
  - qn: 画质（16/32/64/80/112/116/120/125/126/127）
  - fnval: 功能标志（16=flv, 1=dash, 4048=dash+杜比）
  - wbi签名
```

#### 番剧视频流
```
GET /pgc/player/web/v2/playurl
参数：
  - cid
  - bvid
```

#### 视频播放信息（字幕）
```
GET /x/player/wbi/v2
参数：
  - aid, cid
```

### 3. 视频互动

#### 点赞
```
POST /x/v2/view/like
参数：
  - aid: avid
  - like: 1=点赞, 2=取消
```

#### 投币
```
POST /x/web-interface/coin/add
参数：
  - aid
  - multiply: 数量（1-2）
  - select_like: 是否附加点赞
```

#### 收藏
```
POST /x/v3/fav/resource/deal
参数：
  - rid: avid
  - type: 2（视频）
  - add_media_ids: 收藏夹ID列表
  - del_media_ids: 取消收藏夹ID列表
```

#### 三连（点赞+投币+收藏）
```
POST /x/web-interface/archive/like/triple
参数：
  - aid
```

### 4. 搜索

#### 搜索建议
```
GET https://s.search.bilibili.com/main/suggest
参数：
  - term: 搜索词
  - main_ver: v1
  - highlight: 搜索词
```

#### 分类搜索
```
GET /x/web-interface/wbi/search/type
参数：
  - search_type: video/bangumi/pgc/livestream/article
  - keyword: 关键词
  - page: 页码
  - order: 排序（totalrank/click/pubdate/dm）
  - duration: 时长（0/1/2/3）
  - tids: 分区
  - wbi签名
```

#### 热搜榜
```
GET /x/web-interface/wbi/search/square
```

### 5. 弹幕

#### 弹幕列表
```
GET https://comment.bilibili.com/{cid}.xml
返回：XML 格式弹幕数据
```

#### 历史弹幕
```
GET /x/v1/dm/history
参数：
  - type: 1（视频）
  - oid: cid
  - date: 日期（2024-01-01格式）
```

### 6. 评论

#### 评论列表
```
GET /x/v2/reply/main
参数：
  - oid: 视频aid
  - type: 1（视频）
  - mode: 2=按时间, 3=按热度
  - pn: 页码
  - ps: 每页数量
  - pagination_str: 分页字符串
```

#### 楼中楼（子评论）
```
GET /x/v2/reply/reply
参数：
  - oid
  - root: 根评论rpid
  - pn, ps
  - type: 1
```

### 7. 动态

#### 关注动态
```
GET /x/polymer/web-dynamic/v1/feed/all
参数：
  - offset: 翻页参数
  - features: 功能标志
```

#### UP主动态
```
GET /x/polymer/web-dynamic/v1/feed/space
参数：
  - host_mid: UP主uid
  - offset
```

### 8. 用户

#### 用户信息
```
GET /x/web-interface/nav
返回：当前登录用户信息（含登录状态）
```

#### 用户空间
```
GET /x/space/wbi/acc/info
参数：
  - mid: 用户uid
  - wbi签名
```

#### 关注列表
```
GET /x/relation/followings
参数：
  - vmid: 用户uid
  - pn, ps
```

#### 粉丝列表
```
GET /x/relation/followers
参数：
  - vmid
  - pn, ps
```

#### 稍后再看
```
GET /x/v2/history/toview/web
```

#### 历史记录
```
GET /x/web-interface/history/cursor
参数：
  - max: 最大时间戳
  - view_at: 指定时间
  - type: 类型
```

### 9. 直播

#### 直播间信息
```
GET /room/v1/Room/get_info
参数：
  - room_id: 直播间ID
```

#### 直播流地址
```
GET /room/v1/Room/playUrl
参数：
  - cid: 直播间ID
  - platform: h5
  - quality: 画质
```

#### 直播分区
```
GET /room/v1/Area/getList
```

#### 直播弹幕（Websocket）
```
wss://broadcastlv.chat.bilibili.com/sub
```

### 10. 登录

#### 扫码登录（TV模式）
```
POST /x/passport-tv-login/qrcode/auth_code
参数（APP签名）：
  - local_id: 0
  - platform: android
  - mobi_app: android_hd
```

#### 轮询登录状态
```
POST /x/passport-tv-login/qrcode/poll
参数（APP签名）：
  - auth_code
```

#### Web 扫码
```
GET /x/passport-login/web/qrcode/generate
返回：qrcode_key, url
```

#### Web 扫码轮询
```
GET /x/passport-login/web/qrcode/poll
参数：
  - qrcode_key
```

### 11. 收藏

#### 收藏夹列表
```
GET /x/v3/fav/folder/created/list-all
参数：
  - up_mid: 用户uid
```

#### 收藏夹详情
```
GET /x/v3/fav/resource/list
参数：
  - media_id: 收藏夹ID
  - pn, ps
  - keyword: 搜索
  - order: 排序
```

### 12. 番剧/影视

#### 番剧详情
```
GET /pgc/view/web/season
参数：
  - season_id: 番剧ID
```

#### 番剧列表
```
GET /pgc/web/rank/list
参数：
  - season_type: 1=番剧, 2=电影, 3=纪录片, 4=国创, 5=电视剧, 7=综艺
```

---

## 关键注意事项

1. **CORS 限制**：浏览器直接调用 B 站 API 会遇到跨域，需要代理服务器
2. **签名算法**：WBI 签名和 APP 签名是必须的，否则大部分接口返回 -352 错误
3. **Cookie 管理**：登录态通过 Cookie 维持，需要代理转发或第三方登录方案
4. **频率限制**：B 站有反爬机制，请求频率不能太高
