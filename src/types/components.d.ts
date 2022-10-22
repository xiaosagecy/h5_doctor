// 让组建书写有提示

// 1.导入组件
import CpNavBar from '@/components/cp-nav-bar.vue'
import CpIcon from '@/components/CpIcon.vue'
import CpRadioBtn from '@/components/CpRadioBtn.vue'
// 2.声明vue类型模块
declare module 'vue' {
    // 3.给vue添加全局组件类型，interface和之前的合并
    interface GlobalComponents {
        // 4.定义具体组件类型，typeof 获取到组件实例类型
        // typeof 作用是得到对应的TS类型
        CpNavBar: typeof CpNavBar
        CpIcon: typeof CpIcon
        CpRadioBtn: typeof CpRadioBtn
    }
}

