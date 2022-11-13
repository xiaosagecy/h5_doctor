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
    { path: '/login', component: () => import('@/views/Login/index.vue'), meta: { title: '登陆' } },
    {
      path: '/',
      component: () => import('@/views/Layout/index.vue'),
      redirect: '/home',
      children: [
        { path: '/home', component: () => import('@/views/Home/index.vue'), meta: { title: '首页' } },
        { path: '/article', component: () => import('@/views/Article/index.vue'), meta: { title: '健康百科' } },
        { path: '/notify', component: () => import('@/views/Notify/index.vue'), meta: { title: '消息通知' } },
        { path: '/user', component: () => import('@/views/User/index.vue'), meta: { title: '个人中心' } },
      ]
    },
    { path: '/user/patient', component: () => import('@/views/User/PatientPage.vue'), meta: { title: '家庭档案' } },
    { path: '/consult/fast', component: () => import('@/views/Consult/ConsultFast.vue'), meta: { title: '极速问诊' } },
    { path: '/consult/dep', component: () => import('@/views/Consult/ConsultDep.vue'), meta: { title: '选择科室' } },
    { path: '/consult/illness', component: () => import('@/views/Consult/ConsultIllness.vue'), meta: { title: '病情描述' } },
    { path: '/consult/pay', component: () => import('@/views/Consult/ConsultPay.vue'), meta: { title: '问诊支付' } },
    {
      path: '/room', component: () => import('@/views/Room/index.vue'), meta: { title: '问诊室' },
      beforeEnter(to) {
        // 进入路由前做一个支付结果判断
        if (to.query.payResult === 'false') return '/user/consult'
      }
    },
    { path: '/user/consult', component: () => import('@/views/User/ConsultPage.vue'), meta: { title: '问诊记录' } }
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
