import CryptoJS from 'crypto-js'

// WBI 混淆表（从 PiliPlus 源码移植）
const MIXIN_KEY_ENC_TAB = [
  46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35,
  27, 43, 5, 49, 33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13,
  37, 48, 7, 16, 24, 55, 40, 61, 26, 17, 0, 1, 60, 51, 30, 4,
  22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11, 36, 20, 34, 44, 52,
]

function getMixinKey(orig: string): string {
  return MIXIN_KEY_ENC_TAB.map((n) => orig[n]).join('').slice(0, 32)
}

function encWbi(params: Record<string, any>, imgKey: string, subKey: string): Record<string, any> {
  const mixinKey = getMixinKey(imgKey + subKey)
  const now = Math.round(Date.now() / 1000)
  const wts = now
  const queryParams: Record<string, any> = { ...params, wts }

  // 按 key 排序
  const sorted = Object.keys(queryParams)
    .sort()
    .map((key) => `${key}=${encodeURIComponent(String(queryParams[key]))}`)
    .join('&')

  // 计算 wbi 签名
  const wRid = CryptoJS.MD5(sorted + mixinKey).toString()

  return { ...queryParams, w_rid: wRid }
}

// 缓存 WBI key
let wbiKeys: { imgKey: string; subKey: string } | null = null

export async function getWbiKeys(): Promise<{ imgKey: string; subKey: string }> {
  if (wbiKeys) return wbiKeys

  const resp = await fetch('/api/x/web-interface/nav')
  const data = await resp.json()
  const imgUrl: string = data.data.wbi_img.img_url
  const subUrl: string = data.data.wbi_img.sub_url

  const imgKey = imgUrl.split('/').pop()!.split('.')[0]
  const subKey = subUrl.split('/').pop()!.split('.')[0]

  wbiKeys = { imgKey, subKey }
  return wbiKeys
}

export async function wbiSign(params: Record<string, any>): Promise<Record<string, any>> {
  const { imgKey, subKey } = await getWbiKeys()
  return encWbi(params, imgKey, subKey)
}
