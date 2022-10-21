import type { User, CodeType } from '@/types/user'
import { request } from '@/utils/request'

// 密码登录
export const loginByPassword = (mobile: string, password: string) =>
    request<User>('/login/password', 'post', { mobile, password })

// 发送验证码
export const sendMobileCode = (mobile: string, type: CodeType) =>
    request('/code', 'get', { mobile, type })