---
title: Vue使用笔记1--使用vue-cli搭建Vue项目
date: 2016-09-03 11:04:35
categories: vue八宝粥
tags: 笔记
---
最近在学习使用Vue作为前端的框架，《Vue使用笔记》系列用于记录过程中的一些使用和解决方法。
本文记录使用Vue框架的脚手架vue-cli初步搭建项目的过程。
<!--more-->

## 初步使用Vue应用

### 直接使用Vue源码
- 下载[Vue生产版本](http://cn.vuejs.org/js/vue.min.js)或[Vue开发版本](http://cn.vuejs.org/js/vue.js)
- 用`<script>`标签引入，Vue会被注册为一个全局变量

### 使用脚手架vue-cli搭建
当我们真正开发一个应用的时候，我们不可避免的会用到一大堆的工具，模块化、预处理器、热模块加载、代码校验和测试。

Vue.js提供一个[官方命令行工具vue-cli](https://vuejs-templates.github.io/webpack/index.html)，可用于快速搭建大型单页应用。

使用vue-cli，让一个简单的命令行工具来帮助你快速的构建一个拥有强大构建能力的Vue.js项目：单文件Vue组件，热加载，保存时检查代码，单元测试等。

- 安装项目

``` cmd
$ npm install -g vue-cli
$ vue init webpack vue-test
$ cd vue-test
$ npm install
```
安装过程会询问是否需要添加一些相关的依赖（编码规范、测试等），如图
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/8EC6.tmp.png)

- 目录组织
如图，生成目录组织如下（这里木有显示.开头的文件）：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/9B08.tmp.png)

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

### 主要的npm命令
- 启动服务

``` bash
npm run dec
```
效果如下：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/A221.tmp.png)

- 打包生成

``` bash
npm run build
```

  - 注意，打包生成的文件为绝对定位，需在服务环境下才能打开。如果需要生成相对定位的文件，可以进行如下操作：

  - 1.打开config文件夹下的index.js文件
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/7BB8.tmp.png)

  - 2.修改build中assetsPublicPath为''（原本为'/'）

``` javascript
module.exports = {
  build: { //打包生成项目相关配置
    env: require('./prod.env'), //环境为生产环境
    index: path.resolve(__dirname, '../dist/index.html'), //打包后的主页面位置
    assetsRoot: path.resolve(__dirname, '../dist'), //打包后的其余文件的根位置
    assetsSubDirectory: 'static', //其余文件的目录
    assetsPublicPath: '', //相对或绝对位置
    productionSourceMap: true, //是否生产map文件
    productionGzip: false, //压缩
    productionGzipExtensions: ['js', 'css'] //需要压缩的文件类型
  },
  dev: { //启动服务、热加载相关配置
    env: require('./dev.env'), //环境为开发环境
    port: 8080, //服务端口
    proxyTable: {}
  }
}
```


  - 生成的文件将放置在dist文件夹，如图：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/3B27.tmp.png)

  - 运行单元测试

``` bash
npm run unit
```

- 运行e2e测试

``` bash
npm run e2e
```

- 运行单元测试和e2e测试

``` bash
npm run test
```

### 参考
[vue-cli官方文档](https://vuejs-templates.github.io/webpack/index.html)
[《使用Vue构建中(大)型应用》](http://www.tuicool.com/articles/mYVvmyA)


## 快速浏览项目
-----
项目生成完毕，现在我们快速查看一下Vue项目的使用吧。
### index.html
查看主页面index.html，可以看到如下代码：
``` html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>vue-test</title>
  </head>
  <body>
    <app></app>
    <!-- built files will be auto injected -->
  </body>
</html>
```
其中：<app></app>是主应用组件入口，我们可以在src文件夹的App.vue查看该组件，动态生成的js文件会在其后导入加载。

### main.js
该文件主要负责初始化主组件，当然路由也可以在该文件中进行处理，后面的章节我们会讲到。
``` javascript
import Vue from 'vue' //导入vue
import App from './App' //导入App主组件（App.vue）
new Vue({
  el: 'body', //el为实例提供挂载元素
  components: { App } //components包含组件
})
```

### App.vue
主组件App，如下：
``` javascript
<!--模板-->
<template> 
	<div id="app">
		<img class="logo" src="./assets/logo.png">
		<!--使用Hello组件-->
		<hello></hello>
		<p>Welcome to your Vue.js app!</p>
	</div>
</template>
<!--js-->
<script>
import Hello from './components/Hello' //导入Hello组件
export default { //输出组件
	components: {
		Hello
	}
}
</script>
<!--样式-->
<style>
#app {
	color: #2c3e50;
	margin-top: -100px;
	max-width: 600px;
	font-family: Source Sans Pro, Helvetica, sans-serif;
	text-align: center;
}
</style>
```

我们可以看到，Vue的组件中，每一个组件的样式style、模板template和脚本script集合成了一整个文件，每个文件就是一个组件。
至于Hello.vue文件与该文件大同小异，这里就不分析啦。

## Vue简单介绍
-----
这里我们简单介绍一下Vue，以及稍微比较前面讲过的[Angular](/2016/07/01/angular-note-1-create-angular-project/)和[React](/2016/08/06/react-notes-1-build-react-project/)。

### Vue概述
Vue.js是一个构建数据驱动的web界面的库。Vue.js的目标是通过尽可能简单的API实现响应的数据绑定和组合的视图组件。

- 对比其它框架
[官方文档](http://cn.vuejs.org/guide/comparison.html)中已经详细介绍Vue和Angular、React、Ember等框架的比较，大家可以查看。

### 响应的数据绑定
Vue.js拥抱数据驱动的视图概念。
通俗地讲，它意味着我们在普通HTML模板中使用特殊的语法将DOM“绑定”到底层数据。一旦创建了绑定，DOM将与数据保持同步。每当修改了数据，DOM便相应地更新。
- 对比Angular
  - Vue默认使用单向绑定，可开启双向绑定。Angular使用双向绑定
  - Vue.js使用基于依赖追踪的观察系统并且异步列队更新，所有的数据变化都是独立地触发。Angular使用脏检查，当watcher越来越多时会变得越来越慢
- 对比React
  - Vue使用真实DOM作为模板，数据绑定到真实节点。React使用Virtual DOM，难以自己控制DOM
  - Vue中指令和组件分得更清晰。React使用JSX，渲染函数常常包含大量的逻辑

### 组件系统
组件系统是Vue.js另一个重要概念，它提供了一种抽象，让我们可以用独立可复用的小组件来构建大型应用。如果我们考虑到这点，几乎任意类型的应用的界面都可以抽象为一个组件树。
实际上，一个典型的用Vue.js构建的大型应用将形成一个组件树。组件系统是用Vue.js构建大型应用的基础。
- 对比Angular
  - Angular中几乎很少有组件的概念，要进行也只有指令能与Vue组件进行比较
  - Vue.js指令只封装DOM操作，而组件代表一个自给自足的独立单元。Angular中视图和数据逻辑有不少相混的地方
- 对比React
  - React中组件与Vue组件很相似，props、组件间通信等有很多相似的概念
  - Vue中样式、模板和脚本分层更清晰，React中则比较混杂

### 参考
[《Vue概述》](http://cn.vuejs.org/guide/overview.html)

## 结束语
-----
认识了Vue之后，发现它结合了其他框架优秀的地方，并且使得项目的快速搭建变得更加简单。当然每个框架都各有千秋，具体的使用要结合项目具体分析才行哦。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/vue-notes/1-build-vue-project)
[此处查看页面效果](http://vue-notes.godbasin.com/1-build-vue-project/index.html)