<template>
    <div class="consult-dep-page">
        <cp-nav-bar title="选择科室" />
        <div class="wrapper">
            <!-- 侧边栏组件 -->
            <van-sidebar v-model="active">
                <van-sidebar-item :title="top.name" v-for="top in allDep" :key="top.id" />
            </van-sidebar>
            <!-- 二级科室 -->
            <div class="sub-dep">
                <router-link to="/consult/illness" v-for="sub in subDep" :key="sub.id" @click="store.setDep(sub.id)">{{
                        sub.name
                }}</router-link>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, onMounted, computed } from 'vue'
import { getAllDep } from '@/services/consult'
import type { TopDep } from '@/types/consult'
import { useConsultStore } from '@/stores'
const active = ref(0)

// 一级科室
const allDep = ref<TopDep[]>([])
onMounted(async () => {
    const res = await getAllDep()
    allDep.value = res.data
})

// 二级科室，注意：组件在初始化的时候没有数据 child 可能拿不到
/**
 * 当top科室默认第一个（最顶部科室）此时active为0，allDep.value[0.value]?.child
 * 通过选择不同top科室，改变active渲染不同的二级科室
 */
const subDep = computed(() => allDep.value[active.value]?.child)

const store = useConsultStore()

</script>

<style scoped lang="scss">
.consult-dep-page {
    padding-top: 46px;
}

.van-sidebar {
    width: 114px;

    &-item {
        padding: 14px;
        color: var(--cp-tag);

        &--select {
            color: var(--cp-main);
            font-weight: normal;

            &::before {
                display: none;
            }
        }
    }
}

.wrapper {
    height: calc(100vh - 46px);
    overflow: hidden;
    display: flex;

    .sub-dep {
        flex: 1;
        height: 100%;
        overflow-y: auto;

        >a {
            display: block;
            padding: 14px 30px;
            color: var(--cp-dark);
        }
    }
}
</style>