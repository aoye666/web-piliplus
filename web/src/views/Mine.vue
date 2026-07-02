<template>
  <div class="mine-page">
    <!-- 未登录 -->
    <div v-if="!userStore.isLoggedIn" class="login-prompt">
      <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23e3e5e7'/%3E%3Ctext x='50' y='65' text-anchor='middle' fill='%239499a0' font-size='40'%3E👤%3C/text%3E%3C/svg%3E" class="avatar-placeholder" />
      <h3 class="prompt-title">登录后享受更多功能</h3>
      <p class="prompt-desc">收藏、历史、动态等</p>
      <button class="login-btn" @click="$router.push('/login')">登录 B 站账号</button>
    </div>

    <!-- 已登录 -->
    <div v-else>
      <div class="user-header">
        <img :src="userInfo?.face" class="avatar" />
        <div class="user-info">
          <h3 class="username">{{ userInfo?.name }}</h3>
          <p class="uid">UID: {{ userInfo?.mid }}</p>
        </div>
      </div>
      <div class="stats-grid">
        <div class="stat-item" v-for="s in statItems" :key="s.label">
          <span class="stat-num">{{ s.value }}</span>
          <span class="stat-label">{{ s.label }}</span>
        </div>
      </div>
    </div>

    <div class="menu-section">
      <div class="menu-item" v-for="item in menuItems" :key="item.label">
        <van-icon :name="item.icon" size="20" color="#61666d" />
        <span>{{ item.label }}</span>
        <van-icon name="arrow" size="14" color="#c0c4cc" />
      </div>
    </div>

    <button v-if="userStore.isLoggedIn" class="logout-btn" @click="handleLogout">退出登录</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { getUserInfo } from '@/api/user'

const router = useRouter()
const userStore = useUserStore()
const userInfo = ref<any>(null)

const statItems = computed(() => [
  { label: '关注', value: userInfo.value?.following || '0' },
  { label: '粉丝', value: userInfo.value?.follower || '0' },
  { label: '获赞', value: '0' },
  { label: '收藏', value: '0' },
])

const menuItems = [
  { icon: 'clock-o', label: '历史记录' },
  { icon: 'star-o', label: '我的收藏' },
  { icon: 'like-o', label: '我的点赞' },
  { icon: 'comment-o', label: '我的评论' },
  { icon: 'settings-o', label: '设置' },
]

onMounted(async () => {
  if (userStore.isLoggedIn) {
    try {
      const res = await getUserInfo(userStore.uid)
      userInfo.value = res.data?.card
    } catch (e) {
      console.error(e)
    }
  }
})

function handleLogout() {
  userStore.logout()
  userInfo.value = null
}
</script>

<style lang="scss" scoped>
.mine-page {
  background: var(--bg-primary);
  min-height: 100vh;
  padding-bottom: 70px;
}

.login-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px 40px;
  background: var(--bg-card);

  .avatar-placeholder { width: 72px; height: 72px; border-radius: 50%; margin-bottom: 16px; }
  .prompt-title { font-size: 17px; font-weight: 600; margin-bottom: 6px; }
  .prompt-desc { font-size: 13px; color: var(--text-muted); margin-bottom: 20px; }
  .login-btn {
    background: var(--bili-blue);
    color: #fff;
    border: none;
    border-radius: 24px;
    padding: 12px 36px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
  }
}

.user-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 24px 20px;
  background: linear-gradient(135deg, #00aeec, #0095d9);

  .avatar { width: 60px; height: 60px; border-radius: 50%; border: 3px solid rgba(255,255,255,0.3); }
  .username { color: #fff; font-size: 18px; font-weight: 600; }
  .uid { color: rgba(255,255,255,0.7); font-size: 12px; margin-top: 2px; }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  background: var(--bg-card);
  padding: 16px;
  gap: 8px;
  text-align: center;
  border-bottom: 8px solid var(--bg-primary);

  .stat-num { display: block; font-size: 17px; font-weight: 600; }
  .stat-label { font-size: 11px; color: var(--text-muted); }
}

.menu-section {
  background: var(--bg-card);
  margin: 0 12px;
  border-radius: var(--radius-md);
  overflow: hidden;

  .menu-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    font-size: 14px;
    cursor: pointer;
    border-bottom: 1px solid var(--border-color);

    &:last-child { border-bottom: none; }
    &:active { background: var(--bg-primary); }
    span:first-of-type { flex: 1; }
  }
}

.logout-btn {
  display: block;
  margin: 20px auto;
  background: var(--bg-card);
  color: var(--bili-pink);
  border: none;
  border-radius: var(--radius-md);
  padding: 12px 48px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}
</style>
