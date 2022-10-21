import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import pinia from './stores'
// 导入svg插件
import 'virtual:svg-icons-register'

// import persist from 'pinia-plugin-persistedstate'

// vant 全局样式使用
import 'vant/lib/index.css'
const app = createApp(App)

// const pinia = createPinia()
// pinia.use(persist)

// app.use(pinia)
app.use(router)
app.use(pinia)

app.mount('#app')
