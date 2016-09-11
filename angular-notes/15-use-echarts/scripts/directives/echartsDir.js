'use strict';

/*柱状图示例加载*/
app.directive('echartsHistogram', function() {
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
})

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
}])

/*地图示例加载*/
.directive('echartsMap', function() {
    return {
        restrict: 'AE',
        template: '<div></div>',
        replace: true,
        link: function(scope, element, attrs) {
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(element[0]);

            var option = {
                title: {
                    text: '记录分布',
                    subtext: '纯属虚构',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: ['盗窃库', '抢劫库', '诈骗库']
                },
                visualMap: {
                    min: 0,
                    max: 2500,
                    left: 'left',
                    top: 'bottom',
                    text: ['高', '低'], // 文本，默认为数值文本
                    calculable: true
                },
                toolbox: {
                    show: true,
                    orient: 'vertical',
                    left: 'right',
                    top: 'center',
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                series: [{
                    name: '盗窃库',
                    type: 'map',
                    mapType: 'china',
                    roam: false,
                    label: {
                        normal: {
                            show: true
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    data: [
                        { name: '北京', value: Math.round(Math.random() * 1000) },
                        { name: '天津', value: Math.round(Math.random() * 1000) },
                        { name: '上海', value: Math.round(Math.random() * 1000) },
                        { name: '重庆', value: Math.round(Math.random() * 1000) },
                        { name: '河北', value: Math.round(Math.random() * 1000) },
                        { name: '河南', value: Math.round(Math.random() * 1000) },
                        { name: '云南', value: Math.round(Math.random() * 1000) },
                        { name: '辽宁', value: Math.round(Math.random() * 1000) },
                        { name: '黑龙江', value: Math.round(Math.random() * 1000) },
                        { name: '湖南', value: Math.round(Math.random() * 1000) },
                        { name: '安徽', value: Math.round(Math.random() * 1000) },
                        { name: '山东', value: Math.round(Math.random() * 1000) },
                        { name: '新疆', value: Math.round(Math.random() * 1000) },
                        { name: '江苏', value: Math.round(Math.random() * 1000) },
                        { name: '浙江', value: Math.round(Math.random() * 1000) },
                        { name: '江西', value: Math.round(Math.random() * 1000) },
                        { name: '湖北', value: Math.round(Math.random() * 1000) },
                        { name: '广西', value: Math.round(Math.random() * 1000) },
                        { name: '甘肃', value: Math.round(Math.random() * 1000) },
                        { name: '山西', value: Math.round(Math.random() * 1000) },
                        { name: '内蒙古', value: Math.round(Math.random() * 1000) },
                        { name: '陕西', value: Math.round(Math.random() * 1000) },
                        { name: '吉林', value: Math.round(Math.random() * 1000) },
                        { name: '福建', value: Math.round(Math.random() * 1000) },
                        { name: '贵州', value: Math.round(Math.random() * 1000) },
                        { name: '广东', value: Math.round(Math.random() * 1000) },
                        { name: '青海', value: Math.round(Math.random() * 1000) },
                        { name: '西藏', value: Math.round(Math.random() * 1000) },
                        { name: '四川', value: Math.round(Math.random() * 1000) },
                        { name: '宁夏', value: Math.round(Math.random() * 1000) },
                        { name: '海南', value: Math.round(Math.random() * 1000) },
                        { name: '台湾', value: Math.round(Math.random() * 1000) },
                        { name: '香港', value: Math.round(Math.random() * 1000) },
                        { name: '澳门', value: Math.round(Math.random() * 1000) }
                    ]
                }, {
                    name: '抢劫库',
                    type: 'map',
                    mapType: 'china',
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    data: [
                        { name: '北京', value: Math.round(Math.random() * 1000) },
                        { name: '天津', value: Math.round(Math.random() * 1000) },
                        { name: '上海', value: Math.round(Math.random() * 1000) },
                        { name: '重庆', value: Math.round(Math.random() * 1000) },
                        { name: '河北', value: Math.round(Math.random() * 1000) },
                        { name: '安徽', value: Math.round(Math.random() * 1000) },
                        { name: '新疆', value: Math.round(Math.random() * 1000) },
                        { name: '浙江', value: Math.round(Math.random() * 1000) },
                        { name: '江西', value: Math.round(Math.random() * 1000) },
                        { name: '山西', value: Math.round(Math.random() * 1000) },
                        { name: '内蒙古', value: Math.round(Math.random() * 1000) },
                        { name: '吉林', value: Math.round(Math.random() * 1000) },
                        { name: '福建', value: Math.round(Math.random() * 1000) },
                        { name: '广东', value: Math.round(Math.random() * 1000) },
                        { name: '西藏', value: Math.round(Math.random() * 1000) },
                        { name: '四川', value: Math.round(Math.random() * 1000) },
                        { name: '宁夏', value: Math.round(Math.random() * 1000) },
                        { name: '香港', value: Math.round(Math.random() * 1000) },
                        { name: '澳门', value: Math.round(Math.random() * 1000) }
                    ]
                }, {
                    name: '诈骗库',
                    type: 'map',
                    mapType: 'china',
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    data: [
                        { name: '北京', value: Math.round(Math.random() * 1000) },
                        { name: '天津', value: Math.round(Math.random() * 1000) },
                        { name: '上海', value: Math.round(Math.random() * 1000) },
                        { name: '广东', value: Math.round(Math.random() * 1000) },
                        { name: '台湾', value: Math.round(Math.random() * 1000) },
                        { name: '香港', value: Math.round(Math.random() * 1000) },
                        { name: '澳门', value: Math.round(Math.random() * 1000) }
                    ]
                }]
            };
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        }
    };
});