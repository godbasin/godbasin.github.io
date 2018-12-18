---
title: D3.js-Tree实战笔记7--曲线上的文字textPath
date: 2018-03-04 13:22:57
categories: D3小馒头
tags: 笔记
---

因为业务需要折腾起了图表，《D3.js-Tree 实战笔记》系列用于记录使用该库制作 Tree 图表的一些笔记。本节我们要在 link 连接线上，添加文字说明。

<!--more-->

# 添加曲线文字

---

## textPath

除了笔直地绘制一行文字以外， SVG 也可以根据 `<path>` 元素的形状来放置文字。 只要在`<textPath>`元素内部放置文本，并通过其`xlink:href`属性值引用`<path>`元素，我们就可以让文字块呈现在`<path>`元素给定的路径上了。

## 添加 textPath

简单来说，我们想要实现连接线上增加文字说明，需要进行这样的处理：

1. 给每个 link 的 svg 元素`<path>`添加 id 标识。
2. 在 link 的 enter 操作中，添加`<textPath>`元素，并设置`xlink:href`属性值引用对应的`<path>`。
3. 给每个`<textPath>`添加对应的文字和颜色。

### 给 path 添加 id 标识

在 link 的 enter 操作中，给`<path>`添加 id：

```js
// 添加enter操作，添加类名为link的path元素
var linkEnter = link
  .enter()
  .insert("path", "g")
  .attr("class", "link")
  // 添加id
  .attr("id", d => {
    return "textPath" + d.id;
  });
// ...其他操作
```

### 添加 textPath 文字

我们在 link 的 enter 操作中，添加 text，同时添加与 path 匹配的 textPath：

```js
link
  .enter()
  .append("text")
  // 给text添加textPath元素
  .append("textPath")
  // 给textPath设置path的引用
  .attr("xlink:href", d => {
    return "#textPath" + d.id;
  })
  // 字体居中
  .style("text-anchor", "middle")
  .attr("startOffset", "50%")
  // 父节点的name
  .style("fill", "red")
  .text(function(d) {
    return d.parent.id;
  })
  .append("tspan")
  .style("fill", "blue")
  .text(" --> ")
  // 子节点的name
  .append("tspan")
  .style("fill", "red")
  .text(function(d) {
    return d.id;
  });
```

上面我们还处理了这样的事情，添加文字说明：父节点 id --> 子节点 id，同时还设置了颜色。

## path 方向调整

如果按照这样的方式，我们会发现我们的文字反了：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1513586990%281%29.png)

像一个个蝙蝠，倒挂着在那。这是因为 pathText 是有方向的，而我们在添加 path 元素的时候，使用的贝塞尔曲线为子节点到父节点的方向，故我们需要进行调整：

```js
// 添加贝塞尔曲线的path，方向为父节点指向子节点
function diagonalReverse(s = {}, d = {}) {
  path = `M ${d.y} ${d.x}
                  C ${(s.y + d.y) / 2} ${d.x},
                  ${(s.y + d.y) / 2} ${s.x},
                  ${s.y} ${s.x}`;
  return path;
}
```

然后把之前`diagonal`改为`diagonalReverse`，就可以实现想要的效果了。

最终效果如图：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1513586680%281%29.png)

# 结束语

---

本节介绍了一个新的 svg 元素--textPath，可以通过绘制 path，然后给 text 添加 textPath 来绘制曲线文字。刚开始本骚年还以为是 d3 的能力，看来是小瞧了 svg 了呢，不过现在似乎 svg 使用越来越少了呢。Sign~

[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/d3-tree-notes/7-text-path)
[此处查看页面效果](http://d3.godbasin.com/7-text-path/index.html)
