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
				_img = _dom != 0 ? _ele.find(_dom) : _ele.find("img"),
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