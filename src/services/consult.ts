import type { KnowledgePage, KnowledgeParams, DoctorPage, PageParams, FollowType, TopDep, Image } from '@/types/consult'
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


