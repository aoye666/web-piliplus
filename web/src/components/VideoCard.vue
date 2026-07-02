<template>
  <div class="video-card" @click="$emit('click')">
    <div class="cover">
      <img :src="coverUrl" loading="lazy" />
      <span class="duration" v-if="duration">{{ formatDuration(duration) }}</span>
    </div>
    <div class="info">
      <h4 class="title">{{ title }}</h4>
      <p class="author" v-if="author">{{ author }}</p>
      <p class="stat" v-if="stat">
        <span v-if="stat.view">{{ formatCount(stat.view) }}播放</span>
        <span v-if="stat.danmaku">{{ formatCount(stat.danmaku) }}弹幕</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  coverUrl: string
  title: string
  author?: string
  duration?: number
  stat?: { view?: number; danmaku?: number; like?: number }
  bvid?: string
}>()

defineEmits<{ click: [] }>()

function formatDuration(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function formatCount(n: number) {
  if (!n) return '0'
  if (n >= 10000) return (n / 10000).toFixed(1) + '万'
  return String(n)
}
</script>

<style lang="scss" scoped>
.video-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;

  .cover {
    position: relative;
    img { width: 100%; display: block; }
    .duration {
      position: absolute; right: 6px; bottom: 6px;
      background: rgba(0, 0, 0, 0.7); color: #fff;
      font-size: 12px; padding: 1px 4px; border-radius: 3px;
    }
  }

  .info {
    padding: 8px 10px;
    .title {
      font-size: 14px; line-height: 1.4;
      display: -webkit-box; -webkit-line-clamp: 2;
      -webkit-box-orient: vertical; overflow: hidden;
    }
    .author, .stat { font-size: 12px; color: #9499a0; margin-top: 4px; }
    .stat span + span { margin-left: 8px; }
  }
}
</style>
