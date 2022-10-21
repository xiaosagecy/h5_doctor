<template>
    <svg aria-hidden="true" class="cp-icon">
        <use :href="`#icon-${name}`" />
    </svg>
</template>

<script setup lang='ts'>
// 提供name属性
defineProps<{
    name: string
}>()
</script>

<style scoped lang="scss">
.cp-icon {
    // 和字体一样大
    width: 1em;
    height: 1em;
}
</style>