<template>
  <div class="dynamic-page">
    <div class="page-header"><h1>动态</h1></div>

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <div v-if="userStore.isLoggedIn">
        <div class="feed-list">
          <div v-for="item in dynamicList" :key="item.id_str" class="feed-item" @click="goVideo(item)">
            <div class="feed-user">
              <img :src="item.modules?.module_author?.face" class="feed-avatar" />
              <div class="feed-user-info">
                <span class="feed-name">{{ item.modules?.module_author?.name }}</span>
                <span class="feed-time">{{ item.modules?.module_author?.pub_time }}</span>
              </div>
            </div>
            <p class="feed-text" v-if="item.modules?.module_dynamic?.major?.draw?.items?.[0]">
              {{ item.modules?.module_dynamic?.desc?.text }}
            </p>
            <div class="feed-cover" v-if="item.modules?.module_dynamic?.major?.archive?.bvid">
              <img :src="item.modules?.module_dynamic?.major?.archive?.cover + '@480w_300h.jpg'" />
              <span class="feed-duration">{{ formatDuration(item.modules?.module_dynamic?.major?.archive?.duration || 0) }}</span>
            </div>
            <h4 class="feed-title">{{ item.modules?.module_dynamic?.major?.archive?.title }}</h4>
          </div>
        </div>
        <van-empty v-if="!dynamicList.length" description="暂无动态" image-size="120" />
      </div>
      <div v-else class="login-hint">
        <van-empty description="登录后查看动态" image-size="120">
          <button class="login-btn" @click="$router.push('/login')">去登录</button>
        </van-empty>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { getFollowDynamic } from '@/api/dynamics'

defineOptions({ name: 'Dynamic' })

const router = useRouter()
const userStore = useUserStore()
const dynamicList = ref<any[]>([])
const refreshing = ref(false)

onMounted(async () => {
  if (userStore.isLoggedIn) {
    try {
      const res = await getFollowDynamic()
      dynamicList.value = res.data?.items || []
    } catch (e) {}
  }
})

function onRefresh() { refreshing.value = false }

function goVideo(item: any) {
  const bvid = item.modules?.module_dynamic?.major?.archive?.bvid
  if (bvid) router.push(`/video/${bvid}`)
}

function formatDuration(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
</script>

<style lang="scss" scoped>
.dynamic-page { background: var(--bg-primary); min-height: 100vh; }

.page-header {
  position: sticky; top: 0; z-index: 100;
  padding: 12px 16px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  h1 { font-size: 20px; font-weight: 700; }
}

.feed-list { padding: 10px 12px; padding-bottom: 70px; }

.feed-item {
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: 14px 16px;
  margin-bottom: 10px;

  .feed-user {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
  }
  .feed-avatar { width: 36px; height: 36px; border-radius: 50%; }
  .feed-name { font-size: 14px; font-weight: 500; display: block; }
  .feed-time { font-size: 11px; color: var(--text-muted); }

  .feed-text { font-size: 13px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 8px; }

  .feed-cover {
    position: relative;
    border-radius: var(--radius-sm);
    overflow: hidden;
    img { width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block; }
    .feed-duration {
      position: absolute;
      bottom: 6px; right: 8px;
      background: rgba(0,0,0,0.7);
      color: #fff;
      font-size: 11px;
      padding: 2px 6px;
      border-radius: 4px;
    }
  }

  .feed-title {
    font-size: 14px;
    font-weight: 500;
    margin-top: 8px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

.login-hint {
  padding-top: 80px;
  .login-btn {
    background: var(--bili-blue);
    color: #fff;
    border: none;
    border-radius: 24px;
    padding: 10px 32px;
    font-size: 14px;
    cursor: pointer;
  }
}
</style>
