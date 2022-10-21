import type { User, CodeType, UserInfo } from '@/types/user'
import { request } from '@/utils/request'

// 密码登录
export const loginByPassword = (mobile: string, password: string) =>
    request<User>('/login/password', 'post', { mobile, password })

// 发送验证码
export const sendMobileCode = (mobile: string, type: CodeType) =>
    request('/code', 'get', { mobile, type })

// 短信登录
export const loginByMobile = (mobile: string, code: string) =>
    request('/login', 'post', { mobile, code })

// 获取个人信息
export const getUserInfo = () => request<UserInfo>('/patient/myUser')
