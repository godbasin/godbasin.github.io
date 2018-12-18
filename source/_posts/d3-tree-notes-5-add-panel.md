---
title: D3.js-Tree实战笔记5--添加浮层
date: 2018-02-15 16:18:43
categories: D3小馒头
tags: 笔记
---

因为业务需要折腾起了图表，《D3.js-Tree 实战笔记》系列用于记录使用该库制作 Tree 图表的一些笔记。本节实现浮层信息，当鼠标放置在节点上面时，展示节点信息。

<!--more-->

# 添加浮层

---

## 实现逻辑

给图表添加浮层，其实有个很简单的办法，大概逻辑是：

* 用一个`<div>`元素来装载数据
* 绑定节点的 mouseover 事件，当鼠标浮在节点上时，设置浮层展示，同时设置内容和位置
* 绑定节点的 mouseout 事件，当鼠标移出节点时，设置浮层隐藏

## 添加浮层 div

我们来添加这么一个版块：

```html
 <div class="chartTooltip hidden">
    <p>
      <strong class="name"></strong>
    </p>
</div>
```

和这样一个样式：

```css
.chartTooltip {
  position: absolute;
  width: 200px;
  height: auto;
  padding: 10px;
  box-sizing: border-box;
  background-color: white;
  border-radius: 5px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.4);
  pointer-events: none;
}

.chartTooltip.hidden {
  display: none;
}

.chartTooltip p {
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  word-wrap: break-word;
}
```

这里我们简单地，只展示节点的 name 属性，但其实一个 div 元素能实现各种各样的交互和样式吧，剩下的都是一个前端必备的能力啦。

## 绑定鼠标事件

我们需要在每个节点 enter 操作中，绑定 mouseover 和 mouseout 事件：

```js
// 添加enter操作，添加类名为node的group元素
var nodeEnter = node
  .enter()
  .append("g")
  // ...其他操作
  // 添加mouseover事件
  .on("mouseover", d => {
    // 从d3.event获取鼠标的位置
    var transform = d3.event;
    var yPosition = transform.offsetY + 20;
    var xPosition = transform.offsetX + 20;

    // 将浮层位置设置为鼠标位置
    var chartTooltip = d3
      .select(".chartTooltip")
      .style("left", xPosition + "px")
      .style("top", yPosition + "px");

    // 更新浮层内容
    chartTooltip.select(".name").text(d.data.name);

    // 移除浮层hidden样式，展示浮层
    chartTooltip.classed("hidden", false);
  })
  // 添加mouseover事件
  .on("mouseout", () => {
    // 添加浮层hidden样式，隐藏浮层
    d3.select(".chartTooltip").classed("hidden", true);
  });
// ...click和dblclick事件操作
```

最终效果如图：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1513572588.png)

# 结束语

---

嗯，你没看错，这节到这里就结束了。虽然内容不多，不过学到了个比较取巧的办法。很多时候我们都有类似的想法，像在 canvas 里面就得使用 canvas 来绘制内容。
跳开固有的逻辑看事物，会有不同的想法和看到不同的景色噢。

[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/d3-tree-notes/5-add-panel)
[此处查看页面效果](http://d3.godbasin.com/5-add-panel/index.html)
