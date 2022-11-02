<template>
    <div class="room-page">
        <cp-nav-bar title="问诊室" />
        <room-status></room-status>
        <room-message :list="list"></room-message>
        <room-action></room-action>

    </div>
</template>

<script setup lang='ts'>
import RoomStatus from './components/RoomStatus.vue'
import RoomMessage from './components/RoomMessage.vue'
import RoomAction from './components/RoomAction.vue'
import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'
import { onMounted, onUnmounted, ref } from 'vue'
import { baseURL } from '@/utils/request'
import { useUserStore } from '@/stores'
import { useRoute } from 'vue-router'
import { MsgType } from '@/enums'
import type { Message, TimeMessages } from '@/types/room'
import type { ConsultOrderItem } from '@/types/consult'
import { getConsultOrderDetail } from '@/services/consult'

const store = useUserStore()
const route = useRoute()

let socket: Socket
// 消息列表
const list = ref<Message[]>([])

onUnmounted(() => {
    socket.close()
})

onMounted(() => {
    // 建立连接，创建 socket.io 实例
    socket = io(baseURL, {
        // 身份认证
        auth: {
            token: `Bearer ${store.user?.token}`
        },
        // 订单ID
        query: {
            // 地址栏取出orderId，在建立连接的时候发送给，socket服务器
            orderId: route.query.orderId
        }
    })

    socket.on('connect', () => {
        // 建立连接成功
        console.log('connect')
    })

    socket.on('error', (event) => {
        // 错误异常消息
        console.log('error')
    })

    socket.on('disconnect', () => {
        // 已经断开链接
        console.log('disconnect')
    })
    // 聊天记录
    socket.on('chatMsgList', ({ data }: { data: TimeMessages[] }) => {
        // 准备转换常规消息列表
        const arr: Message[] = []
        data.forEach((item, i) => {
            arr.push({
                msgType: MsgType.Notify,
                msg: { content: item.createTime },
                createTime: item.createTime,
                id: item.createTime
            })
            arr.push(...item.items)
        })
        // 追加到聊天消息列表
        list.value.unshift(...arr)
    })
})

/**
 * 接受状态的控制：（订单详情）
 * 1.组件挂载后，需要知道当前的接诊状态
 * 2.订单状态变更后，需要只知道已经变化，更新当前接诊状态
 * 3.依赖状态：
 *      1） 状态栏 需要条件渲染，有倒计时
 *      2)  操作栏 需要禁用和启用
 */
const consult = ref<ConsultOrderItem>()
onMounted(async () => {
    // 需要传一个订单号 使用断言
    const res = await getConsultOrderDetail(route.query.orderId as string)
    consult.value = res.data
    // console.log(consult.value)
    // console.log(route.query.orderId)
})



</script>

<style scoped lang="scss">
.room-page {
    padding-top: 90px;
    padding-bottom: 60px;
    min-height: 100vh;
    box-sizing: border-box;
    background-color: var(--cp-bg);

    .van-pull-refresh {
        width: 100%;
        min-height: calc(100vh - 150px);
    }
}
</style>