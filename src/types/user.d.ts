// 用户信息
export type User = {
    token: string
    id: string
    account: string
    mobile: string
    avatar: string
}

// 短信验证码类型，密码｜注册｜修改手机号｜忘记密码｜绑定手机号
export type CodeType = 'login' | 'register' | 'changeMobile' | 'forgetPassword' | 'bindMobile'
