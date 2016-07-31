---
title: Angular使用笔记8--使用filter服务进行格式转换
date: 2016-07-23 22:42:23
categories: angular混搭
tags: 笔记
---
最近的一个项目使用AngularJS(v1.2.6)作为前端的框架，《Angular使用笔记》系列用于记录过程中的一些使用和解决方法。
本文记录使用filter服务进行格式转换的过程。
<!--more-->
## AngularJS Filter
-----
AngularJS 过滤器可用于转换数据。
### ng内置过滤器
- currency： 格式化数字为货币格式
- filter： 从数组项中选择一个子集
- lowercase： 格式化字符串为小写
- orderBy： 根据某个表达式排列数组
- uppercase： 格式化字符串为大写
- date: 日期格式化
- json: 格式化json对象
- limitTo: 限制数组长度或字符串长度
- number: 格式化数字（如千分位）

### 在模板中使用filter
- 过滤器可以通过一个管道字符（|）和一个过滤器添加到表达式中

``` html
{{ expression | filter }}
```
- 可以多个filter连用，上一个filter的输出将作为下一个filter的输入

``` html
{{ expression | filter1 | filter2 | ... }}
```
- filter可以接收参数，参数用 : 进行分割

``` html
{{ expression | filter:argument1:argument2:... }}
```
### 依赖注入使用filter
- 需使用依赖注入方法将$filter注入到该controller中

``` javascrpit
var new_value = $filter('filtername')(old_value);
```

### 参考
[《AngularJS的Filter用法详解》](http://www.cnblogs.com/wushangjue/p/4516107.html?utm_source=tuicool&utm_medium=referral)

## 自定义过滤器
-----
- 使用module的filter方法，返回一个函数
- 该函数接收输入值，并返回处理后的结果

这里我们自定义一个日期格式化的过滤器，可传入type参数进行设置格式(默认为xxxx.xx.xx，传入cn为中文日期xxxx年xx月xx日)。

### 格式简介
- xxxx.xx.xx格式
> 该格式需要对月和日进行补全，即小于10表示为0x

``` javascrpit
var numStd = function(num) {
	if (num === undefined) return; //若无传入值，则返回
	var _val = parseInt(num), //数字化值，去除多余0
		_num;
	//判断小于10，则在前方添加0
	_num = (_val < 10) ? ('0' + _val) : ('' + _val);
	return _num; //返回新值
};
```
- xxxx年xx月xx日
> 该格式需要对月和日数字化，即小于10表示为x

``` javascrpit
var numUnstd = function(num) {
	if (num === undefined) return; //若无传入值，则返回
	var _num = parseInt(num); //数字化值，去除多余0
	return _num; //返回新值
};
```

### 设置过滤器
- 首先需要对传入值进行判断，若为undefined则返回
- 使用正则判断当前值的格式，将其拆分取出年月日
- 根据传入的type参数值，格式化为新的值，并返回

``` javascript
.filter('myDate', function() {
	/**此处略去上方提到的数字格式化***/
	return function(str, type) {
		if (_str === undefined) return; //若无传入值，则返回
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

		return _str; //返回新值
	};
});
```

## 在other页面中使用
-----
### 添加filter.js
- 在scripts文件夹新建filter文件夹
- 在filter文件夹添加filter.js，并添加上述内容

### 添加other页面
- 在views文件夹内添加一个other.html
- 在other.html页面内加入头部指令

``` html
<header app-header></header>
```
- 在app.js文件中添加路由

``` javascript
.when('/other', {
	templateUrl: 'views/other.html', //other的html页面
	controller: 'OtherCtrl' //other的控制器
})
```

- 添加一些展示过滤器的信息

### 添加控制器
- 在controller文件夹内添加一个otherCtrl.js
- 在index启动页面中添加该文件
- 注入$filter服务
- 设置一些用于展示的初始值

``` javascript
app.controller('OtherCtrl', ['$scope', '$filter',  function($scope, $filter) {
	$scope.string = 'This is a long long long long long long long long long long very long string.';
	$scope.date = new Date();
	$scope.number = 1263714072;
	$scope.number_with_currency = $filter('currency')($scope.number, '￥');
}]);
```
### 最终效果
如图：
![image](http://o905ne85q.bkt.clouddn.com/511E.tmp.png)

## 结束语
-----
使用filter服务可以很方便转换各种的数据格式哦，而且也方便统一管理呢。
[此处查看项目代码（仅包含app部分）](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular-notes/8-create-filter)
[此处查看页面效果](http://o9grhhyar.bkt.clouddn.com/8-create-filter/index.html#/other)