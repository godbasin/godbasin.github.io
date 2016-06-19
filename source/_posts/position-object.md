---
title: js判断某个位置是否特定元素
date: 2016-06-19 00:15:36
categories: js什锦
---
需要获取鼠标所在位置是否为某种特定元素，然后进行相关处理。本文介绍一种实现方法。
<!--more-->

首先，获取鼠标坐标的兼容问题大家都很熟悉了。

此处粘贴一些常用坐标相关属性：
  scrollHeight: 获取对象的滚动高度
  scrollLeft:设置或获取位于对象左边界和窗口中目前可见内容的最左端之间的距离
  scrollTop:设置或获取位于对象最顶端和窗口中可见内容的最顶端之间的距离
  scrollWidth:获取对象的滚动宽度
  offsetHeight:获取对象相对于版面或由父坐标 offsetParent 属性指定的父坐标的高度
  offsetLeft:获取对象相对于版面或由 offsetParent 属性指定的父坐标的计算左侧位置
  offsetTop:获取对象相对于版面或由 offsetTop 属性指定的父坐标的计算顶端位置
  event.clientX 相对文档的水平座标
  event.clientY 相对文档的垂直座标
  event.offsetX 相对容器的水平坐标
  event.offsetY 相对容器的垂直坐标
  document.documentElement.scrollTop 垂直方向滚动的值
  event.clientX + document.documentElement.scrollTop 相对文档的水平座标+垂直方向滚动的量

现在我们来获取鼠标位置
### 绑定鼠标事件
- 此处需对IE事件、FireFox事件等兼容
- 绑定方式有几种
  - 1.在元素中，onXXX（事件）绑定
  - 2.在Javascript代码中，获得元素并为元素的onXXX（事件）绑定

``` javascript
if (document.addEventListener) {
	element.addEventListener(event, eventFunction);//IE之外的绑定事件方法
}else{
	element.attachEvent(event, eventFunction);//IE 
}
```
### 获取鼠标坐标
- IE中可以直接使用 event对象，而 FF中则不可以
  - 1.window.event || arguments.callee.caller.arguments[0]获取event对象
  - 2.将 event 作为参数来传递, function xxx(e){var e = e || window.event;}

### 计算鼠标位置

``` javascript
var eventX = e.pageX - scrollX || e.clientX ;
var eventY = e.pageY - scrollY || e.clientY ;
```

### 获取当前位置是否有特定元素
- 给需要检测的元素绑定id或者自定义属性
- 通过不断获取当前元素父元素，直至获取成功（通过自定义属性判断）或者元素为body

```javascript
function fnGetTable(oEl) {
	while (null !== oEl && $(oEl).attr("自定义属性") !== "特定属性值" && target.tagName !== "BODY") {
		oEl = oEl.parentElement;
	}
	return oEl;
}
```

### 实例：下拉菜单点击外围自动关闭

- 通过点击当前元素时绑定到事件

``` javascript
if (document.addEventListener) {
	element.addEventListener(event, clickOutside);//IE之外的绑定事件方法
}else{
	element.attachEvent(event, clickOutside);//IE 
}
```

- clickOutside对象维护队列，该队列对象为id和callback事件

``` javascript
function clickOutside() {	
	var list = {}; //队列, 对象为id和callback事件
	return function(id, cb) {
		list.id.push(id); //id队列
		list.cb[id] = cb; //callback事件队列
		//绑定点击事件
		$(document).off("click").on("click", function(e) {
			var e = e || window.event,
				eventX = e.pageX - scrollX || e.clientX,
				eventY = e.pageY - scrollY || e.clientY,
				target = document.elementFromPoint(eventX, eventY),
				id = $(target).attr("id");
			//判断当前事件位置是否有ID队列里元素
			while (list.id.indexOf(id) == -1 && target.tagName != "BODY") {
				target = target.parentElement;
				id = $(target).attr("id");
			}
			//若有相关元素，则调用对应callback事件，完了移出队列
			for (i in list.id) {
				if (list.id[i] != id) {
					list.cb[list.id[i]]();
					list.cb.splice(list.id[i], 1);
					list.id.splice(i, 1);
				}
			}
			//若队列为空，关闭事件绑定
			if (!list.id.length) $(document).off("click");
		});
	};
}
```

### 结束语
解决办法很多，优化方法也很多，代码都是在一次又一次重构和提炼中变得出彩的呢。