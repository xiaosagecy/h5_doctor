/**
 * 利用组合API，实现关注医生业务逻辑复用
 */

import { ref } from 'vue'
import { followDoctor, getPrescriptionPic, cancelOrder, deleteOrder } from '@/services/consult'
import type { ConsultOrderItem, FollowType } from '@/types/consult'
import { ImagePreview, Toast } from 'vant'
import { OrderType } from '@/enums'

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

export const useShowPrescription = () => {
    // 查看处方
    const showPrescription = async (id?: string) => {
        if (id) {
            const res = await getPrescriptionPic(id)
            ImagePreview([res.data.url])
        }
    }
    return { showPrescription }
}

// 取消订单
export const useCancelOrder = () => {
    const loading = ref(false)
    const onCancelOrder = async (item: ConsultOrderItem) => {
        loading.value = true
        try {
            await cancelOrder(item.id)
            // 修改订单的状态
            item.status = OrderType.ConsultCancel
            item.statusValue = '已取消'
            Toast.success('取消成功')
        } catch (error) {
            Toast.fail('取消失败')
        } finally {
            loading.value = false
        }
    }
    return { loading, onCancelOrder }
}


// 删除订单，删除成功做的事不确定，可以通过传入函数实现
export const useDeleteOrder = (cb: () => void) => {
    const loading = ref(false)
    const deleteConsultOrder = async (item: ConsultOrderItem) => {
        loading.value = true
        try {
            await deleteOrder(item.id)
            // 成功，通知父组件删除这条信息，提示，详情就是跳转列表页面
            Toast.success('删除成功')
        } catch (error) {
            Toast.fail('删除失败')
        } finally {
            loading.value = false
        }
    }
    return { loading, deleteConsultOrder }
}