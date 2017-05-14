---
title: 前端阶段性总结之「框架相关」
date: 2017-05-12 20:04:11
categories: 前端满汉全席
tags: 分享
---
该篇主要整理用过的一些框架，像Angular/Vue/React等的对比和总结。
<!--more-->

## 热门框架
---
### Angular
其实本人接触框架里面，可能是Angular最多吧，之前项目都是Angular1，现在项目在用Angular2。
不得不说，Angular对管理端的开发效率其实是很不错的，毕竟PC端对性能优化等的宽容度都还可以。比较坑的地方不得不说是Angular每次不向下兼容的升级了吧。不只是Angular1到Angular2的重新设计，甚至是Angular2自身的更新也不全兼容。

但不得不说，虽然对用户不是非常友好，其实仔细品味的话，Angular有很多很棒的理念和设计的。

目前来说，收集的更多是Angular1的一些文章吧，但感觉多数都不是很完整的，那这里本骚年就简单分享一下使用的演进吧。
- Angular1的个人演进
  - 入门+理解Directive/Controller/Provider/依赖注入等
  - 使用Yaomen自动化搭建Gulp+Grunt开发
  - 升级Angular(1.2到1.5)
  - 改用webpack构建
  - 添加Babel，开始使用ES6/ES7
  - 加入Typescript
  - 调整目录结构，约定规范

