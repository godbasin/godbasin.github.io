---
title: 我的前端入门之路
date: 2016-06-24 21:30:30
categories: web乱炖
tags: 分享
---
曾经作为物理学院的一名理工女，如今成为一名热爱代码的前端工程师。其中的过程也是颇为丰富，作为记录也好，参考也好，我都想写下来呢。仅供参考哦。
<!--more-->

## 入门基础学习
------
前端基础三剑客（瞎编的）： HTML、CSS、javascript

### 充分利用网络资源
- 最基础的语法可参考[W3C](http://www.w3school.com.cn/)，这也是一本很好的词典哦

### HTML + CSS
- [Bootstrap](http://www.bootcss.com/)，大家都在用的样式框架
- [Font Awesome](http://www.bootcss.com/p/font-awesome/)，图标字体库
- [jQuery Mobile](http://jquerymobile.com/)，移动web应用程序的框架
- [jQuery UI](https://jqueryui.com/)，建立在jQuery库上的一组用户界面交互、特效、小部件及主题
- 大家不妨用的时候也阅读一下这些框架/库的源码，有助于理解CSS特性哦

### HTML5
- 每一项都值得你去深入探究哦
  - 用于绘画的canvas元素，可做图片裁剪、创作游戏等等
  - 用于媒介回放的video和audio元素，可插入音乐和视频哦
  - 对本地离线存储的更好的支持，离线你的API哈哈
  - 新的特殊内容元素，比如article、footer、header、nav、section，让你的代码更好懂
  - 新的表单控件，比如calendar、date、time、email、url、search，记得考虑兼容哦
  - 实时通信的websocket，建议同时解一下socket.io
  - 超实用的File API，可以做图片预览等等
  - 当然少不了sessionStorage和localStorage，可以作为页面间的通讯哦

### CSS3
- 可以实现超级酷炫的动画效果，还有漂酿的样式哦
- [w3cPlus](http://www.w3cplus.com/content/css3-gradient)上的CSS3教程不错哦
  - 背景和边框，好看的按钮和阴影
  - 文本效果，可以使用自己设计的字体哦
  - 2D/3D 转换，配合动画和过渡一起使用哦
  - 动画和过渡效果，快使用酷炫的交互效果吧

### javascript
- 原生javascript是基础中的基础，但也是能力最强大的主角呀
- 推荐的书《JavaScript高级程序设计》，《JavaScript 权威指南》，花点钱买本正版吧，收益终身呀
  - 基础的ECMAScript，js的自由度很高的哦
  - DOM，若说浏览器是画布，DOM是画布上的内容，javascript就是画笔吧（瞎编+1）
  - BOM，包括常用的window对象、location对象、history对象等等

## 学会使用和了解框架和库
-----
### CSS框架
- 上面提到的[Bootstrap](http://www.bootcss.com/)，[Font Awesome](http://www.bootcss.com/p/font-awesome/)，[jQuery Mobile](http://jquerymobile.com/)，[jQuery UI](https://jqueryui.com/)都可以去了解看看哦

### LESS/SASS
- [LESS](http://www.bootcss.com/p/lesscss/)将CSS赋予了动态语言的特性，如变量，继承，运算，函数等
- [SASS](http://sass.bootcss.com/docs/sass-reference/)让CSS语言更强大、优雅。它允许你使用变量、嵌套规则、mixins、导入等众多功能，并且完全兼容CSS语法

### jQuery库
- 不得不说这是很强大的js库，曾经在我刚开始工作时帮助我解决了很多问题呢
- 这里有份[《jQuery API中文文档》](http://www.css88.com/jqapi-1.9/)，查询专用哦
  - jQuery可以帮忙解决初期的很多问题哦，例如：
  - 1.消除了JavaScript跨平台兼容问题
  - 2.丰富的DOM选择器，超便利的$()选择器哦
  - 3.可以很容易地浏览文档、选择元素、处理事件以及添加效果
  - 4.ajax操作支持，后面版本的还支持Promise哦
  - 5.允许开发者定制插件，[jQuery form插件](http://www.cnblogs.com/heyuquan/p/form-plug-async-submit.html)不错哦

### [zepto库](http://www.css88.com/doc/zeptojs_api/)
- 轻量级的jQuery库，适合移动端
- 个人觉得了解一下就够了。。除了touch事件有些参考价值，还是jQuery强大多了


### MVC/MVVM框架
- 这是待开拓的一大片领土，每个框架都有自己的特色和优势，很有意思哦
- 虽然说纷繁琳目，但其实选一个喜欢的用起来就好啦，当然生产环境的话得考虑稳定性、社区、维护这些哦
- [AngularJS](http://www.apjs.net/)，MVVM
- [React](http://reactjs.cn/)，MVC的V
- [Underscore](http://www.bootcss.com/p/underscore/)，JavaScript工具库
- [Backbone](http://www.css88.com/doc/backbone/)，MVC，基于underscore.js
- [Vue](http://cn.vuejs.org/)，国人MVVM的VM
- [Avalon](http://avalonjs.github.io/)，国人MVVM


## 前端开发工具
-----
### 编辑器
- DW(Dreamweaver)挺老了，比较重量级
- Sublime Text，很多人在用的
- Hbuilder，本人在用，感觉还不错
- Vim，听说很好用

### Chrome开发者工具/Firebug
- 浏览器调试工具，很强大哦，只需在浏览器右键-检查就能打开啦

### Gulp/Grunt
- 基于任务的javascript命令行构建工具
- 用于任务自动化，创建工作区等

### Mocha/Jasmine/Karma
- Mocha/Jasmine是常用的前端测试框架
- Karma是驱动测试的Runner

### 其它前端工具
- 这里有篇[《各式 Web 前端開發工具整理》](https://github.com/doggy8088/frontend-tools)



## 成为一枚优质前端工程师
-----
### 注意代码规范
- 良好的代码规范对团队合作很有帮助哦
- 本骚年在这方面有警觉，但还是欠缺实践呢...

### 针对性研究
- [《理解Promise》](https://blog.coding.net/blog/how-do-promises-work)
- [《XMLHttpRequest Level 2使用指南》](http://www.ruanyifeng.com/blog/2012/09/xmlhttprequest_level_2.html)
- [《浏览器的渲染原理简介》](http://coolshell.cn/articles/9666.html)
- [《Javascript装载和执行》](http://coolshell.cn/articles/9749.html#jtss-tsina)
- [《一个对前端模板技术的全面总结》](http://www.html-js.com/article/Regularjs-Chinese-guidelines-for-a-comprehensive-summary-of-the-front-template-technology?utm_source=tuicool&utm_medium=referral)
- [《浅谈HTML5单页面架构》](http://www.cnblogs.com/kenkofox/p/4643760.html)

### 深入理解库/框架原理
- 学习研究源代码是个很好的爱好哦，对个人提升也很有帮助呢
- 当然像Bootstrap这样的优秀样式框架很值得阅读，建议直接翻开源码，配合浏览器调试工具一起学习吧
- [《深入理解JavaScript系列》](http://www.sxrczx.com/docs/js/2286877.html)
- [《jQuery源码分析系列》](http://www.cnblogs.com/aaronjs/p/3279314.html)
- [《触碰jQuery：AJAX异步详解》](http://www.cnblogs.com/heyuquan/archive/2013/05/13/3076465.html)
- React精华之虚拟DOM：[《如何实现一个Virtual DOM算法》](https://github.com/livoras/blog/issues/13)
- [《Angular学习笔记》](https://www.zouyesheng.com/angular.html)
- [《Angular源码分析系列》](http://www.html-js.com/article/2145)

### 了解后台工作
- 了解和你一起合作的小伙伴们也是很重要的哦
- PHP、JAVA、Nodejs等服务端语言
- MySQL、MongoDB等数据库

## 培养你的热情
-----
你热爱前端吗？不清楚？
那你喜欢逻辑吗，喜欢设计吗，想要将自己大大的脑洞里面装的所有有趣的都分享出来吗？
我喜欢思考，喜欢想象，热爱学习，沉迷那种把想法写成成果的喜悦。
如果你的热情跟不上，可以尝试一下设计些小项目：
### 博客
这是最大众的选择，但即使是这样普通的网页，依然可以刷上你喜欢的颜色，添加有趣的装饰，贴一些你的想法，分享自己的喜怒哀乐。
还有什么比拥有一个专属自己的空间更值得开心呢？
- 搭建方式： 
  - 1.使用现有工具快速搭建。可选择使用wordpress（基于PHP），或者是hexo(基于nodejs)。网上google教程，一搜一大堆，度娘和谷哥无论生活还是学习都是一强力工具呢（很可惜我的认知能力就到这里了。。）
  - 2.网上下载一些喜欢的博客资源，然后根据自己的爱好进行修改
  - 3.从基础开始，自己搭建。可以从静态页面开始，用最基础的HTML+CSS+javascript(jQuery)来编写你的静态页面吧。一步步实现自己的设计还是个很有成就感的事情呢。[看我用静态页面和PHP搭的很多bug的博客](http://www.godbasin.com/)

### 游戏
当然首先你自己得是个爱玩游戏的骚年。相信你会对自己在游戏中加入的小想法和念头沾沾自喜的。
- 编写选择：
  - 1.idea不足的时候，可以选择自己喜欢的一款游戏，使用前端去编写。
  - 2.又或者可以下载已有的游戏，改成成自己喜欢的样子。
  - 3.脑洞够大的你，当然要写一份自己设计的游戏啦。
看我的[《打嗝的巴士》](http://o969gatx6.bkt.clouddn.com/index.html)和[《弹珠》](http://o969lbf8k.bkt.clouddn.com/ballt.html)

### 动态页面
一个简单但却动效十足的交互页面也是很有意思的哦。可参考[《酷炫HTML5》](http://o95scrds5.bkt.clouddn.com/index.html)
当然这跟HTML5没多大关系，主要用的CSS3，不得不说CSS3太好玩了。

### 静态网页
静态网页可能没有前面的有意思，但也不妨为一种练习设计和基础的方式。
当然酷酷的你肯定可以设计漂亮的静态页面，又或者你可以用多种库和框架练练手呢。
参考入门初期写的一些网页： [《被删动漫》](http://o95u5v08d.bkt.clouddn.com/index.html)和[《Restaurant》](http://o95u208de.bkt.clouddn.com/index.html)

## 结束语
-----
一年多来，我学到的也就这篇文章差不多的东西。
前端很繁荣呢，还有很多很多的领域等待开拓和研究，相信你和我一样都满怀着好奇心和期待呢。
每天期待去上班的，不能只是我一个呀。让你的工作成为你美好生活的一部分吧。