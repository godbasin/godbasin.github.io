---
title: jQuery插件--图片居中对齐
date: 2016-06-20 21:12:34
categories: jQuery杂烩
---
需要将不同尺寸的图片居中放置时，可使用该jQuery插件。本文介绍实现方法。
<!--more-->

代码放在github上，有兴趣的小伙伴可以下载看
[picture-align](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/picture-align)

最终效果图如下[点击查看页面](http://o92lwol8p.bkt.clouddn.com/index.html)
![image](http://o905ne85q.bkt.clouddn.com/picture-align.png)

### 插件介绍

- 使用方法
-- html
``` html
<!--img元素外层裹一层div-->
<div class="fill">
	<img src="img/2.png" />
</div>
```
-- js
``` javascript
//使用jQuery获取需要的外层容器
$(".fill").bsPictureAlign({
	"img_dom": ".img", //img的class/id/其他属性，为0则选中该容器内所有img（tagName === "img"）图片
	"style": "fill", //两种style：full为最短边对齐，过长剪裁；fill为最长边对齐，填充背景
	"width": "100%", //容器宽度，默认为100%
	"height": "300px", //容器高度，默认为300px
	"background": "#000" //背景填充颜色，默认为#000黑色
});
```
- 插件封装方法
-- 使用jQuery拓展属性$.fn.xxx来进行封装
-- 这里有超详细教程[《jQuery插件开发精品教程，让你的jQuery提升一个台阶》](http://www.cnblogs.com/Wayou/p/jquery_plugin_tutorial.html)

### 图片居中原理

- 使用img.load()确保图片加载完成，此时可精确图片比例
- 获取图片宽高比例，与容器比例进行比较

- 最短边对齐，过长隐藏：full方法
-- 容器宽高比大于图片时，图片高度100%，宽度按比例缩放按比例缩放
-- 容器宽高比小于图片时，图片宽度100%，高度按比例缩放按比例缩放
-- 使用绝对定位将容器内图片居中
-- 设置容器overflow: hidden;隐藏图片过长部分

- 最长边对齐，填充背景：fill方法
-- 容器宽高比大于图片时，图片宽度100%，高度按比例缩放
-- 容器宽高比小于图片时，图片高度100%，宽度按比例缩放
-- 使用绝对定位将容器内图片居中
-- 设置容器background，填充背景

### 待完善的地方
- 需要在图片加载完之后回调，可自行增加回调函数
- 去到哪里都别忘了优化代码哦

### 插件代码
请别叫我下划线狂魔^_^
``` javascript
;
(function($, window, document, undefined) {
	$.fn.bsPictureAlign = function(options) {
		var num = this.length,
			loadnum = 0;
		//若为多个容器，分别初始化每个容器
		for (i = 0; i < this.length; i++) {
			var _this = this[i];
			//创建bsPictureAlign实体
			var bsPictureAlign = new BsPictureAlign(_this, options);
			//调用其方法
			if (options.style == "full") bsPictureAlign.full();
			if (options.style == "fill") bsPictureAlign.fill({
				//这里增加了回调函数，确保所有图片处理完毕后进行回调
				callback: function() {
					loadnum++;
					if (num == loadnum && options.loadover) {
						options.loadover();
					}
				}
			});
		}
	};
	//定义原型
	var BsPictureAlign = function(ele, opt) {
		this.$ele = ele;
		//若无定义宽高背景，使用默认值
			this.defaults = {
				"width": "100%",
				"height": "300px",
				"background": "#000"
			};
			this.options = $.extend({}, this.defaults, opt);
	};
	BsPictureAlign.prototype = {
		//定义fill方法
		fill: function(opc) {
			var that = this,
				_options = that.options,
				_ele = $(this.$ele),
				_dom = _options.img_dom,
				_img = _dom ? _ele.find(_dom) : _ele.find("img"),
				_this, _width, _height, _ratio, _w, _h, _r, _wider;
			//修改图片容器宽高
			_ele.css({
				"width": _options.width,
				"height": _options.height,
				"overflow": "hidden",
				"background": _options.background,
				"position": "relative"
			});
			//容器比例
			_width = _ele.width();
			_height = _ele.height();
			_ratio = _width / _height;
			//每张所选图片进行处理
			_img.each(function() {
				_this = $(this);
				//此处可选，用来保证图片加载完之前不可见
				_this.css({
					'opacity': 0,
				});
				//此处确保图片加载完毕
				_this.load(function() {
					_w = _this.width();
					_h = _this.height();
					_r = _w / _h;
					_wider = _r > _ratio ? true : false;
					//容器宽高比小于图片时，图片高度100%，宽度按比例缩放
					if (_wider) {
						_this.css({
							"width": "100%",
							"height": "auto"
						});
						var _top = (_height - _this.height()) / 2;
						_this.css({
							"position": "absolute",
							"top": _top + "px",
							"left": 0
						});
					//容器宽高比大于图片时，图片宽度100%，高度按比例缩放
					} else {
						_this.css({
							"width": "auto",
							"height": "100%"
						});
						var _left = (_width - _this.width()) / 2;
						_this.css({
							"position": "absolute",
							"top": 0,
							"left": _left + "px"
						});
					}
					_this.css({
						'opacity': 1,
					});
					if (opc.callback) opc.callback();
				});
				//此处图片加载失败处理
				_this.error(function() {
					if (opc.callback) opc.callback();
					_this.css({
						'opacity': 1,
					});
				});
			});
			//链式回调
			return this;
		},
		//定义full方法
		full: function() {
			var that = this,
				_options = that.options,
				_ele = $(this.$ele),
				_img = _ele.find("img"),
				_this, _width, _height, _ratio, _w, _h, _r, _wider;
			//修改图片外壳宽高
			_ele.css({
				"width": _options.width,
				"height": _options.height,
				"overflow": "hidden",
				"background": "#000",
				"position": "relative"
			});
			//容器比例
			_width = _ele.width();
			_height = _ele.height();
			_ratio = _width / _height;
			//每张所选图片进行处理
			_img.each(function() {
				_this = $(this);
				//此处确保图片加载完毕
				_this.load(function() {
					_w = _this.width();
					_h = _this.height();
					_r = _w / _h;
					_wider = _r > _ratio ? true : false;
					//容器宽高比大于图片时，图片高度100%，宽度按比例缩放按比例缩放
					if (_wider) {
						_this.css({
							"width": "auto",
							"height": "100%"
						});
						var _left = (_width - _this.width()) / 2;
						_this.css({
							"position": "absolute",
							"top": 0,
							"left": _left + "px"
						});
					//容器宽高比小于图片时，图片宽度100%，高度按比例缩放按比例缩放
					} else {
						_this.css({
							"width": "100%",
							"height": "auto"
						});
						var _top = (_height - _this.height()) / 2;
						_this.css({
							"position": "absolute",
							"top": _top + "px",
							"left": 0
						});
					}
				});
			});
			//链式回调
			return this;
		},
	}
})(jQuery, window, document);
```

### 结束语
插件封装也是个有趣的事情哦，当然有兴趣也可以将逻辑封装成原生js插件哒。