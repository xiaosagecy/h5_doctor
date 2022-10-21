<template>
    <div class="layout-page">
        <router-view></router-view>
        <!-- 开启路由模式 route -->
        <van-tabbar route>
            <van-tabbar-item to="/home">
                首页
                <!-- 被选择的图标 active为true -->
                <template #icon="active">
                    <cp-icon :name="`home-index-${active ? 'active': 'default'}`"></cp-icon>
                </template>
            </van-tabbar-item>
            <van-tabbar-item to="/article">
                健康百科
                <template #icon="active">
                    <cp-icon :name="`home-article-${active ? 'active': 'default'}`"></cp-icon>
                </template>
            </van-tabbar-item>
            <van-tabbar-item to="/notify">
                消息中心
                <template #icon="active">
                    <cp-icon :name="`home-notice-${active ? 'active': 'default'}`"></cp-icon>
                </template>
            </van-tabbar-item>
            <van-tabbar-item to="/user">
                我的
                <template #icon="active">
                    <cp-icon :name="`home-mine-${active ? 'active': 'default'}`"></cp-icon>
                </template>
            </van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script setup lang='ts'>

</script>

<style scoped lang="scss">
.layout-page {
    ::v-deep() {
        .van-tabbar-item {
            &_icon {
                font-size: 21px;
            }
        }

        // &_text {
        //     font-size: 11px;
        // }
    }
}
</style>