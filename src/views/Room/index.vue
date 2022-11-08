<template>
    <div class="room-page">
        <cp-nav-bar title="问诊室" />
        <!-- status为订单状态，countdown为倒计时 -->
        <room-status :status="consult?.status" :countdown="consult?.countdown"></room-status>
        <!-- refresh	下拉刷新时触发 -->
        <van-pull-refresh v-model="loading" @refresh="onRefresh">
            <room-message :list="list"></room-message>
        </van-pull-refresh>
        <!-- ConsultChat为问诊中 -->
        <room-action @send-text="sendText" @send-image="sendIamge"
            :disabled="consult?.status !== OrderType.ConsultChat"></room-action>

    </div>
</template>

<script setup lang='ts'>
import RoomStatus from './components/RoomStatus.vue'
import RoomMessage from './components/RoomMessage.vue'
import RoomAction from './components/RoomAction.vue'
import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
import { baseURL } from '@/utils/request'
import { useUserStore } from '@/stores'
import { useRoute } from 'vue-router'
import { MsgType, OrderType } from '@/enums'
import type { Message, TimeMessages } from '@/types/room'
import type { ConsultOrderItem, Image } from '@/types/consult'
import { getConsultOrderDetail } from '@/services/consult'
import dayjs from 'dayjs'
import { Loading, Toast } from 'vant'

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
        // 默认一个空的聊天数组
        list.value = []
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
            // 记录消息分组第一组的时间，作为下次获取聊天记录的时间
            if (i === 0) time.value = item.createTime
            arr.push({
                msgType: MsgType.Notify,
                msg: { content: item.createTime },
                createTime: item.createTime,
                id: item.createTime
            })
            // arr.push(...item.items)
            item.items.forEach(item => {
                arr.push({ ...item, notScroll: initialMsg.value === false })
            })
        })
        // 追加到聊天消息列表
        list.value.unshift(...arr)

        // 关闭刷新效果
        Loading.value = false
        if (!data.length) {
            Toast('没有聊天记录了')
        }

        // 第一次需要滚动到最底部
        nextTick(() => {
            if (initialMsg.value) {
                // 把默认加载到消息全部改成了已读
                socket.emit('updateMsgStatus', arr[arr.length - 1].id)
                window.scrollTo(0, document.body.scrollHeight)
                initialMsg.value = false
            }
        })
    })
    // 等待连接成功后，注册事件，订单状态变更
    socket.on('statusChange', async () => {
        const res = await getConsultOrderDetail(route.query.orderId as string)
        consult.value = res.data
    })
    // 接收消息
    socket.on('receiveChatMsg', async (msg: Message) => {
        list.value.push(msg)
        // 是一个promise，等下一帧在执行（等DOM渲染完）
        await nextTick()
        // 修改消息为已阅
        socket.emit('updateMsgStatus', msg.id)
        // 滚动到最底部
        window.scrollTo(0, document.body.scrollHeight)
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

/**
 * 发送文字信息
 * 1.底部操作栏组件，输入信息后需要传递给父组件（index.vue）组件
 * 2.由父组件来发送信息，通过emit发送消息 sendChatMsg
 * 3.接受信息，on receiveChatMsg接受服务器回的消息证明发送成功，追加到消息列表
 * 4.在渲染的时候，区分是自己还是医生
 */
const sendText = (text: string) => {
    // 根据后台约定发送消息：from 发送人 to接收人  msgType消息类型  msg{content:文字}
    // sendChatMsg 发送信息
    socket.emit('sendChatMsg', {
        from: store.user?.id,
        to: consult.value?.docInfo?.id,
        msgType: MsgType.MsgText,
        msg: {
            content: text
        }
    })
}

/**
 * 发送图片信息
 * 1.底部操作栏组件，上传图片，成功后传递给父组件（index.vue） 组件{id,url}图片对象
 * 2.由父组件来发送信息，通过emit发送消息 sendChatMsg
 * 3.在渲染的时候，区分是自己还是医生
 */
const sendIamge = (img: Image) => {
    socket.emit('sendChatMsg', {
        form: store.user?.id,
        to: consult.value?.docInfo?.id,
        msgTye: MsgType.MsgImage,
        msg: {
            picture: img
        }
    })
}

/**
 * 加载更多聊天记录
 * 1.默认的聊天记录滚动到最底部，第二次，第三次，... 不需要滚动滚动底部
 * 2.实现下拉刷新效果
 * 3.下拉刷新后，发送一个获取聊天记录的消息给后台
 * 4.触发聊天记录事件，记录当前时间段最早的时间，作为发送聊天记录消息的参数给后台
 * 4.1 判断如果有数据，追加到数组，如果没有数据，轻提示没有数据
 * 5.再次连接socket的时候，需要清空聊天记录。
 */
const initialMsg = ref(true)
const loading = ref(false)
// 初始化值是当前时间 YYYY-MM-DD HH:mm:ss
const time = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
const onRefresh = () => {
    socket.emit('getChatMsgList', 20, time.value, consult.value?.id)
}
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