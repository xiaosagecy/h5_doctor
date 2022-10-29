import type { User, CodeType, UserInfo, PatientList, Patient } from '@/types/user'
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

// 获取患者信息列表
export const getPatientList = () => request<PatientList>('/patient/mylist')

// 添加患者档案信息
export const addPatient = (patient: Patient) => request('/patient/add', 'post', patient)

// 编辑患者档案信息
export const editPatient = (patient: Patient) => request('patient/update', 'put', patient)


// 删除患者信息
export const delPatient = (id: string) => request(`/patient/del/${id}`, 'DELETE')

// 查询患者详情
export const getPatientDetail = (id: string) => request<Patient>(`/patient/info/${id}`)

