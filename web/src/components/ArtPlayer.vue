<template>
  <div ref="artRef" class="art-player"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import Artplayer from 'artplayer'
import artplayerPluginDanmuku from 'artplayer-plugin-danmuku'

const props = defineProps<{
  url: string
  type?: string
  danmaku?: any[]
}>()

const emit = defineEmits<{
  ready: [art: Artplayer]
}>()

const artRef = ref<HTMLElement>()
let art: Artplayer | null = null

function createPlayer() {
  if (!artRef.value || !props.url) return

  art = new Artplayer({
    container: artRef.value,
    url: props.url,
    type: props.type || 'mp4',
    autoplay: true,
    autoSize: false,
    autoMini: true,
    loop: false,
    flip: true,
    playbackRate: true,
    aspectRatio: true,
    setting: true,
    hotkey: true,
    pip: true,
    mutex: true,
    backdrop: true,
    fullscreen: true,
    fullscreenWeb: true,
    subtitleOffset: true,
    miniProgressBar: true,
    lang: navigator.language.toLowerCase().includes('zh') ? 'zh-cn' : 'en',
    lock: true,
    fastForward: true,
    autoPlayback: true,
    airplay: true,
    theme: '#00aeec',
    plugins: props.danmaku?.length
      ? [
          artplayerPluginDanmuku({
            danmaku: props.danmaku,
            speed: 5,
            opacity: 0.7,
            fontSize: 25,
            color: '#FFFFFF',
            mode: 0,
            margin: [10, '25%'],
            antiOverlap: true,
            useWorker: true,
            synchronousPlayback: false,
            filter: (danmaku: any) => danmaku.text.length <= 30,
          }),
        ]
      : [],
  })

  art.on('ready', () => {
    emit('ready', art!)
  })

  art.on('error', (err: any) => {
    console.error('[Player Error]', err)
  })
}

watch(() => props.url, (newUrl) => {
  if (art && newUrl) {
    art.url = newUrl
  }
})

onMounted(() => {
  createPlayer()
})

onBeforeUnmount(() => {
  if (art) {
    art.destroy()
    art = null
  }
})
</script>

<style lang="scss" scoped>
.art-player {
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
}
</style>
