---
title: D3.js-Tree实战笔记1--拜见D3.js
date: 2017-12-31 21:27:57
categories: D3小馒头
tags: 笔记
---

因为业务需要折腾起了图表，《D3.js-Tree 实战笔记》系列用于记录使用该库制作 Tree 图表的一些笔记。本文介绍 svg 和 D3，认识 D3 的概念和作用。

<!--more-->

# SVG 与 D3

不同于 Echarts 使用 Canvas 绘制，D3 主要使用 SVG 来绘制图表，当然现在似乎也支持了 Canvas。

---

## SVG

SVG 是什么呢？

可缩放矢量图形（Scalable Vector Graphics，SVG)，是一种用来描述二维矢量图形的 XML 标记语言。 简单地说，SVG 面向图形，HTML 面向文本。
SVG 与 Flash 类似，都是用于二维矢量图形，二者的区别在于，SVG 是一个 W3C 标准，基于 XML，是开放的，而 Flash 是封闭的基于二进制格式的。

所以，SVG 与 HTML 相似，都是基于元素，同时通过给元素添加样式、属性、事件的方式，来达到交互的目的。

SVG 里面的元素类型，也与 HTML 一样丰富，可以参考[SVG 元素参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element)，这里只先介绍使用比较多的几个，剩下的等遇到的时候再讲吧。

