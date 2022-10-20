import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import pinia from './stores'

// import './assets/main.css'
// import persist from 'pinia-plugin-persistedstate'

const app = createApp(App)

// const pinia = createPinia()
// pinia.use(persist)

// app.use(pinia)
app.use(router)
app.use(pinia)

app.mount('#app')
