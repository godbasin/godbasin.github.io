---
title: jQuery插件--Canvas实现图片裁剪
date: 2016-06-20 22:04:12
categories: jQuery杂烩
---
需要对图片进行裁剪时，可使用该jQuery插件。本文介绍实现方法。
<!--more-->

代码放在github上，有兴趣的小伙伴可以下载看
[picture-cut](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/picture-cut)

最终效果图如下[点击查看页面](http://o92md66rk.bkt.clouddn.com/index.html)
![image](http://o905ne85q.bkt.clouddn.com/picture-cut.png)

### 插件介绍

- 使用方法
-- html
``` html
<img class="img-to-cut" src="img/1.png" />
<img class="img-to-cut" src="img/2.png" />
<img class="img-to-cut" src="img/3.png" />
<!--需加上一个包裹的外壳-->
<section id="bsphotocut-con"></section>
```
-- js
``` javascript
//初始化能进行裁剪的图片：此处使用class='img-to-cut'
$(".img-to-cut").click(function() {
	$(this).bsPhotoCut({
		"section": "#bsphotocut-con", //外框
		"ratio": "0", //裁剪框宽度和高度比例n:m, 为0则不限比例
		"success": function(src, obj) { //src为返回图片src, obj为调用此插件的DOM对象this
			var _img = $("<img src='" + src + "' />");
			$("body").append(_img);
		}
	});
});
```
- 插件封装方法
-- 使用jQuery拓展属性$.fn.xxx来进行封装
-- 这里有超详细教程[《jQuery插件开发精品教程，让你的jQuery提升一个台阶》](http://www.cnblogs.com/Wayou/p/jquery_plugin_tutorial.html)
-- 本插件的封装不是特别完美，因为涉及事件绑定，当时还没想到很好的办法，欢迎小伙伴们提意见

### 图片裁剪原理

- 使用HTML5 Canvas实现裁剪过程
-- 创建两个canvas：canvas1--装载图片 canvas2--装载裁剪框
- canvas1
-- 装载图片，实现图片居中处理，具体相关原理可参考[picture-align插件](https://github.com/godbasin/godbasin.github.io/blob/blog-codes/picture-align/js/style.js)

- canvas2
-- 装载裁剪框，若有限制比例则按照比例缩放
-- 裁剪框溢出canvas1时候的处理

- 获取裁剪后图片
-- 使用Canvas函数getImageData可读取特定区域的图片数据
-- 使用Canvas函数putImageData可导出图片数据至canvas
-- 使用Canvas函数toDataURL可将canvas导出为图片格式
-- 这里需要注意，getImageData可能产生跨域问题，解决办法可自行google（似乎没有特别好的解决方法）
``` javascript
cutOver: function(obj) {
	var _options = obj.options,
		//获取canvas1图片数据
		canvas1 = document.getElementById(_options.canvas_id + "1"),
		ctx1 = canvas1.getContext('2d'),
		//导出canvas1图片数据，可能有跨域问题哦
		imgData = ctx1.getImageData(_options.canvas_left, _options.canvas_top, _options.canvas_width, _options.canvas_height),
		canvas3 = document.createElement("canvas"),
		ctx3 = canvas3.getContext('2d'),
		_image;
	canvas3.width = _options.canvas_width;
	canvas3.height = _options.canvas_height;
	//将图片数据输出到canvas3
	ctx3.putImageData(imgData, 0, 0);
	//将canvas3转换成图片
	_image = canvas3.toDataURL("image/jpg");
	return _image;
}
```


### 鼠标或者触屏事件处理
- 鼠标事件为mousedown/mousemove/mouseup，相应js文件为mousestyle.js
-- 鼠标获取坐标位置可参考[js判断某个位置是否特定元素]()
- 触屏事件为touchstart/touchmove/touchend，相应js文件为touchstyle.js
-- 触屏事件获取坐标位置为event.touches[0].clientX和event.touches[0].clientY
- 在裁剪过程中，全程绑定开始事件（mousedown/touchstart）的检测
``` javascript
//此处为鼠标事件部分代码
function mouseStart() {
	//getMousePos为获取鼠标坐标的方法，此处不详细讲解
	mousestartX = that.getMousePos(event).x - _l;
	mousestartY = that.getMousePos(event).y - _t;
	//判断鼠标位置是否为裁剪框的角，并针对不同角绑定不同的移动事件
	if (((_left - 20) < mousestartX && mousestartX < (_left + 20)) && ((_top - 20) < mousestartY && mousestartY < (_top + 20))) {
		//此处为裁剪框左上角，可调整裁剪框大小
		document.addEventListener("mousemove", changeLeftTop, false);
		document.addEventListener("mouseup", mouseEnd, false);
	} else if (((_right - 20) < mousestartX && mousestartX < (_right + 20)) && ((_bottom - 20) < mousestartY && mousestartY < (_bottom + 20))) {
		//此处为裁剪框右下角，可调整裁剪框大小
		document.addEventListener("mousemove", changeRightBottom, false);
		document.addEventListener("mouseup", mouseEnd, false);
	} else if ((_left + 20) < mousestartX && (_right - 20) > mousestartX && (_top + 20) < mousestartY && (_bottom - 20) > mousestartY) {
		//此处为裁剪框里面，可移动裁剪框
		document.addEventListener("mousemove", changeMove, false);
		document.addEventListener("mouseup", mouseEnd, false);
	} else {
		return;
	}
}
```
- 触发开始事件后，开始绑定移动（mousemove/touchmove）和结束事件（mouseup/touchend）的检测
-- 具体的实现这里不详细说明，大家可查看源文件获取

### 结束语
曾经我很喜欢用下划线命名变量，被小伙伴们吐槽过很多遍，这些代码还处于那个时代的产物，小伙伴们请见谅呀。