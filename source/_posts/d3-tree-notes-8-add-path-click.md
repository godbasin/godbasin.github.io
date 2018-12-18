---
title: D3.js-Tree实战笔记8--曲线hover和点击
date: 2018-03-10 17:20:29
categories: D3小馒头
tags: 笔记
---

因为业务需要折腾起了图表，《D3.js-Tree 实战笔记》系列用于记录使用该库制作 Tree 图表的一些笔记。本节我们要在 link 连接线上，添加 hover 的样式，和点击事件。

<!--more-->

# 添加 path 事件

---

## 基本思路

之前在讲节点悬浮展示信息的时候，也有做过差不多逻辑的事情，这里因为比较简单，也不涉及新的特性，就直接讲讲逻辑吧。

1. 绑定 mouseout 和 mouseover 事件，给线条加上颜色。
2. 绑定 click 事件，获取需要的信息，再触发对应的事情。

简单来说，就是这么一小段：

```js
// 添加enter操作，添加类名为link的path元素
var linkEnter = link
  .enter()
  .insert("path", "g")
  .attr("class", "link")
  // 添加id
  .attr("id", d => {
    return "textPath" + d.id;
  })
  .on("mouseover", function(d) {
    d3.select(this).style("stroke", "orange");
  })
  .on("mouseout", function(d) {
    d3.select(this).style("stroke", "#CCC");
  })
  .on("click", d => {
    alert(d.parent.data.name + ' -> ' + d.data.name);
  })
  // 默认位置为当前父节点的位置
  .attr("d", function(d) {
    var o = {
      x: source.x0,
      y: source.y0
    };
    return diagonalReverse(o, o);
  });
```

从上面我们可以知道，绑定事件时，使用this可以获取到当前元素。所以需要注意的是，这里如果使用可箭头函数，可能就拿不到想要的数据了喔。

最终效果如图：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1514014266%281%29.jpg)

# 结束语

---

我也不知道为啥这节就这么点内容...只是觉得这个点可以记一下，但是又实在凑不上很多东西了，大家将就看看吧。

[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/d3-tree-notes/8-add-path-click)
[此处查看页面效果](http://d3.godbasin.com/8-add-path-click/index.html)
