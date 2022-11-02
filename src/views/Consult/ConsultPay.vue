<template>
    <div class="consult-pay-page" v-if="payInfo">
        <cp-nav-bar title="支付" />
        <div class="pay-info">
            <p class="tit">图文问诊 {{ payInfo?.payment }} 元</p>
            <img class="img" src="@/assets/avatar-doctor.svg" alt="">
            <p class="desc">
                <span>极速问诊</span>
                <span>自动分配医生</span>
            </p>
        </div>
        <van-cell-group>
            <van-cell title="优惠卷" :value="`-¥${payInfo.couponDeduction}`" />
            <van-cell title="积分抵扣" :value="`-¥${payInfo.pointDeduction}`" />
            <van-cell title="实付款" :value="`¥${payInfo.actualPayment}`" class="pay-price" />
        </van-cell-group>
        <div class="pay-space"></div>
        <van-cell-group>
            <van-cell title="患者信息" :value="`${patient?.name} | ${patient?.genderValue} | ${patient?.age}岁`"></van-cell>
            <van-cell title="病情描述" :label="store.consult.illnessDesc"></van-cell>
        </van-cell-group>
        <div class="pay-schema">
            <van-checkbox v-model="agree">我已同意 <span class="text">支付协议</span></van-checkbox>
        </div>
        <van-submit-bar button-type="primary" :price="payInfo.actualPayment * 100" button-text="立即支付" text-align="left"
            @click="submit" :loading="loading" />
        <!--close-on-popstate 是否在页面回退时自动关闭 -->
        <van-action-sheet v-model:show="show" title="选择支付方式" :closeable="false" :before-close="onClose"
            :close-on-popstate="false">
            <div class="pay-type">
                <p class="amount">￥{{ payInfo.actualPayment.toFixed(2) }}</p>
                <van-cell-group>
                    <van-cell title="微信支付" @click="paymentMethod = 0">
                        <template #icon>
                            <cp-icon name="consult-wechat" />
                        </template>
                        <template #extra>
                            <van-checkbox :checked="paymentMethod === 0" />
                        </template>
                    </van-cell>
                    <van-cell title="支付宝支付" @click="paymentMethod = 1">
                        <template #icon>
                            <cp-icon name="consult-alipay" />
                        </template>
                        <template #extra>
                            <van-checkbox :checked="paymentMethod === 1" />
                        </template>
                    </van-cell>
                </van-cell-group>
                <div class="btn">
                    <van-button type="primary" round block @click="pay">立即支付</van-button>
                </div>
            </div>
        </van-action-sheet>
    </div>
</template>

<script setup lang='ts'>
import { getConsultOrderPre, createConsultOrder, getConsultOrderPayUrl } from '@/services/consult'
import { getPatientDetail } from '@/services/use'
import { useConsultStore } from '@/stores'
import type { ConsultOrderPreData } from '@/types/consult'
import type { Patient } from '@/types/user'
import { Dialog, Toast } from 'vant'
import { onMounted, ref } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'

const store = useConsultStore()

const payInfo = ref<ConsultOrderPreData>()
const loadData = async () => {
    const res = await getConsultOrderPre({
        type: store.consult.type,
        illnessType: store.consult.illnessType
    })
    payInfo.value = res.data
    // 设置默认优惠券
    store.setCoupon(res.data.couponId)

}

const patient = ref<Patient>()
const loadPatient = async () => {
    if (!store.consult.patientId) return
    const res = await getPatientDetail(store.consult.patientId)
    patient.value = res.data
}

onMounted(() => {
    loadData()
    loadPatient()
})

const agree = ref<boolean>(false)

// 打开选项支付抽屉
const show = ref<boolean>(false)
const loading = ref<boolean>(false)
const orderId = ref<string>('')
const paymentMethod = ref<0 | 1>()
const submit = async () => {
    if (!agree.value) return Toast('请勾选我已同意支付协议')
    loading.value = true
    const res = await createConsultOrder(store.consult)
    orderId.value = res.data.id
    loading.value = false
    store.clear()
    show.value = true
}

onBeforeRouteLeave(() => {
    if (orderId.value) return false
})

const router = useRouter()
const onClose = () => {
    return Dialog.confirm({
        title: '关闭支付',
        message: '取消支付将无法获得医生回复，医生接诊名额有限，是否确认关闭？',
        cancelButtonText: '仍要关闭',
        confirmButtonText: '继续支付',
        confirmButtonColor: 'var(--cp-primary)'
    }).then(() => {
        return false
    }).catch(() => {
        orderId.value = ''
        router.push('/user/consult')
        return true
    })
}

// 跳转支付
const pay = async () => {
    if (paymentMethod.value === undefined) return Toast('请选择支付方式')
    Toast.loading('跳转支付')
    const res = await getConsultOrderPayUrl({
        orderId: orderId.value,
        paymentMethod: paymentMethod.value,
        payCallback: 'http://localhost:5173/room'
    })
    window.location.href = res.data.payUrl
}

onMounted(() => {
    if (
        !store.consult.type ||
        !store.consult.illnessType ||
        !store.consult.depId ||
        !store.consult.patientId
    ) {
        return Dialog.alert({
            title: '温馨提示',
            message: '问诊信息不完整请重新填写，如有未支付的问诊订单可在问诊记录中继续支付',
            // 是否在页面回退时自动关闭
            closeOnPopstate: false
        }).then(() => {
            router.push('/')
        })
    }
    loadData()
    loadPatient()
})


</script>

<style scoped lang="scss">
.consult-pay-page {
    padding: 46px 0 50px 0;
}

.pay-info {
    display: flex;
    padding: 15px;
    flex-wrap: wrap;
    align-items: center;

    .tit {
        width: 100%;
        font-size: 16px;
        margin-bottom: 10px;
    }

    .img {
        margin-right: 10px;
        width: 38px;
        height: 38px;
        border-radius: 4px;
        overflow: hidden;
    }

    .desc {
        flex: 1;

        >span {
            display: block;
            color: var(--cp-tag);

            &:first-child {
                font-size: 16px;
                color: var(--cp-text2);
            }
        }
    }
}

.pay-price {
    ::v-deep() {
        .vam-cell__title {
            font-size: 16px;
        }

        .van-cell__value {
            font-size: 16px;
            color: var(--cp-price);
        }
    }
}

.pay-space {
    height: 12px;
    background-color: var(--cp-bg);
}

.pay-schema {
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;

    .text {
        color: var(--cp-primary);
    }
}

::v-deep() {
    .van-submit-bar__button {
        font-weight: normal;
        width: 160px;
    }
}

.pay-type {
    .amount {
        padding: 20px;
        text-align: center;
        font-size: 16px;
        font-weight: bold;
    }

    .btn {
        padding: 15px;
    }

    .van-cell {
        align-items: center;

        .cp-icon {
            margin-right: 10px;
            font-size: 18px;
        }

        .van-checkbox :deep(.van-checkbox_icon) {
            font-size: 16px;
        }
    }
}
</style>