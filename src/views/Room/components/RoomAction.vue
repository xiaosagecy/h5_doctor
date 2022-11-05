<template>
    <!-- 底部发信息输入框/发图片 操作栏 -->
    <div class="room-action">
        <van-field :disabled="disabled" type="text" class="input" :border="false" placeholder="问医生" autocomplete="off"
            v-model="text" @keyup.enter="onSendText"></van-field>
        <!-- 不预览，使用小图标作为上传按钮 -->
        <van-uploader :preview-image="false" :disabled="disabled">
            <cp-icon name="consult-img" />
        </van-uploader>
    </div>
</template>
  

<script setup lang='ts'>
import { ref } from 'vue'
defineProps<{
    disabled: boolean
}>()

// 把输入内容提交给父组件
const emit = defineEmits<{
    // e：派发事件名称，text：派发函数中需要的参数类型
    (e: 'sent-text', text: string): void
}>()

const text = ref('')
const onSendText = () => {
    if (text.value) {
        emit('sent-text', text.value)
        text.value = ''
    }
}



</script>

<style lang="scss" scoped>
.room-action {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 60px;
    background-color: #fff;
    display: flex;
    align-items: center;
    padding: 0 16px;
    z-index: 1;
    box-sizing: border-box;

    .input {
        background-color: var(--cp-bg);
        border: none;
        border-radius: 25px;
        margin-right: 10px;
        padding: 8px 15px;
    }

    .cp-icon {
        width: 24px;
        height: 24px;
    }
}
</style>
