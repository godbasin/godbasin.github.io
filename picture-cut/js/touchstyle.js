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
				_options.success(_src,_ele);
			});
			_section.show();
			//画布初始化
			var _src = _ele.attr("src");
			that.canvasInit(_src);

			return this;
		},
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
				img = new Image(),_r,_wider;				
			
			img.src = src;
			
			img.onload = function(){
				_r = img.width / img.height;
				_wider = _r > _ratio ? true : false;
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
				touchstartX, touchstartY, touchmoveX = 0,touchmoveY = 0;
			if (_o_ratio == 0) {
				_options.canvas_width = _width = _w > 200 ? 200 : _w;
				_options.canvas_height = _height = _h > 200 ? 200 : _h;
				_options.canvas_left = _left = _r_left = (_w - _width) / 2;
				_options.canvas_top = _top = _r_top = (_h - _height) / 2;
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

			canvas2.addEventListener("touchstart", touchStart, false);

			function touchStart() {
				if (!event.touches.length) return;
				event.preventDefault();
				var touch = event.touches[0];
				touchstartX = touch.clientX - _l;
				touchstartY = touch.clientY - _t;
				if (((_left - 20) < touchstartX && touchstartX < (_left + 20)) && ((_top - 20) < touchstartY && touchstartY < (_top + 20))) {
					canvas2.addEventListener("touchmove", changeLeftTop, false);
					canvas2.addEventListener("touchend", touchEnd, false);
				} else if (((_right - 20) < touchstartX && touchstartX < (_right + 20)) && ((_bottom - 20) < touchstartY && touchstartY < (_bottom + 20))) {
					canvas2.addEventListener("touchmove", changeRightBottom, false);
					canvas2.addEventListener("touchend", touchEnd, false);
				} else if ((_left + 20) < touchstartX && (_right - 20) > touchstartX && (_top + 20) < touchstartY && (_bottom - 20) > touchstartY) {
					canvas2.addEventListener("touchmove", changeMove, false);
					canvas2.addEventListener("touchend", touchEnd, false);
				} else {
					return;
				}
			}

			function changeLeftTop() {
				if (!event.touches.length) return;
				event.preventDefault();
				var touch = event.touches[0];
				_top = touch.clientY - _t;
				_top = _top < 0 ? 0 : (_top > (_bottom - 50) ? _bottom - 50 : _top);				
				_height = _bottom - _top;
				_left = _o_ratio == 0 ? touch.clientX - _l : _right - _height * _ratio;
				_width = _right - _left;
				if ( (_left < 0) || (_left > _right - 50)) {
					_left = _left < 0 ? 0 : _right - 50;
					_width = _right - _left;
					_top = _o_ratio == 0 ? touch.clientY - _t : _bottom - _width / _ratio;
					if(_top > _bottom - 50) _top = _bottom - 50;
					_height = _bottom - _top;
				}
				ctx2.clearRect(0, 0, _w, _h);
				drawCutCon();

			}

			function changeRightBottom() {
				if (!event.touches.length) return;
				event.preventDefault();
				var touch = event.touches[0];
				_bottom = touch.clientY - _t;
				_bottom = _bottom > _h ? _h : (_bottom < (_top + 50) ? _top + 50 : _bottom);
				_height = _bottom - _top;
				_right = _o_ratio == 0 ? touch.clientX - _l : _left + _height * _ratio;
				_width = _right - _left;
				if ((_right > _w) || (_right < _left + 50)) {
					_right = _right > _w ? _w : _left + 50;
					_width = _right - _left;
					_bottom = _o_ratio == 0 ? touch.clientY - _t : _top + _width / _ratio;
					if(_bottom < _top + 50) _bottom = _top + 50;
					_height = _bottom - _top;
				}
				ctx2.clearRect(0, 0, _w, _h);
				drawCutCon();
			}

			function changeMove() {
				if (!event.touches.length) return;
				event.preventDefault();
				var touch = event.touches[0];
				touchmoveX = touch.clientX - _l - touchstartX;
				touchmoveY = touch.clientY - _t - touchstartY;
				touchstartX = touch.clientX - _l;
				touchstartY = touch.clientY - _t;
				if(_left + touchmoveX > 0 && _right + touchmoveX < _w){
					_left += touchmoveX;
					_right += touchmoveX;															
				}
				if(_top + touchmoveY > 0 && _bottom + touchmoveY < _h){
					_top += touchmoveY;
					_bottom += touchmoveY;
				}
				ctx2.clearRect(0, 0, _w, _h);
				drawCutCon();
			}

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

			function touchEnd() {
				canvas2.removeEventListener("touchmove", changeLeftTop, false);
				canvas2.removeEventListener("touchmove", changeRightBottom, false);
				canvas2.removeEventListener("touchmove", changeMove, false);
				canvas2.removeEventListener("touchend", touchEnd, false);
				_options.canvas_height = _height;
				_options.canvas_width = _width;
				_options.canvas_left = _left;
				_options.canvas_top = _top;
			}
		},
		cutOver: function(obj) {			
			var _options = obj.options,
				canvas1 = document.getElementById(_options.canvas_id + "1"),
				ctx1 = canvas1.getContext('2d'),
				imgData = ctx1.getImageData(_options.canvas_left, _options.canvas_top, _options.canvas_width, _options.canvas_height),
				canvas3 = document.createElement("canvas"),
				ctx3 = canvas3.getContext('2d'),
				_image;
			canvas3.width = _options.canvas_width;
			canvas3.height = _options.canvas_height;
			ctx3.putImageData(imgData, 0, 0);
			_image = canvas3.toDataURL("image/jpg");
			return _image;
		}

	}
})(jQuery, window, document);