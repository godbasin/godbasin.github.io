---
title: D3.js-Tree实战笔记4--添加拖动和缩放
date: 2018-02-07 15:11:52
categories: D3小馒头
tags: 笔记
---

因为业务需要折腾起了图表，《D3.js-Tree 实战笔记》系列用于记录使用该库制作 Tree 图表的一些笔记。本节我们来给图表添加拖动和缩放吧。

<!--more-->

# 添加鼠标事件

---

## d3-zoom

不得不说，这节我们增加的拖动和缩放功能，都是通过`d3-zoom`模块来完成的。
`d3-zoom`可以对 selections 进行平移和缩放，它封装了浏览器支持的 input events 并对浏览器兼容性做了处理。

我们先来介绍下基本的 API：

**d3.zoom()**
创建一个 zoom 操作。返回一个 zoom 对象方法，通常被传递给 selection.call 来调用。

**zoom.scaleExtent([extent])**
设置或获取缩放范围。默认为`[0, ∞]`。

```js
// 这里我们创建了zomm操作，同时通过scaleExtent设置缩放区域为0.1-100倍。
var zoom = d3.zoom().scaleExtent([0.1, 100]);
```

**zoom.on(typenames[, listener])**
三种情况：设置，取消，获取事件监听器。

1. 如果指定了 listener，则为对应的 typenames 设置事件监听器。
2. 如果 listenter 为 null，则取消对应的 typenames 监听器。
3. 如果没有指定 listenter，则返回对应的 typenames 监听器。

typenames 是一个字符串，由 type 和 name 组成。也就是可以为同一种事件类型添加多个监听器。type 必须为如下几种：

* start：开始缩放 (比如鼠标按下)
* zoom：开始缩放变换(比如拖拽)
* end：缩放结束(比如鼠标抬起 )

```js
var zoom = d3
  .zoom()
  // 设置缩放区域为0.1-100倍
  .scaleExtent([0.1, 100])
  // 监听缩放变换事件，包括拖动和滚轮
  .on("zoom", () => {});

// 绑定zoom事件，通过单独定义dblclick.zoom，释放zoom双击事件（默认为双击放大，会与动态请求冲突）
selection.call(zoom).on("dblclick.zoom", () => {});
```

更多的 API 详情，请参考[d3-zoom](https://github.com/xswei/d3js_doc/tree/master/API/d3-zoom-master)。

## Zoom Events

当 zoom event listener 被调用时, d3.event 会被设置为当前的 zoom 事件。zoom event 对象由以下几部分组成:

* target：当前的缩放 zoom behavior。
* type：事件类型:“start”, “zoom” 或者 “end”; 参考 zoom.on。
* transform：当前的 zoom transform(缩放变换)。
* sourceEvent：原始事件, 比如 mousemove 或 touchmove。

```js
zoom.on("zoom", () => {
  // 可以获取zoom事件当前的缩放状态
  console.log(d3.event.transform);
});
```

## 添加 zoom 事件的处理

svg 里面包括很多的子元素，我们这里采用给整个 svg 添加 zoom 事件，来进行完整的缩放和拖动处理：

```js
// 这里我们将svg元素，和子group元素拆分
var svg = d3
  .select("body")
  .append("svg")
  .attr("width", width + margin.right + margin.left)
  .attr("height", height + margin.top + margin.bottom);

// 子group元素存为view变量
var view = svg
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// 创建zoom操作
var zoom = d3
  .zoom()
  // 设置缩放区域为0.1-100倍
  .scaleExtent([0.1, 100])
  .on("zoom", () => {
    // 子group元素将响应zoom事件，并更新transform状态
    view.attr(
      "transform",
      "translate(" +
        (d3.event.transform.x + margin.left) +
        "," +
        (d3.event.transform.y + margin.top) +
        ") scale(" +
        d3.event.transform.k +
        ")"
    );
  });

// svg层绑定zoom事件，同时释放zoom双击事件
svg.call(zoom).on("dblclick.zoom", () => {});
```

这里，不管是鼠标滚轮的事件还是拖动事件，都会触发 zoom 事件响应。如果说滚轮事件与页面上下滚动事件相斥的话，我们可以通过`zoom.filter()`来过滤。我们如果想要改成按下 ctrl 键的同时，滚动鼠标滚轮才进行缩放，可以这样修改：

```js
var zoom = d3
  .zoom()
  .scaleExtent([0.1, 100])
  .filter(function() {
    // isWheelEvent为是否滚轮事件
    var isWheelEvent = d3.event instanceof WheelEvent;
    // 返回是否ctrl与滚轮同时触发
    return !isWheelEvent || (isWheelEvent && d3.event.ctrlKey);
  })
  .on("zoom", () => {});
```

效果如图，缩放前：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1513511660%281%29.png)

放大后：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1513511993%281%29.png)

## 根据节点数量和层级调整间距

而当我们的层级树和子节点树上去之后，我们的节点会挤到一起，而要避免文字被遮挡，需要调整间距。

我们先来定义两个函数方法，分别用来获取最深层数和最大子节点数。

```js
// 获取最多的子节点数
function getMax(obj) {
  let max = 0;
  if (obj.children) {
    max = obj.children.length;
    obj.children.forEach(d => {
      const tmpMax = this.getMax(d);
      if (tmpMax > max) {
        max = tmpMax;
      }
    });
  }
  return max;
}

// 获取最深层级数
function getDepth(obj) {
  var depth = 0;
  if (obj.children) {
    obj.children.forEach(d => {
      var tmpDepth = this.getDepth(d);
      if (tmpDepth > depth) {
        depth = tmpDepth;
      }
    });
  }
  return 1 + depth;
}
```

同时，我们在每次更新节点状态时，重新进行 tree 的大小调整：

```js
function updateChart(source) {
  // 大致计算需要放大的倍数
  var scale = (getDepth(root) / 8 || 0.5) + (getMax(root) / 12 || 0.5);
  // 定义Tree层级，并设置宽高
  var treemap = d3.tree().size([height * scale, width]);
  // 其他处理
}
```

# 结束语

---

本节我们添加了鼠标操作，包括滚轮缩放和拖动，主要依靠 d3-zoom 模块来实现。同时，考虑文字重叠，也进行了些处理。
细心的小伙伴们或许会发现 d3-drag 模块，骚年还没用到，不过或许区别在于整体的拖动和单个元素的拖动吧。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/d3-tree-notes/4-zoom-amd-drag)
[此处查看页面效果](http://p13oygsq6.bkt.clouddn.com/4-zoom-amd-drag/index.html)
