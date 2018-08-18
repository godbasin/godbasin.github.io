---
title: Angular使用笔记14-在Angular中使用百度地图
date: 2016-09-16 21:09:52
categories: angular混搭
tags: 笔记
---
最近的一个项目使用AngularJS(v1.2.6)作为前端的框架，《Angular使用笔记》系列用于记录过程中的一些使用和解决方法。
本文记录在Angular中使用百度地图（封装成指令）的过程。
<!--more-->

## 百度地图Javascript API
-----
### 简单介绍
百度地图JavaScript API是一套由JavaScript语言编写的应用程序接口，可帮助您在网站中构建功能丰富、交互性强的地图应用，支持PC端和移动端基于浏览器的地图应用开发，且支持HTML5特性的地图开发。

开发者文档见：[JavaScript API v2.0](http://lbsyun.baidu.com/index.php?title=jspopular)

### 百度地图的使用
- 申请密钥
该套API免费对外开放。自v1.5版本起，需先申请密钥（ak）才可使用，接口（除发送短信功能外）无使用次数限制

- 引入api文件

``` html
<script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=您的密钥"></script>
```

- 创建地图实例

``` javascript
// 位于BMap命名空间下的Map类表示地图，通过new操作符可以创建一个地图实例。其参数可以是元素id也可以是元素对象。
var map = new BMap.Map("container");
```

## 在Angular中使用百度地图
-----
这里我们将简单使用指令创建一个地图服务，具体包括以下功能：
- 可输入关键字搜索地图位置
- 可通过点击地图获取该位置的经纬度并反馈
- 可通过手动设置经纬度获取地图位置

### 基本步骤
- 申请密钥&引入api文件
请查看上文"百度地图的使用"
- 通过指令创建地图实例
``` javascript
.directive('setLocation', function() {
    return {
        restrict: 'AE',
        replace: true,
        template: `<div class="l-map"></div>`,
        link: function(scope, element, attrs) {
            var map = new BMap.Map(element[0]); // 创建Map实例   
        }
    };
})
```

### 添加地图模块
这里我们增加一个地图模块，用于展示百度地图相关服务。

- 添加bmap.html模板

``` html
<!--添加头部菜单模块-->
<header app-header></header>
<div class="container bmap">
	<h2>百度地图的使用</h2>
	<section>
		<h3>位置设置</h3>
		<p>输入搜索位置，或点击地图获取位置，或手动输入经纬度</p>
		<article>
			<header>
				<input type="text" class="form-control" ng-model="search" placeholder="输入关键词搜索位置" />
				<a class="btn btn-primary" ng-click="location.searchText = search;">搜索</a>
			</header>
			<!--插入地图服务指令set-location-->
			<div set-location search-text="{{ location.searchText }}" location="location" location-str="{{ location.locationStr }}"></div>
			<div>
				<p>经度<input type="number" class="form-control" ng-model="location.longitude" /></p>
				<p>维度<input type="number" class="form-control" ng-model="location.latitude" /></p>
				<a ng-click="location.locationStr = location.longitude + ' ' + location.latitude;" class="btn btn-default">设置</a>
			</div>
		</article>
	</section>
</div>
```

- 添加bmapCtrl.js控制器

``` javascript
.controller('BmapCtrl', ['$scope',  function($scope) {
	$scope.location = {
            searchText: '', // 保存搜索输入
            longitude: undefined, // 保存位置经度信息
            latitude: undefined, // 保存位置纬度信息
        };
}]);
```

- 添加bmap路由
在app.js文件中：

``` javascript
.when('/bmap', {
	templateUrl: 'views/bmap.html', //bmap的html页面
	controller: 'BmapCtrl' //bmap的控制器
})
```

### 添加地图服务指令
用于展示地图服务的相关页面和逻辑准备完毕，从上面的Html中可看到我们将创建的指令setLocation的使用。
在directives文件夹中添加mapDir.js文件，用于存放地图相关指令。
``` javascrpit
.directive('setLocation', function() {
    return {
        restrict: 'AE',
        scope: {
            'searchText': '@searchText', // 用于保存搜索关键词
            'locationStr': '@locationStr', // 用于监视经纬度
            'location': '=location' // 用于保存位置信息
        },
        replace: true,
        template: `<div class="l-map"></div>`,
        link: function(scope, element, attrs) {
            // 百度地图API功能
            var map = new BMap.Map(element[0]); // 创建Map实例
            var marker; // 用来保存选中的点
            map.enableScrollWheelZoom();
            var searchClick = {
                state: false,
                lng: null,
                lat: null
            };
            var myKeys = scope.searchText ? scope.searchText.split(' ') : '';
            var local = new BMap.LocalSearch(map, {
                renderOptions: { map: map, panel: "r-result" },
                pageCapacity: 10,
                onInfoHtmlSet: data => {
                    // 选择某个标志物后
                    searchClick.state = true;
                    searchClick.lng = data.marker.point.lng;
                    searchClick.lat = data.marker.point.lat;
                }
            });
            map.centerAndZoom(new BMap.Point(114.063821, 22.549535), 11);
            // 监听搜索输入变化
            var watch = scope.$watch('searchText', function(newValue, oldValue, scope) {
                if (!scope.searchText) {
                    return;
                }
                myKeys = scope.searchText.split(' ');
                local.search(myKeys);
            });

            // 监听经纬度变化
            var watch = scope.$watch('locationStr', function(newValue, oldValue, scope) {
                if (!scope.locationStr) {
                    return;
                }
                var lat = scope.locationStr.split(' ')[1];
                var lng = scope.locationStr.split(' ')[0];
                // 移除点
                map.removeOverlay(marker);
                // 创建点
                var p = new BMap.Point(lng, lat);
                marker = new BMap.Marker(p);
                // 添加点
                map.addOverlay(marker);
                // 设置中心
                map.panTo(p);
            });

            // 单击地图时返回坐标(longitude, latitude)
            map.addEventListener("click", function(e) {
                // 移除点
                map.removeOverlay(marker);
                // 创建点
                var p = new BMap.Point(e.point.lng, e.point.lat);
                if (searchClick.state) {
                    p = new BMap.Point(searchClick.lng, searchClick.lat);
                    searchClick.state = false;
                } else {
                    marker = new BMap.Marker(p);
                    // 添加点
                    map.addOverlay(marker);
                }
                // 设置中心
                map.panTo(p);
                // 更改经纬度
                scope.location.longitude = e.point.lng;
                scope.location.latitude = e.point.lat;
            });
        },
    };
});
```

### 最终效果
如图：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/F7EE.tmp.png)

## 结束语
-----
在实例中本骚年还创建了另外一个地图服务，用于展示路径，感兴趣的小伙伴也可以自行查看相关的代码呀。
[此处查看项目代码（仅包含app部分）](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular-notes/14-use-bmap)
[此处查看页面效果](http://o9grhhyar.bkt.clouddn.com/14-use-bmap/index.html#/bmap)