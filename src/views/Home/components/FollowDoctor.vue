<template>
    <div class="follow-doctor">
        <div className="head">
            <p>推荐关注</p>
            <a href="javascript:;">查看更多<i class="van-icon van-icon-arrow" /></a>
        </div>
        <div class="body">
            <!-- swipe 组件 -->
            <!-- 去除指示器:show-indicators="false"，关闭无缝滚动，设置一次滚动一个卡片 loop是否开启循环播放-->
            <van-swipe :width="150" :show-indicators="false" :loop="false">
                <van-swipe-item v-for="item in 5" :key="item">
                    <DoctorCard />
                </van-swipe-item>
            </van-swipe>
        </div>
    </div>
</template>

<script setup lang='ts'>
import DoctorCard from './DoctorCard.vue'
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