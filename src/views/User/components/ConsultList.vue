<template>
    <div class="consult-list">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <consult-item v-for="item in list" :key="item.id" :item="item"></consult-item>
        </van-list>
    </div>
</template>

<script setup lang='ts'>
import ConsultItem from './ConsultItem.vue'
import type { ConsultType } from '@/enums'
import { getConsultOrderList } from '@/services/consult'
import type { ConsultOrderItem, ConsultOrderParams } from '@/types/consult'
import { ref } from 'vue'

const props = defineProps<{
    type: ConsultType
}>()

const params = ref<ConsultOrderParams>({
    type: props.type,
    current: 1,
    pageSize: 5
})

const loading = ref(false)
const finished = ref(false)
const list = ref<ConsultOrderItem[]>([])

// 不满一屏触发，满了一屏高度滚到下方加载
const onLoad = async () => {
    const res = await getConsultOrderList(params.value)
    list.value.push(...res.data.rows)
    // 因为触发@load会自动把v-model:loading="loading"中的loading改为true
    // 加载完毕要手动改为false
    loading.value = false
    if (params.value.current < res.data.pageTotal) {
        // 准备下一页页码
        params.value.current++
    } else {
        // 加载完毕
        finished.value = true
    }
}

</script>

<style scoped lang="scss">
.consult-list {
    padding: 10px 15px;
}
</style>