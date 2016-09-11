'use strict';

/*全局头部加载*/
app.directive('appHeader', function() {
	return {
		restrict: 'AE',
		template: '<nav class="navbar navbar-default header">' +
			'<div class="container-fluid">' +
			'<div class="navbar-header">' +
			'<a class="navbar-brand" href="#">Godbasin</a>' +
			'</div>' +
			'<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">' +
			'<ul class="nav navbar-nav">' +
			'<li ng-repeat="menu in menus" ng-class="menu.current ? \'active\' : \'\'"><a ng-href="{{ menu.href }}">' +
			'{{ menu.text }}' +
			'<span ng-show="menu.current" class="sr-only">(current)</span>' +
			'</a>' +
			'</li>' +
			'</ul>' +
			'<ul class="nav navbar-nav navbar-right">' +
			'<li><a>{{ clock }}</a></li>' +
			'<li class="dropdown">' +
			'<a href="" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">菜单 <span class="caret"></span></a>' +
			'<ul class="dropdown-menu">' +
			'<li ng-repeat="usermenu in usermenus" ng-click="usermenu.click()"><a href="">{{ usermenu.text }}</a></li>' +
			'</ul>' +
			'</li>' +
			'</ul>' +
			'</div>' +
			'</div>' +
			'</nav>',
		replace: true,
		controller: function($scope, $element, $timeout) {
			//$scope.menus用于储存主菜单
			$scope.menus = [{
				title: 'index', //title用于储存路由对应的路径
				href: 'index.html#/index', //href用于设定该菜单跳转路由
				text: '首页', //text用于储存该菜单显示名称
			}, {
				title: 'other',
				href: 'index.html#/other',
				text: '其他',
			}, {
				title: 'bmap',
				href: 'index.html#/bmap',
				text: '地图',
			}, {
				title: 'echarts',
				href: 'index.html#/echarts',
				text: 'Echarts',
			}];
			//$scope.usermenus用于储存侧边下拉菜单
			$scope.usermenus = [{
				text: '退出', //text用于储存该菜单显示名称
				click: function() {
					sessionStorage.clear(); //清除登录信息
					location.href = 'index.html#/login'; //设定该菜单跳转路由
				}
			}];
			//判断当前路径，点亮对应模块
			var _location = location.hash.split('/')[1];
			for (var i in $scope.menus) {
				//current用于储存当前菜单是否与当前路径符合，符合则点亮(active)菜单
				if ($scope.menus[i].title == _location) {
					$scope.menus[i].current = true;
				} else {
					$scope.menus[i].current = false;
				}
			}
			//用于格式化时间（少于10在前面增加0）
			var numberStandard = function(num) {
				var _val = Number(num),
					_num;
				_num = (_val < 10) ? ('0' + _val) : ('' + _val);
				return _num;
			};
			//用于渲染时钟
			var renderClock = function() {
				var _date = new Date();
				$scope.clock = '';
				$scope.clock += _date.getFullYear() + '年' + (_date.getMonth() + 1) + '月' +
					_date.getDate() + '日';
				$scope.clock += ' ' + numberStandard(_date.getHours()) + ':' + numberStandard(_date.getMinutes()) +
					':' + numberStandard(_date.getSeconds());
				//此处已通过参数注入$timeout服务，若需要注入自定义服务需要require
				$timeout(function() {
					renderClock();
				}, 500);
			};
			renderClock();
			//判断是否已经登录，未登录则进行跳转
//			if (!sessionStorage.getItem('username')) {
//				alert("请登录");
//				location.href = 'index.html#/';
//			}
		}
	};
});
