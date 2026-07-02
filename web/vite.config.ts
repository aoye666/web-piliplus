import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // 代理 B 站 API 解决 CORS
      '/api': {
        target: 'https://api.bilibili.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/app-api': {
        target: 'https://app.bilibili.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/app-api/, ''),
      },
      '/live-api': {
        target: 'https://api.live.bilibili.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/live-api/, ''),
      },
      '/passport': {
        target: 'https://passport.bilibili.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/passport/, ''),
      },
      '/comment': {
        target: 'https://comment.bilibili.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/comment/, ''),
      },
      '/search-suggest': {
        target: 'https://s.search.bilibili.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/search-suggest/, ''),
      },
    },
  },
})
