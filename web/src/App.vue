<template>
  <router-view />
  <van-tabbar v-model="activeTab" route>
    <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
    <van-tabbar-item icon="fire-o" to="/hot">热门</van-tabbar-item>
    <van-tabbar-item icon="comment-o" to="/dynamic">动态</van-tabbar-item>
    <van-tabbar-item icon="contact" to="/mine">我的</van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const activeTab = ref(0)
</script>

<style lang="scss">
#app {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 50px;
}
</style>
