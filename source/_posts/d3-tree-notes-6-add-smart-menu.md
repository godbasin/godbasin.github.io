---
title: D3.js-Tree实战笔记6--添加右键菜单
date: 2018-02-25 10:54:57
categories: D3小馒头
tags: 笔记
---

因为业务需要折腾起了图表，《D3.js-Tree 实战笔记》系列用于记录使用该库制作 Tree 图表的一些笔记。上节讲了个很简单的添加浮层，这节我们来讲个更简单的，添加右键菜单。

<!--more-->

# 添加右键菜单

---

## smartMenu

smartMenu 是网上一个可以右键自定义上下文菜单的 jQuery 插件，具体 api 请查看[SmartMenus for jQuery](https://www.smartmenus.org/docs/)，这里不进行详细的说明。

## 添加资源

首先我们需要添加对应的资源，由于 smartMenu 是基于 jQuery 的，故我们还需要引入 jQuery：

```html
<link href="./smartMenu/smartMenu.css" rel="stylesheet">
<script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.js"></script>
<script src="./smartMenu/smartMenu.js"></script>
```

当然，如果你是需要在模块化中使用，也可以通过`npm install smartmenus`来安装依赖。

## 添加菜单

代码很简单，我们只需要全局进行 smartMenu 初始化，并绑定到响应节点，这里是类名为 node 的 g 元素：

```js
// 定义菜单选项
var userMenuData = [
  [
    {
      text: "菜单1",
      func: function() {
        // id为节点id
        var id = Number($(this).attr("id"));
        alert("菜单1", id);
      }
    },
    {
      text: "菜单2",
      func: function() {
        var id = Number($(this).attr("id"));
        alert("菜单1", id);
      }
    }
  ]
];
// 事件监听方式添加事件绑定
$("body").smartMenu(userMenuData, {
  name: "chatRightControl",
  container: "g.node"
});
```

这里我们需要确认选中的是哪个节点，故我们用 id 的方式标志。前面我们 id 是通过从 1 开始的整数：

```js
// 给节点添加id，用于选择集索引
var node = view.selectAll("g.node").data(nodes, function(d) {
  return d.id || (d.id = ++i);
});
```

故我们可以通过添加属性的方式，来把节点的 id 添加到元素上，因为在 smartMenu 中，`func`属性的`function`中，this 是指向被右键选中的 dom 元素（故这里不能使用箭头函数）。

```js
var nodeEnter = node
  .enter()
  .append("g")
  .attr("class", "node")
  .attr("id", d => d.id);
// ...其他操作
```

最终效果如图：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1513575655%281%29.jpg)

# 结束语

---

本节简单介绍了给节点添加右键菜单的过程，当然，大多数都是smartMenu的工作。这里只介绍了最简单的配置方式，还有分块配置、多层子菜单配置，甚至看文档说明似乎支持移动端，这个插件挺好用的，小伙伴们可以研究下。

[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/d3-tree-notes/6-add-smart-menu)
[此处查看页面效果](http://p13oygsq6.bkt.clouddn.com/6-add-smart-menu/index.html)
