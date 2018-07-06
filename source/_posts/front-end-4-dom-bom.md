---
title: 前端入门4--DOM和BOM
date: 2018-04-29 14:06:40
categories: js什锦
tags: 分享
---
《前端入门》系列主要为个人对前端一些经验和认识总结。Javascript 包括三块：ECMAScript、DOM和BOM，本文主要介绍 DOM 和 BOM。
<!--more-->

# DOM
## 什么是 DOM
文档对象模型 (`DOM`) 是`HTML`和`XML`文档的编程接口。
`DOM`将文档解析为一个由节点和对象（包含属性和方法的对象）组成的结构集合。

尽管通常会使用`JavaScript`来访问`DOM`， 但它并不是`JavaScript`的一部分，它也可以被其他语言使用。

## DOM 解析
我们常见的`HTML`元素，在浏览器中会被解析成节点：
![image](http://o905ne85q.bkt.clouddn.com/ct_htmltree.gif)

在控制台，我们也能比较清晰地看到这样的层级关系：

![image](http://o905ne85q.bkt.clouddn.com/%7BEA4AA8AF-DB12-4B48-8A6A-E71099D1A942%7D.png)

**节点树中的节点彼此拥有层级关系。**
父（`parent`）、子（`child`）和同胞（`sibling`）等术语用于描述这些关系。父节点拥有子节点。同级的子节点被称为同胞（兄弟或姐妹）。
- 在节点树中，顶端节点被称为根（`root`）
- 每个节点都有父节点、除了根（它没有父节点）
- 一个节点可拥有任意数量的子
- 同胞是拥有相同父节点的节点

**通过`HTML DOM`，树中的所有节点均可通过`JavaScript`进行访问。所有`HTML`元素（节点）均可被修改，也可以创建或删除节点。**

## DOM接口
`DOM`接口主要用于操作`DOM`节点，如常见的增删查改。

在 web 和 XML 页面脚本中使用 DOM 时，一些常用的 API 如下：
- `document.getElementById(id)`：根据`id`获取元素
- `document.getElementsByTagName(name)`：根据`tag`获取元素
- `document.createElement(name)`：创建元素
- `parentNode.appendChild(node)`：添加子元素
- `element.innerHTML`：设置/获取元素内容
- `element.styles`：设置/获取元素样式
- `element.setAttribute()`：设置元素属性值
- `element.getAttribute()`：获取元素属性值
- `element.addEventListener()`：添加事件绑定

通常什么时候会用呢，最常见的便是列表的维护，包括增加新的选项、删除某个、修改某个等等。

在浏览器兼容性问题很多的时候，我们常常会使用`jQuery`来进行些`DOM`操作，如今兼容性问题逐渐变少，大家更倾向于用原生`DOM`接口来进行操作。

## DOM 事件流
事件流所描述的就是从页面中接受事件的顺序。
**DOM事件流（`event  flow`）存在三个阶段：事件捕获阶段、处于目标阶段、事件冒泡阶段。**
1. 捕获阶段：一开始从文档的根节点流向目标对象；
2. 目标阶段：然后在目标对向上被触发；
3. 冒泡阶段：之后再回溯到文档的根节点。

### 事件捕获
当鼠标点击或者触发 dom 事件时，浏览器会从根节点开始由外到内进行事件传播，即点击了子元素，如果父元素通过事件捕获方式注册了对应的事件的话，会先触发父元素绑定的事件。

在事件捕获的概念下在`p`元素上发生`click`事件的顺序应该是`document -> html -> body -> div -> p`。

### 事件冒泡
与事件捕获恰恰相反，事件冒泡顺序是由内到外进行事件传播，直到根节点。

在事件冒泡的概念下在`p`元素上发生`click`事件的顺序应该是`p -> div -> body -> html -> document`。

**`DOM`标准事件流的触发的先后顺序为：先捕获再冒泡，即当触发 dom 事件时，会先进行事件捕获，捕获到事件源之后通过事件传播进行事件冒泡。**

不同的浏览器对此有着不同的实现，IE10 及以下不支持捕获型事件，所以就少了一个事件捕获阶段，IE11、Chrome 、Firefox、Safari等浏览器则同时存在。

曾经踩过 IE9 中`button`的坑，例如`<button><span></span></button>`，如果我们分别在`button`以及`span`里均绑定`click`事件，则`span`的事件不会被触发。不知道这个跟事件机制是否相关呢？

**addEventListener**
`addEventListener`的第三个参数就是为冒泡和捕获准备的.
`addEventListener`有三个参数：

``` js
element.addEventListener(event, function, useCapture)
```

- `event`：需要绑定的事件
- `function`：触发事件后要执行的函数
- `useCapture`：默认值是false，表示在事件冒泡阶段调用事件处理函数。如果参数为true，则表示在事件捕获阶段调用处理函数。

### 事件委托
基于事件冒泡机制，我们可以实现将子元素的事件委托给父级元素来进行处理。
当我们需要对很多元素添加事件的时候，可以通过将事件添加到它们的父节点而将事件委托给父节点来触发处理函数。

这样能解决什么问题呢？
1. 绑定子元素会绑定很多次的绑定，而绑定父元素只需要一次绑定。
2. 将事件委托给父节点，这样我们对子元素的增加和删除、移动等，都不需要重新进行事件绑定。

很常见的就是我们有个列表，每个选项都可以进行编辑、删除、添加标签等功能，而把事件委托给父元素或者`document`，不管我们新增、删除、更新选项，都不需手动去绑定和移除事件。

最常在`jQuery`中使用事件委托：

``` js
$("#my-list").delegate("button", "click", function(){
  // "$(this)"是被click的元素
  console.log("you clicked a button",$(this));
});
```

现在我们基本上都使用框架了，我们可以随意地在元素上绑定事件，如 Vue 中`<div @click="myClickEvent" />`，因为框架会帮我们用事件委托的方式处理掉，大部分都会绑定在最外层初始化的`id`元素，或者是`document`吧。

## 虚拟DOM
一个`DOM`节点元素，其实是很复杂的，包含了很多的属性和方法。

我们来简单打印一下一个`DOM`元素：
![image](http://o905ne85q.bkt.clouddn.com/1512633321%281%29.png)

看到右边的滚动条了没，有如此之多的属性。

所以随着应用程序越来越复杂，`DOM`操作越来越频繁，需要监听事件和在事件回调用更新页面的DOM操作也越来越多，性能消耗则会比较大。于是乎，虚拟`DOM`的想法便被人提出并实现了。

虚拟`DOM`其实是用来模拟真实`DOM`的中间产物，主要包括以下功能：

**1. 用`JS`对象模拟`DOM`树，简化`DOM`对象。**

简单来说，就是用一个对象模拟，保留主要的一些`DOM`属性，其他的则去掉。

**2. 使用虚拟`DOM`，结合操作`DOM`的接口，来生成真实`DOM`。**

使用假`DOM`生成真`DOM`，同时保持真实`DOM`对象的引用，以便3步骤的执行。

**3. 更新`DOM`时，比较两棵虚拟`DOM`树的差异，局部更新真实`DOM`。**

这个就比较有意思，可以根据数据的变化，来最小化地移动、替换、删除原有的`DOM`元素。

结合使用以上功能，便能在复杂应用中更好地维护了。

## 参考
[《javascript学习笔记（三）BOM和DOM详解》](http://www.jb51.net/article/55851.htm)
[DOM | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model/Introduction)
[《浏览器的渲染原理简介》](https://coolshell.cn/articles/9666.html)
[《JavaScript 详说事件机制之冒泡、捕获、传播、委托》](http://www.cnblogs.com/bfgis/p/5460191.html)


# BOM
## 什么是BOM
`BOM`是`Browser Object Model`，浏览器对象模型。主要处理浏览器窗口和框架，不过通常浏览器特定的`JavaScript`扩展都被看做`BOM`的一部分。
`BOM`是各个浏览器厂商根据`DOM`在各自浏览器上的实现，表现为不同浏览器定义有差别，实现方式不同。

`javacsript`是通过访问`BOM`对象来访问、控制、修改客户端(浏览器)。

## BOM与DOM
`DOM`（`Document Object Model`文档对象模型）是为了操作文档出现的`API`，包括`document`。
`BOM`（`Browser Object Model`浏览器对象模型）是为了操作浏览器出现的`API`，包括`window`/`location`/`history`等。

由于`BOM`的`window`包含了`document`，换个角度讲，`BOM`包含了`DOM`(对象)，浏览器提供出来给予访问的是`BOM`对象，从`BOM`对象再访问到`DOM`对象，从而`js`可以操作浏览器以及浏览器读取到的文档。

以上都是一些默认或是传说，但其实浏览器对象模型`BOM`尚无正式标准。

## window对象
所有浏览器都支持`window`对象。它表示浏览器窗口。
所有`JavaScript`全局对象、函数以及变量均自动成为`window`对象的成员。
全局变量是`window`对象的属性，全局函数是`window`对象的方法。

`window`对象包括：
- `window.screen`对象：包含有关用户屏幕的信息
- `window.location`对象：用于获得当前页面的地址(URL)，并把浏览器重定向到新的页面
- `window.history`对象：浏览历史的前进后退等
- `window.navigator`对象：常常用来获取浏览器信息、是否移动端访问等等
- `JavaScript`消息框：`alert()`等
- `JavaScript`计时：`setTimeout()`等

## 参考
[《javascript学习笔记（三）BOM和DOM详解》](http://www.jb51.net/article/55851.htm)

## 结束语
---
DOM 和 BOM，会在我们日常实战中会经常用到，但是很多时候我们都只觉得自己在使用 Javascript。
当我们开始写 node.js 的时候，才会发现其中很多的不一致吧~