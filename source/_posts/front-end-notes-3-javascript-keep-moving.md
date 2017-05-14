---
title: 前端阶段性总结之「javascript新特性」
date: 2017-05-07 14:02:22
categories: 前端满汉全席
tags: 分享
---
该篇主要整理目前为止javascript的一些更新和迭代，以及相关的新特性和术语。
<!--more-->

## 进击中的语法糖
---
### ES6/ES7
关于ES6和ES7，阮一峰大神的[《ECMAScript 6 入门》](http://es6.ruanyifeng.com/)其实有个比较完整的说明，具体每个api大家也可以到MDN上进行查询。

最基础的变化包括：
- let/const
- 解构（对象、数组等）
- 数组、对象、函数的拓展
- ...

这里面有几个新的概念需要了解：
- Module
- Promise
- Proxy
- Generator/Async
- Class/Decoratir
- ...

这些新式语法糖其实已经大大改变了我们以往的写码方式和效率了，配合babel这样的编译工具，我们也无需太担忧新语法的兼容性。

### Typescript/coffeescript
对于像[coffeescript](http://coffee-script.org/)和[typescript](https://www.typescriptlang.org/)等不断出现的语法糖和辅助语法，对javascript的冲击和推进也是贡献了不少的。

其实两者并不是一样的东西，像coffeescript更多是语法糖，而typescript则是对javascript弱类型的一些辅助吧，大型项目或者多人协作项目会方便很多。

像如今其实coffeescript已经逐渐退出舞台，因为javascript本身的演进到es6/es7，不断进化的语言是会把各种语言或者语法糖优秀的地方都吸收进来的。
不管怎么说，对原生javascript的理解和熟悉也总会对我们使用各种各样的工具、框架和语法糖有一定的帮助。

### 新兴API
其实HTML5出现已经很久了，但或许是因为兼容性问题，又或者是不常用的问题，这些API或许也不是特别了解的：
- audio/video
- Canvas/WebGL
- Websocket/Web Worker
- LocalStorage/SessionStorage
- ...

## 日新月异的javascript
---
### 不断演化的框架/库
对于目前来说，比较占分量的框架包括：
- Vue
- React
- Angular
- ...

然后是一些经常搭配框架进行状态管理的：
- vuex
- flux
- redux
- mobx
- ...

还有一些新兴库：
- threejs
- d3/echarts
- rxjs
- ...

各种各样层出不穷的框架和库，我们肯定是学不完的。
其实还是关键的，多深入学习javascript，然后了解框架的一些对比和设计，能进行选型以及快速上手，便足够了。

### 新的术语
这里只是简单阐述一些最近接触到的术语，有兴趣大家需要自行搜索，包括：
- PWA(Google提出的离线APP)
- WebAssembly
- HTTPS/HTTP2
- ...

## 结束语
-----
对于框架，大概后面也会整理收藏的一些文章吧。在写这篇文章的时候，其实我也有一段时间没去跟进javascript的最新情况了，或许这些都已经老旧了，但其实都没有关系。
重要的还是，自身的提升和不减的热情，共勉呀。