<!-- 按钮组件单选框封装 -->
<template>
    <div class="cp-radio-btn">
        <a class="item" href="javascript:;" :class="{ active: modelValue === item.value }" v-for="item in options"
            :key="item.value" @click="toggleItem(item.value)">{{ item.label }}</a>
    </div>
</template>

<script setup lang='ts'>

// 接收值
defineProps<{
    options: {
        label: string
        value: number | string
    }[],
    modelValue?: string | number
}>()

// emit 简单用法
// const emit = defineEmits(['update:visible'])
// const close = () => {
//   emit('update:visible', false)
// }

// 派发值
const emit = defineEmits<{
    (e: 'update:modelVale', value: string | number): void
}>()

const toggleItem = (value: string | number) => {
    emit('update:modelValue', value)
}

</script>

<style lang="scss" scoped>
.cp-radio-btn {
    display: flex;
    flex-wrap: wrap;

    .item {
        height: 32px;
        min-width: 60px;
        line-height: 30px;
        padding: 0 14px;
        text-align: center;
        border: 1px solid var(--cp-bg);
        background-color: var(--cp-bg);
        margin-right: 10px;
        box-sizing: border-box;
        color: var(--cp-text2);
        margin-bottom: 10px;
        border-radius: 4px;
        transition: all 0.3s;

        &.active {
            border-color: var(--cp-primary);
            background-color: var(--cp-plain);
        }
    }
}
</style>