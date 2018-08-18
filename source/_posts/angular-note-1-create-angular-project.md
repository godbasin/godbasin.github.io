---
title: Angular使用笔记1--搭建Angular项目
date: 2016-07-01 19:52:43
categories: angular混搭
tags: 笔记
---
最近的一个项目使用AngularJS(v1.2.6)作为前端的框架，《Angular使用笔记》系列用于记录过程中的一些使用和解决方法。
本文记录初步搭建项目的过程。
<!--more-->

## 使用Yeoman自动生成初步完整功能的AngularJS应用

### 使用AngularJS的方法
- 1.下载AngularJS源代码，引入到页面内，然后按照[官方教程](http://www.apjs.net/)进行启动app。
- 2.使用自动化构建Grunt/Gulp搭建项目。

### 自动化搭建
- 本骚念使用的是Yeoman自动搭建，这里有详细教程[《Yeoman官方教程：用Yeoman和AngularJS做Web应用》](http://blog.jobbole.com/65399/)
- 自动化搭建的好处：
  - 1.对框架的目录组织有个大概的了解
  - 2.可选择自动引入Bootstrap或者SASS
  - 3.可选择自动引入需要使用的Angular模块，如下
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/CF95.tmp.png)
  - 4.对首次使用AngularJS的小伙伴们来说，可以直观看到如何启用ng-app，以及路由ng-route的使用方式
  - 5.启动一个基于Node的http服务，通过一系列的Grunt任务来监视你的文件的更改情况，一旦发现文件被改动了，'live reloading'就会自动刷新应用，并更新到浏览器上
  - 6.可使用grunt命令自动执行规范代码、跑测试、压缩JS和CSS代码（减少网络请求）、优化图片还有编译使用了预处理的代码

### Gulp/Grunt/Bower/NPM/Yeoman
这里简单介绍一下这些工具
- Grunt: Javascript任务运行器。常用来执行需要重复执行的任务，例如压缩、编译、单元测试等。
- Gulp: gulp.js是一种基于流的，代码优于配置的新一代构建工具。Gulp和Grunt 类似。但相比于Grunt的频繁的IO操作，Gulp的流操作，能更快地完成构建。
- Bower: Bower是一个客户端技术的软件包管理器，它可用于搜索、安装和卸载如JavaScript、HTML、CSS之类的网络资源。如YeoMan和Grunt等开发工具则是建立在Bower基础之上。
- NPM: NPM是随同NodeJS一起安装的包管理工具，能解决NodeJS代码部署上的很多问题。是node.js常用来下载以及安装套件的工具。
- Node.js: Node.js是一个事件驱动I/O服务端JavaScript环境，基于Google的V8引擎，简单的说就是运行在服务端的JavaScript。
- Yeoman: Yeoman的目标是通过Grunt和Bower的包装为开发者创建一个易用的工作流，同时可解决前端开发所面临的诸多严重问题，例如零散的依赖关系。主要有三部分组成：yo（脚手架工具）、grunt（构建工具）、bower（包管理器）。
- yo是一个用于构建特定框架的生态系统的代码工具，我们称之为生成器(generator)。

## 目录组织
-----
搭建好初始化的项目，目录组织如下：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/5C4E.tmp.png)
当然，涉及angular项目的文件在app目录下，其他主要用于自动化构建、生成的环境和管理包引用。
现在我们查看一下app目录下文件：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/E558.tmp.png)

当然项目发展文件数量肯定多很多的呢，在js文件成倍增长的时候，该怎么去管理呢？

### 按照功能分类
- 将directive/controller/service/filter等不同功能的js放置不同的文件夹管理
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1350.tmp.png)

### 按模块分类
- 将每个模块的文件放置在一个文件夹内管理
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/14A2.tmp.png)

本骚年用的是按照功能划分的，这种方式相对本骚年来说比较容易管理。
或者你们如果有更好的管理目录组织方式，当然也欢迎分享啦。

## Angular基本概念
-----
此处稍微介绍一下本骚年用的比较多的angular部分

### AngularJS模块
- ng-app: 模块用于单独的逻辑表示服务，控制器，应用程序等，并保持代码的整洁
- 一般一个项目中只会用到一个ng-app，而angular自动启动也仅限于第一个ng-app，故使用多个模块的小伙伴们需要手动启动剩余的模块啦
- 使用angular.bootstrap()可启用多个ng-app，[参考](http://www.cnblogs.com/whitewolf/archive/2012/08/13/2637262.html)

### AngualrJS视图
- ng-view: 标记只是简单地创建一个占位符，是一个相应的视图(HTML或ng-template视图)，可以根据配置来放置
- 配合ng-route路由可以实现单页应用哦

### AngularJS表达式
``` html
{{ expression | filter }}
```
- 其中filter为过滤器，常用于格式转换等
- ng-bind与双大括号表达式差不多，但可以防止页面未加载完全时出现不必要的字符

### AngularJS控制器
- ng-controller: 控制AngularJS应用程序的数据
- 常配合路由使用，也可以创建局部作用域来管理其中数据

### AngularJS指令
- angular.directive: 常用来拓展HTML
- 对可复用的控件可进行封装，可创建独立作用域，可管理特定DOM事件
- DOM操作尽量封装在指令内部哦

### AngularJS HTML DOM常用事件和指令
- ng-repeat: 通过数组来循环HTML代码
- ng-show/ng-hide: 隐藏和显示相应元素
- ng-if: 是否加载相应元素
- ng-click: 绑定元素点击事件
- ng-model: 双向绑定，多用于表单
- ng-change/ng-keyup/ng-focus: 绑定事件，多用于表单

此外还有路由、表单验证、作用域等，这里就不详细介绍啦。
虽然说配合实践是高效学习的一种方式，但是基础和概念也是很重要的哦。
下面是一些教程：
[《AngularJS中文网》](http://www.apjs.net/)
[《w3c菜鸟：AngularJS教程》](http://www.runoob.com/angularjs/angularjs-tutorial.html)

## 结束语
-----
自动化搭建对AngularJS应用整体上的了解很有帮助哦，不妨尝试一下啦。
[此处查看项目代码（仅包含app部分）](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular-notes/1-create-angular-project)
[此处查看页面效果](http://o9grhhyar.bkt.clouddn.com/1-create-angular-project/index.html#/)