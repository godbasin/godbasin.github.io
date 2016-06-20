;
(function($, window, document, undefined) {
	$.fn.bsPhotoCut = function(options) {
		for (i = 0; i < this.length; i++) {
			var _this = this[i];
			//创建bsPictureAlign实体
			var bsPhotoCut = new BsPhotoCut(_this, options);
			//调用其方法
			bsPhotoCut.ready();
		}
	}

	var BsPhotoCut = function(ele, opt) {
		this.$ele = ele,
			this.defaults = {
				ratio: "0",
				background: "#000",
				section: "#bsphotocut-con",
				canvas_id: "bsphotocut-canvas",
				canvas_con: null,
				canvas_left: 0,
				canvas_top: 0,
				canvas_width: 0,
				canvas_height: 0
			},
			this.options = $.extend({}, this.defaults, opt);
	}
	BsPhotoCut.prototype = {
		//初始化
		ready: function() {
			var that = this,
				_options = that.options,
				_ele = $(this.$ele),
				_section = $(_options.section),
				_div = $('<div></div>'),
				_canvas1 = $('<canvas id="' + _options.canvas_id + '1" ></canvas>'),
				_canvas2 = $('<canvas id="' + _options.canvas_id + '2" ></canvas>'),
				_footer = $('<footer></footer>'),
				_cancel = $('<a class="cancel">取消</a>'),
				_confirm = $('<a class="confirm">确认</a>');
			//裁剪框重载
			_section.html("");
			_div.append(_canvas1, _canvas2);
			_footer.append(_cancel, _confirm);
			_section.append(_div, _footer);
			_cancel.bind("click", function() {
				_section.hide();
			});
			_confirm.bind("click", function() {
				var _src = that.cutOver(that);
				_section.hide();
				_options.success(_src, _ele);
			});
			_section.show();
			//画布初始化
			var _src = _ele.attr("src");
			that.canvasInit(_src);

			return this;
		},
		//绘制裁剪画布以及裁剪框
		canvasInit: function(src) {
			var that = this,
				_options = that.options,
				_div = $(_options.section).find("div"),
				_width = _div.width(),
				_height = _div.height(),
				_ratio = _width / _height,
				canvas1 = document.getElementById(_options.canvas_id + "1"),
				canvas2 = document.getElementById(_options.canvas_id + "2"),
				ctx1 = canvas1.getContext('2d'),
				ctx2 = canvas2.getContext('2d'),
				img = new Image(),
				_r, _wider;
			//读取图片
			img.src = src;
			img.onload = function() {
				_r = img.width / img.height;
				_wider = _r > _ratio ? true : false;
				//图片居中处理
				if (_wider) {
					canvas1.width = canvas2.width = _width;
					canvas1.height = canvas2.height = _width * img.height / img.width;
					$(canvas1).css({
						"top": (_height - canvas1.height) / 2 + "px",
						"width": _width + "px",
						"height": canvas1.height + "px",
						"left": 0,
						"position": "absolute"
					});
					$(canvas2).css({
						"top": (_height - canvas2.height) / 2 + "px",
						"width": _width + "px",
						"height": canvas2.height + "px",
						"left": 0,
						"position": "absolute",
						"z-index": "99"
					});
				} else {
					canvas1.height = canvas2.height = _height;
					canvas1.width = canvas2.width = _height * img.width / img.height;
					$(canvas1).css({
						"left": (_width - canvas1.width) / 2 + "px",
						"width": canvas1.width + "px",
						"height": _height + "px",
						"top": 0,
						"position": "absolute"
					});
					$(canvas2).css({
						"left": (_width - canvas2.width) / 2 + "px",
						"width": canvas2.width + "px",
						"height": _height + "px",
						"top": 0,
						"position": "absolute",
						"z-index": "99"
					});
				}
				ctx1.drawImage(img, 0, 0, canvas1.width, canvas1.height);
				that.cutInit();
				return this;
			};

		},
		//初始化裁剪事件
		cutInit: function() {
			var that = this,
				_options = that.options,
				canvas1 = document.getElementById(_options.canvas_id + "1"),
				canvas2 = document.getElementById(_options.canvas_id + "2"),
				ctx1 = canvas1.getContext('2d'),
				ctx2 = canvas2.getContext('2d'),
				_w = canvas2.width,
				_h = canvas2.height,
				_l = canvas2.offsetLeft,
				_t = canvas2.offsetTop,
				_r = _w / _h,
				_o_ratio = _options.ratio,
				_width, _height, _left, _top, _right, _bottom,
				mousestartX, mousestartY, mousemoveX = 0,
				mousemoveY = 0;
			//按照图片宽高比绘制裁剪框
			if (_o_ratio == 0) {
				_options.canvas_width = _width = _w > 200 ? 200 : _w;
				_options.canvas_height = _height = _h > 200 ? 200 : _h;
				_options.canvas_left = _left = _r_left = (_w - _width) / 2;
				_options.canvas_top = _top = _r_top = (_h - _height) / 2;
			//按照设定宽高比绘制裁剪框
			} else {
				var _ratio_group = _options.ratio.split(":"),
					_ratio = parseFloat(_ratio_group[0]) / parseFloat(_ratio_group[1]),
					_wider = _ratio > _r ? true : false;
				if (_wider) {
					_options.canvas_width = _width = _w > 200 ? 200 : _w;
					_options.canvas_height = _height = _width / _ratio;
					_options.canvas_left = _left = _r_left = (_w - _width) / 2;
					_options.canvas_top = _top = _r_top = (_h - _height) / 2;
				} else {
					_options.canvas_height = _height = _h > 200 ? 200 : _h;
					_options.canvas_width = _width = _height * _ratio;
					_options.canvas_left = _left = (_w - _width) / 2;
					_options.canvas_top = _top = (_h - _height) / 2;
				}
			}

			_right = _left + _width;
			_bottom = _top + _height;
			drawCutCon();

			//绑定鼠标按下事件
			document.addEventListener("mousedown", mouseStart, false);

			//鼠标按下事件
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
			//鼠标选中裁剪框左上角移动事件
			function changeLeftTop() {
				_top = that.getMousePos(event).y - _t;
				_top = _top < 0 ? 0 : (_top > (_bottom - 50) ? _bottom - 50 : _top);
				_height = _bottom - _top;
				_left = _o_ratio == 0 ? that.getMousePos(event).x - _l : _right - _height * _ratio;
				_width = _right - _left;				
				if ((_left < 0) || (_left > _right - 50)) {
					_left = _left < 0 ? 0 : _right - 50;
					_width = _right - _left;
					_top = _o_ratio == 0 ? that.getMousePos(event).y - _t : _bottom - _width / _ratio;
					if (_top > _bottom - 50) _top = _bottom - 50;
					_height = _bottom - _top;
				}
				ctx2.clearRect(0, 0, _w, _h);
				drawCutCon();

			}
			//鼠标选中裁剪框右下角移动事件
			function changeRightBottom() {
				_bottom = that.getMousePos(event).y - _t;
				_bottom = _bottom > _h ? _h : (_bottom < (_top + 50) ? _top + 50 : _bottom);
				_height = _bottom - _top;
				_right = _o_ratio == 0 ? that.getMousePos(event).x - _l : _left + _height * _ratio;
				_width = _right - _left;
				if ((_right > _w) || (_right < _left + 50)) {
					_right = _right > _w ? _w : _left + 50;
					_width = _right - _left;
					_bottom = _o_ratio == 0 ? that.getMousePos(event).y - _t : _top + _width / _ratio;
					if (_bottom < _top + 50) _bottom = _top + 50;
					_height = _bottom - _top;
				}
				ctx2.clearRect(0, 0, _w, _h);
				drawCutCon();
			}

			//鼠标移动裁剪框事件
			function changeMove() {
				mousemoveX = that.getMousePos(event).x - _l - mousestartX;
				mousemoveY = that.getMousePos(event).y - _t - mousestartY;
				mousestartX = that.getMousePos(event).x - _l;
				mousestartY = that.getMousePos(event).y - _t;
				if (_left + mousemoveX > 0 && _right + mousemoveX < _w) {
					_left += mousemoveX;
					_right += mousemoveX;
				}
				if (_top + mousemoveY > 0 && _bottom + mousemoveY < _h) {
					_top += mousemoveY;
					_bottom += mousemoveY;
				}
				ctx2.clearRect(0, 0, _w, _h);
				drawCutCon();
			}
			//绘制裁剪框
			function drawCutCon() {
				ctx2.globalAlpha = 0.5;
				ctx2.fillStyle = "#333";
				ctx2.fillRect(0, 0, _w, _h);
				ctx2.globalAlpha = 1;
				ctx2.strokeStyle = "#18CFD5";
				ctx2.strokeRect(_left, _top, _width, _height);
				ctx2.clearRect(_left, _top, _width, _height);
				ctx2.fillStyle = "#ccc";
				ctx2.fillRect(_right - 5, _bottom - 5, 10, 10);
				ctx2.fillRect(_left - 5, _top - 5, 10, 10);
			}
			//鼠标松开事件
			function mouseEnd() {
				document.removeEventListener("mousemove", changeLeftTop, false);
				document.removeEventListener("mousemove", changeRightBottom, false);
				document.removeEventListener("mousemove", changeMove, false);
				document.removeEventListener("mouseup", mouseEnd, false);
				_options.canvas_height = _height;
				_options.canvas_width = _width;
				_options.canvas_left = _left;
				_options.canvas_top = _top;
			}
		},
		//获取鼠标坐标位置事件
		getMousePos: function(event) {
			var e = event || window.event;
			var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
			var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
			var x = e.pageX || e.clientX + scrollX;
			var y = e.pageY || e.clientY + scrollY;
			return {
				'x': x,
				'y': y
			};
		},
		//裁剪图片事件
		cutOver: function(obj) {
			try {
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
			}catch(e){
				alert("喔喔，图片可能存在跨域问题哦")
			}
		}
	}
})(jQuery, window, document);