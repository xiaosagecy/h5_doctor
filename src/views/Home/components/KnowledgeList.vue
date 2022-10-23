<template>
    <div class="knowledge-list">
        <!-- 全部数据加载完 finished为true -->
        <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <knowledge-card v-for="item in list" :key="item.id" :item="item"></knowledge-card>
        </van-list>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue'
import KnowledgeCard from './KnowledgeCard.vue'
import type { KnowledgeType, KnowledgeList, KnowledgeParams } from '@/types/consult'
import { getKonwledgePage } from '@/services/consult'

const props = defineProps<{
    type: KnowledgeType
}>()

const list = ref<KnowledgeList>([])
const params = ref<KnowledgeParams>({
    type: props.type,
    current: 1,
    pageSize: 10
})

const loading = ref(false)
const finished = ref(false)
const onLoad = async () => {
    // 加载数据
    const res = await getKonwledgePage(params.value)
    list.value.push(...res.data.rows)
    if (params.value.current >= res.data.pageTotal) {
        // 当前加载数据条数>总数据条数 加载完毕
        finished.value = true
    } else {
        params.value.current++
    }
    loading.value = false
}
</script>

<style lang="scss" scoped>
.knowledge-list {
    padding: 0 15px;
}
</style>