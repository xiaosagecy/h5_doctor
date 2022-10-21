// 表单校验
const mobileRules = [
    { request: true, message: '请输入手机号' },
    // pattern通过正则表达式进行校验，正则无法匹配表示校验不通过
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
]

const passwordRules = [
    { request: true, message: '请输入密码' },
    { pattern: /^\w{8,24}$/, message: '密码需要8-24个字符' }
]

const codeRules = [
    { request: true, message: '请输入验证码' },
    { pattern: /^\d{6}$/, message: '输入6位验证码' }
]

export { mobileRules, passwordRules, codeRules }