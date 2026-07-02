<template>
  <div class="home">
    <van-nav-bar title="PiliPlus" fixed>
      <template #right>
        <van-icon name="search" size="20" @click="$router.push('/search')" />
      </template>
    </van-nav-bar>

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
    img {
      width: 100%;
      display: block;
    }
    .duration {
      position: absolute;
      right: 6px;
      bottom: 6px;
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
      font-size: 14px;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .author, .stat {
      font-size: 12px;
      color: #9499a0;
      margin-top: 4px;
    }
    .stat span + span {
      margin-left: 8px;
    }
  }
}
</style>
