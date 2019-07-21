---
title: 9102全员学Vue--3.把页面拼成个Web应用
date: 2019-07-21 14:17:18
categories: vue八宝粥
tags: 教程
---
本节内容主要介绍使用 vue-router 来管理路由，包括应用和路由的设计和配置、页面间跳转、路由鉴权等。然后将上一节拼出来的页面，再拼出来一个完整的 Web 应用叭。
<!--more-->

# Vue 应用概念
我们[第一节内容](https://godbasin.github.io/2019/06/27/vue-for-everyone-1/)里，最后用[Vue CLI](https://cli.vuejs.org/zh/)生成了一个 demo，我们称之为一个 Web 应用。

## 单页应用
单页应用这个概念，是随着前几年 AngularJS、React、Ember 等这些框架的出现而出现的。[第一节内容](https://godbasin.github.io/2019/06/27/vue-for-everyone-1/)里，我们在页面渲染中讲了页面的局部刷新，而单页应用则是使用了页面的局部刷新的能力，在切换页面的时候刷新页面内容，从而获取更好的体验。

### SPA 与 MPA
单页应用（SinglePage Web Application，SPA）和多页应用（MultiPage Application，MPA）的区别可以参考：

| - | 单页面应用 | 多页面应用 |
| - | - | - |
| 组成 | 一个外壳页面和多个页面片段组成 | 多个完整页面构成 |
| 资源共用(css,js) | 共用，只需在外壳部分加载 | 不共用，每个页面都需要加载 |
| 刷新方式 | 页面局部刷新或更改 | 整页刷新 |
| url 模式 | a.com/#/pageone<br>a.com/#/pagetwo | a.com/pageone.html<br>a.com/pagetwo.html |
| 用户体验 | 页面片段间的切换快，用户体验良好 | 页面切换加载缓慢，流畅度不够，用户体验比较差 |
| 页面跳转动画 | 容易实现 | 无法实现 |
| 数据传递 | 容易 | 依赖 url 传参、或者 cookie 、localStorage 等 |
| 搜索引擎优化(SEO) | 需要单独方案、实现较为困难、不利于SEO检索 可利用服务器端渲染(SSR)优化 | 实现方法简易 |

> 以上表格内容来自[《前端：你要懂的单页面应用和多页面应用》](https://juejin.im/post/5a0ea4ec6fb9a0450407725c)，个人认为整理得挺到位的。

### 其他应用
所以其实可以看到，应用和页面的关系，可以简单地理解为多个页面拼成一个应用的关系。应用也分很多种噢，前端里最常见的是浏览器中的 Web 应用，除了这个以外，还有[渐进式 Web 应用（Progressive Web Apps，PWA）](https://developer.mozilla.org/zh-CN/docs/Web/Progressive_web_apps)，以及原生应用、移动应用。原生应用这些年也有很火的框架出现，像 React Native，Flutter 和 Xamarin 这样的框架允许使用不同于每种标准本地语言的语言来开发所有平台的本地应用程序。

从产品的角度来说，一个应用可以理解为给用户提供一套完整的定向服务，会包括用户登录、服务分类（Tab）、交互设计和内容展示等等。从工程项目的角度来看，包括用户身份管理、页面管理、路由管理、应用状态管理等。

这一节内容，我们主要来讲路由管理，也就是会把[上一节内容](https://godbasin.github.io/2019/07/11/vue-for-everyone-2/)中拼好的一个个页面，串成一个完整的应用。
> 原谅我脑袋里忽然想起了小虎队的“把你的心我的心，串一串，串一株幸运草，串一个同心圆”

## 页面划分
在直接讲我们的路由怎么配置前，我们需要先知道我们的应用要怎么划分，路由和页面路径是一一对应的，所以我们需要先设计应用的页面逻辑。我们要知道怎么设计一个应用，或者说根据已有的产品、设计交互，怎么规划我们项目的结构。

我们看看上一节的[页面效果](http://vue-for-everyone.godbasin.com/2/index.html)：
![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/vue-for-everyone-2-1.jpg)

### 页面结构设计
这是常用的一种管理端页面结构，我们可以基于这样的页面设计几种类型的页面拼装：

| 序号 | 页面形式 | 页面能力 |
| - | - | - |
| 1 | 登录页 | 只有用户名和密码的输入|
| 2 | 列表 + 表单 | 单页可以完成某类服务的增删查改|
| 3 | 列表页 | 只有列表展示，提供查和删服务，需要配合 4 的表单页完成增和改|
| 4 | 表单页 | 只有表单编辑内容，可提供新增、修改等能力给 3 使用|

上述 2-4 结构的页面，可以配合路由，整理出这样的菜单信息：
![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/vue-for-everyone-3-2.jpg)

### 页面路由设计
上述情况下，以`/`作为根路由（对应的组件为 App.vue），我们设计这么几种路由和页面：

| 路由 | 页面内容 | 页面对应的 Component | 页面组成 |
| - | - | - | - |
| `/login` | 登录页 | Login | 表单，包括`username`和`password` |
| `/home` | 应用首页 | Home | 左侧菜单`<Menu>`，右侧路由内容`<router-view>` |
| `/home/service` | 服务信息页 | Service | 为 Home 的子路由组件，包括列表和表单 |
| `/home/product` | 产品容器页 | Product | 为 Home 的子路由组件，包括`<router-view>` |
| `/home/product/list` | 产品信息页 | ProductList | 为 Product 的子路由组件，包括列表 |
| `/home/product/edit` | 产品编辑页 | ProductEdit | 为 Product 的子路由组件，包括表单 |

页面结构和路由嵌套管理，其实是这样的：

``` cmd
/login                     /home                     /home/service  
+------------------+       +-----------------+       +-----------------+
| App              |       | App             |       | App             |
| +--------------+ |       | +-------------+ |       | +-------------+ |
| | Login        | |       | | Home        | |       | | Home        | |
| |              | |       | |             | |       | | +---------+ | |
| |              | |  +--) | |<router-view>| |  +--) | | | Service | | |
| |              | |       | |  无对应内容  | |       | | |列表+表单 | | |
| |              | |       | |             | |       | | +---------+ | |
| +--------------+ |       | +-------------+ |       | +-------------+ |
+------------------+       +-----------------+       +-----------------+


      /home/product                /home/product/list              /home/product/edit
      +---------------------+      +------------------------+      +------------------------+
      | App                 |      | App                    |      | App                    |
      | +-----------------+ |      | +--------------------+ |      | +--------------------+ |
      | | Home            | |      | | Home               | |      | | Home               | |
      | | +-------------+ | |      | | +----------------+ | |      | | +----------------+ | |
 +--) | | | Product     | | | +--) | | | Product        | | | +--) | | | Product        | | |
      | | |<router-view>| | |      | | | +------------+ | | |      | | | +------------+ | | |
      | | |  无对应内容  | | |      | | | | ProductList| | | |      | | | | ProductEdit| | | |
      | | |             | | |      | | | | 单列表页    | | | |      | | | | 单表单页    | | | |
      | | |             | | |      | | | +------------+ | | |      | | | +------------+ | | |
      | | +-------------+ | |      | | +----------------+ | |      | | +----------------+ | |
      | +-----------------+ |      | +--------------------+ |      | +--------------------+ |
      +---------------------+      +------------------------+      +------------------------+

      (=′∇`=）画这个图累死俺了
```

我们能看到，这里包括了层层的路由嵌套关系，我们后面在配置路由的时候也能看到这样的结构。

### 目录结构划分
我们看到上面的路由划分示意图，使用框框框起来的代表一个 Vue component，而在 Vue 中，其实一切皆组件（页面是特殊的组件），那我们要怎么区分页面和组件呢，一般可以使用项目目录来简单做一些划分：

``` cmd
├─dist                      // 编译之后的项目文件
├─src                       // 开发目录
│  ├─assets                 // 静态资源
│     ├─less                // 公共less
│     ├─img                 // 图片资源
│  ├─components             // **放这里是组件**
│  ├─pages                  // **放这里是页面** 根据路由结构划分
│  ├─utils                  // 工具库
│  ├─App.vue                // 启动页面，最外层容器组件
│  ├─main.js                // 入口脚本
├─babel.config.js          // babel 配置文件
├─vue.config.js            // vue 自定义配置，与 webpack 配置相关
├─package.json             // 项目配置
├─README.md                // 项目说明
```

目录结构清晰，其实对一个项目的可维护性非常重要，一眼看去你就知道这个项目大概包括了哪些内容，分别都放在哪里。好看的目录结构和命名，和好看的代码结构和命名一样，已经是天然的说明了，这是很好的编码习惯呢。

好了，项目目录和路由结构我们划分好了，我们来看看怎么根据上面的设计来配置路由，以及实现相互跳转吧。

## 路由配置
Vue 框架本身的定位是核心关注视图层，所以路由配置、状态管理、其他千奇百怪的测试、mock功能等都不是自带的，我们需要自己找到对应的开源库配合使用（像 angular 这种大而全的框架，则会提供了开箱即用的完整功能，适合大型项目使用）。例如与 Vue 结合的路由管理，一般选择 [vue-router](https://router.vuejs.org/zh/)。

### 使用开源库和工具
这里顺便介绍下前端怎么找开源库和工具，包括几种途径：
1. google 搜 `vue router`。（没有爬墙工具的小伙伴，可以使用 [bing](https://cn.bing.com/) 噢）
2. 在 [github](https://github.com/) 上搜 `vue router`。
3. 去 [npm](https://www.npmjs.com/) 上找 `vue router` 资源包。（因为前端开源都是基于 npm 包管理，所以基本上都能在 npm 里找到）

如图：
![搜索开源库和工具](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/vue-for-everyone-3-1.jpg)

### 安装和引入 vue-router
其实官方文档也有介绍怎么安装和使用，这里再简单介绍一下哈：

#### 1. 安装依赖

``` cmd
# 安装依赖
npm install vue-router
```

#### 2. 引入 vue-router

``` js
// main.js
import Vue from 'vue';
// 引入 vue-router
import VueRouter from 'vue-router';
Vue.use(VueRouter); // 使用 vue-router
```

### 使用 vue-router 添加路由
这里我们根据前面的应用设计，讲一下要怎么配置，vue-router 怎么使用。

#### 1. 配置路由信息
根据以上的嵌套关系，我们可以设置最外层的根路由为`"/"`，加上其他嵌套子路由配置为：

``` js
// 配置路由信息
// 每个路由应该映射一个组件。 其中"component" 可以是
// 通过 Vue.extend() 创建的组件构造器，
// 或者，只是一个组件配置对象。
const routes = [
  {
    path: "/", // 父路由路径
    component: App, // 父路由组件，传入 vue component
    name: "App", // 路由名称
    // 设置子路由
    children: [
      { 
        path: "login", // 子路由路径
        component: Login, // 子路由组件，会替换父组件中<router-view>中的内容
        name: "Login" // 路由名称
      },
      {
        // 应用首页
        path: "home", component: Home,  name: "Home",
        children: [
          // 服务列表
          { path: "service", component: Service, name: "Service" },
          // 产品容器
          { path: "product", component: Product, name: "Product",
            children: [ // 子路由内容
              // 产品列表
              { path: "list", component: ProductList, name: "ProductList" },
              // 产品新增
              { path: "add/0", component: ProductEdit, name: "ProductAdd" },
              // 产品编辑
              // 我们能看到，新增和编辑其实最终使用的是同一个组件，所以后面会有一些需要兼容处理的地方
              // :id可匹配任意值，且可在组件中通过this.$route.params.id获取该值
              { path: "edit/:id", component: ProductEdit, name: "ProductEdit" }
            ]
          }
        ]
      }
    ]
  }
];
```

#### 2. Vue 中加载 vue-router 和路由信息
路由配置设计好之后，我们可以通过将 router 配置参数注入路由，让整个应用都有路由功能：

``` js
// 加载路由信息
const router = new VueRouter({
  // mode: 路由模式，'hash' | 'history'
  // routes：传入路由配置信息，后面会讲怎么配置
  routes // （缩写）相当于 routes: routes
});
// 启动一个 Vue 应用
new Vue({
  el: "#app",
  router, // 传入路由能力
  render: h => h(App)
});
```

这里的[路由模式-mode](https://router.vuejs.org/zh/api/#mode)包括两种：
- `hash`
  - 使用 URL hash 值来作路由。支持所有浏览器，包括不支持 HTML5 History Api 的浏览器
  - 例如上面说的`a.com/#/pageone`，便是 hash 模式
- `history`
  - 充分利用 history.pushState API 来完成 URL 跳转而无须重新加载页面
  - 例如`a.com/pageone`，如果觉得 hash 模式丑可以使用这种
  - **注意！！**依赖 [HTML5 History API 和服务器配置](https://router.vuejs.org/zh/guide/essentials/history-mode.html#html5-history-%E6%A8%A1%E5%BC%8F)

到这里，我们路由配置和启动的部分已经完成，可以在 [main.js](https://github.com/godbasin/vue-element-demo/blob/master/3/src/main.js) 文件查看完整代码。

#### 3. `<router-view>`使用
`<router-view>`组件是一个 functional 组件，渲染路径匹配到的视图组件。它渲染的组件还可以内嵌自己的`<router-view>`，根据嵌套路径，渲染嵌套组件。

我们来看看`<router-view>`的使用，这里以`App.vue`和`Home.vue`作为例子：

``` html
<!-- 这里是最外层 /app 路由的组件，App.vue -->
<template>
  <!-- 使用 <router-view></router-view> 来嵌套路由 -->
  <router-view></router-view>
</template>

<!-- 这里是 /app/home 路由的组件，Home.vue -->
<!-- 这里采用了简写，省略了一些非关键内容，更多内容可以参考上一节 -->
<template>
  <el-container>
    <!-- 左侧菜单, Menu.vue -->
    <Menu></Menu>
    <!-- 右侧内容 -->
    <el-container>
      <!-- 上边的头部栏 -->
      <el-header></el-header>
      <!-- 子路由页面的内容 -->
      <router-view></router-view>
    </el-container>
  </el-container>
</template>
```

#### 4. `<router-link>`使用
[上一节内容](https://godbasin.github.io/2019/07/11/vue-for-everyone-2/)中我们拼了这么一个页面：
![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/vue-for-everyone-2-1.jpg)

大家[查看页面效果](http://vue-for-everyone.godbasin.com/2/index.html)的时候会发现，左侧的菜单点击没有什么反应，因为我们还没有加上路由。那么现在就使用这里的菜单，来展示下`<router-link>`的使用吧。

``` html
<!-- 这里是 Menu.vue，即上一节内容种拼的左侧菜单 -->
<!-- 这里主要针对路由相关内容，更多的注释省略了，有需要可查看最终代码 -->
<template>
  <!-- 此处有个 default-active 属性需要注意，是用来设置菜单的选中样式，我们需要根据当前路由情况来选中 -->
  <el-menu :collapse="isMenuCollapse" :default-openeds="['0', '1']" :default-active="activeIndex">
    <!-- 遍历生成父菜单选项 -->
    <template v-for="menu in menus">
      <!-- 有子菜单的时候 -->
      <el-submenu v-if="menu.subMenus && menu.subMenus.length" :index="menu.index" :key="menu.index"
      >
        <template slot="title">
          <i :class="menu.icon"></i>
          <span slot="title">{{menu.text}}</span>
        </template>
        <el-menu-item-group>
          <!-- 使用 router-link 组件来导航. -->
          <!-- 通过传入 `to` 属性指定链接. -->
          <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
          <router-link tag="div" v-for="subMenu in menu.subMenus"
            :key="subMenu.index" :to="{name: subMenu.routerName}">
          <el-menu-item :index="subMenu.index">{{subMenu.text}}</el-menu-item>
          </router-link>
        </el-menu-item-group>
      </el-submenu>
      <!-- 只有单个父菜单的时候，也要给这个父菜单添加路由，同样的 to 指向要去的地方 -->
      <router-link v-else :index="menu.index" :key="menu.index" tag="div" :to="{name: menu.routerName}">
        <!-- 没子菜单的时候，就用 el-menu-item，也要绑个序号 index -->
        <el-menu-item>
          <i :class="menu.icon"></i>
          <span slot="title">{{menu.text}}</span>
        </el-menu-item>
      </router-link>
    </template>
  </el-menu>
</template>
```

`<router-link>`的使用，除了通过 name 来跳转之外，还可通过 path 跳转、带上参数、激活样式、tag 设置等：
- to: 一个路径字符串, 或者一个对象 location descriptor
- tag: 渲染成的html元素类型，默认是
- exact: 用于控制当前激活项的行为
- append: 控制相对链接路径的追加方式
- replace: 替代而不是作为历史条目压榨
- active-class: 当链接项激活时增加的 CSS 样式

更多的大家可以参考[官网 router-link API](https://router.vuejs.org/zh/api/#router-link)。也可以在 [Menu.vue](https://github.com/godbasin/vue-element-demo/blob/master/3/src/components/Menu.vue) 文件查看 Menu 组件的完整代码。

#### 5. 使用 watch 监控路由变化
对应的，我们需要在 menus 里加上 routerName，用来跳转：

``` js
// routerName 为对应的路由的路由名称
const menus = [
  {
    text: "服务管理", icon: "el-icon-setting",
    subMenus: [{ text: "服务信息", routerName: 'Service' }]  
  },
  {
    text: "产品管理", icon: "el-icon-menu",
    subMenus: [
        { text: "产品信息", routerName: 'ProductList' }, 
        { text: "新增", routerName: 'ProductAdd' }
    ]
  },
  // 日志信息这里为空，则不会进行跳转
  { text: "日志信息", icon: "el-icon-message", routerName: '' }
].map((x, i) => {
  // 添加 index，可用于默认展开 default-openeds 属性，和激活状态 efault-active 属性的设置
  return {
    ...x,
    // 子菜单就拼接${父菜单index}-${子菜单index}
    subMenus: (x.subMenus || []).map((y, j) => {
      return { ...y, index: `${i}-${j}` };
    }),
    // 父菜单就把 index 加上好了
    index: `${i}`
  };
});
```

根据[el-menu的配置](https://element.eleme.io/#/zh-CN/component/menu#menu-attribute)我们知道，`<el-menu>`的`default-active`属性需要设置当前激活菜单的 index，因此我们需要监控路由的变化，并根据路由情况调整绑定的激活 index。

``` js
// 下面是 Vue 组件
export default {
  data() {
    return {
      menus, // menus: menus 的简写
      activeIndex: ''
    };
  },
  watch: {
    // 为了设置 el-menu 的 default-active 属性，需要获取到路由状态
    '$route' (to) {
      // 对路由变化作出响应...
      let activeIndex;
      // 找到匹配的 routerName
      this.menus.forEach(x => {
        if(x.routerName === to.name){
          activeIndex = x.index;
        }else{
          const subMenuItem = x.subMenus.find(y => y.routerName === to.name);
          if(subMenuItem){ activeIndex = subMenuItem.index; }
        }
      });
      // 并将 activeIndex 设置为对应的 菜单 index
      if(activeIndex){
        this.activeIndex = activeIndex;
      }
    }
  }
};
```

我们看到，这里使用了一个叫 watch 的属性。Vue 中监听属性 watch 和计算属性 computed 也是很常用的能力（能节省不少的代码），衍生的其他依赖状态就可以使用 computed 来处理，而某种状态的变更可以使用 watch 监听。这里篇幅关系不多说，大家可以去翻阅下[官方文档]((https://cn.vuejs.org/v2/guide/computed.html))。

#### 6. 路由跳转
除了使用`<router-link>`来定义导航链接，我们还可以借助 router 的实例方法，通过编写代码来实现。在 Vue 实例内部，我们可以通过 $router 访问路由实例，例如我们在 ProductList 页面需要跳转到 ProductEdit 页面来编辑/新增选项内容：

``` js
export default {
  // ...其他省略
  methods: {
    // 新增/修改一个数据
    updateTableItem(id = 0){
      // 跳转到编辑页面，新增则传id为0，否则为编辑
      // 可以通过 this.$router 访问路由实例
      if(id !== 0){
        // 传参 name 为路由名字，params 为我们定义的路由 path 的参数，变成 /edit/xxx
        // 还有另外一种传参方式 query，带查询参数，变成 /edit?id=xxx
        this.$router.push({name: 'ProductEdit', params: {id}})
      }else{
        this.$router.push({name: 'ProductAdd'})
      }
    },
  }
}
```

router 实例的使用和`<router-link>`其实很相像，也挺简单的，可以参考[编程式的导航](https://router.vuejs.org/zh/guide/essentials/navigation.html)。

### 给路由添加鉴权
既然我们这一次设计了登录页和应用首页（请各位根据[第二节内容](https://godbasin.github.io/2019/07/11/vue-for-everyone-2/)分别自行拼出来），一般来说，我们会设计只有当登录完成之后，才可以进入应用里面的其他页面。

#### 1. 设置简单的全局数据
一般来说，在 Vue 中会使用 Vuex 来管理数据状态。基于本节内容主要讲 vue-router，所以我们简单设计一个全局数据的管理库：

``` js
// globalData.js
// globalData 用来存全局数据
let globalData = {};

// 获取全局数据
// 传 key 获取对应的值
// 不传 key 获取全部值
export function getGlobalData(key){
    return key ? globalData[key] : globalData;
}

// 设置全局数据
export function setGlobalData(key, value){
    // 需要传键值对
    if(key === undefined || value === undefined){
        return;
    }
    globalData = {...globalData, [key]: value}
    return globalData;
}

// 清除全局数据
// 传 key 清除对应的值
// 不传 key 清除全部值
export function clearGlobalData(key){
    // 需要传键值对
    if(key === undefined){
        globalData = {};
    }else{
        delete globalData[key];
    }
    return globalData;
}
```

使用这种方式的全局数据，是会在页面刷新之后丢失的。而如果用来存用户的登录态信息，为了避免频繁登录，更好的方式是存到 cookie 或者缓存里。

#### 2. 登录页面登录
拼好的页面可以查看 [Login.vue](https://github.com/godbasin/vue-element-demo/blob/master/3/src/pages/Login.vue) 文件，这里由于篇幅关系，我们只看保存数据和跳转的部分：

``` js
import {setGlobalData} from 'utils/globalData';

// 下面是 Vue 组件
export default {
  // ...其他省略
  methods: {
    // 提交新增/修改表单
    onSubmit(){
      // 校验表单，用户名和密码都必须填入
      // Element 表单校验规则配置，请查看https://element.eleme.cn/#/zh-CN/component/form
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // 校验通过
          // 设置用户名
          setGlobalData('username', this.form.username);
          // 跳转到里页
          this.$router.push({name: "Home"});
        } else {
          // 校验失败
          return false;
        }
      });
    }
  }
};
```

#### 3. 鉴权进入内页
这里，我们需要使用 vue-router 的[导航守卫](https://router.vuejs.org/zh/guide/advanced/navigation-guards.html#%E5%85%A8%E5%B1%80%E5%89%8D%E7%BD%AE%E5%AE%88%E5%8D%AB)能力，当用户未登录时，则拒绝进入其他路由页面里：

``` js
// main.js
import { getGlobalData } from "utils/globalData";

router.beforeEach((to, from, next) => {
  if (to.name !== "Login") {
    // 非 login 页面，检查是否登录
    // 这里简单前端模拟是否填写了用户名，真实环境需要走后台登录，缓存到本地
    if (!getGlobalData("username")) {
      next({ name: "Login" });
    }
  }
  // 其他情况正常执行
  next();
});
```

到这里，我们整个应用可以顺利地跑起来了：
- [页面的效果查看](http://vue-for-everyone.godbasin.com/3/index.html)
- [页面代码查看](https://github.com/godbasin/vue-element-demo/tree/master/3)

## 结束语
---
很多人会谈到程序员的天花板，前端开发也喜欢谈前端开发的天花板。我们总以为自己所经历的是最艰难的，其实每个人都是一样的。工地的建筑工人、快递外卖小哥、各行各业都有各自的难处，人只要想要往上走，总是要爬坡的。
自我感动取之便捷，又容易上瘾，我们绝不能走到半山腰上就嚎啕大哭。