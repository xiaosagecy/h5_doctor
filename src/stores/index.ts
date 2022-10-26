/**
 * stores统一导出
 */

import { createPinia } from 'pinia'
import presist from 'pinia-plugin-persistedstate'

// 创建pinia实例
const pinia = createPinia()
// 使用pinia插件
pinia.use(presist)
// 导出pinia实例，给main使用
export default pinia

// 完整写法
// import { useUserStore } from './user'
// export { useUserStore }
// 统一导出
export * from './modules/user'
export * from './modules/consult'