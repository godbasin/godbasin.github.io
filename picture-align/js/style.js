;
(function($, window, document, undefined) {
	$.fn.bsPictureAlign = function(options){
		for(i=0;i<this.length;i++){
			var _this = this[i];
			//创建bsPictureAlign实体
			var bsPictureAlign = new BsPictureAlign(_this,options);
			//调用其方法
			if(options.style=="full") bsPictureAlign.full();
			if(options.style=="fill") bsPictureAlign.fill();
		}	
	}
	
	var BsPictureAlign = function(ele,opt){
		this.$ele = ele,
		this.defaults = {
			"width":"100%",
			"height":"300px",
			"background":"#000"
		},
		this.options = $.extend({}, this.defaults, opt);
	}
	BsPictureAlign.prototype = {
		//banner初始化
		fill: function(){			
			var that = this,
				_options = that.options,
				_ele = $(this.$ele),
				_dom = _options.img_dom,
				_img = _dom ? _ele.find(_dom) : _ele.find("img"),
				_this, _width, _height, _ratio, _w, _h, _r, _wider;	
			
			//修改图片外壳宽高
			_ele.css({
				"width":_options.width,
				"height":_options.height,
				"overflow":"hidden",
				"background":_options.background,
				"position":"relative"
			});		
			
			_width = _ele.width();
			_height = _ele.height();
			_ratio = _width/_height;
			
			_img.each(function(){
				_this = $(this);				
				_w = _this.width();
				_h = _this.height();
				_r = _w/_h;
				_wider = _r > _ratio ? true : false;
				if(_wider){				
					_this.css({
						"width":"100%",
						"height":"auto"
					});
					var _top = (_height - _this.height())/2;
					_this.css({
						"position":"absolute",
						"top":_top+"px",
						"left":0
					});
				}else{
					_this.css({
						"width":"auto",
						"height":"100%"
					});
					var _left = (_width - _this.width())/2;
					_this.css({
						"position":"absolute",
						"top": 0,
						"left": _left+"px"
					});
				}		
			});
			//判断图片宽高比
				
						
			return this;
		},
		full: function(){			
			var that = this,
				_options = that.options,
				_ele = $(this.$ele),
				_img = _ele.find("img"),
				_this, _width, _height, _ratio, _w, _h, _r, _wider;
									
			//修改图片外壳宽高
			_ele.css({
				"width":_options.width,
				"height":_options.height,
				"overflow":"hidden",
				"background":"#000",
				"position":"relative"
			});
			
			_width = _ele.width();
			_height = _ele.height();
			_ratio = _width/_height;
			
			_img.each(function(){
				_this = $(this);				
				_w = _this.width();
				_h = _this.height();
				_r = _w/_h;
				_wider = _r > _ratio ? true : false;
				
				if(_wider){				
					 _this.css({
						"width":"auto",
						"height":"100%"
					});
					var _left = (_width - _this.width())/2;
					 _this.css({
						"position":"absolute",
						"top": 0,
						"left": _left+"px"
					});
				}else{
					 _this.css({
						"width":"100%",
						"height":"auto"
					});
					var _top = (_height - _this.height())/2;
					 _this.css({
						"position":"absolute",
						"top":_top+"px",
						"left":0
					});
				}	
			});

			return this;
		},
		
	}
})(jQuery,window,document);
