<template>
  <div class="video-detail" v-if="detail">
    <!-- 顶部导航 -->
    <div class="detail-header">
      <van-icon name="arrow-left" size="22" @click="$router.back()" />
      <span class="header-title">{{ detail.title }}</span>
    </div>

    <!-- 播放器 -->
    <ArtPlayer
      v-if="playUrl"
      :url="playUrl"
      :title="detail.title"
      :poster="detail.pic + '@480w_300h.jpg'"
      :danmaku="danmakuList"
      class="player"
    />
    <div v-else class="player-placeholder">
      <van-loading size="36" color="#00aeec" />
    </div>

    <!-- 视频信息 -->
    <div class="info-section">
      <h2 class="video-title">{{ detail.title }}</h2>
      <div class="video-stats">
        <span>{{ formatCount(detail.stat?.view || 0) }}次观看</span>
        <span class="sep">·</span>
        <span>{{ formatCount(detail.stat?.like || 0) }}点赞</span>
        <span class="sep">·</span>
        <span>{{ formatCount(detail.stat?.danmaku || 0) }}弹幕</span>
      </div>

      <!-- UP主信息 -->
      <div class="uploader" @click="goSpace(detail.owner?.mid)" v-if="detail.owner">
        <img :src="detail.owner?.face" class="avatar" />
        <div class="uploader-info">
          <span class="name">{{ detail.owner?.name }}</span>
          <span class="followers">{{ formatCount(detail.stat?.follower || 0) }}粉丝</span>
        </div>
        <button class="follow-btn" @click.stop>关注</button>
      </div>

      <!-- 操作按钮 -->
      <div class="action-bar">
        <div class="action-item" @click="onLike">
          <van-icon :name="hasLike ? 'good-job' : 'good-job-o'" :color="hasLike ? '#00aeec' : '#61666d'" size="22" />
          <span :class="{ active: hasLike }">{{ formatCount(detail.stat?.like || 0) }}</span>
        </div>
        <div class="action-item">
          <van-icon name="star-o" size="22" color="#61666d" />
          <span>{{ formatCount(detail.stat?.favorite || 0) }}</span>
        </div>
        <div class="action-item">
          <van-icon name="chat-o" size="22" color="#61666d" />
          <span>{{ formatCount(detail.stat?.reply || 0) }}</span>
        </div>
        <div class="action-item">
          <van-icon name="share-o" size="22" color="#61666d" />
          <span>分享</span>
        </div>
      </div>
    </div>

    <!-- 简介 -->
    <div class="desc-section" v-if="detail.desc">
      <div class="desc-label">简介</div>
      <p class="desc-text" :class="{ expanded: descExpanded }">{{ detail.desc }}</p>
      <span class="desc-toggle" v-if="detail.desc.length > 60" @click="descExpanded = !descExpanded">
        {{ descExpanded ? '收起' : '展开' }}
      </span>
    </div>

    <!-- 评论 -->
    <div class="comment-section">
      <div class="section-header">
        <span class="section-title">评论</span>
        <span class="comment-count">{{ formatCount(totalReplies) }}</span>
      </div>
      <div class="comment-list">
        <ReplyItem v-for="item in replies" :key="item.rpid" :reply="item" />
        <van-empty v-if="!replies.length" description="暂无评论" image-size="80" />
      </div>
    </div>
  </div>

  <!-- 加载态 -->
  <div v-else class="loading-wrap">
    <van-loading size="36" color="#00aeec" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getVideoDetail, getVideoPlayUrl, getDanmakuList } from '@/api/video'
import { getReplyList } from '@/api/reply'
import ArtPlayer from '@/components/ArtPlayer.vue'
import ReplyItem from '@/components/ReplyItem.vue'

const route = useRoute()
const router = useRouter()
const bvid = route.params.bvid as string

const detail = ref<any>(null)
const playUrl = ref('')
const danmakuList = ref<any[]>([])
const replies = ref<any[]>([])
const totalReplies = ref(0)
const hasLike = ref(false)
const descExpanded = ref(false)

