---
title: Vue2使用笔记4--vue-router使用
date: 2016-11-27 12:17:00
categories: vue八宝粥
tags: 笔记
---
最近在使用Vue2作为项目中前端的框架，《Vue2使用笔记》系列用于记录过程中的一些使用和解决方法。
本文记录vue-router2的使用过程。
<!--more-->

## vue-router2.0的变化
---
### API的修改
- `router.go()`改为`router.push()`，使用`$router.push()`
- 新增`router.back()`、`router.forward()`

### 路由配置
- 所有路由配置都通过一个单独的对象传到Router的构造函数
- 路由配置现在用数组而不是用对象哈希表来作为数据结构
- 作废了一些配置项，修改了一些配置项，具体参考[可用配置选项](https://github.com/vuejs/vue-router/blob/43183911dedfbb30ebacccf2d76ced74d998448a/flow/declarations.js#L8-L16)

### 链接（Links）
v-link指令已经被<router-link>组件替代. 这个组件接受以下属性参数:
- to : 一个路径字符串, 或者一个对象location descriptor
- tag : 渲染成的html元素类型，默认是<a>
- exact : 用于控制当前激活项的行为
- append : 控制相对链接路径的追加方式
- replace : 替代而不是作为历史条目压榨
- active-class : 当链接项激活时增加的CSS样式

### 参考
还有一些本骚年暂时没有用到的变化，如滚动行为（Scroll Behavior）等。
[《vue-router 2.0 改变的内容》](https://segmentfault.com/a/1190000006623100?utm_source=tuicool&utm_medium=referral)
[vue-router 2官方文档](http://router.vuejs.org/zh-cn/index.html)

## vue-router的使用
---
这里我们简单创建一个嵌套路由，结合之前路由相关描述下vue-router的使用。

### 创建新组件用于路由匹配
这里本骚年添加几个文件：
- Services.vue：用于服务列表展示
- ServiceAdd.vue：用于服务创建或修改
- Logs.vue：用于日志列表展示

本节我们主要讲述路由的使用，故这些组件都使用最简单的模板表示不同组件。
``` vue
<template>
	<div>Services组件</div>
</template>

<script>
    export default {
        name: 'Sevices'
    }
</script>
```

### 添加App嵌套子路由
应用界面通常由多层嵌套的组件组合而成，URL中各段动态路径也按某种结构对应嵌套的各层组件。
接下来我们在main.js中定义嵌套子路由。
- 导入组件

``` js
import Services from './components/Services'
import ServiceAdd from './components/ServiceAdd'
import Logs from './components/Logs'
```

- 设置路由
要在嵌套的出口中渲染组件，需要在VueRouter的参数中使用children配置。

``` js
const routes = [
    { path: '/login', component: Login, name: 'Login' },
    {
        path: '/app',
        component: App,
        name: 'App',
        // 设置子路由
        children: [{
            // 服务列表
            path: 'services', 
            component: Services,
            name: 'Services'
        }, {
            // 添加服务
            path: 'add/service', 
            component: ServiceAdd,
            name: 'ServiceAdd'
        }, {
            // 编辑服务，:id可匹配任意值，且可在组件中获取该值
            path: 'edit/service/:id', 
            component: ServiceAdd,
            name: 'ServiceEdit'
        }, {
            // 日志列表
            path: 'logs',
            component: Logs,
            name: 'Logs'
        }, {
            // 其余路由重定向至服务列表
            path: '*',
            redirect: { name: 'Services' }
        }]
    },
    { path: '*', redirect: { name: 'Login' } }
]
```

- 在App组件中添加路由模板
vue-router2.0中，一个被渲染组件同样可以包含自己的嵌套<router-view>。

``` html
<!--右侧内容展示-->
<div class="right_col" role="main">
	<router-view></router-view>
</div>
```
这时候我们的应用已经支持路由跳转了，但在我们的左侧菜单中，部分链接跳转位于一级菜单，部分位于二级菜单。
这里我们设定当一级菜单跳转被点亮时，自动关闭下拉菜单，接下来我们将实现这个功能。

### 使用watch监控路由变化
- 在Sidebar组件中，添加watch来对每次路由跳转进行判断

``` js
watch: {
	$route() {
		// 检查是否一级菜单链接
		this.checkMenuActived(this.$route.path);
	}
}
```

- 添加checkMenuActived方法，来控制相关实现

``` js
methods: {
	...
	checkMenuActived(path) {
		// 遍历所有的一级菜单
		this.menus.forEach(item => {
			// 若非当前路由，则取消激活状态
			if (item.href && item.href !== path) {
				item.class = '';
			}
		});
	}
}
```

### 其他路由使用
- 使用`this.$router.push()`可在组件中控制路由跳转，Login组件中已实现
- 使用`<router-link></router-link>`可在组件模板中设定超链接进行挑战，在Sidebar组件中也已实现

### 页面最终效果
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1E1E.tmp.png)

### 参考
[Vue2.0中文文档](https://vuefe.cn/guide/)
[vue-router 2官方文档](http://router.vuejs.org/zh-cn/index.html)

## 结束语
-----
大家是不是觉得左侧的下拉菜单实现路由跟踪特别麻烦呢，其实这也是本骚年偷了个小懒，不想改动样式代码直接使用gentelella的样式。大家也可以想一下其他的一些实现方法的呀。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/vue2-notes/4-vue-router)
[此处查看页面效果](http://vue2-notes.godbasin.com/4-vue-router/index.html#/App)