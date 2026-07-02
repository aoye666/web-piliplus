<template>
  <div class="home">
    <div class="header">
      <div class="header-left">
        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%2300aeec'/%3E%3Ctext x='50' y='65' text-anchor='middle' fill='white' font-size='40' font-weight='bold'%3EP%3C/text%3E%3C/svg%3E" class="logo" />
        <span class="brand">PiliPlus</span>
      </div>
      <van-icon name="search" size="22" color="#61666d" @click="$router.push('/search')" />
    </div>

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="刷新成功">
      <van-list v-model:loading="loading" :finished="finished" finished-text="已经到底啦~" @load="onLoad">
        <div class="video-list">
          <VideoCard
            v-for="item in videoList"
            :key="item.bvid"
            :cover-url="item.pic + '@480w_300h.jpg'"
            :title="item.title"
            :author="item.owner?.name"
            :duration="item.duration"
            :stat="item.stat"
            @click="goVideo(item)"
          />
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getRecommend } from '@/api/video'
import VideoCard from '@/components/VideoCard.vue'

const router = useRouter()
const videoList = ref<any[]>([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
let page = 1

async function onLoad() {
  try {
    const res = await getRecommend(20, page)
    if (res.data?.item) {
      videoList.value.push(...res.data.item)
      page++
      if (res.data.item.length < 20) finished.value = true
    } else {
      finished.value = true
    }
  } catch (e) {
    finished.value = true
  } finally {
    loading.value = false
  }
}

function onRefresh() {
  page = 1
  videoList.value = []
  finished.value = false
  refreshing.value = false
}

function goVideo(item: any) {
  router.push(`/video/${item.bvid}`)
}
</script>

<style lang="scss" scoped>
.home {
  min-height: 100vh;
  background: var(--bg-primary);
}

.header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  backdrop-filter: blur(10px);

  .header-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .logo {
    width: 32px;
    height: 32px;
    border-radius: 8px;
  }

  .brand {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.02em;
  }
}

.video-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  padding: 10px 12px;
  padding-bottom: 70px;
}

@media (min-width: 768px) {
  .video-list {
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    padding: 14px 16px;
  }
}
</style>
