<template>
    <div class="patient-page">
        <cp-nav-bar title="家庭档案"></cp-nav-bar>
        <div class="patient-list">
            <div class="patient-item" v-for="item in list" :key="item.id">
                <div class="info">
                    <span class="name">{{item.name}}</span>
                    <span class="id">{{ item.idCard.replace(/^(.{6})(?:\d+)(.{4})$/, '\$1******\$2') }}</span>
                    <span>{{item.genderValue}}</span>
                    <span>{{item.age}}岁</span>
                </div>
                <div class="icon">
                    <cp-icon name="user-edit"></cp-icon>
                </div>
                <div class="tag" v-if="item.defaultFlag === 1">默认</div>
            </div>
            <div class="patient-add" v-if="list.length < 6" @click="showPopup">
                <cp-icon name="user-add"></cp-icon>
                <p>添加患者</p>
            </div>
            <div class="patient-tip">最多可添加 6 人</div>
        </div>
        <!-- 弹出层 -->
        <!-- 右侧边栏：用于点击添加患者档案信息从右侧滑动弹出表单 -->
        <!-- :show="show" @update:show="show=$event"也可以改为v-model -->
        <van-popup :show="show" @update:show="show=$event" position="right">
            <cp-nav-bar :back="() => (show = false)" title="添加患者" right-text="保存" @click-right="submit"></cp-nav-bar>
            <!-- 添加患者档案表单 -->
            <van-form autocomplete="off">
                <van-field v-model="patient.name" label="真实姓名" placeholder="请输入真实姓名" />
                <van-field v-model="patient.idCard" label="身份证号" placeholder="请输入身份证号" />
                <van-field label="性别">
                    <!-- 封装的单选框 -->
                    <template #input>
                        <cp-radio-btn v-model="patient.gender" :options="options"></cp-radio-btn>
                    </template>
                </van-field>
                <van-field label="默认就诊人">
                    <template #input>
                        <van-checkbox v-model="patient.defaultFlag" round />
                    </template>
                </van-field>
            </van-form>
        </van-popup>

    </div>
</template>

<script setup lang='ts'>
import { getPatientList } from '@/services/use'
import type { Patient } from '@/types/user'
import { ref, onMounted, computed } from 'vue'
import { Toast } from 'vant'
import Validator from 'id-validator'

// 页面初始化加载数据
const list = ref<Patient[]>([])
const loadList = async () => {
    const res = await getPatientList()
    // console.log(res)
    list.value = res.data
}

onMounted(() => {
    loadList()
})

// 添加患者档案信息
const initPatient: Patient = {
    name: '',
    idCard: '',
    gender: 1, // 默认男
    defaultFlag: 0 // 默认就诊人 0不默认
}

const patient = ref<Patient>({ ...initPatient })

// 默认值需要转换
const defaultFlag = computed({
    get() {
        return patient.value.defaultFlag === 1 ? true : false
    },
    set(value) {
        patient.value.defaultFlag = value ? 1 : 0
    }
})

// 复选框内容
const options = [
    { label: '男', value: 1 },
    { label: '女', value: 0 }
]

// 1默认为男性
const gender = ref(1)

// 打开侧滑栏
const show = ref(false)
const showPopup = () => {
    // 重置表单
    patient.value = { ...initPatient }
    show.value = true
}

const submit = () => {
    if (!patient.value.name) return Toast('请输入真实姓名')
    if (!patient.value.idCard) return Toast('请输入身份证号')
    const validate = new Validator()
    if (!validate.isValid(patient.value.idCard)) return Toast('身份证格式有误')
    const { sex } = validate.getInfo(patient.value.idCard)
    if (patient.value.gender !== sex) return Toast('性别与身份证不符')
}

</script>

<style lang="scss" scoped>
.patient-page {
    padding: 46px 0 80px;

    ::v-deep() {
        .van-popup {
            width: 100%;
            height: 100%;
            padding-top: 46px;
            box-sizing: border-box;
        }
    }
}

.patient-list {
    padding: 15px;
}

.patient-item {
    display: flex;
    align-items: center;
    padding: 15px;
    background-color: var(--cp-bg);
    border-radius: 8px;
    margin-bottom: 15px;
    position: relative;
    border: 1px solid var(--cp-bg);
    transition: all 0.3s;
    overflow: hidden;

    .info {
        display: flex;
        flex-wrap: wrap;
        flex: 1;

        span {
            color: var(--cp-tip);
            margin-right: 20px;
            line-height: 30px;

            &.name {
                font-size: 16px;
                color: var(--cp-text1);
                width: 80px;
                margin-right: 0;
            }

            &.id {
                color: var(--cp-text2);
                width: 180px;
            }
        }
    }

    .icon {
        color: var(--cp-tag);
        width: 20px;
        text-align: center;
    }

    .tag {
        position: absolute;
        right: 60px;
        top: 21px;
        width: 30px;
        height: 16px;
        font-size: 10px;
        color: #fff;
        background-color: var(--cp-primary);
        border-radius: 2px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    &.selected {
        border-color: var(--cp-primary);
        background-color: var(--cp-plain);

        .icon {
            color: var(--cp-primary);
        }
    }
}

.patient-add {
    background-color: var(--cp-bg);
    color: var(--cp-primary);
    text-align: center;
    padding: 15px 0;
    border-radius: 8px;

    .cp-icon {
        font-size: 24px;
    }
}

.patient-tip {
    color: var(--cp-tag);
    padding: 12px 0;
}
</style>