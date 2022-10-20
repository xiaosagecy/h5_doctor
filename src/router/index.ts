import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  // import.meta.env.BASE_URL是vite配置的路由基准地址，默认是'/'
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: []
})

export default router
