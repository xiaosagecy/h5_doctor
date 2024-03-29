<template>
    <div class="consult-detail-page" v-if="item">
        <cp-nav-bar title="问诊详情" />
        <div class="detail-head">
            <div class="text">
                <h3>图文问诊 {{ item.payment }} 元</h3>
                <span class="sta" :class="{
                    orange: item.status === OrderType.ConsultPay,
                    green: item.status === OrderType.ConsultChat
                }">{{ item.statusValue }}</span>
                <p class="tip">服务医生信息</p>
            </div>
            <div class="card">
                <img class="avatar" src="@/assets/avatar-doctor.svg" alt="" />
                <p class="doc">
                    <span>极速问诊</span>
                    <span>自动分配医生</span>
                </p>
                <van-icon name="arrow" />
            </div>
        </div>
        <div class="detail-patient">
            <van-cell-group :border="false">
                <van-cell title="患者信息"
                    :value="`${item.patientInfo.name} | ${item.patientInfo.genderValue} | ${item.patientInfo.age}岁`" />
                <van-cell title="患病时长" :value="getIllnessTimeText(item.illnessTime)" />
                <van-cell title="就诊情况" :value="getConsultFlagText(item.consultFlag)" />
                <van-cell title="病情描述" :label="item.illnessDesc" />
            </van-cell-group>
        </div>
        <div class="detail-order">
            <h3>订单信息</h3>
            <van-cell-group :border="false">
                <van-cell title="订单编号">
                    <template #value>
                        <span class="copy" @click="onCopy">复制</span>
                        {{ item.orderNo }}
                    </template>
                </van-cell>
                <van-cell title="创建时间" :value="item.createTime" />
                <van-cell title="应付款" :value="`￥${item.payment}`" />
                <van-cell title="优惠券" :value="`-￥${item.couponDeduction}`" />
                <van-cell title="积分抵扣" :value="`-￥${item.pointDeduction}`" />
                <van-cell title="实付款" :value="`￥${item.actualPayment}`" class="price" />
            </van-cell-group>
        </div>
        <!-- 待支付，倒计时提示 -->
        <div class="detail-time" v-if="item.status === OrderType.ConsultPay">
            请在
            <van-count-down :time="item.countdown * 1000" /> 内完成支付，超时订单将取消
        </div>
        <div class="detail-action van-hairline--top" v-if="item.status === OrderType.ConsultPay">
            <div class="price">
                <span>需付款</span>
                <span>￥{{ item.actualPayment.toFixed(2) }}</span>
            </div>
            <van-button type="default" round :loading="loading" @click="onCancelOrder(item!)">取消问诊</van-button>
            <van-button type="primary" round @click="show = true">继续支付</van-button>
        </div>
        <div class="detail-action van-hairline--top" v-if="item.status === OrderType.ConsultWait">
            <van-button type="default" round :loading="loading" @click="onCancelOrder(item!)">取消问诊</van-button>
            <van-button type="primary" round :to="`/room?orderId=${item.id}`">继续沟通</van-button>
        </div>
        <div class="detail-action van-hairline--top" v-if="item.status === OrderType.ConsultChat">
            <van-button type="default" round v-if="item.prescriptionId" @click="showPrescription(item?.prescriptionId)">
                查看处方</van-button>
            <van-button type="primary" round :to="`/room?orderId=${item.id}`">继续沟通</van-button>
        </div>
        <div class="detail-action van-hairline--top" v-if="item.status === OrderType.ConsultComplete">
            <cp-consult-more :disabled="!item.prescriptionId" @on-delete="deleteConsultOrder(item!)"
                @on-preview="showPrescription(item?.prescriptionId)"></cp-consult-more>
            <van-button type="default" round :to="`/room?orderId=${item.id}`">问诊记录</van-button>
            <van-button type="primary" round v-if="item.evaluateId">写评价</van-button>
            <van-button type="default" round v-else>查看评价</van-button>
        </div>
        <div class="detail-action van-hairline--top" v-if="item.status === OrderType.ConsultCancel">
            <van-button type="default" round :loading="deleteLoading" @click="deleteConsultOrder(item!)">删除订单
            </van-button>
            <van-button type="primary" round to="/">咨询其他医生</van-button>
        </div>
        <!-- 支付抽屉 -->
        <cp-pay-sheet :actual-payment="item.actualPayment" :order-id="item.id" v-model:show="show"
            pay-callback="http://localhost:5173/room"></cp-pay-sheet>
    </div>
    <div class="consult-detail-page" v-else>
        <cp-nav-bar title="问诊详情" />
        <van-skeleton title :row="4" style="margin-top: 30px" />
        <van-skeleton title :row="4" style="margin-top: 30px" />
    </div>
