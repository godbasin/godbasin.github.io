---
title: Vue2使用笔记1--vue-cli+vue-router搭建应用
date: 2016-11-19 18:13:39
categories: vue八宝粥
tags: 笔记
---
最近在使用Vue2作为项目中前端的框架，《Vue2使用笔记》系列用于记录过程中的一些使用和解决方法。
本文记录使用Vue框架的脚手架vue-cli初步搭建项目，以及使用vue-router简单搭建路由的过程。
<!--more-->

## 初步使用Vue应用
---
### 直接使用Vue源码
这里本骚年就不详细描述了，具体大家可以参考[Vue2.0中文文档](https://vuefe.cn/guide/)。

### 使用脚手架vue-cli搭建
Vue.js提供一个[官方命令行工具vue-cli](https://vuejs-templates.github.io/webpack/index.html)，可用于快速搭建单页应用。

- 安装项目

``` cmd
$ npm install -g vue-cli
$ vue init webpack vue2-test
$ cd vue-test
$ npm install
```

安装过程会询问是否需要添加一些相关的依赖（EsLint、mocha、n2n等），但由于本项目较小，也就不安装了。

- 目录组织
生成目录组织如下：
``` bash
├── build/                      # webpack配置参数文件
│   └── ...
├── config/                     
│   ├── index.js                # 主项目的配置
│   └── ...
├── src/
│   ├── main.js                 # 应用入口
│   ├── App.vue                 # 主应用组件
│   ├── components/             # UI组件
│   │   └── ...
│   └── assets/                 # 模块资源（webpack提供）
│       └── ...
├── static/                     # 纯静态资源（打包时直接复制）
├── test/
│   └── unit/                   # 单元测试
│   └── e2e/                    # e2e tests测试
├── .babelrc                    # babel编译参数
├── .editorconfig.js            # 编辑器配置
├── .eslintrc.js                # eslint配置文件，用以规范团队开发编码规范
├── index.html                  # 主页模板
└── package.json                # 项目文件，记载着一些命令和依赖还有简要的项目描述信息
```

跟vue1.0长得一模一样对吧，哈哈哈。

### 主要的npm命令
``` bash
// 启动服务
npm run dev
// 打包生成
npm run build
```
> 注意，打包生成的文件为绝对定位，需在服务环境下才能打开。如果需要生成相对定位的文件，可以进行如下操作：
> 1.打开config文件夹下的index.js文件
> 2.修改build中assetsPublicPath为'./'（原本为'/'）
> 生成的文件将放置在dist文件夹

### 参考
[Vue2.0中文文档](https://vuefe.cn/guide/)
[《Vue使用笔记1--使用vue-cli搭建Vue项目》](https://godbasin.github.io/2016/09/03/vue-notes-1-build-vue-project/)

## 添加路由
---
下面我们给项目添加路由。

### 安装vue-router
``` bash
npm install vue-router --save
```

### 引入vue-router
在src/main.js文件中引入vue-router，并创建简单路由，包括：
- Login：登陆页面
- App：管理页面

``` js
import Vue from 'vue' // 引入vue
import VueRouter from 'vue-router' // 引入vue-router

import App from './App' // 引入App组件
import Login from './Login' // 引入Login组件

Vue.use(VueRouter) // 使用路由

// 设置路由信息
const routes = [
    { path: '/login', component: Login, name: 'Login' },
    { path: '/app', component: App, name: 'App' },
    { path: '*', redirect: { name: 'Login' } }
]

const router = new VueRouter({
    routes // （缩写）相当于 routes: routes
})

new Vue({
    router
}).$mount('#app')
```

### 添加登陆页面
这个项目中我们使用gentelella的开源模板，故我们需要引入一些该模板的相关文件。
- 获取gentelella模板
  - 从github上获取源码
  - 下载后选择需要的文件放置在/static/gentelella/文件夹中
  - lib文件夹放置相关依赖代码文件
  - build文件夹放置自定义的css和js文件

- index.html中引入相关js和css
这里我简单列出大概会用到的库和组件。

``` html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>vue2-test</title>
    <!-- Bootstrap -->
    <!-- Font Awesome -->
    <!-- NProgress -->
    <!-- jQuery custom content scroller -->
    <!-- iCheck -->
    <!-- Select2 -->
    <!-- Switchery -->
    <!-- Datatables -->
    <!-- PNotify -->
    <!-- Custom Theme Style -->
    <link href="./static/gentelella/build/css/custom.css" rel="stylesheet">
    <link href="./static/gentelella/build/css/common.css" rel="stylesheet">
</head>

<body class="nav-md">
    <div id="app">
        <router-view></router-view>
    </div>
    <!-- built files will be auto injected -->
    <!-- jQuery -->
    <!-- Bootstrap -->
    <!-- bootstrap-daterangepicker -->
    <!-- FastClick -->
    <!-- NProgress -->
    <!-- jQuery custom content scroller -->
    <!-- iCheck -->
    <!-- jQuery Tags Input -->
    <!-- Switchery -->
    <!-- Select2 -->
    <!-- Parsley -->
    <!-- Autosize -->
    <!-- NProgress -->
    <!-- bootstrap-progressbar -->
    <!-- Datatables -->
    <!-- PNotify -->
    <!-- Custom Theme Scripts -->
    <script src="./static/gentelella/build/js/common.js"></script>
</body>
</html>
```

- 添加登陆页面Login组件
在src下新建Login.vue文件：

``` vue
<template>
	<div>
		<a class="hiddenanchor" id="signup"></a>
		<a class="hiddenanchor" id="signin"></a>
		<div class="login_wrapper">
			<div class="animate form login_form">
				<section class="login_content">
					<form>
						<h1>管理系统</h1>
						<div>
							<input type="text" class="form-control" placeholder="用户名" v-model="username" required="" />
						</div>
						<div>
							<input type="password" class="form-control" placeholder="密码" v-model="password" required="" />
						</div>
						<div class="alert alert-danger alert-dismissible fade in" role="alert" v-show="error.shown">
							<strong>错误：</strong> {{error.text}}
						</div>
						<div>
							<a class="btn btn-default submit" href="javascript:;" v-on:click="login">登录</a>
						</div>

						<div class="clearfix"></div>
						<div>
							<h1><i class="fa fa-paw"></i> Gentelella Alela!</h1>
							<p>©2016 All Rights Reserved. Gentelella Alela! is a Bootstrap 3 template. Privacy and Terms</p>
						</div>
					</form>
				</section>
			</div>
		</div>
	</div>
</template>

<script>
    export default {
        name: 'Login',
        data() {
            return {
                username: '',
                password: '',
                error: {
                    text: '',
                    shown: false
                }
            }
        },
        methods: {
            // 登陆事件
            login() {
                if (!this.username || !this.password) {
                    this.error.text = '用户名和密码不能为空'
                    this.error.shown = true
                    return;
                }
                this.$router.push('App')
            }
        },
        // 实例已完成以下的配置：数据观测(data observer)，属性和方法的运算， watch/event 事件回调
        created() {
            this.error.shown = false
            $('body').attr('class', 'login')
        },
        // 此时元素创建完成
        mounted() {
            $('input')[0].focus()
        }
    }
</script>
```

### 参考
[Vue2.0中文文档](https://vuefe.cn/guide/)

## 结束语
-----
其实使用了这么多的框架，Vue的确是做的很不错的一个呢，从Vue1.x到Vue2.x也是有很多优秀的转变呢。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/vue2-notes/1-build-vue2-project)
[此处查看页面效果](http://ofyya1gfg.bkt.clouddn.com/1-build-vue2-project/index.html)