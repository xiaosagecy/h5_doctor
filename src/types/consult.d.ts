import { ConsultType, Illnesstime, OrderType } from '@/enums'
import type { Patient } from './user'
// 文章类型，关注医生的文章｜推荐的文章｜减脂｜饮食
export type KnowledgeType = 'like' | 'recommend' | 'fatReduction' | 'food'

// 文章信息类型
export type Knowledge = {
    id: string
    title: string
    coverUrl: string[]
    topics: string[]
    collectionNumber: number
    commentNumber: number
    creatorName: string
    creatorAvatar: string
    creatorHospatalName: string
    likeFlag: 0 | 1
    content: string
    creatorDep: string
    creatorTitles: string
    creatorId: string
}

// 文章列表
export type KnowledgeList = Knowledge[]

// 文章列表带分页
export type KnowledgePage = {
    pageTotal: number
    total: number
    rows: KnowledgeList
}

// 文章列表查询参数
export type KnowledgeParams = {
    type: KnowledgeType
    current: number
    pageSize: number
}

// 通用的分页查询参数
export type PageParams = {
    // 当前页码
    current: number
    // 每页条数
    pageSize: number
}

// 文章列表查询条件
export type KnowledegParams = PageParams & {
    // 文章类型
    type: KnowledgeType
}

// 医生卡片对象
export type Doctor = {
    // 医生ID
    id: string
    // 医生名称
    name: string
    // 头像
    avatar: string
    // 医院名称
    hospitalName: string
    // 医院等级
    gradeName: string
    // 科室
    depName: string
    // 职称
    positionalTitles: string
    // 是否关注，0 未关注 1已关注
    likeFlag: 0 | 1
    // 接诊服务费
    serviceFee: number
    // 接诊人数
    consultationNum: number
    // 评分
    score: number
    // 主攻方向
    major: string
}

// 医生列表
export type DoctorList = Doctor[]

// 医生分页
export type DoctorPage = {
    pageTotal: number
    total: number
    rows: DoctorList
}

// 关注的类型，医生｜文章｜百科话题｜疾病
export type FollowType = 'doc' | 'knowledge' | 'topic' | 'disease'

// 问诊订单（记录）类型
export type Image = {
    id: string
    url: string
}
export type Consult = {
    id: string
    // 就诊类型1找医生 2极速问诊 3开药问诊默认是1
    type: ConsultType
    // 使用优惠券，必传可使用优惠券id
    couponId: string
    // 极速问诊类型：0普通1三甲
    illnessType: 0 | 1
    // 患者id,用于关联患者信息
    patientId: string
    // 选择的科室id-极速问诊必填(选择的科室)
    depId: string
    // 病情--症状描述
    illnessDesc: string
    // 找医生/极速问诊-患病时间1一周内2一月内3半年内4半年以上
    illnessTime: ConsultTime
    // 找医生/极速问诊-是否就诊过0未就诊1就诊过
    consultFlag: 0 | 1
    // 补充病例信息-图片集合
    pictures: Image[]
}

// Partial 把对象类型的属性全部转换为可选属性  --- Required把对象全部属性转换成必选属性
export type PartialConsult = Partial<Consult>


// 科室
export type SubDep = {
    // 科室ID
    id: string
    // 科室名称
    name: string
}

export type TopDep = SubDep & {
    // 二级科室数组
    child: SubDep[]
}

export type ConsultIllness = Pick<PartialConsult, 'illnessDesc' | 'illnessTime' | 'consultFlag' | 'pictures'>

// 问诊订单预支付传参
export type ConsultOrderPreParams = Pick<PartialConsult, 'type' | 'illnessType'>

// 问诊订单预支付信息
export type ConsultOrderPreData = {
    // 积分抵扣
    pointDeduction: number
    // 优惠券抵扣
    couponDeduction: number
    // 优惠券ID
    couponId: string
    // 需付款
    payment: number
    // 实付款
    actualPayment: number
}

// 问诊订单单项信息
export type ConsultOrderItem = Consult & {
    // 创建时间
    createTime: string
    // 医生信息
    docInfo?: Doctor
    // 患者信息
    patientInfo: Patient
    // 订单编号
    orderNo: string
    // 订单状态
    status: OrderType
    // 状态文字
    statusValue: string
    // 类型问诊文字
    typeValue: string
    // 倒计时时间
    countdown: number
    // 处方ID
    prescriptionId?: string
    // 评价ID
    evaluateId: number
    // 应付款
    payment: number
    // 优惠券抵扣
    couponDeduction: number
    // 积分抵扣
    pointDeduction: number
    // 实付款
    actualPayment: number
}


// 问诊记录查询参数
type ConsultOrderParams = PageParams & {
    type: ConsultType
}

// 问诊记录分页数据
type ConsultOrderPage = {
    total: number
    pageTotal: number
    rows: ConsultOrderItem[]
}