</template>

<script setup lang="ts">
import { OrderType } from '@/enums'
import { getConsultOrderDetail } from '@/services/consult'
import type { ConsultOrderItem } from '@/types/consult'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getIllnessTimeText, getConsultFlagText } from '@/utils/filter'
import { useCancelOrder, useDeleteOrder, useShowPrescription } from '@/composable'
import { useClipboard } from '@vueuse/core'
import { Toast } from 'vant'


const route = useRoute()
const router = useRouter()

const item = ref<ConsultOrderItem>()
onMounted(async () => {
    const res = await getConsultOrderDetail(route.params.id as string)
    item.value = res.data
})

// 取消问诊
const { loading, onCancelOrder } = useCancelOrder()

// 删除订单
const { loading: deleteLoading, deleteConsultOrder } = useDeleteOrder(() => { router.push('/user/consult') })
// 查看处方
const { showPrescription } = useShowPrescription()

// 复制功能
// 1.从vueuse得到数据和函数
/**
 * copy（需要拷贝的内容）
 * copied 是否拷贝成功，默认1.5s恢复状态
 * isSupported 浏览器是否支持，需要授权权读取粘贴板和写入粘贴板权限
 */
const { copy, copied, isSupported } = useClipboard()
// 2.点击复制按钮，复制订单编号
const onCopy = () => {
    if (!isSupported.value) return Toast('不支持，或未授权')
    // 因为是详情页面，传过来的item已经这个包含了订单详情orderNo，直接使用即可
    copy(item.value?.orderNo as string)
}
// 3.复制后提示
watch(copied, () => {
    if (copied.value) Toast('已复制')
})

const show = ref(false)

</script>

<style lang="scss" scoped>
.consult-detail-page {
    padding: 46px 0 110px 0;
}

.detail-head {
    height: 140px;
    position: relative;

    &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 135px;
        background: linear-gradient(180deg, rgba(44, 181, 165, 0), rgba(44, 181, 165, 0.2));
        border-bottom-left-radius: 150px 20px;
        border-bottom-right-radius: 150px 20px;
    }

    padding: 15px;

    .text {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 10px 3px;

        .sta {
            color: var(--cp-tag);
            font-weight: 500;
            font-size: 16px;

            &.green {
                color: var(--cp-primary);
            }

            &.orange {
                color: #f2994a;
            }
        }

        .tip {
            width: 100%;
            color: var(--cp-text3);
            margin-top: 5px;
        }
    }

    .card {
        height: 74px;
        background-color: #fff;
        border-radius: 8px;
        position: relative;
        display: flex;
        align-items: center;
        padding: 0 15px;
        box-shadow: 0px 0px 22px 0px rgba(229, 229, 229, 0.5);

        .avatar {
            width: 38px;
            height: 38px;
        }

        .doc {
            flex: 1;
            padding-left: 15px;

            >span {
                display: block;
                font-size: 16px;

                &:last-child {
                    font-size: 13px;
                    color: var(--cp-text3);
                }
            }
        }

        .van-icon {
            color: var(--cp-tip);
        }
    }
}

.detail-patient {
    &::after {
        content: '';
        display: block;
        height: 12px;
        background-color: var(--cp-bg);
    }
}

.detail-order {
    >h3 {
        padding: 10px 18px;
        font-weight: normal;
    }

    .copy {
        padding: 2px 10px;
        border: 1px solid var(--cp-primary);
        background-color: var(--cp-plain);
        color: var(--cp-primary);
        font-size: 12px;
        border-radius: 12px;
        margin-right: 10px;
    }

    :deep(.van-cell__title) {
        width: 70px;
        flex: none;
    }

    .price :deep(.van-cell__value) {
        font-size: 16px;
        color: var(--cp-price);
    }
}

.detail-action {
    height: 65px;
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    background-color: #fff;
    justify-content: flex-end;
    padding: 0 15px;
    box-sizing: border-box;

    .price {
        flex: 1;

        >span:last-child {
            font-size: 18px;
            color: var(--cp-price);
            padding-left: 5px;
        }
    }

    .van-button {
        margin-left: 10px;
        padding-left: 17px;
        padding-right: 17px;
    }

    :deep(.van-button--default) {
        background-color: var(--cp-bg);
        color: var(--cp-text3);
    }
}

.van-cell {
    padding-left: 18px;
    padding-right: 18px;
}

.detail-time {
    position: fixed;
    left: 0;
    bottom: 65px;
    width: 100%;
    height: 44px;
    background-color: #fff7eb;
    text-align: center;
    line-height: 44px;
    font-size: 13px;
    color: #f2994a;

    .van-count-down {
        display: inline;
        color: #f2994a;
    }
}
</style>