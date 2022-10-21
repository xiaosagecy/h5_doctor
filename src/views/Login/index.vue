<template>
    <div class="login-page">
        <cp-nav-bar right-text="注册" @click-right="$router.push('/register')"></cp-nav-bar>
        <div class="login-head">
            <h3>密码登录</h3>
            <a href="javascript:;">
                <span>短信验证码登录</span>
                <!-- 向右箭头 -->
                <van-icon name="arrow"></van-icon>
            </a>
        </div>
        <!-- form 表单 -->
        <van-form autocomplete="off" @submit="login">
            <van-field v-model="mobile" :rules="mobileRules" placeholder="请输入手机号" type="tel"></van-field>
            <van-field v-model="password" :rules="passwordRules" placeholder="请输入密码" :type="show ? 'text':'password'">
                <template #button>
                    <cp-icon @click="show = !show" :name="`login-eye-${show ? 'on' : 'off'}`"></cp-icon>
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
import { ref } from 'vue'
import { mobileRules, passwordRules } from '@/utils/rules'
import { Toast } from 'vant'
import { loginByPassword } from '@/services/use'
import { useUserStore } from '@/stores'
import { useRouter, useRoute } from 'vue-router'
const agree = ref(false)

// 表单数据
const mobile = ref('13230000001')
const password = ref('abc12345')
// 控制密码是否显示
const show = ref(false)

const store = useUserStore()
const router = useRouter()
const route = useRoute()

// 提交表单
const login = async () => {
    if (!agree.value) return Toast('请勾选我已同意')
    // 校验完毕，进行登录
    const res = await loginByPassword(mobile.value, password.value)
    store.setUser(res.data)
    // 如果有回调地址就进行回跳，没有则跳转到个人中心
    router.push((route.query.returnUrl as string) || '/user')
    Toast.success('登陆成功')
}
</script>

<style scoped lang="scss">
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
                color: var(--cp-primary);
                padding: 0 5px;
            }
        }
    }
}
</style>