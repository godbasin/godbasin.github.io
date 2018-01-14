---
title: D3.js-Tree实战笔记2--简单的Tree demo
date: 2018-01-01 14:11:53
categories: D3小馒头
tags: 笔记
---

因为业务需要折腾起了图表，《D3.js-Tree 实战笔记》系列用于记录使用该库制作 Tree 图表的一些笔记。本文介绍基本场景，以及选择 demo 的过程。

<!--more-->

# 基本场景

---

## Tree 图与服务

首先我们来看个简单的图：
![image](http://o9bc2k1st.bkt.clouddn.com/1513409805%281%29.png)

没错，这就是个简单的树状图。 本骚年此次要解决的问题包括：

1. 每一层的子节点为动态请求加载。
2. 子节点可以收起和展开。
3. 服务的层级最多为 15 层，每层数量最多或许在 20 左右，需要考虑文字是否重叠。
4. 支持鼠标滚动缩放 + 鼠标拖动。
5. 节点根据服务类型展示为不同的样式。
6. 鼠标放置在节点上，需要展示更多的内容。
7. 连接线需要展示该链路的一些状态和信息（容量大小等）。
8. 连接线根据链路当前状态，需要展示为不同颜色。

以上等等。其实大致数据内容大家也大概能猜到了，主要展示服务的调用关系，以及状态信息、容灾能力等，方便整体的管理和维护。

## 选择插件库

本骚年首先翻了翻 Echarts（毕竟配置化的用起来简单），很可惜 Echarts 翻来翻去都木有树状图（别翻了，本骚年完成了这个开发工作的时候，它突然又提供支持了）。

D3 之前也有稍微看过，对比 Echarts 的使用简单，它似乎更适合个性化或者说不是那么通用的场景（对，就是本骚年的这次需求了）。

关于 D3 和 Echarts 的对比，网上有人说（感觉挺有道理的）：

* D3 属于是基础的绘图库(基于 canvas 的, 所以可以说完全不做兼容考虑)，封装的功能都是一些基础图形图像和动画这类的，但是功能异常强大。
* Echarts 属于应用型(或者业务型)的图表库， 期望的是： 几乎不需要写绘图过程代码就能生成漂亮的图表。

决定好要使用 D3 之后，看了下，D3 最新版本为 v4，而网上很多的 demo 都是基于 v3 的，但是作为一个对自己有要求的程序员，怎么可以容忍使用旧版本呢！

其实真相是这样的：
![image](http://o9bc2k1st.bkt.clouddn.com/1513412297%281%29.png)

Sign~

而 v4 版本相对 v3 版本的变更，其实很关键的是模块化，更多的可以参考[D3 4.0 做了哪些改进](https://github.com/xswei/d3js_doc/tree/master/ReleaseNotes)。

## 寻找 Demo

来，我们再从网上找个现有的 Demo 下手吧，就它了：[Collapsible tree diagram in v4](https://bl.ocks.org/d3noob/43a860bc0024792f8803bba8ca0d5ecd)。这里还有个 v3 版本的，大家可以对比着看一下：[Interactive d3.js tree diagram](http://bl.ocks.org/d3noob/8375092)。

其实 v4 和 v3 版本，不一致的地方比较关键的是`link`连接线的绘制，`diagonal`函数：

``` javascript
// v3
var diagonal = d3.svg.diagonal().projection(function(d) {
  return [d.y, d.x];
});

// v4
function diagonal(s, d) {
  path = `M ${s.y} ${s.x}
          C ${(s.y + d.y) / 2} ${s.x},
            ${(s.y + d.y) / 2} ${d.x},
            ${d.y} ${d.x}`;
  return path;
}
```

我们看看[官方文档 v3](https://github.com/d3/d3/wiki/SVG-%E5%BD%A2%E7%8A%B6#diagonal)的描述。

`d3.svg.diagonal()`：使用默认的配置构造一个对角线生成器；返回值可以用来当做函数使用来生成三次贝塞尔曲线数据，该曲线的若干条切线可以保证节点连接处会有平滑的介入效果。

其实这里我们主要给连接线绘制路径，D3 里面主要使用了[贝塞尔曲线](https://www.zhihu.com/question/29565629)。在 v3 版本中，D3 提供了生成该曲线的方法，而在 v4 版本中，我们需要自己构造这样的曲线。

这里涉及到的并不是 D3 独有的，而是`SVG-<path>`的特性，`<path>`在上一节也简单说过，大家可以补充看看[SVG 路径 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Paths)，里面讲到了直线命令和曲线命令。

# 解读 Demo

我们先结合上一节大致讲到的 D3 基础，来解读下我们的 Demo。

---

## 整体逻辑

我们的 Demo 实现了这样的功能：

1. 定义 svg 根元素，设置基本的属性（宽高等）。
2. 定义基本的 treemap。
3. 将数据转换成需要的格式。
4. 将数据绑定 treemap。
5. 定义子节点的选择集，以及过渡动画。
6. 添加 toggle 处理，并绑定到节点。

## 代码说明

我们结合代码来看看，其实 Demo 里面原有英文的说明，这里本骚年可能更多的是翻译的作用吧：

``` javascript
// 嗯，这是最初的数据。
var treeData = {
  name: "Top Level",
  children: [
    {
      name: "Level 2: A",
      children: [{ name: "Son of A" }, { name: "Daughter of A" }]
    },
    { name: "Level 2: B" }
  ]
};

// 设置图表的宽高和Margin
var margin = { top: 20, right: 90, bottom: 30, left: 90 },
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var svg = d3
  .select("body")
  // 在页面的body里添加svg对象
  .append("svg")
  // 设置svg宽高
  .attr("width", width + margin.right + margin.left)
  .attr("height", height + margin.top + margin.bottom)
  // 在svg里添加group元素
  .append("g")
  // 将group放置在左上方
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var i = 0,
  duration = 750,
  root;

// 定义Tree层级，并设置宽高
var treemap = d3.tree().size([height, width]);

// 计算父节点、字节点、高度和深度（parent, children, height, depth）
root = d3.hierarchy(treeData, function(d) {
  return d.children;
});
// 设置第一个元素的初始位置
root.x0 = height / 2;
root.y0 = 0;

// 第二层以上元素收起
root.children.forEach(collapse);

// 更新节点状态
update(root);

// collapse方法，用于切换子节点的展开和收起状态
function collapse(d) {
  if (d.children) {
    d._children = d.children;
    d._children.forEach(collapse);
    d.children = null;
  }
}

function update(source) {
  // 设置节点的x、y位置信息
  var treeData = treemap(root);

  // 计算新的Tree层级
  var nodes = treeData.descendants(),
    links = treeData.descendants().slice(1);

  // 设置每个同级节点间的y间距为180
  nodes.forEach(function(d) {
    d.y = d.depth * 180;
  });

  // ****************** 节点部分操作 ***************************

  // 给节点添加id，用于选择集索引
  var node = svg.selectAll("g.node").data(nodes, function(d) {
    return d.id || (d.id = ++i);
  });

  // 添加enter操作，添加类名为node的group元素
  var nodeEnter = node
    .enter()
    .append("g")
    .attr("class", "node")
    // 默认位置为当前父节点的位置
    .attr("transform", function(d) {
      return "translate(" + source.y0 + "," + source.x0 + ")";
    })
    // 给每个新加的节点绑定click事件
    .on("click", click);

  // 给每个新加的group元素添加cycle元素
  nodeEnter
    .append("circle")
    .attr("class", "node")
    .attr("r", 1e-6)
    // 如果元素有子节点，且为收起状态，则填充浅蓝色
    .style("fill", function(d) {
      return d._children ? "lightsteelblue" : "#fff";
    });

  // 给每个新加的group元素添加文字说明
  nodeEnter
    .append("text")
    .attr("dy", ".35em")
    .attr("x", function(d) {
      return d.children || d._children ? -13 : 13;
    })
    .attr("text-anchor", function(d) {
      return d.children || d._children ? "end" : "start";
    })
    .text(function(d) {
      return d.data.name;
    });

  // 获取update集
  var nodeUpdate = nodeEnter.merge(node);

  // 设置节点的位置变化，添加过渡动画效果
  nodeUpdate
    .transition()
    .duration(duration)
    .attr("transform", function(d) {
      return "translate(" + d.y + "," + d.x + ")";
    });

  // 更新节点的属性和样式
  nodeUpdate
    .select("circle.node")
    .attr("r", 10)
    .style("fill", function(d) {
      return d._children ? "lightsteelblue" : "#fff";
    })
    .attr("cursor", "pointer");

  // 获取exit操作
  var nodeExit = node
    .exit()
    // 添加过渡动画
    .transition()
    .duration(duration)
    .attr("transform", function(d) {
      return "translate(" + source.y + "," + source.x + ")";
    })
    // 移除元素
    .remove();

  // exit集中节点的cycle元素尺寸变为0
  nodeExit.select("circle").attr("r", 1e-6);

  // exit集中节点的text元素可见度降为0
  nodeExit.select("text").style("fill-opacity", 1e-6);

  // ****************** 连接线部分操作 ***************************

  // 更新数据
  var link = svg.selectAll("path.link").data(links, function(d) {
    return d.id;
  });

  // 添加enter操作，添加类名为link的path元素
  var linkEnter = link
    .enter()
    .insert("path", "g")
    .attr("class", "link")
    // 默认位置为当前父节点的位置
    .attr("d", function(d) {
      var o = { x: source.x0, y: source.y0 };
      return diagonal(o, o);
    });

  // 获取update集
  var linkUpdate = linkEnter.merge(link);

  // 更新添加过渡动画
  linkUpdate
    .transition()
    .duration(duration)
    .attr("d", function(d) {
      return diagonal(d, d.parent);
    });

  // 获取exit集
  var linkExit = link
    .exit()
    // 设置过渡动画
    .transition()
    .duration(duration)
    .attr("d", function(d) {
      var o = { x: source.x, y: source.y };
      return diagonal(o, o);
    })
    // 移除link
    .remove();

  // 为动画过渡保存旧的位置
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });

  // 添加贝塞尔曲线的path，衔接与父节点和子节点间
  function diagonal(s, d) {
    path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`;

    return path;
  }

  // 当点击时，切换children，同时用_children来保存原子节点信息
  function click(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    update(d);
  }
}
```

以上的逻辑处理，无非是`初始化图表 -> 获取数据 -> 数据转换 -> 元素操作/交互/动画 -> 事件绑定 -> 数据更新 -> 元素更新`这样的流程吧。

## 结束语

---

这节主要分析了需求场景，接着找了个基本的 Tree Demo，然后结合上节讲过的 D3 知识，理解每个步骤的逻辑。
后面将结合实际需要的功能，一点点地说明实现的过程，以及将涉及到的 D3 更多的 API，甚至核心原理吧。
