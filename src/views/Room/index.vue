<template>
    <div class="room-page">
        <cp-nav-bar title="问诊室" />
        <room-status></room-status>
        <room-message></room-message>
        <room-action></room-action>
    </div>
</template>

<script setup lang='ts'>
import RoomStatus from './components/RoomStatus.vue'
import RoomMessage from './components/RoomMessage.vue'
import RoomAction from './components/RoomAction.vue'

</script>

<style scoped lang="scss">
.room-page {
    padding-top: 90px;
    padding-bottom: 60px;
    min-height: 100vh;
    box-sizing: border-box;
    background-color: var(--cp-bg);

    .van-pull-refresh {
        width: 100%;
        min-height: calc(100vh - 150px);
    }
}
</style>