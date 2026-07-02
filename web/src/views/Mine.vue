<template>
  <div class="mine">
    <van-nav-bar title="我的" fixed />

    <!-- 已登录 -->
    <template v-if="isLoggedIn">
      <div class="user-card">
        <img :src="userStore.userInfo?.face" class="avatar" />
        <div class="user-meta">
          <p class="uname">{{ userStore.userInfo?.uname }}</p>
          <p class="uid">UID: {{ userStore.userInfo?.mid }}</p>
        </div>
        <van-tag v-if="userStore.userInfo?.vipStatus" type="primary" size="small">大会员</van-tag>
      </div>

      <!-- 用户数据 -->
      <van-grid :column-num="4" class="stat-grid">
        <van-grid-item :label="`${userStats.fans || 0}粉丝`" icon="friends-o" />
        <van-grid-item :label="`${userStats.following || 0}关注`" icon="contact" />
        <van-grid-item :label="`${userStats.dynamic || 0}动态`" icon="comment-o" />
        <van-grid-item :label="`${coins}硬币`" icon="gold-coin-o" />
      </van-grid>

      <!-- 功能菜单 -->
      <van-cell-group inset class="menu-group">
        <van-cell title="历史记录" icon="clock-o" is-link @click="$router.push('/mine')" />
        <van-cell title="稍后再看" icon="bookmark-o" is-link />
        <van-cell title="我的收藏" icon="star-o" is-link />
        <van-cell title="设置" icon="setting-o" is-link />
      </van-cell-group>

      <div style="padding: 16px;">
        <van-button plain block type="default" @click="onLogout">退出登录</van-button>
      </div>
    </template>

    <!-- 未登录 -->
    <template v-else>
      <!-- 扫码登录 -->
      <div class="login-section">
        <van-tabs v-model:active="loginTab" shrink>
          <van-tab title="扫码登录" name="qrcode">
            <div class="qrcode-box">
              <div class="qrcode-wrapper">
                <img v-if="qrcodeUrl" :src="qrcodeImg" class="qrcode-img" />
                <van-loading v-else size="40" />
                <div v-if="qrExpired" class="qr-overlay" @click="refreshQrcode">
                  <p>已过期</p>
                  <p>点击刷新</p>
                </div>
              </div>
              <p class="qr-tip">打开哔哩哔哩 APP 扫码登录</p>
              <p v-if="qrStatus" class="qr-status" :class="qrStatusClass">{{ qrStatus }}</p>
            </div>
          </van-tab>

          <van-tab title="Cookie 登录" name="cookie">
            <div class="cookie-box">
              <p class="tip">从浏览器 F12 开发者工具中复制 B 站 Cookie 粘贴到下方</p>
              <van-field
                v-model="cookieInput"
                type="textarea"
                rows="4"
                placeholder="粘贴 Cookie (SESSDATA=xxx; bili_jct=xxx; ...)..."
              />
              <van-button
                type="primary"
                block
                :disabled="!cookieInput.trim()"
                :loading="cookieLoading"
                @click="onCookieLogin"
                style="margin-top: 12px"
              >
                登录
              </van-button>
            </div>
          </van-tab>
        </van-tabs>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useUserStore } from '@/stores/user'
import { getQrcode, pollQrcode, checkLogin } from '@/api/login'
import { get } from '@/api/http'
import { showNotify } from 'vant'

const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.isLoggedIn)
const loginTab = ref('qrcode')
const cookieInput = ref('')
const cookieLoading = ref(false)

// 用户统计
const userStats = ref({ fans: 0, following: 0, dynamic: 0 })
const coins = ref(0)

// 扫码登录
const qrcodeUrl = ref('')
const qrcodeImg = ref('')
const qrStatus = ref('')
const qrStatusClass = ref('')
const qrExpired = ref(false)
let pollTimer: ReturnType<typeof setInterval> | null = null

