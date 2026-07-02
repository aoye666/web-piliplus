import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface UserInfo {
  mid: number
  uname: string
  face: string
  vipType: number
  vipStatus: number
}

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserInfo | null>(null)
  const cookie = ref<string>(localStorage.getItem('bili_cookie') || '')

  const isLoggedIn = computed(() => !!userInfo.value)
  const csrf = computed(() => {
    const m = cookie.value.match(/bili_jct=([a-f0-9]+)/)
    return m ? m[1] : ''
  })

  function setCookie(c: string) {
    cookie.value = c
    localStorage.setItem('bili_cookie', c)
  }

  function setUser(info: UserInfo) {
    userInfo.value = info
  }

  function logout() {
    userInfo.value = null
    cookie.value = ''
    localStorage.removeItem('bili_cookie')
  }

  return { userInfo, cookie, isLoggedIn, csrf, setCookie, setUser, logout }
})
