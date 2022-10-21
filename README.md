### 路由响应的映射
路由路径	路由级别	组件功能
/login	1	登录
/	1	布局容器
/user	②	个人中心
/user/patient	1	家庭档案
/user/address	1	地址管理
/home	②	首页
/consult/fast	1	快速问诊
/consult/dep	1	选择科室
/consult/illness	1	病情描述
/consult/pay	1	问诊支付
/room	1	问诊室
/user/consult	1	我的问诊
/user/consult/:id	1	问诊详情
/order/pay	1	药品订单支付
/order/pay/result	1	药品订单支付结果
/order	1	药品订单列表
/order/:id	1	药品订单详情
/order/logistics/:id	1	药品订单物流
/login/callback	1	QQ登录回跳
/article	②	健康百科
/notify	②	消息通知

### vant自动按需加载
需要按照插件，再配置vite.config.ts
```
# 通过 npm 安装
npm i unplugin-vue-components -D
# 通过 yarn 安装
yarn add unplugin-vue-components -D
# 通过 pnpm 安装
pnpm add unplugin-vue-components -D
```
`vite.config.ts`
```js
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'

plugins: [
    // 解析单文件组件的插件
    vue(),
    // 自动导入的插件，解析器可以是 vant element and-vue
    Components({
      // 不开起自动生成声明文件 dts: false
      dts: false,
      // 原因：Toast Confirm 这类组件的样式还是需要单独引入，样式全局引入了，关闭自动引入
      resolvers: [VantResolver({ importStyle: false })]
    })
  ],
```

### 怎么深层作用其他组件样式？
> ::v-deep(){ // 样式 }

### 项目中如何判断是否可以回退？
> history.state?.back

### 为什么可以不导入组件，反而直接使用组件呢？
> 使用了 unplugin-vue-components 默认 src/compoenents 自动导入注册

### 怎么给整个表单加校验？
> 按钮组件设置 native-type="submit"，表单组件绑定 @submit 事件

### TS两个内置类型 Pick与Omit
```ts
  type Person = {
    name: string
    age: number
  }
  //Pick:从Person类型中选出age属性
  type PickPerson = Pick<Person, 'age'>
  // PickPerson === { age: string }

  let obj:PickPerson = {
    age:11
  }
  
  // Omit:从Person类型中剔除age属性
  type OmitPerson = Omit<Person, 'age'>

  let obj2:OmitPerson = {
    name: 'zhangsan'
  }
```
>Pick作用：从类型对象中取出指定的属性类型
>Omit作用：从类型对象中排除掉指定的属性类型，得到剩下的

