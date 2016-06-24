---
title: jQuery响应式瀑布流
date: 2016-06-20 20:42:49
categories: jQuery杂烩
tags: 逻辑实现
---
之前用jQuery写过一个响应式的瀑布流。本文介绍实现方法。
<!--more-->

代码放在github上，有兴趣的小伙伴可以下载看
[responsive-waterfall](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/responsive-waterfall)

最终效果图如下，改变浏览器大小效果更棒哦[点击查看页面](http://o922dcmwp.bkt.clouddn.com/index.html)
![image](http://o905ne85q.bkt.clouddn.com/responsive-waterfall.png)

以下我们将每个瀑布流盒子简称为box

## 使用数组记录每个box宽和高
-----

### 设置不同屏幕宽度下每一行box的数量
- 使用$(window).width()获取屏幕宽度
- 根据不同屏幕宽度设置每一行box的数量
- 得到每个box的宽度
- 这里使用最傻的方法计算，有待优化

``` javascript
var num = 4; //每行box数量
if ($(window).width() <= 500) num = 1;
if ($(window).width() > 500) num = 2;
if ($(window).width() > 800) num = 3;
if ($(window).width() > 1200) num = 5;
var boxWidth = $(window).width() / num; //每个box宽度
```

### 创建数组对象
- 每个数组元素为对象，该对象属性有width/height/top/left等

``` javascript
function boxStyle(width, height, top, left) {
	this.position = "absolute";
	this.width = width;
	this.height = height;
	this.top = top;
	this.left = left;
}
```

### 创建数组记录元素宽高
这里简述一下瀑布流原理：第一行box从左往右排列，第二行开始box的添加位置为各列中高度最小的一列，添加后该列高度则加上该box高度，以此类推
- 设置每个元素宽度，高度自定义auto
- 创建数组boxStyleArr来保存每个元素宽高
- 使用数组boxArr保存每一竖列的高度，即每一竖列最后一个box的底部位置
- 使用瀑布流原理计算每个box的位置（left和top）,并保存到数组boxStyleArr

``` javascript
box.each(function(index, value) {
	//设置每个元素宽度，高度自定义auto
	$(value).css({
		"width": boxWidth,
		"height": "auto"
	});
	//数组boxStyleArr保存每个元素宽高
	boxStyleArr[index] = new boxStyle();
	boxStyleArr[index].width = boxWidth;
	boxStyleArr[index].height = box.eq(index).height();
	//首行box从左到右依次排列
	if (index < num) {
		boxArr[index] = boxStyleArr[index].height;
		boxStyleArr[index].left = boxWidth * index;
		boxStyleArr[index].top = 0;
	//瀑布流原理计算每个box的位置（left和top）
	} else {
		var minboxHeight = Math.min.apply(null, boxArr);
		var minboxIndex = $.inArray(minboxHeight, boxArr);
		boxStyleArr[index].left = boxStyleArr[minboxIndex].left;
		boxStyleArr[index].top = minboxHeight;
		boxArr[minboxIndex] += boxStyleArr[index].height;
	}
});
```


## 放置box
-----
- 根据数组boxStyleArr，将每个box使用绝对定位放置到相应位置
- 这里使用了动画效果，使所有box从左上角伸展

``` javascript
function boxLocation() {
	var box = $(".response");
	var boxStyleArr = [];
	boxArrBuild(boxStyleArr);
	box.each(function(index, value) {
		//设置每个box最初位置为左上角，宽高为0
		$(value).css({
			"position": "absolute",
			"top": 0,
			"left": 0,
			"width": 0,
			"height": 0
		});
		//动画效果使box们进行伸展
		$(value).animate({
			top: boxStyleArr[index].top,
			left: boxStyleArr[index].left,
			height: boxStyleArr[index].height,
			width: boxStyleArr[index].width
		}, 500);
	});
}
```

## 绑定屏幕宽度改变事件
-----
- 当屏幕大小改变时，触发重新计算box位置
  - 为了避免浏览器频繁改变宽度，这里增加了个小判断
  - 当屏幕改变后200毫秒内不再改变，才触发重新计算

``` javascript
$(window).on("load", function() {
	boxLocation();
	window.onresize = function() {
		windowWidth = $(window).width();
		if (interval == null) {
			interval = setInterval("test()", 200);
		}
	}
});
```

## 待完善的地方
-----
### 考虑图片加载
- 图片加载过程可能影响对box高度判断
- 可通过img.load来确保图片加载完成或者失败之后才进行计算
### 代码优化&封装
- 尽情发挥你的创造力吧

## 结束语
-----
这个效果是我从别人的博客看到的，然后自己用jQuery实现，这也不失为创造的乐趣呢。