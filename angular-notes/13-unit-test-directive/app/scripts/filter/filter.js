'use strict';

//小数百分比格式
app.filter('percentage', function() {
	return function(str, len) {
		if (str === undefined) return;
		var _str = (parseFloat(str) * 100).toFixed(1) + '%';
		return _str;
	}
})

//日期转换,type指格式(默认为xxxx.xx.xx，传入cn为中文日期xxxx年xx月xx日)
.filter('mydate', function() {
	//格式化数字，小于10表示为0x
	var numStd = function(num) {
			if (num === undefined) return; //若无传入值，则返回
			var _val = parseInt(num), //数字化值，去除多余0
				_num;
			//判断小于10，则在前方添加0
			_num = (_val < 10) ? ('0' + _val) : ('' + _val);
			return _num; //返回新值
		},
		//反格式化数字，去掉0
		numUnstd = function(num) {
			if (num === undefined) return; //若无传入值，则返回
			var _num = parseInt(num); //数字化值，去除多余0
			return _num; //返回新值
		};
	return function(str, type) {
		if (str === undefined) return; //若无传入值，则返回
		var _str = str + ''; //将该值转换为字符串格式
		//正则判断当前日期格式
		//是否为xxxx-xx-xx
		if (/\d{4}-\d{1,2}-\d{1,2}/.test(_str)) {
			var datearr = _str.split('-'); //取出年月日
			//若type为cn，则转换成xxxx年xx月xx日，否则为xxxx.xx.xx
			if (type && type.toLowerCase() == 'cn') {
				_str = numUnstd(datearr[0]) + '年' + numUnstd(datearr[1]) + '月' + numUnstd(datearr[2]) + '日';
			} else {
				_str = numStd(datearr[0]) + '.' + numStd(datearr[1]) + '.' + numStd(datearr[2]);
			}
		//是否为xxxx.xx.xx
		} else if (/\d{4}\.\d{1,2}\.\d{1,2}/.test(_str)) {
			var datearr = _str.split('.'); //取出年月日
			//若type为cn，则转换成xxxx年xx月xx日，否则为xxxx.xx.xx
			if (type && type.toLowerCase() == 'cn') {
				_str = numUnstd(datearr[0]) + '年' + numUnstd(datearr[1]) + '月' + numUnstd(datearr[2]) + '日';
			} else {
				_str = numStd(datearr[0]) + '.' + numStd(datearr[1]) + '.' + numStd(datearr[2]);
			}
		//是否为xxxx年xx月xx日
		} else if ((_str.indexOf('年') > -1) && (_str.indexOf('月') > -1) && (_str.indexOf('日') > -1)) {
			 //取出年月日
			var datearr = _str.split('年'),
				year = datearr[0],
				month = datearr[1].split('月')[0],
				day = datearr[1].split('月')[1].replace('日', '');
			//若type为cn，则转换成xxxx年xx月xx日，否则为xxxx.xx.xx
			if (type && type.toLowerCase() == 'cn') {
				_str = numUnstd(year) + '年' + numUnstd(month) + '月' + numUnstd(day) + '日';
			} else {
				_str = numStd(year) + '.' + numStd(month) + '.' + numStd(day);
			}	
		} else {
			return str; //以上均不符合，返回原值
		}
		return _str; //返回新值
	};
});