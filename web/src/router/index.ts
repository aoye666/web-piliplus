import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
    },
    {
      path: '/hot',
      name: 'hot',
      component: () => import('@/views/Hot.vue'),
    },
    {
      path: '/dynamic',
      name: 'dynamic',
      component: () => import('@/views/Dynamic.vue'),
    },
    {
      path: '/mine',
      name: 'mine',
      component: () => import('@/views/Mine.vue'),
    },
    {
      path: '/video/:bvid',
      name: 'video',
      component: () => import('@/views/VideoDetail.vue'),
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/views/Search.vue'),
    },
    {
      path: '/space/:mid',
      name: 'space',
      component: () => import('@/views/Space.vue'),
    },
  ],
})

export default router
