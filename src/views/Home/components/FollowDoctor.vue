<template>
    <div class="follow-doctor">
        <div className="head">
            <p>推荐关注</p>
            <a href="javascript:;">查看更多<i class="van-icon van-icon-arrow" /></a>
        </div>
        <div class="body">
            <!-- swipe 组件 -->
            <!-- 去除指示器:show-indicators="false"，关闭无缝滚动，设置一次滚动一个卡片 loop是否开启循环播放-->
            <!-- :width适配不同设备 -->
            <van-swipe :width="(150 / 375) * width" :show-indicators="false" :loop="false">
                <van-swipe-item v-for="item in list" :key="item.id">
                    <DoctorCard :item="item" />
                </van-swipe-item>
            </van-swipe>
        </div>
    </div>
</template>

<script setup lang='ts'>
import DoctorCard from './DoctorCard.vue'
import { ref, onMounted } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { getDoctorPage } from '@/services/consult'
import type { DoctorList } from '@/types/consult'

const { width } = useWindowSize()
const list = ref<DoctorList>()

const loadData = async () => {
    const res = await getDoctorPage({ current: 1, pageSize: 5 })
    list.value = res.data.rows
}

onMounted(() => loadData())



</script>

<style scoped lang="scss">
.follow-doctor {
    background-color: var(--cp-bg);
    height: 250px;

    .head {
        display: flex;
        justify-content: space-between;
        height: 45px;
        align-items: center;
        padding: 0 15px;
        font-size: 13px;

        >a {
            color: var(--cp-tip);
        }
    }

    .body {
        width: 100%;
        overflow: hidden;
    }
}
</style>