<template>
    <div class="room-page">
        <cp-nav-bar title="问诊室" />
        <room-status></room-status>
        <room-message></room-message>
        <room-action></room-action>
    </div>
</template>

<script setup lang='ts'>
import RoomStatus from './components/RoomStatus.vue'
import RoomMessage from './components/RoomMessage.vue'
import RoomAction from './components/RoomAction.vue'
import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'
import { onMounted, onUnmounted } from 'vue'
import { baseURL } from '@/utils/request'
import { useUserStore } from '@/stores'
import { useRoute } from 'vue-router'

const store = useUserStore()
const route = useRoute()

let socket: Socket

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