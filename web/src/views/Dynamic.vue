<template>
  <div class="dynamic">
    <van-nav-bar title="动态" fixed />
    <van-empty v-if="!isLoggedIn" description="请先登录">
      <van-button type="primary" size="small" @click="$router.push('/mine')">去登录</van-button>
    </van-empty>
    <van-pull-refresh v-else v-model="refreshing" @refresh="onRefresh">
      <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <div v-for="item in dynamics" :key="item.id_str" class="dyn-card">
          <div class="dyn-header">
            <img :src="item.modules?.module_author?.face" class="avatar" />
            <div>
              <p class="uname">{{ item.modules?.module_author?.name }}</p>
              <p class="time">{{ item.modules?.module_author?.pub_ts }}</p>
            </div>
          </div>
          <div class="dyn-body" v-html="item.modules?.module_dynamic?.desc?.text"></div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { get } from '@/api/http'

const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.isLoggedIn)
const dynamics = ref<any[]>([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
let offset = ''

async function onLoad() {
  try {
    const params: Record<string, any> = { features: 'itemOpusStyle' }
    if (offset) params.offset = offset
    const res: any = await get('/x/polymer/web-dynamic/v1/feed/all', params)
    if (res.data?.items?.length) {
      dynamics.value.push(...res.data.items)
      offset = res.data.offset || ''
      if (!res.data.has_more) finished.value = true
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
  offset = ''
  dynamics.value = []
  finished.value = false
  refreshing.value = false
}
</script>

<style lang="scss" scoped>
.dynamic { padding-top: 46px; }
.dyn-card { background: #fff; margin-bottom: 8px; padding: 12px 16px;
  .dyn-header { display: flex; align-items: center; gap: 10px;
    .avatar { width: 40px; height: 40px; border-radius: 50%; }
    .uname { font-size: 14px; font-weight: 500; }
    .time { font-size: 12px; color: #9499a0; }
  }
  .dyn-body { margin-top: 10px; font-size: 14px; line-height: 1.6; white-space: pre-wrap; }
}
</style>
