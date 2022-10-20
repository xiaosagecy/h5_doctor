import { useUserStore } from '@/stores'
import router from '@/router'
import axios, { type Method } from 'axios'
import { Toast } from 'vant'

// 配置axios的基础配置
const baseURL = 'https://consult-api.itheima.net/'
const instance = axios.create({
    baseURL,
    timeout: 10000
})

// 请求拦截器，携带token
instance.interceptors.request.use(
    (config) => {
        const store = useUserStore()
        if (store.user?.token && config.headers) {
            config.headers['Authorization'] = `Bearer ${store.user?.token}`
        }
        return config
    },
    (err) => Promise.reject(err)
)

// 响应拦截器，拦截无效数据，401无权限拦截
instance.interceptors.response.use(
    (res) => {
        // 响应码不是10000 请求失败
        if (res.data?.code !== 10000) {
            Toast(res.data?.message)
            return Promise.reject(res.data)
        }
        // 请求成功，返回响应数据
        return res.data
    },
    (err) => {
        if (err.response.status === 401) {
            // 401token失效 不给再鉴权后请求 清空用户信息
            const store = useUserStore()
            store.delUser()
            // 跳转登陆，带上接口失效所在页面的地址，登录完后回跳使用
            router.push(`/login?returnUrl=${router.currentRoute.value.fullPath}`)
        }
        return Promise.reject(err)
    }
)

// 响应拦截使用了res.data,为将来响应成功后的结果
// 所以需要指定res.data的数据类型 request<数据类型,数据类型>()
type Data<T> = {
    code: number,
    message: string,
    data: T
}

// 导出一个通用的请求工具函数
const request = <T>(url: string, method: Method = 'get', submiData?: object) => {
    return instance.request<T, Data<T>>({
        url,
        method,
        [method.toLowerCase() === 'get' ? 'params' : 'data']: submiData
    })
}

export { baseURL, instance, request }