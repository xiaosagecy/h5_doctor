import type { KnowledgePage, KnowledgeParams, DoctorPage, PageParams } from '@/types/consult'
import { request } from '@/utils/request'


// 获取知识列表信息
export const getKonwledgePage = (params: KnowledgeParams) =>
    request<KnowledgePage>('/patient/home/knowledge', 'get', params)


// 获取推荐关注医生
export const getDoctorPage = (params: PageParams) =>
    request<DoctorPage>('/home/page/doc', 'get', params)