我们找后面将使用到的一个 Tree Demo 来讲吧，在控制台能看到这些元素：
![image](https://about-position-1255459943.file.myqcloud.com/1513414198%281%29.png)

**svg**
我们常常看到两种：

1. `<svg>`为根元素，主要用作矢量图片等。
2. `<svg>`不是根元素，可以用于在当前文档（比如说，一个 HTML 文档）内嵌套一个独立的 svg 片段。这个独立片段拥有独立的视口和坐标系统。

**g**
元素`<g>`是用来组合对象的容器。添加到 g 元素上的变换会应用到其所有的子元素上。添加到 g 元素的属性会被其所有的子元素继承。这里我们使用`<g>`来管理节点对象和 link 连接线对象。

**path**
`<path>`元素是 SVG 基本形状中最强大的一个，它不仅能创建其他基本形状，还能创建更多其他形状。另外，path 只需要设定很少的点，就可以创建平滑流畅的线条（比如曲线，比如上面的贝塞尔曲线）。这里我们使用`<path>`来创建 link 连接线。

**cycle**
`<circle>` SVG 元素是一个 SVG 的基本形状，用来创建圆,基于一个圆心和一个半径。这里我们使用`<circle>`来绘制节点。

**text**
`<text>`元素定义了一个由文字组成的图形。注意：我们可以将渐变、图案、剪切路径、遮罩或者滤镜应用到 text 上。这里我们使用`<text>`来绘制节点描述。

## D3

关于 D3，我希望你已经有一些研究，基本的安装和 API 查找和使用，可以参考[官方文档](https://github.com/d3/d3/wiki)，这里只大致讲述下 D3 库的大致内容。

### D3 是什么

D3 是一个可以基于数据来操作文档的 JavaScript 库。可以帮助你使用 HTML,CSS,SVG 以及 Canvas 来展示数据。D3 遵循现有的 Web 标准，可以不需要其他任何框架独立运行在现代浏览器中，它结合强大的可视化组件来驱动 DOM 操作。

D3 可以将数据绑定到 DOM 上，然后根据数据来计算对应 DOM 的属性值。例如你可以根据一组数据生成一个表格。或者也可以生成一个可以过渡和交互的 SVG 图形。

D3 的运行速度很快，支持大数据集和动态交互以及动画，当然在数量级上去了之后，据说 SVG 性能与 Canvas 还是差了一些的。

下面我们讲几个 D3 中比较关键的概念。

### Selections(选择集)

D3 采用声明式方法，可以对任意节点以及节点集合进行操作:

``` javascript
d3.selectAll("p").style("color", "white"); // selectAll则选中所有匹配的元素

// 同时，可以操作其他节点，而不相互影响
d3.select("body").style("background-color", "black"); // select仅仅选择第一个匹配的元素
```

我们能看到：

1. 选择器方法接受[W3C selector strings](https://www.w3.org/TR/selectors-api/)支持的字符串，比如`.fancy`表示选择类名为`fancy`的元素, `div`选择`DIV`元素。
2. 选择集的方法一般返回当前选择集或一个新的选择集，这样可以支持简明的链式语法。

### 属性操作

在选中元素之后，就可以通过一些方法对元素进行操作。比如设置 a 元素的 name 属性和颜色:

``` javascript
d3
  .select("a")
  .attr("name", "fred")
  .style("color", "red");
```

**动态属性**
或许上面的操作，与 jQuery、Prototype 有相似之处。但是不同的是，样式、属性以及其他属性的值在 D3 中可以是函数形式，而不仅仅是常量。

``` javascript
d3.selectAll("p").style("color", function() {
  return "hsl(" + Math.random() * 360 + ",100%,50%)";
});
```

### 数据绑定

上面这种通过匿名函数动态设置属性、样式值的方法常用来绑定数据。

数据被定义在一个数组中，并且每一个数据值可以作为这个函数的参数，此外还有索引等参数，如我们的 Demo 中则用 id 设为索引，此索引对于后面 enter 和 exit 操作等都有很大的用处。

``` javascript
var node = svg.selectAll("g.node").data(nodes, function(d) {
  return d.id || (d.id = ++i);
});
```

数据绑定操作可以方便的根据具体数据操作 DOM 元素。

将数组类型的 data 与选择集中的元素绑定，返回一个 update 集：数据与元素绑定。因为数据个数未必与元素个数一致，所以又有 enter 和 exit 操作。故在数据绑定操作之后会产生三种选择集：update 集,enter 集以及 exit 集。

### enter 和 exit 操作

数据绑定的时候可能出现 DOM 元素与数据元素个数不匹配的问题，那么 enter 和 exit 就是用来处理这个问题的。

enter 操作用来添加新的 DOM 元素，exit 操作用来移除多余的 DOM 元素。如果数据元素多于 DOM 个数时用 enter，如果数据元素少于 DOM 元素，则用 exit。

通常来说，我们将元素绑定数据的时候，一般会同时定义 enter 和 exit 的操作，会有三种状态：

1. 数据元素与 DOM 元素个数一样时，操作元素。
2. 数据元素个数多于 DOM 元素个数时，动态添加元素，并操作元素。
3. 数据元素个数少于 DOM 元素个数，移除多余元素。

``` javascript
var circle = svg
  .selectAll("circle") // 1
  .data(data) // 2
  .style("fill", "blue"); // 3

circle.exit().remove(); // 4

circle
  .enter()
  .append("circle") // 5
  .style("fill", "green") // 6
  .merge(circle) // 7
  .style("stroke", "black"); // 8
```

这个过程可分解成以下步骤:

1. 当前存在的 circles 被选中。
2. 将新的数据绑定到这些圆上, 返回 update 集。
3. 将 update 集中的圆颜色设置为 blue。
4. 没有数据对应的圆，也就是多余的圆被删除。
5. 新的圆被 appended，也就是圆不够了，会添加新的圆进来。
6. 新加入的圆颜色设置为 green。
7. 将新添加的圆和已存在的圆 union(合并)为一个新的选择集，包括了当前所有的存在的圆。
8. 将当前所有的圆的边线设置为 black。

### 事件处理

selections 允许监听和分发事件以支持交互。

我们可以看到我们的 Demo 中：

``` javascript
var nodeEnter = node
  .enter()
  .append("g")
  .attr("class", "node")
  .attr("transform", function(d) {
    return "translate(" + source.y0 + "," + source.x0 + ")";
  })
  .on("click", click);
```

上面每个节点添加的时候，都会绑定`click`事件，当然这里是 toggle，也就是切换子节点的展开和收起状态。

### 过渡

D3 支持动画效果，这种动画效果可以通过对样式属性的过渡实现。其补间插值支持多种方式，比如线性、弹性等。此外 D3 内置了多种插值方式，比如对数值类型、字符类型路径数据以及颜色等。

D3 中过渡的 API 是 transition，参考[d3-transition](https://github.com/xswei/d3js_doc/tree/master/API/d3-transition-master)。
transition 是一个类 selection 为 DOM 元素进行过渡的接口，可以使 DOM 从当前状态平滑的过渡到目标状态。

除了 D3 提供的过渡之外，也可以通过 CSS 动画来实现对元素的过渡效果。

### 参考

[d3js 简介](https://github.com/xswei/d3js_doc/tree/master/Introduction)
[d3-selection](https://github.com/xswei/d3js_doc/tree/master/API/d3-selection-master)
[d3-transition](https://github.com/xswei/d3js_doc/tree/master/API/d3-transition-master)

令还有个 D3 的教程网站，如果你需要的话：[【 D3.js 入门系列 】 入门总结](http://www.ourd3js.com/wordpress/396/)。

# 结束语

---

这节主要简单介绍了 SVG 和 D3，如果你是一个前端基础不大稳的入门者，建议可以系统看看。如果说你是个经验满满的实战者，那么边做边查边翻源码的方式也是很不错的呢。
