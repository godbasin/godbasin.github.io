---
title:  Vue使用笔记2--vue-router与创建登录组件
date: 2016-09-04 00:26:00
categories: vue八宝粥
tags: 笔记
---
最近在学习使用Vue作为前端的框架，《Vue使用笔记》系列用于记录过程中的一些使用和解决方法。
本文记录路由插件vue-router，以及搭建登录页面的过程。
<!--more-->

## vue-router
-----
在使用vue-router时，我们需要做的就是把路由映射到各个组件，vue-router会把各个组件渲染到正确的地方。

### 安装、起步
- 安装

``` bash
npm install vue-router --save
```

- 起步

### 基本用法
- HTML

``` html
<div id="app">
  <h1>Hello App!</h1>
  <p>
    <!-- 使用指令 v-link 进行导航。 -->
    <a v-link="{ path: '/foo' }">Go to Foo</a>
    <a v-link="{ path: '/bar' }">Go to Bar</a>
  </p>
  <!-- 路由外链 -->
  <router-view></router-view>
</div>
```

- javascript

``` javascript
// 定义组件
var Foo = Vue.extend({
    template: '<p>This is foo!</p>'
})
var Bar = Vue.extend({
    template: '<p>This is bar!</p>'
})
// 路由器需要一个根组件。
// 出于演示的目的，这里使用一个空的组件，直接使用 HTML 作为应用的模板
var App = Vue.extend({})
// 创建一个路由器实例
// 创建实例时可以传入配置参数进行定制，为保持简单，这里使用默认配置
var router = new VueRouter()
// 定义路由规则
// 每条路由规则应该映射到一个组件。这里的“组件”可以是一个使用 Vue.extend
// 创建的组件构造函数，也可以是一个组件选项对象。
// 稍后我们会讲解嵌套路由
router.map({
    '/foo': {
        component: Foo
    },
    '/bar': {
        component: Bar
    }
})
// 现在我们可以启动应用了！
// 路由器会创建一个 App 实例，并且挂载到选择符 #app 匹配的元素上。
router.start(App, '#app')
```

以上均来自[官方文档](http://router.vuejs.org/zh-cn/basic.html)，且提供了一个[在线实例应用](http://jsfiddle.net/yyx990803/xyu276sa/)。

这里我们主要介绍将会涉及的一些基本资料，有关路由的嵌套、对象等等更多的请查看[官方文档](http://router.vuejs.org/zh-cn/nested.html)。

## 创建登录组件
-----
### 主要页面逻辑
在这里，本骚年就建一个比较简单的项目。该项目与之前的Angular/React使用笔记项目长得完全一致，我们这里用Vue来实现吧。
- 我们的主要页面逻辑如下：
  - 1.登录页面，输入账号和密码即可
  - 2.模块页面

### index.html主页面
index.html主页面添加用于渲染匹配的组件，如下：
``` html
<div id="app">
  <router-view></router-view>
</div>
```

### main.js中设置路由
``` javascript
// 引入vue以及vue-router
import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入组件
import Login from './components/Login.vue'
import Index from './components/Index.vue'
// 创建一个路由器实例
// 创建实例时可以传入配置参数进行定制，为保持简单，这里使用默认配置
Vue.use(VueRouter)
var router = new VueRouter()
// 路由器需要一个根组件。
var App = Vue.extend({})
// 定义路由规则
// 每条路由规则应该映射到一个组件。这里的“组件”可以是一个使用 Vue.extend
// 创建的组件构造函数，也可以是一个组件选项对象。
router.redirect({
  // 重定向任意未匹配路径到 /login
  '*': '/login'
})
router.map({
  '/login': {
    name: 'login', // 定义路由的名字。方便使用。
    component: Login // 引用的组件名称，对应上面使用`import`导入的组件
  },
  '/index': {
    name: 'index',
    component: Index
  }
})
// 现在我们可以启动应用了！
// 路由器会创建一个 App 实例，并且挂载到选择符 #app 匹配的元素上。
router.start(App, '#app')
```

### 创建登录页面
- 首先我们在components文件夹内添加一个Login.vue

``` vue
<template>
 <div class="container" id="login">
	<form id="login-form">
		<h3 class="text-center">login</h3>
		<div class="form-group">
			<label>account</label>
			<!--v-model双向绑定账号-->
			<input type="text" class="form-control" placeholder="Account" v-model="username" required />
		</div>
		<div class="form-group">
			<label>Password</label>
			<!--v-model双向绑定密码-->
			<input type="password" class="form-control" placeholder="Password" v-model="password" required>
		</div>
		<button class="btn btn-default" v-on:click="submit">登录</button>
	</form>
</div>
</template>

<script>
export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  // 在 `methods` 对象中定义方法
  methods: {
    submit: function () {
      console.log('username: ' + this.username) //console中字符串需使用单引号''
      this.$route.router.go({name: 'index'}) //直接使用路由的名字进行跳转
    }
  }
}
</script>

<style scoped>
#login {
  padding: 200px 20px;
  width: 730px;
}
#login > form {
  border: solid 1px #999;
  padding: 20px;
  border-radius: 5px;
}
</style>
```

- 使用v-model进行双向绑定数据，数据在data中定义，可使用this.xxx直接获取

- 此处引用了Bootstrap的样式，在index.html中添加

``` html
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css">
```

至此，我们初步创建了一个带路由的登录页面组件。

### 参考
[《http://guowenfh.github.io/2016/03/28/vue-webpack-06-router/》](webpack入坑之旅（六）配合vue-router实现SPA)
[vue-router官方文档](http://router.vuejs.org/zh-cn/route.html)

## 结束语
-----
Vue中使用路由也折腾了一小会，不过vue的debug信息写得很详细哦，对哪里出问题了有个比较清晰的了解呢。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/vue-notes/2-create-login)
[此处查看页面效果](http://vue-notes.godbasin.com/2-create-login/index.html)
