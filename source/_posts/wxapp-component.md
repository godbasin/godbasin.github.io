---
title: 小程序自定义组件知多少
date: 2019-02-23 22:38:58
categories: 小程序双皮奶
tags: 教程
---
小程序里，自定义组件作为一个贯穿小程序架构核心的组成，你对它又掌握了多少呢？
<!--more-->

# 自定义组件

## why
### 代码的复用
在起初小程序只支持 Page 的时候，就会有这样蛋疼的问题：多个页面有相同的组件，每个页面都要复制粘贴一遍，每次改动都要全局搜索一遍，还说不准哪里改漏了就出翔了。

### 组件化设计
在前端项目中，组件化是很常见的方式，某块通用能力的抽象和设计，是一个必备的技能。组件的管理、数据的管理、应用状态的管理，这些在我们设计的过程中都是需要去思考的。当然你也可以说我就堆代码就好了，不过一个真正的码农是不允许自己这么随便的！

所以，组件化是现代前端必须掌握的生存技能！

## 自定义组件的实现
### 一切都从 Virtual DOM 说起
前面[《解剖小程序的 setData》](https://godbasin.github.io/2018/10/05/wxapp-set-data/)有讲过，基于小程序的双线程设计，视图层（Webview 线程）和逻辑层（JS 线程）之间通信（表现为 setData），是基于虚拟 DOM 来实现数据通信和模版更新的。

自定义组件一样的双线程，所以一样滴基于 Virtual DOM 来实现通信。那在这里，Virtual DOM 的一些基本知识（包括生成 VD 对象、Diff 更新等），就不过多介绍啦~

### Shadow DOM 模型
基于 Virtual DOM，我们知道在这样的设计里，需要一个框架来支撑维护整个页面的节点树相关信息，包括节点的属性、事件绑定等。在小程序里，Exparser 承担了这个角色。

前面[《关于小程序的基础库》](https://godbasin.github.io/2018/09/23/wxapp-basic-lib/)也讲过，Exparser 的主要特点包括：
- 基于 Shadow DOM 模型
- 可在纯 JS 环境中运行

Shadow DOM 是什么呢，它就是我们在写代码时候写的自定义组件、内置组件、原生组件等。Shadow DOM 为 Web 组件中的 DOM 和 CSS 提供了封装。Shadow DOM 使得这些东西与主文档的 DOM 保持分离。

简而言之，Shadow DOM 是一个 HTML 的新规范，其允许开发者封装 HTML 组件（类似 vue 组件，将 html，css，js 独立部分提取）。

例如我们定义了一个自定义组件叫`<my-component>`，你在开发者工具可以见到：
![Shadow DOM](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/wxapp-component-1.jpg)

`#shadow-root`称为影子根，DOM 子树的根节点，和文档的主要 DOM 树分开渲染。可以看到它在`<my-component>`里面，换句话说，`#shadow-root`寄生在`<my-component>`上。`#shadow-root`可以嵌套，形成节点树，即称为影子树（Shadow Tree）。

像这样：
![Shadow Tree](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/wxapp-component-2.jpg)

### Shadow Tree 拼接
既然组件是基于 Shadow DOM，那组件的嵌套关系，其实也就是 Shadow DOM 的嵌套，也可称为 Shadow Tree 的拼接。

Shadow Tree 拼接是怎么做的呢？一切又得从模版引擎讲起。

我们知道，Virtual DOM 机制会将节点解析成一个对象，那这个对象要怎么生成真正的 DOM 节点呢？数据变更又是怎么更新到界面的呢？这大概就是模版引擎做的事情了。

[《前端模板引擎》](https://godbasin.github.io/2017/10/21/template-engine/)里有详细描述模版引擎的机制，通常来说主要有这些：
- DOM 节点的创建和管理：`appendChild`/`insertBefore`/`removeChild`/`replaceChild`等
- DOM 节点的关系（嵌套的处理）：`parentNode`/`childNodes`
- 通常创建后的 DOM 节点会保存一个映射，在更新的时候取到映射，然后进行处理（通常包括替换节点、改变内容`innerHTML`、移动删除新增节点、修改节点属性`setAttribute`）

在上面的图我们也可以看到，在 Shadow Tree 拼接的过程中，有些节点并不会最终生成 DOM 节点，例如`<slot>`这种。

但是，常用的前端模版引擎，能直接用在小程序里吗？

## 双线程的难题
### 自定义组件渲染流程
双线程的设计，给小程序带来了很多便利，安全性管控力都拥有了，当然什么鬼东西都可以比作一把双刃剑，双线程也不例外。

我们知道，小程序分为 Webview 和 JS 双线程，逻辑层里是没法拿到真正的 DOM 节点，也没法随便动态变更页面的。那在这种情况下，我们要怎么去使用映射来更新模版呢（因为我们压根拿不到 Webview 节点的映射）？

所以在双线程下，其实两个线程都需要保存一份节点信息。这份节点信息怎么来的呢？其实就是我们需要在创建组件的时候，通过事件通知的方式，分别在逻辑层和视图层创建一份节点信息。

同时，视图层里的组件是有层级关系的，但是 JS 里没有怎么办？为了维护好父子嵌套等节点关系，所以我们在 逻辑层也需要维护一棵 Shadow Tree。

那么我们自定义组件的渲染流程大概是：
1. 组件创建。
  - 逻辑层：先是 wxml + js 生成一个 JS 对象（因为需要访问组件实例 this 呀），然后是 JS 其中节点部分生成 Virtual DOM，拼接 Shadow Tree 什么的，最后通过底层通信通知到 视图层
  - 视图层：拿到节点信息，然后吭哧吭哧开始创建 Shadow DOM，拼接 Shadow Tree 什么的,最后生成真实 DOM，并保留下映射关系
2. 组件更新。

这时候我们知道，不管是逻辑层，还是视图层，都维护了一份 Shadow Tree，要怎么保证他们之间保持一致呢？

### 让 JS 和 Webview 的组件保持一致
为了让两边的 Shadow Tree 保持一致，可以使用同步队列来传递信息。（这样就不会漏掉啦）

同步队列可以，每次变动我们就往队列里塞东西就好了。不过这样还会有个问题，我们也知道 setData 其实在实际项目里是使用比较频繁的，要是像 Component 的 observer 里做了 setData 这类型的操作，那不是每次变动会导致一大堆的 setDate？这样通信效率会很低吧？

所以，其实可以把一次操作里的所有 setData 都整到一次通信里，通过排序保证好顺序就好啦。

## Page 和 Component
### Component 是 Page 的超集
事实上，小程序的页面也可以视为自定义组件。因而，页面也可以使用`Component`构造器构造，拥有与普通组件一样的定义段与实例方法。但此时要求对应 json 文件中包含`usingComponents`定义段。

> 来自[官方文档-Component](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html)

所以，基于 Component 是 Page 的超集，那么其实组件的渲染流程、方式，其实跟页面没多大区别，应该可以一个方式去理解就差不多啦。

### 页面渲染
既然页面就是组件，那其实页面的渲染流程跟组件的渲染流程基本保持一致。

视图层渲染，可以参考[7.4 视图层渲染](https://developers.weixin.qq.com/ebook?action=get_post_info&token=935589521&volumn=1&lang=zh_CN&book=miniprogram&docid=00024a319d00b87b008612f5f5640a)说明。

## 结束语
---
其实很多新框架新工具出来的时候，经常会让人眼前一亮，觉得哇好厉害，哇好高大上。
但其实更多时候，我们需要挖掘新事物的核心，其实大多数都是在原有的事物上增加了个新视角，从不一样的视角看，看到的就不一样了呢。作为一名码农，我们要看到不变的共性，变化的趋势。