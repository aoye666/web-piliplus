<template>
  <div class="space">
    <van-nav-bar left-arrow @click-left="$router.back()" title="用户空间" fixed />
    <div v-if="userInfo" class="user-card">
      <img :src="userInfo.face" class="avatar" />
      <div class="user-meta">
        <h3>{{ userInfo.name }}</h3>
        <p class="sign">{{ userInfo.sign }}</p>
        <p class="stats">
          <span>{{ formatCount(userInfo.fans) }}粉丝</span>
          <span>{{ userInfo.attention }}关注</span>
        </p>
      </div>
    </div>
    <div class="video-list">
      <div v-for="item in videos" :key="item.bvid" class="video-item" @click="$router.push(`/video/${item.bvid}`)">
        <img :src="item.pic + '@200w_125h.jpg'" class="cover" />
        <div class="info">
          <h4>{{ item.title }}</h4>
          <p>{{ formatCount(item.play) }}播放 · {{ formatDate(item.created) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { get } from '@/api/http'
import { wbiSign } from '@/utils/wbi'

const route = useRoute()
const mid = route.params.mid as string
const userInfo = ref<any>(null)
const videos = ref<any[]>([])

onMounted(async () => {
  try {
    const params = await wbiSign({ mid })
    const res: any = await get('/x/space/wbi/acc/info', params)
    userInfo.value = res.data
  } catch {}

  try {
    const res: any = await get('/x/space/wbi/arc/search', { mid, pn: 1, ps: 30, order: 'pubdate' })
    videos.value = res.data?.list?.vlist || []
  } catch {}
})

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
.space { padding-top: 46px; min-height: 100vh; background: #fff; }
.user-card { display: flex; gap: 14px; padding: 20px 16px; background: linear-gradient(135deg, #00aeec 0%, #0081c6 100%); color: #fff;
  .avatar { width: 64px; height: 64px; border-radius: 50%; border: 3px solid rgba(255,255,255,0.5); }
  .user-meta { flex: 1; h3 { font-size: 18px; } .sign { font-size: 12px; opacity: 0.8; margin-top: 4px; } .stats { margin-top: 8px; font-size: 12px; span + span { margin-left: 16px; } } }
}
.video-list { padding: 8px 12px; }
.video-item { display: flex; gap: 10px; padding: 10px 0; border-bottom: 1px solid #f1f2f3; cursor: pointer;
  .cover { width: 140px; border-radius: 6px; flex-shrink: 0; }
  .info { flex: 1;
    h4 { font-size: 14px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    p { font-size: 12px; color: #9499a0; margin-top: 6px; }
  }
}
</style>
