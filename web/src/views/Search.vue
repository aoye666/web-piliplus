<template>
  <div class="search-page">
    <div class="search-bar">
      <van-icon name="arrow-left" size="20" @click="$router.back()" />
      <van-search
        v-model="keyword"
        shape="round"
        placeholder="搜索视频、UP主"
        background="transparent"
        @search="doSearch"
        autofocus
      />
    </div>

    <!-- 热搜 -->
    <div v-if="!results.length" class="hot-search">
      <h4>热门搜索</h4>
      <div class="hot-tags">
        <span v-for="(tag, i) in hotSearchList" :key="i" class="tag" @click="searchTag(tag.keyword)">
          <span class="tag-rank" :class="{ top3: i < 3 }">{{ i + 1 }}</span>
          {{ tag.keyword }}
        </span>
      </div>
    </div>

    <!-- 搜索结果 -->
    <div v-else class="result-list">
      <VideoCard
        v-for="item in results"
        :key="item.bvid"
        :cover-url="(item.pic || item.cover) + '@480w_300h.jpg'"
        :title="item.title?.replace(/<[^>]+>/g, '')"
        :author="item.author"
        :duration="item.duration"
        :stat="item.stat || { view: item.play || 0, danmaku: 0 }"
        @click="$router.push(`/video/${item.bvid}`)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { searchVideos, getHotSearch } from '@/api/search'
import VideoCard from '@/components/VideoCard.vue'

const keyword = ref('')
const results = ref<any[]>([])
const hotSearchList = ref<any[]>([])

onMounted(async () => {
  try {
    const res = await getHotSearch()
    hotSearchList.value = res.data?.trending?.list || []
  } catch (e) {}
})

async function doSearch() {
  if (!keyword.value.trim()) return
  try {
    const res = await searchVideos(keyword.value)
    results.value = res.data?.result || []
  } catch (e) {
    console.error(e)
  }
}

function searchTag(kw: string) {
  keyword.value = kw
  doSearch()
}
</script>

<style lang="scss" scoped>
.search-page { background: var(--bg-primary); min-height: 100vh; }

.search-bar {
  display: flex;
  align-items: center;
  padding: 6px 10px 6px 12px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);

  .van-search { flex: 1; padding: 0; }
}

.hot-search {
  padding: 20px 16px;
  h4 { font-size: 15px; font-weight: 600; margin-bottom: 14px; }
}

.hot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  .tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    background: var(--bg-card);
    border-radius: 20px;
    font-size: 13px;
    color: var(--text-primary);
    cursor: pointer;
    transition: background 0.15s;

    &:active { background: var(--border-color); }

    .tag-rank {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
      &.top3 { color: var(--bili-pink); }
    }
  }
}

.result-list {
  padding: 10px 12px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}
</style>
