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



### 身份证脱敏处理

```ts
'11111111111111111'.replace(/^(.{6})(?:\d+)(.{4})$/, '\$1******\$2')
// 处理后 '111111******1111'
```

身份证脱敏处理：`/^(.{6})(?:\d+)(.{4})$/`

- 匹配第一个$1 `^(.{6})`
- `?:` 不作为匹配结果存储
- 匹配第二个$2 `(.{4})$`

说明：身份证前6位和后4位显示，其余用*代替



### 回顾Vue3 v-model语法糖

```vue
<com-a v-model="count"></com-a>
<!-- 等价 -->
<com-a :modelValue="count" @update:modelValue="count=$event"></com-a>
```

```vue
<com-a v-model:msg="str"></com-a>
<!-- 等价 -->
<com-a :msg="str" @update:msg="str=$event"></com-a>
```

- vue3中只需要 `v-model` 指令可以支持对个数据在父子组件同步，不再支持 `.sync` 语法。

- vue3 中 v-model 语法糖
  - `:modelValue="count"` 和 `@update:modelValue="count=$event"`
- vue3 中 v-model:xxx 语法糖
  - `:xxx="count"` 和 `@update:xxx="count=$event"`
  - 其中$event就是子组件传给父组件的参数值.


  ### linear-gradient()
  函数用于创建一个表示两种或多种颜色线性渐变的图片
  渐变轴为180度
  background: linear-gradient(180deg,rgba(62,206,197,0.85),#26bcc6);

  ### 下拉加载更多
  List 组件通过 loading 和 finished 两个变量控制加载状态，当组件滚动到底部时，会触发 load 事件并将 loading 设置成 true。此时可以发起异步操作并更新数据，数据更新完毕后，将 loading 设置成 false 即可。若数据已全部加载完毕，则直接将 finished 设置成 true 即可。

### @vueuse/core 应用
```
如果遇见一些常见的需求可以先看看 @vueuse/core 是否提供，这样可以提高开发效率。
如果：窗口尺寸，滚动距离，是否进入可视区，倒计时，...等等。

```