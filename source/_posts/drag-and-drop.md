---
title: 做一个拖放功能的自定义页面
date: 2016-06-19 15:42:49
categories: js什锦
tags: 原创部件
---
以前写过一个拖放功能的页面，用来搭建自定义移动端页面。本文介绍实现方法。
<!--more-->

项目放在github上，有兴趣的小伙伴可以下载玩玩看
[DD-custom-pages](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/DD-custom-pages)
已经没有在维护了，也基本没优化，但还是挺有意思的一个项目

最终效果图如下[点击查看页面](http://o907xb1mi.bkt.clouddn.com/index.html)
![image](http://o905ne85q.bkt.clouddn.com/dd_custom_pages.png)


## 基本页面搭建
-----
首先是最基本的页面搭建
- 三个基本布局对象
  - 1.左侧布局列表
  - 2.中间页面效果
  - 3.右侧控件列表
- 对象的事件处理
对象基本事件的编写
  - 1.布局切换，以及自定义布局事件
  - 2.控件切换，选择等
  
样式布局什么的，这里就略过啦，具体可参考[项目](https://github.com/godbasin/DD-custom-pages)

## 绑定鼠标左键按下事件
-----
### 需要进行绑定的对象
- 需要进行鼠标左键按下绑定的对象有两种：布局和控件
- 布局分为两种：左侧布局列表获取、中间页面效果获取的布局，class为fix-layout和float-layout区分
- 控件同理: 右侧控件列表获取、中间页面效果获取的控件，class为fix-target和float-target区分

- 全局绑定鼠标鼠标左键按下事件
由于该项目中鼠标事件几乎是最主要事件，因此采用全局绑定

### 点击对象后进行处理
- 设置拖动标志true，此时可进行鼠标移动事件的处理，后面会提及
- 这里采用复制元素的方式，jQuery实现，$().clone()复制元素对象
- 复制对象后，设置对象位置、大小等，这里设置拖动时将元素宽度减小为一般

### 若对象位于页面效果内，进行相关处理
- 若是对象为布局，则插入布局位置效果

``` javascript
//绑定事件，这里使用了jQuery
$(document).on('mousedown', mouseDown);
function mouseDown(e) {
	//获取左键点击事件
	if (e.which == 1) {
		//定位当前事件位置，并取出相关元素
		position_target(e);
		//处理左侧布局列表获取的布局元素事件
		if ($(target).attr('class') == "fix-layout") {
			dragging = true; //设置拖动标志
			target = $(target).clone(); //复制元素
			$(target).removeClass("fix-layout").addClass("move-layout"); //拖动时元素样式
			$(".container").append(target); //将复制的元素添加到页面
		}
		//处理中间布局列表获取的布局元素事件
		if ($(target).attr('class') == "float-layout") {
			dragging = true; //设置拖动标志
			$(target).removeClass("float-layout").addClass("move-layout"); //拖动时元素样式
			$(".container").append(target); //将元素移动到页面
		}
		//处理右侧控件列表获取的控件元素事件
		if ($(target).attr('class') == "fix-target") {
			dragging = true; //设置拖动标志
			target = $(target).clone(); //复制元素
			$(target).removeClass("fix-target").addClass("move-target"); //拖动时元素样式
			$(".container").append(target); //将复制的元素添加到页面
		}
		//处理中间布局列表获取的控件元素事件
		if ($(target).attr('class') == "float-target") {
			dragging = true; //设置拖动标志
			$(target).removeClass("float-target").addClass("move-target"); //拖动时元素样式
			$(".container").append(target); //将元素移动到页面
			$(target).children(".header, .footer, .nav, .content, .slider-7, .slider-8, .slider-9").css("height", "auto"); //拖动时元素内层控件样式
			$(target).children(".listview-l").css("height", "100px"); //拖动时元素内层控件样式
			$(target).children(".listview-s").css("height", "50px"); //拖动时元素内层控件样式
		}
		//判断是否有元素在拖动，将元素位置设置在当前鼠标位置
		if (dragging) {
			var oX = getMousePos(e).x - $(target).width() / 2;
			var oY = getMousePos(e).y - $(target).height() / 2;
			$(target).css({
				"left": oX + "px",
				"top": oY + "px"
			});
		}
		//定位当前事件位置，判断是否在合适的位置
		//若当前元素为布局，且位置为页面效果内，则添加提示，元素放置的位置
		position_box(e);
		if ($(box).attr('id') == "box") {
			if ($(target).attr('class') == "move-layout" || $(target).attr('class') == "move-layout-over") {
				$(target).removeClass("move-layout").addClass("move-layout-over");
				if (dropping == false) {
					drop = $("<div class='drop-layout'></div>");
					moveDrop();
					$("#box-content").append(drop);
					dropping = true;
				} else {
					$(drop).remove();
					moveDrop();
					$("#box-content").append(drop);
				}
			}
		}
	}
	return false;
}
```

## 定位当前位置是否有特定元素
-----
- 使用鼠标定位获取相关布局或者控件对象
这里可参考上一篇文章：[《js判断某个位置是否特定元素》](https://godbasin.github.io/2016/06/19/position-object/)

- 获取当前鼠标位置
``` javascript
function getMousePos(event) {
	var e = event || window.event;
	var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
	var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
	var x = e.pageX || e.clientX + scrollX;
	var y = e.pageY || e.clientY + scrollY;
	return {
		'x': x,
		'y': y
	};
}
```

- 定位当前位置是否有布局或者控件对象position_target
``` javascript
function position_target(e) {
	var e = e || window.event;
	var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
	var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
	var eventX = e.pageX - scrollX || e.clientX;
	var eventY = e.pageY - scrollY || e.clientY;
	target = document.elementFromPoint(eventX, eventY);
	target = fnGetTable(target);
}
function fnGetTable(oEl) {
	while (null != oEl && $(oEl).attr('class') != "fix-target" && $(oEl).attr('id') != "set-layout" && $(oEl).attr('id') != "save-page" && $(oEl).attr('class') != "box-footer" && $(oEl).attr('class') != "to-edit" && $(oEl).attr('class') != "edit" && $(oEl).attr('class') != "container" && $(oEl).attr('class') != "float-target" && $(oEl).attr('class') != "fix-layout" && $(oEl).attr('class') != "float-layout") {
		oEl = oEl.parentElement;
	}
	return oEl;
}
```
- 定位当前位置是否有在页面效果的布局里position_target
``` javascript
function position_box(e) {
	var e = e || window.event;
	var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
	var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
	var eventX = e.pageX - scrollX || e.clientX;
	var eventY = $(target).offset().top - 1 - scrollY;
	box = document.elementFromPoint(eventX, eventY);
	box = fnGetTable2(box);
}
function fnGetTable2(oEl) {
	while (null != oEl && $(oEl).attr('id') != "box" && $(oEl).attr('class') != "container" && $(oEl).attr('data-type') != "layout") {
		oEl = oEl.parentElement;
	}
	return oEl;
}
```

## 绑定鼠标移动事件
-----
### 需要进行的判断
- 是否有正在拖动的布局或者控件
- 当前鼠标位置是否在页面效果内，添加布局示意（蓝色框框表示即将添加布局的位置）
- 当前鼠标位置是否在页面效果内的某个布局上方，在相应位置添加布局示意
- 全局绑定鼠标移动事件

``` javascript
$(document).mousemove(function(e) {
	//判断是否有正在拖动的布局或者控件
	if (dragging) {
		//正在拖动的对象位置跟随鼠标移动
		var oX = getMousePos(e).x - $(target).width() / 2;
		var oY = getMousePos(e).y - $(target).height() / 2;
		$(target).css({
			"left": oX + "px",
			"top": oY + "px"
		});
		//定位当前事件位置
		position_box(e);
		//判断当前位置在页面效果内，且在某个布局上方，布局示意添加在当前布局前方
		if ($(box).attr('data-type') == "layout" && $(box).parent().attr('class') == "float-layout") {
			if ($(target).attr('class') == "move-layout" || $(target).attr('class') == "move-layout-over") {
				$(target).removeClass("move-layout").addClass("move-layout-over");
				if (dropping == false) {
					drop = $("<div class='drop-layout'></div>");
					moveDrop();
					$($(box).parent()).before(drop);
					dropping = true;
				} else {
					$(drop).remove();
					moveDrop();
					$($(box).parent()).before(drop);
				}
			}
		//判断当前位置在页面效果内，且不在某个布局上方，布局示意添加在页面效果最后
		} else if ($(box).attr('id') == "box") {
			if ($(target).attr('class') == "move-layout" || $(target).attr('class') == "move-layout-over") {
				$(target).removeClass("move-layout").addClass("move-layout-over");
				if (dropping == false) {
					drop = $("<div class='drop-layout'></div>");
					moveDrop();
					$("#box-content").append(drop);
					dropping = true;
				} else {
					$(drop).remove();
					moveDrop();
					$("#box-content").append(drop);
				}
			}
		//判断当前位置不在页面效果内，移除布局示意
		} else {
			if ($(target).attr('class') == "move-layout-over") {
				$(target).removeClass("move-layout-over").addClass("move-layout");
			}
			if (dropping == true) {
				$(drop).remove();
				dropping = false;
			}
		}
	}
	return false;
});
```

## 绑定鼠标左键松开事件
-----
### 效果事件
- 当前拖动的对象为布局，且当前鼠标位置是否在页面效果内，添加布局
- 当前拖动的对象为控件，且当前鼠标位置是否在页面效果内某个布局上方，且该布局内无其他控件，添加控件至布局
- 当前鼠标位置不在页面效果内，移除拖动的对象

### 需要进行的判断
- 是否有正在拖动的布局或者控件
- 当前鼠标位置是否在页面效果内
- 当前拖动的对象是否为布局，且当前鼠标位置是否在页面效果内
- 当前拖动的对象是否为控件，且当前鼠标位置是否在页面效果内某个布局上方，该布局是否为空
- 全局绑定鼠标左键松开事件

``` javascript
$(document).mouseup(function(e) {
	//定位当前事件位置
	position_box(e);
	e.cancelBubble = true;
	//判断是否有正在拖动的布局或者控件
	if (dragging == true) {
		//当前位置为页面效果内的某个布局上方，添加布局或者添加控件
		if (($(box).attr('data-type') == "layout" && $(box).parent().attr('class') == "float-layout") || ($(box).attr('data-type') == "layout" && $(box).parent().attr('data-type') == "layout")) {
			if ($(target).attr('class') == "move-target" && $(box).children().length == 0) {
				$(target).removeClass("move-target").addClass("float-target");
				$(target).children(".header, .footer, .nav, .listview-l, .listview-s, .content, .slider-7, .slider-8, .slider-9").css("height", "100%");
				$(box).append(target);
			} else if ($(target).attr('class') == "move-layout-over") {
				if (dropping) {
					$(target).removeClass("move-layout-over").addClass("float-layout");
					$(drop).before($(target));
				}
			} else $(target).remove();
		//当前位置为页面效果内，添加布局
		} else if ($(box).attr('id') == "box") {
			if ($(target).attr('class') == "move-layout-over") {
				if (dropping) {
					$(target).removeClass("move-layout-over").addClass("float-layout");
					$(drop).before($(target));
				}
			} else {
				$(target).remove();
			}
		//当前鼠标位置不在页面效果内，移除拖动的对象
		} else {
			$(target).remove();
		}
	}
	$(drop).remove();
	dropping = false;
	dragging = false;
});
```

## 完善后续处理
-----
- 编辑控件样式
  - 在页面效果内的控件可进行编辑（改变颜色、内容等）
- 保存页面效果
  - 这里为了偷懒直接把整个html导出，将它导出保存到html页面内，并加载相应的样式
  - 当然为了数据处理的方便，你也可以将这一切都转成数据保存到数据库，提取的时候进行相关处理就好了

## 结束语
-----
有时候写些有意思的项目也是很不错的，脑洞要大大的，当然事后别忘了优化哦。