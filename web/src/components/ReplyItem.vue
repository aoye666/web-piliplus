<template>
  <div class="reply-item">
    <img :src="member?.avatar" class="reply-avatar" />
    <div class="reply-content">
      <p class="reply-user">{{ member?.uname }}</p>
      <p class="reply-text" v-html="content"></p>
      <div class="reply-meta">
        <span>{{ formatDate }}</span>
        <span v-if="like">👍 {{ formatCount(like) }}</span>
        <span v-if="rcount" class="reply-count">{{ rcount }}回复</span>
      </div>
      <slot name="sub-replies" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  member?: { avatar: string; uname: string }
  content?: string
  like?: number
  ctime?: number
  rcount?: number
}>()

const formatDate = computed(() => {
  if (!props.ctime) return ''
  return new Date(props.ctime * 1000).toLocaleDateString('zh-CN')
})

function formatCount(n: number) {
  if (!n) return '0'
  if (n >= 10000) return (n / 10000).toFixed(1) + '万'
  return String(n)
}
</script>

<style lang="scss" scoped>
.reply-item {
  display: flex; gap: 10px; padding: 12px 0; border-bottom: 1px solid #f1f2f3;
  .reply-avatar { width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0; }
  .reply-user { font-size: 13px; color: #61666d; font-weight: 500; }
  .reply-text { font-size: 14px; margin-top: 4px; line-height: 1.5; }
  .reply-meta { display: flex; gap: 16px; font-size: 12px; color: #9499a0; margin-top: 6px; }
  .reply-count { cursor: pointer; &:hover { color: #00aeec; } }
}
</style>
