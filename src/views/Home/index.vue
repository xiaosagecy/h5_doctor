<template>
    <div class="home-page">
        <!-- 头部 -->
        <div class="home-header">
            <div class="con">
                <h1>好医生</h1>
                <div class="search">
                    <cp-icon name="home-search">搜一搜：疾病/症状/医生/健康知识</cp-icon>
                </div>
            </div>
        </div>
        <!-- 导航 -->
        <div class="home-navs">
            <van-row>
                <van-col span="8">
                    <router-link to="/" class="nav">
                        <cp-icon name="home-doctor"></cp-icon>
                        <p class="title">问医生</p>
                        <p class="desc">按科室查问医生</p>
                    </router-link>
                </van-col>
                <van-col span="8">
                    <router-link to="/consult/fast" class="nav">
                        <cp-icon name="home-graphic"></cp-icon>
                        <p class="title">极速问诊</p>
                        <p class="desc">20s医生极速回复</p>
                    </router-link>
                </van-col>
                <van-col span="8">
                    <router-link to="/" class="nav">
                        <cp-icon name="home-prescribe"></cp-icon>
                        <p class="title">开药问诊</p>
                        <p class="desc">线上买药更方便</p>
                    </router-link>
                </van-col>
            </van-row>
            <van-row>
                <van-col span="6">
                    <router-link to="/" class="nav min">
                        <cp-icon name="home-order"></cp-icon>
                        <p class="title">药品订单</p>
                    </router-link>
                </van-col>
                <van-col span="6">
                    <router-link to="/" class="nav min">
                        <cp-icon name="home-docs"></cp-icon>
                        <p class="title">健康档案</p>
                    </router-link>
                </van-col>
                <van-col span="6">
                    <router-link to="/" class="nav min">
                        <cp-icon name="home-rp"></cp-icon>
                        <p class="title">我的处方</p>
                    </router-link>
                </van-col>
                <van-col span="6">
                    <router-link to="/" class="nav min">
                        <cp-icon name="home-find"></cp-icon>
                        <p class="title">疾病查询</p>
                    </router-link>
                </van-col>
            </van-row>
        </div>
        <!-- 轮播图 -->
        <div class="home-banner">
            <!-- indicator-color指示器颜色 则是轮播图下的小圆点颜色-->
            <van-swipe indicator-color="#fff">
                <van-swipe-item v-for="i in 4">
                    <img src="@/assets/ad.png" alt="">
                </van-swipe-item>
            </van-swipe>
        </div>
        <!-- 切换知识列表区域 -->
        <!-- shrink是否开启左侧收缩布局 sticky是否使用粘性布局 -->
        <van-tabs shrink sticky v-model:active="active">
            <van-tab title="关注" name="like">
                <!-- 推荐你关注的医生 -->
                <follow-doctor></follow-doctor>
                <!-- 关注的医生写的问诊 -->
                <knowledge-list type="like" />
            </van-tab>
            <van-tab title="推荐" name="recommend">
                <knowledge-list type="recommend" />
            </van-tab>
            <van-tab title="减脂" name="fatReduction">
                <knowledge-list type="fatReduction" />
            </van-tab>
            <van-tab title="饮食" name="food">
                <knowledge-list type="food" />
            </van-tab>
        </van-tabs>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue'
import KnowledgeList from './components/KnowledgeList.vue'
import type { KnowledgeType } from '@/types/consult'
import FollowDoctor from './components/FollowDoctor.vue'

const active = ref<KnowledgeType>('recommend')
</script>

<style scoped lang="scss">
.home-page {
    padding-bottom: 50px;
}

.home-header {
    height: 100px;
    position: relative;

    &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 90px;
        // linear-gradient()函数用于创建一个表示两种或多种颜色线性渐变的图片
        // 渐变轴为180度
        background: linear-gradient(180deg, rgba(62, 206, 197, 0.85), #26bcc6);
        border-bottom-left-radius: 150px 20px;
        border-bottom-right-radius: 150px 20px;
    }

    .con {
        position: relative;
        padding: 0 15px;

        >h1 {
            font-size: 18px;
            color: #fff;
            font-weight: normal;
            padding: 20px 0;
            line-height: 1;
            padding-left: 5px;
        }

        .search {
            height: 40px;
            border-radius: 20px;
            box-shadow: 0px 15px 20px -7px rgba(224, 236, 250, 0.8);
            background-color: #fff;
            display: flex;
            align-items: center;
            padding: 0 20px;
            color: var(--cp-dark);
            font-size: 13px;

            .cp-icon {
                font-size: 16px;
                margin-right: 5px;
            }
        }
    }
}

.home-navs {
    padding: 10px 15px 0 15px;

    .nav {
        display: flex;
        flex-direction: column;
        align-items: center; // 因为改变了轴向，这个设置的是水平居中了
        padding: 10px 0;

        .cp-icon {
            font-size: 48px;
        }

        .title {
            font-weight: 500;
            margin-top: 5px;
            color: var(--cp-text1);
        }

        .desc {
            font-size: 11px;
            margin-top: 2px;
            color: var(--cp-tap);
        }

        &.min {
            .cp-icon {
                font-size: 31px;
            }

            .title {
                font-size: 13px;
                color: var(--cp-text2);
                font-weight: normal;
            }
        }
    }
}

.home-banner {
    padding: 10px 15px;
    height: 100px;

    img {
        width: 100%;
        height: 100%;
    }
}
</style>