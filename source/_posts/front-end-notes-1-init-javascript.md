---
title: 前端阶段性总结之「掌握javascript」
date: 2017-05-01 11:02:15
categories: 前端满汉全席
tags: 分享
---
该篇主要围绕整理javascript相关的一些基础、原理，以及分享。
<!--more-->

## javascript入门
---
### 入门手册、文档与书籍
重要的事情多说几遍：
一般来说，入门的话，不管是html/css，还是javascript，都能从[w3c](http://www.w3school.com.cn)和[mdn](https://developer.mozilla.org/zh-CN/)上找到。
相对地说，mdn会更加详细和明确一些，也涉及不少较深入的内容呢。

相关入门书籍的话，当然是最经典的《Javascript高级程序设计》和《Javascript权威指南》啦。

本骚年还看过其他的一些书包括：
《Javascript数据结构》
《Javascript忍者秘籍》
《Javascript设计模式与开发实践》
《Javascript DOM编程艺术》
...

要问收获的话，其实都是有的，更重要的是个人的思考和总结吧。

### 理解javascript
除了基础的语法和使用，以下的一些概念或许能帮助到对javascript的理解吧。

- 原型和继承

关于javascript的原型的继承，总有说也说不完的具体细节和场景。我猜，说不定这可以从"javascript中一切皆为对象"这句话的理解开始吧。
而面向对象编程与函数式编程之间的爱恨情仇，也足够讲上好些日子吧，总之小伙伴们有兴趣可以自行谷歌相关的说明。

关于原型和继承的话题，一些需要深入理解的概念包括：构造函数constructor、prototype、__proto__，以及一些方法包括instance of、typeof等等吧。

至于继承，大可大方阅读MDN的[《继承与原型链》](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)：
> 当谈到继承时，Javascript只有一种结构：对象。
> 每个对象都有一个内部链接到另一个对象，称为它的原型prototype。该原型对象有自己的原型，等等，直到达到一个以null为原型的对象。根据定义，null没有原型，并且作为这个原型链prototype chain中的最终链接。

也可以参考阮一峰的[《Javascript继承机制的设计思想》](http://www.ruanyifeng.com/blog/2011/06/designing_ideas_of_inheritance_mechanism_in_javascript.html)、[《Javascript 面向对象编程系列》])(http://www.ruanyifeng.com/blog/2010/05/object-oriented_javascript_encapsulation.html)等等。

其实像很多其他的事物一样，即使是各种各样的设计和方法，都不过为一些达到目的的手段，我们的目标当然是更优秀的体验效果和性能啦。

- 作用域/原型链
- 闭包
- this和上下文

其实上面这些概念都是很相近或是紧密相关的，很久以前本骚年也写过相关的理解和分享，可查阅[《谈谈js的闭包》](https://godbasin.github.io/2016/07/03/js-closure/)和[《谈谈js的this》](https://godbasin.github.io/2016/07/02/js-this/)。
当然，更好的方法当然是找度娘和谷歌找相关的文章阅读啦，本骚年看回当年的文章也觉得不是十分清晰明了。

- JSON

JSON其实是个比较有意思的存在，它是独立的个体，但也跟javascript密切相关。
需要注意的是，JSON是一种数据格式，而不是编程语言。

- 事件冒泡、捕获和委托

关于浏览器事件的理解，可以对性能优化有些简单的了解吧。

这些概念说是基础，但是要理解其实还是需要一定的时间和实践的。本骚年建议可以先初步了解，后续每隔一段时间可以做些回顾和总结，你会发现你看到的，是越来越深入的认识、越来越辽阔的视野。

### 掌握一些API
除了javascript语言自带的语法，还有一些很重要的API，包括以下相关的。

- [DOM对象](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model)

文档对象模型(DOM)是HTML和XML文档的编程接口。它给文档（结构树）提供了一个结构化的表述并且定义了一种方式—程序可以对结构树进行访问，以改变文档的结构，样式和内容。
DOM提供了一种表述形式—将文档作为一个结构化的节点组以及包含属性和方法的对象。从本质上说，它将web页面和脚本或编程语言连接起来了。

- [Window对象](https://developer.mozilla.org/zh-CN/docs/Web/API/Window)

Window对象表示一个包含DOM文档的窗口，其document属性指向窗口中载入的DOM文档 。使用document.defaultView属性可以获取指定文档所在窗口。
Window对象其实只是javascript涉及的其中一个环境对象，当我们开始学习Nodejs的时候会涉及更多系统层面的内容吧。

其实Window对象也只是BOM对象中的一种，BOM对象包括window/location/navigator/screen/histiry等等，都是需要掌握的。

- [AJAX/XHR](https://developer.mozilla.org/zh-CN/docs/AJAX)

异步JavaScript + XML, 虽然它本身不是一种技术, 是一个术语, 描述了一种将新的现有技术一起使用的“新”方法，包括: HTML 或 XHTML, CSS, JavaScript, DOM, XML, XSLT, 最重要的是[XMLHttpRequest对象](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest)。

- 正则表达式

正则表达式可谓是编程利器，可惜本骚年对它总是束手无策，入门级别可参考文章[《正则表达式30分钟入门教程》](http://deerchao.net/tutorials/regex/regex.htm)。

## 结束语
-----
其实掌握javascript的关键在于多实践和总结，一边学一边练的效果总是最棒的。关于入门其实本骚年也忘得差不多了，这里有当年总结过的一篇[《我的前端入门之路》](https://godbasin.github.io/2016/06/24/front-end-getting-started/)。
两年多了，作为一个前端到现在，依然感觉更重要的是热情以及学习方法。