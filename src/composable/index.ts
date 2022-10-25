/**
 * 利用组合API，实现关注医生业务逻辑复用
 */

import { ref } from 'vue'
import { followDoctor } from '@/services/consult'
import type { FollowType } from '@/types/consult'

// 封装逻辑 使用useXXX规范，表示使用某功能
export const useFollow = (type: FollowType = 'doc') => {
    const loading = ref(false)
    const follow = async (obj: { id: string; likeFlag: 0 | 1 }) => {
        loading.value = true
        try {
            await followDoctor(obj.id, type)
            obj.likeFlag = obj.likeFlag === 1 ? 0 : 1
        } finally {
            loading.value = false
        }
    }
    // 返回 加载loading 和关注的函数
    return { loading, follow }
}