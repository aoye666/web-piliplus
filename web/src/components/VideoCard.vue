<template>
  <div class="video-card" @click="$emit('click')">
    <div class="cover-wrap">
      <img :src="coverUrl" loading="lazy" class="cover-img" />
      <div class="cover-overlay">
        <span class="duration" v-if="duration">{{ formatDuration(duration) }}</span>
        <div class="play-count" v-if="stat?.view">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
          {{ formatCount(stat.view) }}
        </div>
      </div>
    </div>
    <div class="info">
      <h4 class="title">{{ title }}</h4>
      <div class="meta">
        <span class="author" v-if="author">{{ author }}</span>
        <span class="dot" v-if="author && stat?.danmaku">·</span>
        <span class="danmaku" v-if="stat?.danmaku">{{ formatCount(stat.danmaku) }}弹幕</span>
      </div>
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
  background: var(--bg-card);
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:active {
    transform: scale(0.98);
  }

  .cover-wrap {
    position: relative;
    overflow: hidden;
    border-radius: var(--radius-md);

    .cover-img {
      width: 100%;
      display: block;
      aspect-ratio: 16 / 10;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    &:hover .cover-img {
      transform: scale(1.03);
    }

    .cover-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(transparent 60%, rgba(0, 0, 0, 0.5));
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      padding: 8px 10px;
      gap: 8px;

      .duration {
        background: rgba(0, 0, 0, 0.7);
        color: #fff;
        font-size: 12px;
        padding: 2px 6px;
        border-radius: 4px;
        font-variant-numeric: tabular-nums;
        backdrop-filter: blur(4px);
      }

      .play-count {
        display: flex;
        align-items: center;
        gap: 3px;
        color: #fff;
        font-size: 12px;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      }
    }
  }

  .info {
    padding: 10px 12px 12px;

    .title {
      font-size: 14px;
      font-weight: 500;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      color: var(--text-primary);
      letter-spacing: 0.01em;
    }

    .meta {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 6px;
      font-size: 12px;
      color: var(--text-muted);

      .dot {
        opacity: 0.5;
      }
    }
  }
}
</style>