这个过程不得不说漫长，充满挑战的同时也很是有趣。最大感触就是伴随着ES6/ES7的成长，Angular原本的很多设计都和新语法重复了。然后新出现了很多有趣的设计，像typescript/rxjs等等，才有了Angular2的诞生吧。
具体大家也可以本骚年参考之前写的笔记--[angular混搭分类](https://godbasin.github.io/categories/angular%E6%B7%B7%E6%90%AD/)。

Angular2的话，目前在做2到4版本的升级。作为项目的熟悉过程，现在还不能给出很多的分享，后面或许有空会整理做些笔记吧。
对于遇到的很多问题，其实大家都可以在官网中找到，或者是翻阅Github的issues，或者是自行翻阅代码。
- [Angular1官网](https://angularjs.org/)
- [Angular2官网](https://angular.io/)[(中文版)](https://angular.cn/)

### React
React的虚拟DOM，当初是对前端框架性能的阶段性提升吧。这也是一个比较有意思的概念吧，大家可以参考[《深度剖析：如何实现一个 Virtual DOM 算法》](https://github.com/livoras/blog/issues/13)。

虚拟DOM，本质上是在JS和DOM之间做了个缓存：
1. 用js对象结构表示DOM树结构，并构建真正DOM树
2. 状态变更时，重新构建新DOM树，记录新旧的差异
3. 将差异应用到原有DOM树上

当然，React和Vue不像Angular，它们的使用都是需要搭配组合像路由和状态管理等，其实到最后也都是全家桶方式，不过它们相对自由吧。
对于React，其实除了一般框架的生命周期、事件、语法糖和jsx之外，如今的框架们都是很相似的，到后面也都是与业务结合所做的抽象整理和设计了吧。

- [React官网](https://facebook.github.io/react/)

### Vue
Vue也有两个版本了，不过Vue1和Vue2的升级就没Angular那样坑了。

对于Vue，其实要说的大概是数据的getter和setter，虽然听说Vue2版本也使用了虚拟DOM。相比React，可能会稍微容易上手吧。
另外一个就是，Vue的话html+js+css是写在一个文件中，封装成组件的，这对于有些目录组织管理不好的人来说，可能还比较方便的哈哈。

- [Vue官网](https://cn.vuejs.org/)

### 框架对比
关于框架对比，其实网上也有很多总结分析了，甚至也有详细的性能报告，大家都可以去找找看。这里本骚年只做自身使用的一些感受总结，仅供参考吧。
- 数据绑定
  - Angular1：脏检测（$watch + $digest机制），性能比较难看
  - React：虚拟DOM，性能棒棒哒，但相比Vue的话，需要手动配置才能到最好效果
  - Vue1：getter/setter数据跟踪
  - Vue2：增加虚拟DOM(听说的，未经验证)

- 使用场景
  - 移动端：由于性能问题，Angular在移动端的推荐为0，React/Vue感觉还可以
  - PC端：Angular开发效率会好些，React对团队有要求，Vue则个人感觉不适合很大的项？

> 其实除了移动端可以排除Angular之外，其他时候更多的是对业务和团队成员的考虑吧，包括Typescript等的使用，都是对配合的协助。大家一致性通过或者协商后的方案，才是最适合的方案。
> 到后面更多的是维护成本，这个时候需要做些整理和抽象，这时候规范的重要性就随着项目的壮大、成员的增加愈发地体现出来了。

## 框架全家桶
---
### 模板引擎
对于模板引擎，其实前端技术模板也就分为几种：
- String-based模板技术(基于字符串的parse和compile过程)
- Dom-based模板技术(基于Dom的link或compile过程)
- 杂交的Living templating技术(基于字符串的parse和基于dom的compile过程)

具体的说明大家可以参考[《一个对前端模板技术的全面总结》](http://blog.csdn.net/yczz/article/details/49585381)，感觉还是总结得不错的。
对于Angular/Vue/React，其实更多的区别在于上面所说的数据绑定的方式，其他的基本都是相似的语法分析AST等等的实现方式吧。

### 路由
路由现在也成为了前端框架里一个最基本的要求了呢。毕竟这是个很简单的部件，但是却是单页应用不可或缺的部分。
因为实现的简单，所以基本大家都直接使用框架自带的router，像ngRouter/vue-router/react-router等等，没特别的需求的话，查查API就能做出想做的东西了。

一般来说，路由都是通过history API进行监听和读写，具体大家可以看看这篇[《Web开发中 前端路由 实现的几种方式和适用场景》](http://blog.csdn.net/xllily_11/article/details/51820909)。

### 状态管理
其实Angular虽然是全家桶，但是也是可以自行进行改造，搭配自己喜欢的库或者工具使用的呢。
一般来说，稍微复杂点的项目，会涉及状态管理等工具吧。

目前比较热门的状态管理工具包括：
- [Flux](https://facebook.github.io/flux/docs/overview.html#content)
- [Redux](http://redux.js.org/docs/introduction/)
- [Vuex](https://vuex.vuejs.org/zh-cn/)
- [Mobx](https://mobx.js.org/getting-started.html)
- ...

具体的设计和使用无非是（仅个人感受）：
- 绑定action，触发更新事件
- 状态统一管理处进行对应的计算
- 绑定数据的模板触发相应的更新

其实小的项目，根本不需要加这些工具，即使是事件的乱序分发，也不会很难跟踪。
只有在项目大了，才需要比较统一的数据更新方式，以及可追踪的数据流吧。这些状态管理工具，其实说白了就是把数据的更新提取到一个公共的地方，任何相关变更都会经过这里，然后比较容易追踪变化。
但是如果自行做一些规范的约束或者抽象分离数据流，也是可以达到这样的效果的。

### 模块化
之前曾经有过像requirejs和seajs等模块化工具，而从es6开始支持module之后，无论是模块化、组件化、依赖注入和异步加载等都变得很是简单呢。

另外，还有个需要理解的就是MVC/MVVM这些啦，大家可以参考[《MVC，MVP 和 MVVM 的图示》](http://www.ruanyifeng.com/blog/2015/02/mvcmvp_mvvm.html)。

## 结束语
-----
其实如今前端的框架/库/工具都不断地更新和迭代，像当初jQuery也是个很棒的库呢，到现在本骚年还是认为其中的设计很棒，大家感兴趣也可以看看[《jQuery源码分析系列》](http://www.cnblogs.com/aaronjs/p/3279314.html)。
至于日新月异的前端，其实也不必太多担心。因为现在其实不只是前端吧，各个层面都是在不断地进行革命，不如学会在骄躁中脚踏实步吧。