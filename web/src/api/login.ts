import { get, passportHttp, appHttp } from './http'

// Web 扫码登录 - 生成二维码
export async function getQrcode() {
  return get<{ data: { url: string; qrcode_key: string } }>('/x/passport-login/web/qrcode/generate')
}

// Web 扫码登录 - 轮询状态
export async function pollQrcode(qrcodeKey: string) {
  return get('/x/passport-login/web/qrcode/poll', { qrcode_key: qrcodeKey })
}

// 退出登录
export async function logout(csrf: string) {
  return passportHttp.get('/login/exit/v2', { params: { biliCSRF: csrf } })
}

// TV 扫码登录 - 获取 auth_code
export async function getTvAuthCode() {
  return appHttp.post('/x/passport-tv-login/qrcode/auth_code', undefined, {
    params: { local_id: 0, platform: 'android', mobi_app: 'android_hd' },
  })
}

// TV 扫码登录 - 轮询
export async function pollTvAuthCode(authCode: string) {
  return appHttp.post('/x/passport-tv-login/qrcode/poll', undefined, {
    params: { auth_code: authCode, local_id: 0, platform: 'android', mobi_app: 'android_hd' },
  })
}

// Cookie 有效性检查（通过 nav 接口判断登录态）
export async function checkLogin() {
  return get<{ data: { isLogin: boolean; mid: number; uname: string; face: string } }>('/x/web-interface/nav')
}

// 获取 CSRF token（从 Cookie 提取）
export function extractCsrf(cookie: string): string {
  const m = cookie.match(/bili_jct=([a-f0-9]+)/)
  return m ? m[1] : ''
}

// 验证码
export async function getCaptcha() {
  return get<{ data: any }>('/x/frontend/captcha/geetest', { source_type: 1 })
}
