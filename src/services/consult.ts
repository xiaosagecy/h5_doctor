import type { KnowledgePage, KnowledgeParams, DoctorPage, PageParams, FollowType, TopDep, Image, ConsultOrderPreData, ConsultOrderPreParams, PartialConsult, ConsultOrderItem } from '@/types/consult'
import { request } from '@/utils/request'


// 获取知识列表信息
export const getKonwledgePage = (params: KnowledgeParams) =>
    request<KnowledgePage>('/patient/home/knowledge', 'get', params)


// 获取推荐关注医生
export const getDoctorPage = (params: PageParams) =>
    request<DoctorPage>('/home/page/doc', 'get', params)


// 关注医生/取消关注
export const followDoctor = (id: string, type: FollowType = 'doc') =>
    request('/like', 'post', { id, type })


// 获取全部科室
export const getAllDep = () => request<TopDep[]>('/dep/all')


// 上传图片
export const uploadImage = (file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    return request<Image>('/upload', 'post', fd)
}


// 拉取预支付订单信息
export const getConsultOrderPre = (params: ConsultOrderPreParams) =>
    request<ConsultOrderPreData>('/patient/consult/order/pre', 'GET', params)


// 生产订单
export const createConsultOrder = (data: PartialConsult) =>
    request<{ id: string }>('/patient/consult/order', 'post', data)


// 获取支付地址  0 是微信  1 支付宝
export const getConsultOrderPayUrl = (params: {
    paymentMethod: 0 | 1
    orderId: string
    payCallback: string
}) => request<{ payUrl: string }>('/patient/consult/pay', 'POST', params)


// 获取问诊订单信息
export const getConsultOrderDetail = (orderId: string) =>
    request<ConsultOrderItem>('/patient/consult/order/detail', 'GET', { orderId })



