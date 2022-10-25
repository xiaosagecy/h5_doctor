import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 插件配置，颜色修改
NProgress.configure({
  showSpinner: false
})


const router = createRouter({
  // import.meta.env.BASE_URL是vite配置的路由基准地址，默认是'/'
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/Login/index.vue') },
    {
      path: '/',
      component: () => import('@/views/Layout/index.vue'),
      children: [
        { path: '/home', component: () => import('@/views/Home/index.vue'), meta: { title: '首页' } },
        { path: '/article', component: () => import('@/views/Article/index.vue'), meta: { title: '健康百科' } },
        { path: '/notify', component: () => import('@/views/Notify/index.vue'), meta: { title: '消息通知' } },
        { path: '/user', component: () => import('@/views/User/index.vue'), meta: { title: '个人中心' } },
        { path: '/user/patients', component: () => import('@/views/User/PatientPage.vue'), meta: { title: '家庭档案' } }

      ]
    }
  ]
})

// 访问权限控制
router.beforeEach((to) => {
  NProgress.start()
  // 处理标题
  document.title = `${to.meta.title || ''}`
  // 用户仓库
  const store = useUserStore()
  // 不需要登录的页面，白名单
  const whileList = ['/login', 'register']
  // 如果没有登录而且不在白名单内，就要去登录
  if (!store.user?.token && !whileList.includes(to.path)) return '/login'
})

router.afterEach((to) => {
  // 修改标题
  document.title = `好医生-${to.meta.title || ''}`
  NProgress.done()
})

export default router
