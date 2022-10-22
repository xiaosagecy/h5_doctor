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

// 个人信息
// 把User类型中的token属性剔除后剩下的属性赋值为 OmitUser类型
type OmitUser = Omit<User, 'token'>

export type UserInfo = OmitUser & {
    likeNumber: number
    collectionNumber: number
    score: number
    couponNumber: number
    orderInfo: {
        paidNumber: number
        receivedNumber: number
        shippedNumber: number
        finishedNumber: number
    }
}

// 家庭档案-患者信息
export type Patient = {
    // 患者ID
    id?: string
    // 患者名称
    name: string
    // 身份证号
    idCard: string
    // 0不默认 1默认
    defaultFlag: 0 | 1
    // 0女 1男
    gender: 0 | 1
    // 性别文字
    genderValue?: string
    // 年龄
    age?: number
}

// 家庭档案-患者信息列表
export type PatientList = patient[]