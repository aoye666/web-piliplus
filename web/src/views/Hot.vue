<template>
  <div class="hot">
    <van-nav-bar title="热门" fixed />
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <div class="video-grid">
          <VideoCard
            v-for="item in videoList"
            :key="item.bvid"
            :cover-url="item.pic + '@320w_200h.jpg'"
            :title="item.title"
            :author="item.owner?.name"
            :duration="item.duration"
            :stat="item.stat"
            @click="$router.push(`/video/${item.bvid}`)"
          />
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getHot } from '@/api/video'
import VideoCard from '@/components/VideoCard.vue'

const videoList = ref<any[]>([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
let page = 1

async function onLoad() {
  try {
    const res = await getHot(page)
    if (res.data?.list) {
      videoList.value.push(...res.data.list)
      page++
      if (res.data.list.length < 20) finished.value = true
    } else {
      finished.value = true
    }
  } catch {
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
</script>

<style lang="scss" scoped>
.hot {
  padding-top: 46px;
}
.video-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  padding: 10px;
}
.video-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  .cover {
    position: relative;
    img { width: 100%; display: block; }
    .duration {
      position: absolute;
      right: 6px; bottom: 6px;
      background: rgba(0, 0, 0, 0.7);
      color: #fff;
      font-size: 12px;
      padding: 1px 4px;
      border-radius: 3px;
    }
  }
  .info {
    padding: 8px 10px;
    .title {
      font-size: 14px; line-height: 1.4;
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    }
    .author, .stat { font-size: 12px; color: #9499a0; margin-top: 4px; }
    .stat span + span { margin-left: 8px; }
  }
}
</style>
