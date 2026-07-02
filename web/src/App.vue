<template>
  <div id="app">
    <router-view v-slot="{ Component }">
      <keep-alive :include="['Home', 'Hot', 'Search', 'Dynamic']">
        <component :is="Component" />
      </keep-alive>
    </router-view>

    <!-- 底部导航栏 -->
    <van-tabbar v-if="showTabbar" v-model="activeTab" route fixed placeholder class="main-tabbar">
      <van-tabbar-item to="/" icon="wap-home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/hot" icon="fire-o">热门</van-tabbar-item>
      <van-tabbar-item to="/dynamic" icon="friends-o">动态</van-tabbar-item>
      <van-tabbar-item to="/mine" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeTab = ref(0)

const showTabbar = computed(() => {
  const hiddenRoutes = ['VideoDetail', 'SearchResult', 'Space', 'Login']
  return !hiddenRoutes.includes(route.name as string)
})
</script>

<style lang="scss">
@import './styles/global.scss';

#app {
  min-height: 100vh;
  background: var(--bg-primary);
}

.main-tabbar {
  border-top: 1px solid var(--border-color) !important;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.92) !important;

  .van-tabbar-item {
    font-size: 10px;
    gap: 2px;

    &__icon {
      font-size: 20px;
      margin-bottom: 2px;
    }
  }
}

/* 页面过渡动画 */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.slide-right-enter-from {
  transform: translateX(30px);
  opacity: 0;
}
.slide-right-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}
</style>
