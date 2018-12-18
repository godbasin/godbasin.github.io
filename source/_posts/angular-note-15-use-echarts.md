---
title: Angular使用笔记15-在Angular中使用Echarts
date: 2016-09-17 11:56:28
categories: angular混搭
tags: 笔记
---
最近的一个项目使用AngularJS(v1.2.6)作为前端的框架，《Angular使用笔记》系列用于记录过程中的一些使用和解决方法。
本文记录在Angular中使用Echarts的过程。
<!--more-->

## Echarts
-----
### 简单介绍
ECharts，一个纯Javascript的图表库，可以流畅的运行在PC和移动设备上，兼容当前绝大部分浏览器（IE8/9/10/11，Chrome，Firefox，Safari等），底层依赖轻量级的Canvas类库ZRender，提供直观，生动，可交互，可高度个性化定制的数据可视化图表。

开发者文档见：[echarts3 API](http://echarts.baidu.com/api.html#echarts)

### echarts的使用
全局echarts对象，在script标签引入echarts.js文件后获得，或者在AMD环境中通过require('echarts')获得。

## 在Angular中使用echarts
-----
### 基本步骤
- bower安装echarts

``` cmd
bower install echarts --save
```

安装后我们可在bower_components文件夹中看到echarts，如图：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/E400.tmp.png)

- 引入echarts文件
我们在index.html文件中引入两个文件：

``` html
<!--引入echarts-->
<script src="bower_components/echarts/dist/echarts.js"></script>
<!--引入bmap文件，用于echarts和百度地图结合使用-->
<script src="bower_components/echarts/dist/extension/bmap.js"></script>
```

### 添加echarts模块
这里我们增加一个地图模块，用于展示百度地图相关服务。

- 添加echarts.html模板

``` html
<!--添加头部菜单模块-->
<header app-header></header>
<div class="container echarts">
	<h2>Echarts的使用</h2>
	<section>
		<h3>柱状图</h3>
		<div echarts-histogram></div>
	</section>
	<section>
		<h3>结合百度地图的热力分布图</h3>
		<div echarts-bmap></div>
	</section>

</div>
```

用于展示Echaets服务的相关页面准备完毕，从上面的Html中可看到我们将创建的指令echartsHistogram和echartsBmap的使用。

这里我们并没使用到什么逻辑，故不添加相应的控制器了。

- 添加echarts路由
在app.js文件中：

``` javascript
.when('/echarts', {
	templateUrl: 'views/echarts.html' //other的html页面
})
```

### 添加echartsHistogram指令
在directives文件夹中添加echartsDir.js文件，用于存放echarts相关指令。
该柱状图示例可从[官网示例](http://echarts.baidu.com/demo.html#bar-tick-align)直接获取。
``` javascrpit
/*柱状图示例加载*/
.directive('echartsHistogram', function() {
    return {
        restrict: 'AE',
        template: '<div></div>',
        replace: true,
        link: function(scope, element, attrs) {
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(element[0]);

            var option = {
                title: {
                    text: '坐标轴刻度与标签对齐'
                },
                color: ['#3398DB'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    data: ['直接访问']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    axisTick: {
                        alignWithLabel: true
                    }
                }],
                yAxis: [{
                    type: 'value'
                }],
                series: [{
                    name: '直接访问',
                    type: 'bar',
                    barWidth: '60%',
                    data: [10, 52, 200, 334, 390, 330, 220]
                }]
            };

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        }
    };
});
```

### 添加echartsBmap指令
上面我们已经引入了bmap.js文件了，所以可以在指令中直接使用。
该热力图示例可从[官网示例](http://echarts.baidu.com/demo.html#heatmap-bmap)直接获取。
- 添加test.json文件用于模拟数据
- 创建echartsBmap指令

``` javascript
/*百度地图示例加载*/
.directive('echartsBmap', ['$http', function($http) {
    return {
        restrict: 'AE',
        template: '<div></div>',
        replace: true,
        link: function(scope, element, attrs) {
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(element[0]);

            $http({
                method: 'GET',
                url: './scripts/test.json'
            }).then(function(data) {

                var data = data.data.data;
                console.log(data);

                var points = [].concat.apply([], data.map(function(track) {
                    return track.map(function(seg) {
                        return seg.coord.concat([1]);
                    });
                }));
                var option = {
                    animation: false,
                    bmap: {
                        center: [120.13066322374, 30.240018034923],
                        zoom: 14,
                        roam: true
                    },
                    visualMap: {
                        show: false,
                        top: 'top',
                        min: 0,
                        max: 5,
                        seriesIndex: 0,
                        calculable: true,
                        inRange: {
                            color: ['blue', 'blue', 'green', 'yellow', 'red']
                        }
                    },
                    series: [{
                        type: 'heatmap',
                        coordinateSystem: 'bmap',
                        data: points,
                        pointSize: 5,
                        blurSize: 6
                    }]
                };
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
                if (!app.inNode) {
                    // 添加百度地图插件
                    var bmap = myChart.getModel().getComponent('bmap').getBMap();
                    bmap.addControl(new BMap.MapTypeControl());
                }
            });
        }
    };
}]);
```

### 最终效果
如图：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/365E.tmp.png)

## 结束语
-----
在实例中本骚年还创建了另外一个地图服务，用于展示路径，感兴趣的小伙伴也可以自行查看相关的代码呀。
[此处查看项目代码（仅包含app部分）](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular-notes/15-use-echarts)
[此处查看页面效果](http://angular-notes.godbasin.com/15-use-echarts/index.html#/echarts)