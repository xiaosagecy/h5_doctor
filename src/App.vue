<template>
  <div>
    <van-button type="primary" @click="getUserInfo">获取个人信息</van-button>
    <van-button type="primary" @click="login">登录</van-button>
  </div>
</template>

<script setup lang='ts'>
import { Button as VanButton } from 'vant'
import { request } from '@/utils/request'
import type { User } from './types/user'
import { useUserStore } from '@/stores/index'

const store = useUserStore()

const getUserInfo = async () => {
  const res = await request('/patient/myUser')
  console.log(res)
}

const login = async () => {
  const res = await request<User>('/login/password', 'post', {
    mobile: '13211112222',
    password: 'abc12345'
  })
  store.setUser(res.data)
}
</script>

<style scoped>

</style>