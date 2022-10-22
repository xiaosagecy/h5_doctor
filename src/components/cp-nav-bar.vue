<template>
    <!-- left-arrow显示左侧箭头 -->
    <van-nav-bar left-arrow @click-left="onClickLeft" fixed :title="title" :right-text="rightText"
        @click-right="onClickRight">
    </van-nav-bar>
</template>

<script setup lang='ts'>
import { useRouter } from 'vue-router'

// 使用组件时才能确定的功能：标题、右侧文字、点击右侧文字行为（props传入）
const props = defineProps<{
    title?: string
    rightText?: string
    back?: () => void
}>()

const emit = defineEmits<{
    (e: 'click-right'): void
}>()

const router = useRouter()

const onClickLeft = () => {
    // 在添加患者档案中 如果props中有属性back 
    // 在点击返回 < 符合时 调用back函数 
    // 把show的值赋值给false 使popup按下返回<箭头时隐藏
    if (props.back) {
        return props.back()
    }
    // 判断历史记录中是否有回退
    if (history.state?.back) {
        router.back()
    } else {
        router.push('/')
    }
}

const onClickRight = () => {
    emit('click-right')
}
</script>

<style scoped lang="scss">
::v-deep() {
    .van-nav-bar {
        &__arrow {
            font-size: 18px;
            color: var(--cp-text1);
        }

        &__text {
            font-size: 15px;
        }
    }
}
</style>