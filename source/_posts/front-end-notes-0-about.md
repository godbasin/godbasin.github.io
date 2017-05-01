---
title: 前端阶段性总结之「总览整理」
date: 2017-04-30 07:11:43
categories: 前端满汉全席
tags: 分享
---
前段时间恶补了自己还缺乏的一些前端知识体系，并做了些整理，《前端满汉全席系列》主要用于分享。后续若有其他相关的，也会一并添加进来。
<!--more-->

## 前端基础
---
补上曾经整理过的一篇[《我的前端入门之路》](https://godbasin.github.io/2016/06/24/front-end-getting-started/)，对比起来这篇还比较枯燥呢。

### 入门手册和文档
一般来说，入门的话，不管是html/css，还是javascript，都能从[w3c](http://www.w3school.com.cn)和[mdn](https://developer.mozilla.org/zh-CN/)上找到。
相对地说，mdn会更加详细和明确一些，也涉及不少较深入的内容呢。

### javascript
在本骚年看来，javascript是最基本也是最重要的呢。即使现在的框架和工具让你眼花缭乱，不过万变不离其宗，javascript依然是我们最需要深入学习和理解的一门技能吧。

- 本骚年看过的一些书：
  - 《javascript高级程序设计》
  - 《javascript权威指南》
  - 《javascript数据结构》
  - ...

- 掌握javascript
  - 基本语法和使用
  - 原型和继承
  - 闭包
  - 作用域/原型链
  - this和上下文
  - DOM对象
  - BOM对象
  - ajax/XHR
  - 正则表达式

- 深入了解javascript
  - 单线程的javascript
  - 事件循环Eventloop
  - javascript的装载和执行
  - 事件冒泡/捕获、事件委托
  - javascript设计模式
  - 面向对象编程

- javascript新特性
  - ES6/ES7
  - Promise
  - fetch
  - PWA(Progressive Web Apps)
  - WebAssembly
  - Rxjs

### HTML/CSS
虽然很多时候对javascript考验更多，但是其实HTML和CSS也并不只是很基础和简单的。

- HTML5新特性
  - Web Worker/Service Worker
  - LocalStorage/SessionStorage
  - Canvas
  - History
  - [...](https://developer.mozilla.org/zh-CN/docs/Web/Guide/HTML/HTML5)

- 掌握CSS
  - 文档流
  - 盒子模型
  - 布局（居中）
  - BFC/IFC
  - CSS3新特性
  - CSS动画
  - CSS规范（BEM等）

- 浏览器渲染
  - 浏览器渲染机制
  - reflow和repaint
  - CSS匹配规则/效率

## 前端框架和工具
---
### 前端框架
前端框架可以说是层出不穷的，本骚年也就只涉及几个而已。

- 涉及框架
  - angular1.x
  - angular2
  - react(+redux)
  - vue
  - ...

- 关于框架
  - MVC/MVVM
  - 模板引擎原理
  - 数据流处理(Flux/Redux/Mobx)
  - 虚拟DOM
  - 数据绑定原理
  - 路由控制
  - 框架的区别和选型
  - ...

### 前端工具
关于前端安装部署、热更新、打包等等，也已经有了一系列的相关工具。

- 安装工具
  - node
  - npm

- 构建工具
  - Grunt
  - Gulp
  - Webpack
  - Babel

- 校验工具
  - Typescript

- 测试工具
  - 断言库(Mocha/Jasmine)
  - Runner(Karma)

### 设计和封装
基本的程序员素质--设计抽象，以及前端的组件封装。

## Web相关知识
---
### HTTP
身为一个前端，http相关的知识也是需要熟练使用的呢。

- HTTP入门
  - 完整的HTTP请求
  - TCP/UDP/IP(TCP的三次握手/四次挥手)
  - DNS域名解析(DNS寻址过程)
  - CDN
  - HTTP协议解析(request/response)
  - HTTP常见状态码
  - GET/POST/...(Restful)

- 理解HTTP
  - HTTP无连接与无状态
  - HTTP缓存机制
  - 会话跟踪(Session/Cookie)
  - HTTP与Websocket
  - HTTP压缩
  - HTTPS/HTTP2
  - 浏览器同源政策与跨域请求

- HTTP头属性
  - 缓存相关(Expires/Cache-Control/Progma/Etag/Modified/...)
  - Websocket相关(Upgrade/Connection)
  - 跨域CORS相关(Origin/Access-Control-*)
  - Cookie相关(Set-Cookie/Cookie)
  - host/referer
  - ...

### Web安全
对于Web安全，也有很多是需要知道的。

- XSS攻击
- CSRF攻击
- 运营商劫持
- 其他攻击(各环节脚本注入/钓鱼网站/...)

## 身为程序员
---
### 算法相关
非科班的自己，也有很多身为程序员的基本素质需要补上。（这块还不是特别熟练，如果有写的不对望指出）

- 常用算法
  - 排序算法
  - 递归
  - 分治策略
  - 归并算法
  - ...

- 数据结构
  - 链表
  - 二叉树
  - 散列表
  - ...

### 编码相关
- 常见编码
  - 压缩编码
  - Base64编码
  - 哈希算法
  - URL编码

- 计算机加密算法
  - 对称加密算法
  - DH密钥交换算法
  - 非对称加密算法

### 计算机系统
- 计算机系统深入理解
- 现代计算机系统

## 结束语
-----
该文主要用于自我整理一些东西，虽然还不是特别完整，也不是很全面。不过作为自己的阶段性总结，如果能对大家有帮助就更好啦。