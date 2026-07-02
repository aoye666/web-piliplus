<template>
  <div class="video-detail">
    <van-nav-bar left-arrow @click-left="$router.back()" title="视频详情" fixed />

    <div class="player-area">
      <ArtPlayer v-if="playUrl" :url="playUrl" :danmaku="danmakuList" />
      <div v-else class="player-placeholder">
        <van-loading size="40" />
      </div>
    </div>

    <div class="info-section" v-if="detail">
      <h2 class="title">{{ detail.title }}</h2>
      <div class="meta">
        <span class="views">{{ formatCount(detail.stat?.view) }}播放</span>
        <span class="danmaku">{{ formatCount(detail.stat?.danmaku) }}弹幕</span>
        <span class="date">{{ formatDate(detail.pubdate) }}</span>
      </div>
      <div class="actions">
        <div class="action-item" :class="{ active: hasLike }" @click="onLike">
          <van-icon name="good-job-o" size="22" />
          <span>{{ formatCount(detail.stat?.like) }}</span>
        </div>
        <div class="action-item" @click="onCoin">
          <van-icon name="gold-coin-o" size="22" />
          <span>{{ formatCount(detail.stat?.coin) }}</span>
        </div>
        <div class="action-item" :class="{ active: hasFav }" @click="onFav">
          <van-icon name="star-o" size="22" />
          <span>{{ formatCount(detail.stat?.favorite) }}</span>
        </div>
        <div class="action-item">
          <van-icon name="share-o" size="22" />
          <span>分享</span>
        </div>
      </div>

      <div class="uploader" @click="$router.push(`/space/${detail.owner?.mid}`)">
        <img :src="detail.owner?.face" class="avatar" />
        <div class="uploader-info">
          <p class="name">{{ detail.owner?.name }}</p>
          <p class="fans">{{ detail.owner_ext?.fans }}粉丝</p>
        </div>
      </div>

      <div class="desc" v-if="detail.desc">
        <p>{{ detail.desc }}</p>
      </div>
    </div>

    <div class="reply-section">
      <h3 class="section-title">评论 ({{ totalReplies }})</h3>
      <div v-for="reply in replies" :key="reply.rpid" class="reply-item">
        <img :src="reply.member?.avatar" class="reply-avatar" />
        <div class="reply-content">
          <p class="reply-user">{{ reply.member?.uname }}</p>
          <p class="reply-text" v-html="reply.content?.message"></p>
          <div class="reply-meta">
            <span>{{ formatDate(reply.ctime) }}</span>
            <span>👍 {{ formatCount(reply.like) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getVideoDetail, getVideoPlayUrl, getDanmakuList } from '@/api/video'
import { getReplyList } from '@/api/reply'
import ArtPlayer from '@/components/ArtPlayer.vue'

const route = useRoute()
const bvid = route.params.bvid as string

const detail = ref<any>(null)
const playUrl = ref('')
const replies = ref<any[]>([])
const totalReplies = ref(0)
const hasLike = ref(false)
const hasFav = ref(false)
const danmakuList = ref<any[]>([])

onMounted(async () => {
  // 加载视频详情
  const res = await getVideoDetail(bvid)
  detail.value = res.data

  // 加载播放地址
  if (detail.value?.cid) {
    try {
      const playRes = await getVideoPlayUrl(bvid, detail.value.cid)
      const dash = playRes.data?.dash
      if (dash?.video?.[0]?.baseUrl) {
        playUrl.value = dash.video[0].baseUrl
      } else if (playRes.data?.durl?.[0]?.url) {
        playUrl.value = playRes.data.durl[0].url
      }
    } catch (e) {
      console.error('播放地址获取失败', e)
    }

    // 加载弹幕
    try {
      danmakuList.value = await getDanmakuList(detail.value.cid)
    } catch (e) {
      console.error('弹幕加载失败', e)
    }
  }

  // 加载评论
  if (detail.value?.aid) {
    try {
      const replyRes = await getReplies(detail.value.aid)
      replies.value = replyRes.data?.replies || []
      totalReplies.value = replyRes.data?.page?.count || 0
    } catch (e) {
      console.error('评论加载失败', e)
    }
  }
})

function onLike() { hasLike.value = !hasLike.value }
function onCoin() {}
function onFav() { hasFav.value = !hasFav.value }

function formatCount(n: number) {
  if (!n) return '0'
  if (n >= 10000) return (n / 10000).toFixed(1) + '万'
  return String(n)
}

function formatDate(ts: number) {
  if (!ts) return ''
  return new Date(ts * 1000).toLocaleDateString('zh-CN')
}
</script>

<style lang="scss" scoped>
.video-detail {
  padding-top: 46px;
  background: #fff;
  min-height: 100vh;
}

.player-area {
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
  .video-player { width: 100%; height: 100%; }
  .player-placeholder { display: flex; align-items: center; justify-content: center; height: 100%; }
}

.info-section {
  padding: 12px 16px;
  .title { font-size: 16px; line-height: 1.4; font-weight: 600; }
  .meta { display: flex; gap: 12px; margin-top: 8px; font-size: 12px; color: #9499a0; }
  .actions { display: flex; justify-content: space-around; margin: 16px 0; padding: 8px 0; border-top: 1px solid #e3e5e7; border-bottom: 1px solid #e3e5e7;
    .action-item { display: flex; flex-direction: column; align-items: center; gap: 2px; font-size: 12px; color: #61666d; cursor: pointer;
      &.active { color: #00aeec; }
    }
  }
  .uploader { display: flex; align-items: center; gap: 10px; padding: 12px 0; cursor: pointer;
    .avatar { width: 40px; height: 40px; border-radius: 50%; }
    .name { font-size: 14px; font-weight: 500; }
    .fans { font-size: 12px; color: #9499a0; }
  }
  .desc { font-size: 13px; color: #61666d; line-height: 1.6; padding: 8px 0; white-space: pre-wrap; }
}

.reply-section { padding: 16px;
  .section-title { font-size: 16px; font-weight: 600; margin-bottom: 12px; }
  .reply-item { display: flex; gap: 10px; padding: 12px 0; border-bottom: 1px solid #f1f2f3;
    .reply-avatar { width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0; }
    .reply-user { font-size: 13px; color: #61666d; font-weight: 500; }
    .reply-text { font-size: 14px; margin-top: 4px; line-height: 1.5; }
    .reply-meta { display: flex; gap: 16px; font-size: 12px; color: #9499a0; margin-top: 6px; }
  }
}
</style>
