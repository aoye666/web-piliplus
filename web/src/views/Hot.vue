<template>
  <div class="hot-page">
    <div class="page-header">
      <h1>热门</h1>
    </div>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <div class="hot-list">
        <div
          v-for="(item, index) in hotList"
          :key="item.bvid || index"
          class="hot-item"
          @click="$router.push(`/video/${item.bvid}`)"
        >
          <div class="rank-num" :class="{ top3: index < 3 }">{{ index + 1 }}</div>
          <img :src="item.pic + '@320w_200h.jpg'" class="hot-cover" loading="lazy" />
          <div class="hot-info">
            <h4 class="hot-title">{{ item.title }}</h4>
            <div class="hot-meta">
              <span class="hot-author">{{ item.owner?.name }}</span>
              <span class="hot-score">{{ formatCount(item.stat?.view || 0) }}播放</span>
            </div>
          </div>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getHotList } from '@/api/video'

defineOptions({ name: 'Hot' })

const hotList = ref<any[]>([])
const refreshing = ref(false)

onMounted(() => onLoad())

async function onLoad() {
  try {
    const res = await getHotList()
    hotList.value = res.data?.list || []
  } catch (e) {
    console.error('热门加载失败', e)
  }
}

function onRefresh() {
  refreshing.value = false
  onLoad()
}

function formatCount(n: number) {
  if (n >= 10000) return (n / 10000).toFixed(1) + '万'
  return String(n)
}
</script>

<style lang="scss" scoped>
.hot-page { background: var(--bg-primary); min-height: 100vh; }

.page-header {
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 12px 16px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  h1 { font-size: 20px; font-weight: 700; }
}

.hot-list { padding: 10px 12px; padding-bottom: 70px; }

.hot-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  margin-bottom: 8px;
  cursor: pointer;
  transition: transform 0.15s;

  &:active { transform: scale(0.98); }
}

.rank-num {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-muted);
  width: 28px;
  text-align: center;
  font-variant-numeric: tabular-nums;
  &.top3 { color: var(--bili-pink); }
}

.hot-cover {
  width: 120px;
  height: 75px;
  border-radius: var(--radius-sm);
  object-fit: cover;
  flex-shrink: 0;
}

.hot-info { flex: 1; min-width: 0; }

.hot-title {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 6px;
}

.hot-meta {
  font-size: 12px;
  color: var(--text-muted);
  display: flex;
  gap: 8px;
}
</style>