// 生成二维码（Web API）
async function refreshQrcode() {
  qrExpired.value = false
  qrStatus.value = ''
  try {
    const res: any = await getQrcode()
    if (res.data?.url) {
      qrcodeUrl.value = res.data.url
      // 用第三方生成二维码图片（B 站返回的是登录 URL，需要转成二维码图片）
      qrcodeImg.value = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(res.data.url)}`
      // 开始轮询
      startPolling(res.data.qrcode_key)
    }
  } catch (e) {
    console.error('获取二维码失败', e)
    showNotify({ type: 'danger', message: '获取二维码失败，请重试' })
  }
}

function startPolling(qrcodeKey: string) {
  if (pollTimer) clearInterval(pollTimer)
  let elapsed = 0

  pollTimer = setInterval(async () => {
    elapsed += 2000
    // 180秒超时
    if (elapsed >= 180000) {
      clearInterval(pollTimer!)
      pollTimer = null
      qrExpired.value = true
      qrStatus.value = ''
      return
    }

    try {
      const res: any = await pollQrcode(qrcodeKey)
      const code = res.code ?? res.data?.code

      if (code === 0) {
        // 登录成功
        clearInterval(pollTimer!)
        pollTimer = null
        qrStatus.value = '登录成功！'
        qrStatusClass.value = 'status-success'
        // 从响应中提取 cookie 并保存
        const setCookie = res.data?.cookie || ''
        if (setCookie) {
          userStore.setCookie(setCookie)
        }
        // 获取用户信息
        await fetchUserInfo()
        showNotify({ type: 'success', message: '登录成功！' })
      } else if (code === 86090) {
        qrStatus.value = '已扫码，等待确认...'
        qrStatusClass.value = 'status-waiting'
      } else if (code === 86038) {
        clearInterval(pollTimer!)
        pollTimer = null
        qrExpired.value = true
        qrStatus.value = ''
      }
    } catch (e) {
      // 忽略轮询错误
    }
  }, 2000)
}

// Cookie 登录
async function onCookieLogin() {
  cookieLoading.value = true
  try {
    userStore.setCookie(cookieInput.value.trim())
    await fetchUserInfo()
    if (userStore.isLoggedIn) {
      showNotify({ type: 'success', message: '登录成功！' })
      cookieInput.value = ''
    } else {
      showNotify({ type: 'danger', message: 'Cookie 无效或已过期' })
    }
  } catch (e) {
    showNotify({ type: 'danger', message: '登录失败' })
  } finally {
    cookieLoading.value = false
  }
}

// 获取用户信息
async function fetchUserInfo() {
  try {
    const res: any = await get('/x/web-interface/nav')
    if (res.data?.isLogin) {
      userStore.setUser({
        mid: res.data.mid,
        uname: res.data.uname,
        face: res.data.face,
        vipType: res.data.vipType,
        vipStatus: res.data.vipStatus,
      })
      coins.value = res.data.money || 0

      // 获取用户统计
      try {
        const statRes: any = await get('/x/relation/stat', { vmid: res.data.mid })
        if (statRes.data) {
          userStats.value = {
            fans: statRes.data.follower || 0,
            following: statRes.data.following || 0,
            dynamic: 0,
          }
        }
      } catch {}
    }
  } catch (e) {
    console.error('获取用户信息失败', e)
  }
}

// 退出
function onLogout() {
  userStore.logout()
  showNotify({ type: 'warning', message: '已退出登录' })
}

// 自动尝试恢复登录态
onMounted(async () => {
  if (userStore.cookie) {
    await fetchUserInfo()
  }
})

onBeforeUnmount(() => {
  if (pollTimer) clearInterval(pollTimer)
})
</script>

<style lang="scss" scoped>
.mine { padding-top: 46px; min-height: 100vh; background: #f5f5f5; }

.user-card {
  display: flex; align-items: center; gap: 12px;
  background: linear-gradient(135deg, #00aeec 0%, #0081c6 100%);
  color: #fff; padding: 24px 16px; margin: 0;
  .avatar { width: 56px; height: 56px; border-radius: 50%; border: 3px solid rgba(255,255,255,0.5); }
  .user-meta { flex: 1; }
  .uname { font-size: 18px; font-weight: 600; }
  .uid { font-size: 12px; opacity: 0.8; margin-top: 4px; }
}

.stat-grid { margin: 12px; border-radius: 12px; overflow: hidden; }

.menu-group { margin: 12px; }

.login-section { margin: 16px; }

.qrcode-box {
  text-align: center; padding: 30px 0;
  .qrcode-wrapper {
    position: relative; display: inline-block;
    .qrcode-img { width: 200px; height: 200px; border: 1px solid #e3e5e7; border-radius: 8px; }
    .qr-overlay {
      position: absolute; inset: 0; display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      background: rgba(0,0,0,0.6); color: #fff; border-radius: 8px; cursor: pointer;
      p:first-child { font-size: 16px; font-weight: 600; }
      p:last-child { font-size: 12px; margin-top: 4px; }
    }
  }
  .qr-tip { font-size: 13px; color: #61666d; margin-top: 16px; }
  .qr-status { font-size: 13px; margin-top: 8px;
    &.status-success { color: #07c160; }
    &.status-waiting { color: #ff976a; }
  }
}

.cookie-box { padding: 20px 0;
  .tip { font-size: 12px; color: #9499a0; margin-bottom: 12px; }
}
</style>
