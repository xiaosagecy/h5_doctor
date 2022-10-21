<template>
    <div class="login-page">
        <cp-nav-bar right-text="注册" @click-right="$router.push('/register')"></cp-nav-bar>
        <div class="login-head">
            <h3>{{ isPass ? '密码登录' :'短信验证码登录'}}</h3>
            <a href="javascript:;" @click="isPass = !isPass">
                <span>{{ !isPass ? '密码登录' :'短信验证码登录'}}</span>
                <!-- 向右箭头 -->
                <van-icon name="arrow"></van-icon>
            </a>
        </div>
        <!-- form 表单 -->
        <van-form autocomplete="off" @submit="login">
            <!-- 给手机号码绑定name使用vant表单提供的validate单项校验方法，如果全部没给name会进行全部表单项校验 -->
            <van-field v-model="mobile" name="mobile" :rules="mobileRules" placeholder="请输入手机号" type="tel"></van-field>
            <!-- 密码登录 -->
            <van-field v-if="isPass" v-model="password" :rules="passwordRules" placeholder="请输入密码"
                :type="show ? 'text':'password'">
                <template #button>
                    <cp-icon @click="show = !show" :name="`login-eye-${show ? 'on' : 'off'}`"></cp-icon>
                </template>
            </van-field>
            <!-- 验证码登录 -->
            <van-field v-else v-model="code" placeholder="短信验证码" :rules="codeRules">
                <template #button>
                    <span class="btn-send" @click="send">{{ time > 0 ? `${time}s后重新发送`:'发送验证码'}}</span>
                </template>
            </van-field>

            <div class="cp-cell">
                <van-checkbox v-model="agree">
                    <span>我已同意</span>
                    <a href="javascript:;">用户协议</a>
                    <span>及</span>
                    <a href="javascript:;">隐私条款</a>
                </van-checkbox>
            </div>
            <div class="cp-cell">
                <!-- 把button设置为原生submit类型按键 -->
                <van-button block round type="primary" native-type="submit">登 录</van-button>
            </div>
            <div class="cp-cell">
                <a href="javascript:;">忘记密码？</a>
            </div>
        </van-form>

        <div class="login-other">
            <!-- 分割线 -->
            <van-divider>第三方登录</van-divider>
            <div class="icon">
                <img src="@/assets/qq.svg" alt="">
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { onUnmounted, ref } from 'vue'
import { mobileRules, passwordRules, codeRules } from '@/utils/rules'
import { Toast, type FormInstance } from 'vant'
import { loginByPassword, sendMobileCode, loginByMobile } from '@/services/use'
import { useUserStore } from '@/stores'
import { useRouter, useRoute } from 'vue-router'
const agree = ref(false)

// 表单数据
const mobile = ref('13230000001')
const password = ref('abc12345')
// 控制密码是否显示
const show = ref(false)
// 是否密码登陆
const isPass = ref(true)
// 验证码
const code = ref('')

const store = useUserStore()
const router = useRouter()
const route = useRoute()

const time = ref(0)
let timeId: number
const form = ref<FormInstance>()

// 提交表单
const login = async () => {
    if (!agree.value) return Toast('请勾选我已同意')
    // 校验完毕，进行登录 判断是用密码登录还是验证码登陆
    const res = isPass.value
        ? await loginByPassword(mobile.value, password.value)
        : await loginByMobile(mobile.value, code.value)
    store.setUser(res.data)
    // 如果有回调地址就进行回跳，没有则跳转到个人中心
    router.push((route.query.returnUrl as string) || '/user')
    Toast.success('登陆成功')
}

// 发送登陆验证码
const send = async () => {
    // 进入倒计时，如果大于0证明正在发送验证码，此时允许再次发送验证码
    if (time.value > 0) return
    // 验证不通过报错，阻止程序继续执行
    // 上面给手机号单独绑定了 name='mobile' 用于表单校验
    await form.value?.validate('mobile')
    await sendMobileCode(mobile.value, 'login')
    Toast.success('发送成功')
    time.value = 60
    // 进行倒计时
    clearInterval(timeId)
    timeId = window.setInterval(() => {
        time.value--
        if (time.value <= 0) window.clearInterval(timeId)
    }, 1000)
}

// 组件销毁/卸载清除定时器
onUnmounted(() => {
    window.clearInterval(timeId)
})
</script>

<style scoped lang="scss">
@import '@/styles/main.scss';

.login {
    &-page {
        padding-top: 46px;
    }

    &-head {
        padding: 30px 30px 50px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        line-height: 1;

        h3 {
            font-weight: normal;
            font-size: 24px;
        }

        a {
            font-size: 15px;
        }
    }

    &-other {
        margin-top: 60px;
        padding: 0 30px;

        .icon {
            display: flex;
            justify-content: center;

            img {
                width: 36px;
                height: 36px;
                padding: 4px;
            }
        }
    }
}

.van-form {
    padding: 0 14px;

    .cp-cell {
        height: 52px;
        line-height: 24px;
        padding: 14px 16px;
        box-sizing: border-box;
        display: flex;
        align-items: center;

        .van-checkbox {
            a {
                color: #4187f2;
                padding: 0 5px;
            }
        }
    }

    .btn-send {
        color: #4187f2;

        &.active {
            color: rgba(22, 194, 163, 0.5);
        }
    }
}
</style>