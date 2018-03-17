---
title: D3.js-Tree实战笔记3--动态请求子节点
date: 2018-02-03 13:02:17
categories: D3小馒头
tags: 笔记
---

因为业务需要折腾起了图表，《D3.js-Tree 实战笔记》系列用于记录使用该库制作 Tree 图表的一些笔记。本文介绍动态获取节点数据，并添加子节点的过程。

<!--more-->

# 动态获取子节点数据

---

## 拆分模块

在后面越来越多的功能增加之前，我们要把代码进行下整理，模块拆分首先就是一个整理逻辑的过程。

首先，我们的 Demo 大概可以拆分成这些模块：

1. 初始化 D3 基本能力（设置宽高等）。
2. 数据初始化绑定。
3. 数据更新绑定。
4. node 交互和绘制。
5. link 交互和绘制。
6. 单击节点事件处理。
7. 双击获取子节点事件处理（本节新增）。

由于代码篇幅稍微多一些，这里调整后一致在文末体现哈。

## Tree node

**d3.tree(root)**
使用默认的设置构建一个树图布局生成器。

根据指定的根节点代表的 hierarchy 数据生成一个树状布局数据，每个节点包含以下属性:

* node.x：节点的 x 坐标
* node.y：节点的 y 坐标

为了动态获取时，能有效生成子节点，我们来看看一个 tree node 里面包含了哪些属性：

![image](http://o905ne85q.bkt.clouddn.com/1513514218%281%29.png)

由于`d3.tree()`能自动计算生成 x 和 y 位置，而 id、x0、y0 等则是批量处理生成，故我们主要需要添加的属性有：

* depth：该节点的层级数，主要用于 y 的计算，避免重叠
* parent：保存父节点的信息，用于绘制 link 关系
* children：保存子节点的信息

这里分析 tree node 的信息，用于后面动态获取节点信息，手动添加子节点和更新图表。

## 绑定双击事件

因为我们上面使用了单击来展开和收起子节点，因此这里我们将使用双击来获取子节点。我们在节点 enter 时增加的 click 事件，这里我们再添加个 dbclick 的事件绑定：

```js
// 添加enter操作，添加类名为node的group元素
var nodeEnter = node
  .enter()
  // ...其他操作
  // 给每个新加的节点绑定click事件
  .on("click", click)
  // 给每个新加的节点绑定dbclick事件
  .on("dblclick", dblclick);
```

然后我们需要添加 dblclick 函数，主要处理逻辑包括：

1. 检查该节点是否已经请求过，已请求过则忽略。
2. 随机请求`1.json` - `5.json`随机获取数据。
3. 获取到数据后，手动给节点添加子节点，同时子节点设置 parent 为该节点。
4. 更新图表。

我们将请求到的数据存在节点的`data`属性中，同时根据上面 tree node 节点的分析，我们需要手动给子节点添加对应的属性，包括`name`、`depth`、`parent`等。

我们能得到这样的 dblclick 函数：

```js
// 将获取到的节点，添加进data对象中，同时若已获取过不再获取
function dblclick(d) {
  // 若无d.data.children，则视为未获取
  if (!(d.data && d.data.children)) {
    // 这里模拟请求，1.json - 5.json 随机获取数据
    var randomNum = Math.floor(Math.random() * 5) + 1;
    d3.json(randomNum + ".json", function(error, data) {
      if (error) throw error;
      // 给子节点绑定父节点
      var children = data.children.map(x => {
        return {
          name: x.name,
          parent: d,
          depth: d.depth + 1,
          data: {
            ...x
          }
        };
      });
      // 将子节点数据绑定在d节点上
      // 若子节点为空，则不执行
      if (children.length) d.children = children;
      // 同时也绑到data上
      d.data.children = children;
      updateChart(d);
    });
  }
}
```

上面为什么我们要使用`data.children`来判断是否已经加载过呢？这是因为 d3 中 node 的 children 不接受空数组，只能为非空数组或是`null`。而`null`可能有两种情况：收起、无子节点。同时为了方便后续数据处理，我们使用`data`属性来保存一切获取来的信息数据。

准备就绪，我们将初始的数据设置为首层节点数据：

```js
var treeData = {
  name: "Top Level"
};
```

## 节点状态定义

因为加入 Ajax 获取信息后，节点的状态将会增加，我们给节点添加一些规则：

1. 当未获取子节点信息时，将节点填充灰色，来表示待获取。
2. 当节点拥有子节点、并处于收起状态时，将节点填充浅蓝色，表示拥有子节点。
3. 当节点查无子节点，或是已展开，均无填充状态。

其实只增加了一种状态：是否已获取数据。我们会需要在节点 enter 以及 update 的时候需要增加这个状态。同上，我们使用`data.children`来判断是否已经加载过：

```js
node
  // ...其他操作
  .style("fill", function(d) {
    return d._children ? "lightsteelblue" : d.data.children ? "#fff" : "#ccc";
  });
```

## 双击单击的冲突解决

我们在使用中会发现，双击事件同时会触发两次的单击时间，这其实是不合理的，我们通过添加定时器来解决：

```js
// 当点击时，切换children，同时用_children来保存原子节点信息
function click(d) {
  if (d._clickid) {
    // 若在200ms里面点击第二次，则不做任何操作，清空定时器
    clearTimeout(d._clickid);
    d._clickid = null;
  } else {
    // 首次点击，添加定时器，200ms后进行toggle
    d._clickid = setTimeout(() => {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      updateChart(d);
      d._clickid = null;
    }, 200);
  }
}
```

最终我们效果将会如图：
![image](http://o905ne85q.bkt.clouddn.com/1513505937%281%29.png)

# 结束语

---

本节我们添加了节点动态获取子节点的功能，同时给节点加上已读状态，同时处理好单击双击的事件冲突。
我们在完成基本需求的同时，也需要主动改善用户体验，或是不合理的地方要主动提出来，因为说好的要把最棒的一面呈现世间的呢。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/d3-tree-notes/3-ajax-for-node)
[此处查看页面效果](http://p13oygsq6.bkt.clouddn.com/3-ajax-for-node/index.html)
