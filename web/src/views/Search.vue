<template>
  <div class="search-page">
    <van-search v-model="keyword" placeholder="搜索视频" show-action @search="onSearch" @cancel="$router.back()">
      <template #action>
        <span @click="$router.back()">取消</span>
      </template>
    </van-search>

    <div v-if="!keyword" class="hot-search">
      <h3>热搜榜</h3>
      <div v-for="(item, i) in hotList" :key="i" class="hot-item" @click="keyword = item.keyword; onSearch()">
        <span class="rank" :class="{ top3: i < 3 }">{{ i + 1 }}</span>
        <span class="kw">{{ item.keyword || item.show_name }}</span>
        <span class="icon" v-if="item.icon">🔥</span>
      </div>
    </div>

    <van-list v-else v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <div v-for="item in results" :key="item.bvid" class="result-card" @click="$router.push(`/video/${item.bvid}`)">
        <div class="cover">
          <img :src="item.pic + '@240w_150h.jpg'" loading="lazy" />
          <span class="duration">{{ formatDuration(item.duration) }}</span>
        </div>
        <div class="info">
          <h4 class="title" v-html="item.title"></h4>
          <p class="author">{{ item.author }}</p>
          <p class="stat">{{ formatCount(item.play) }}播放 · {{ item.pubdate_str }}</p>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { get } from '@/api/http'
import { wbiSign } from '@/utils/wbi'

const keyword = ref('')
const results = ref<any[]>([])
const hotList = ref<any[]>([])
const loading = ref(false)
const finished = ref(false)
let page = 1

onMounted(async () => {
  try {
    const res: any = await get('/x/web-interface/wbi/search/square')
    hotList.value = res.data?.trending?.list || []
  } catch {}
})

async function onSearch() {
  if (!keyword.value) return
  page = 1
  results.value = []
  finished.value = false
}

async function onLoad() {
  if (!keyword.value) { loading.value = false; return }
  try {
    const params = await wbiSign({
      search_type: 'video',
      keyword: keyword.value,
      page,
      page_size: 20,
      platform: 'pc',
      web_location: 1430654,
    })
    const res: any = await get('/x/web-interface/wbi/search/type', params)
    const list = res.data?.result || []
    results.value.push(...list)
    page++
    if (list.length < 20) finished.value = true
  } catch {
    finished.value = true
  } finally {
    loading.value = false
  }
}

function formatDuration(sec: number | string) {
  if (!sec) return ''
  const n = typeof sec === 'string' ? parseInt(sec) : sec
  const m = Math.floor(n / 60)
  const s = n % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function formatCount(n: number) {
  if (!n) return '0'
  if (n >= 10000) return (n / 10000).toFixed(1) + '万'
  return String(n)
}
</script>

<style lang="scss" scoped>
.search-page { min-height: 100vh; background: #fff; }

.hot-search {
  padding: 12px 16px;
  h3 { font-size: 16px; margin-bottom: 12px; }
  .hot-item { display: flex; align-items: center; gap: 10px; padding: 10px 0; cursor: pointer;
    .rank { width: 20px; text-align: center; font-size: 14px; color: #9499a0; font-weight: 600; }
    .rank.top3 { color: #fb7299; }
    .kw { flex: 1; font-size: 14px; }
    .icon { font-size: 12px; }
  }
}

.result-card { display: flex; gap: 10px; padding: 12px 16px; border-bottom: 1px solid #f1f2f3; cursor: pointer;
  .cover { position: relative; width: 160px; flex-shrink: 0; border-radius: 6px; overflow: hidden;
    img { width: 100%; display: block; }
    .duration { position: absolute; right: 4px; bottom: 4px; background: rgba(0,0,0,0.7); color: #fff; font-size: 11px; padding: 1px 3px; border-radius: 2px; }
  }
  .info { flex: 1; min-width: 0;
    .title { font-size: 14px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .author { font-size: 12px; color: #9499a0; margin-top: 6px; }
    .stat { font-size: 12px; color: #9499a0; margin-top: 2px; }
  }
}
</style>