onMounted(async () => {
  try {
    const res = await getVideoDetail(bvid)
    detail.value = res.data

    if (detail.value?.cid) {
      try {
        const playRes = await getVideoPlayUrl(bvid, detail.value.cid)
        // FLV 单流格式
        if (playRes.data?.durl?.[0]?.url) {
          playUrl.value = `/api/video-proxy?url=${encodeURIComponent(playRes.data.durl[0].url)}`
        }
        // 兜底 DASH
        else if (playRes.data?.dash?.video?.[0]?.baseUrl) {
          playUrl.value = `/api/video-proxy?url=${encodeURIComponent(playRes.data.dash.video[0].baseUrl)}`
        }
      } catch (e) {
        console.error('播放地址获取失败', e)
      }

      try {
        danmakuList.value = await getDanmakuList(detail.value.cid)
      } catch (e) {
        console.error('弹幕加载失败', e)
      }
    }

    if (detail.value?.aid) {
      try {
        const replyRes = await getReplyList({ oid: detail.value.aid })
        replies.value = replyRes.data?.replies || []
        totalReplies.value = replyRes.data?.page?.count || 0
      } catch (e) {
        console.error('评论加载失败', e)
      }
    }
  } catch (e) {
    console.error('视频加载失败', e)
  }
})

function onLike() { hasLike.value = !hasLike.value }
function goSpace(mid: number) { if (mid) router.push(`/space/${mid}`) }

function formatCount(n: number) {
  if (!n) return '0'
  if (n >= 10000) return (n / 10000).toFixed(1) + '万'
  return String(n)
}
</script>

<style lang="scss" scoped>
.video-detail {
  background: var(--bg-primary);
  min-height: 100vh;
  padding-bottom: 20px;
}

.detail-header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);

  .header-title {
    font-size: 15px;
    font-weight: 500;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.player {
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
}

.player-placeholder {
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-section {
  background: var(--bg-card);
  padding: 14px 16px;

  .video-title {
    font-size: 17px;
    font-weight: 600;
    line-height: 1.4;
    margin-bottom: 8px;
  }

  .video-stats {
    font-size: 12px;
    color: var(--text-muted);
    margin-bottom: 14px;
    .sep { margin: 0 4px; opacity: 0.5; }
  }

  .uploader {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }

    .uploader-info {
      flex: 1;
      .name { font-size: 14px; font-weight: 500; display: block; }
      .followers { font-size: 12px; color: var(--text-muted); }
    }

    .follow-btn {
      background: var(--bili-blue);
      color: #fff;
      border: none;
      border-radius: 20px;
      padding: 6px 18px;
      font-size: 13px;
      font-weight: 500;
    }
  }

  .action-bar {
    display: flex;
    justify-content: space-around;
    padding-top: 10px;
    border-top: 1px solid var(--border-color);

    .action-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: var(--text-secondary);
      cursor: pointer;
      .active { color: var(--bili-blue); }
    }
  }
}

.desc-section {
  background: var(--bg-card);
  margin-top: 8px;
  padding: 14px 16px;

  .desc-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-secondary);
    margin-bottom: 6px;
  }

  .desc-text {
    font-size: 13px;
    color: var(--text-secondary);
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;

    &.expanded {
      -webkit-line-clamp: unset;
      display: block;
    }
  }

  .desc-toggle {
    color: var(--bili-blue);
    font-size: 13px;
    cursor: pointer;
    display: inline-block;
    margin-top: 4px;
  }
}

.comment-section {
  background: var(--bg-card);
  margin-top: 8px;
  padding: 14px 16px;

  .section-header {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 14px;

    .section-title {
      font-size: 15px;
      font-weight: 600;
    }
    .comment-count {
      font-size: 12px;
      color: var(--text-muted);
    }
  }
}

.loading-wrap {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
}
</style>
