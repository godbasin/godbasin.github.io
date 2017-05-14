---
title: 前端阶段性总结之「深入javascript」
date: 2017-05-06 17:35:50
categories: 前端满汉全席
tags: 分享
---
该篇主要整理javascript的部分深入理解，以及一些分享。
<!--more-->

## 深入理解javascript
---
### 单线程与Event Loop
单线程这样的概念，其实本骚年在被问到之前一直是模糊的。

当然这也是因为非科班，对线程、进程这些都不曾真正去了解和学习过，至于单线程，最大的感受就是异步事件、回调等等。

你有想过为什么javascript是单线程的吗？其实更多是因为对页面交互的同步处理吧，具体大家可以参考一下[《JavaScript 运行机制详解：再谈Event Loop》](http://www.ruanyifeng.com/blog/2014/10/event-loop.html)。

- [并发模型与Event Loop](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/EventLoop)

这里我们需要知道事件循环event loop、栈与队列、主线程等等，当我们继续查阅文章的时候，会涉及到其他的概念如宏任务和微任务。

- microtask与macrotask

关于宏任务和微任务，其实大致有个了解就差不多了，在我们编码过程遇到相关的问题时，再针对性地去研究吧。或者大家也可以看看一些文章：
[《理解 js 事件循环二 (macrotask 和 microtask)》](https://juejin.im/entry/58332d560ce46300610e4bad)
[《HTML系列：macrotask和microtask》](https://zhuanlan.zhihu.com/p/24460769)

思考问题：
1. 简单描述Event Loop过程。
2. 为什么javascript是单线程的？单线程与多线程的区别？

### 浏览器机制
身为前端，对浏览器的机制和深入理解，能成为性能优化的一大利器呢。

- 浏览器渲染机制

对于想做简单认识的，可以参考[《浏览器的渲染原理简介》](http://coolshell.cn/articles/9666.html)。想要深入理解的，可以看[《How browsers work》](http://taligarsiel.com/Projects/howbrowserswork1.htm)以及译文系列[《浏览器是怎样工作的（一）：基础知识》](http://ued.ctrip.com/blog/how-browsers-work-i-basic-knowledge.html)。

这里面有几个概念需要理解，包括：Rendering tree渲染树、CSS规则树、Repaint和Reflow等等。

思考问题：
1. 浏览器解析哪些文件，分别会生成什么？
2. 渲染树的生成过程。
3. 哪些行为会导致Reflow和Repaint？怎么规避/优化？

- javascript在浏览器中的加载

浏览的渲染线程和JS执行线程是互斥的，并且JavaScript默认是阻塞加载的。对于这个过程，相关文章阅读[《JAVASCRIPT 装载和执行》](http://coolshell.cn/articles/9749.html#jtss-tsina)、[《S一定要放在Body的最底部么？聊聊浏览器的渲染机制》](http://delai.me/code/js-and-performance/)，或者谷歌查询。

对于这个我们会经常遇到一些问题，如：
1. 为什么js要放在最后面加载？为什么css放前面？
2. js的加载顺序，相关事件（如onload）的理解。
3. 优化首屏加载时间？

- 页面的加载过程（从输入Url到页面加载完成）
- 浏览器的缓存机制
- 浏览器的同源政策与跨域

其实上面这些内容更加涉及http相关多一些，但是其实http也是前端的一部分啦。这些统一放到后面http部分一起进行整理吧。

### javascript设计模式
关于javascript的设计，其实跟大多数的编程语言都是相通的。很多时候我们都会使用，但是或许我们并没有什么感觉。
只是当项目越来越大，重复的代码或是杂乱的代码总会让我们开始对其进行整理、抽象、封装等等工作，便于拓展也提升了开发效率，同时对项目整体的理解也更加深入了。

这里面本骚年也不想细说，感兴趣的大家可以参考[《【Javascript设计模式1】-单例模式》](http://www.alloyteam.com/2012/10/common-javascript-design-patterns/)系列文章，当然还有其他文章，找谷歌或者度娘去吧。
其实很多时候我们使用的一些插件、框架和库，里面就使用了很多的设计模式，大家不妨也可以多去了解一下。

## 结束语
-----
其实仔细研究javascript，总会发现你所不了解的角落。即使是本骚年所认为的深入理解，到头来也只是某个浅尝的部分，越是相处时间长了，越能发现其中的美妙和乐趣吧。