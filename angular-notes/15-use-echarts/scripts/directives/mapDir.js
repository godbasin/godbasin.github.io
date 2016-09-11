'use strict';

/*定位地图*/
app.directive('setLocation', function() {
    return {
        restrict: 'AE',
        scope: {
            'searchText': '@searchText',
            'locationStr': '@locationStr',
            'location': '=location'
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
})

/*轨迹定位展示*/
.directive('trackLocation', function() {
    return {
        restrict: 'AE',
        replace: true,
        template: `<div class="l-map"></div>`,
        link: function(scope, element, attrs) {
            // 百度地图API功能
            var map = new BMap.Map(element[0]); // 创建Map实例
            var solidLines = []; // 保存实线数组
            var dashedLines = []; // 保存虚线数组
            map.enableScrollWheelZoom();
            // map.setMapStyle({
            //     style: 'light' // 设置颜色，有三种可选：light/dark/normal
            // });
            map.centerAndZoom(new BMap.Point(114.063821, 22.549535), 15);

            // 伪造一些数据
            var locations = [{
                longitude: 114.063821,
                latitude: 22.559535,
                text: 'A1地点'
            }, {
                longitude: 114.103821,
                latitude: 22.541535,
                text: 'B2地点'
            }, {
                longitude: 114.123821,
                latitude: 22.547535,
                text: 'C3地点'
            }, {
                longitude: 114.043821,
                latitude: 22.548535,
                text: 'D4地点'
            }];

            //添加点
            locations.forEach((loc, index) => {
                var p = new BMap.Point(loc.longitude, loc.latitude);
                var marker = new BMap.Marker(p);
                var icon = new BMap.Icon('./images/location.png', { width: 28, height: 28 });
                var label = new BMap.Label(loc.text, {
                    position: p,
                    offset: new BMap.Size(5, 5)
                });
                label.setStyle({
                    color: '#343637',
                    fontFamily: '微软雅黑',
                    padding: '0 10px',
                    fontSize: '18px',
                    lineHeight: '40px',
                    border: 'solid 1px #ccc',
                });
                marker.setIcon(icon);

                // 添加点
                map.addOverlay(label);
                map.addOverlay(marker);
                // 设置中心
                map.panTo(p);

                //最后的一组设置为实线，其余为虚线
                if (index === locations.length - 2) {
                    dashedLines.push(p);
                    solidLines.push(p);
                } else if (index === locations.length - 1) {
                    solidLines.push(p);
                } else {
                    dashedLines.push(p);
                }
            });

            // 添加折线
            var dashedLine = new BMap.Polyline(dashedLines);
            var solidLine = new BMap.Polyline(solidLines);
            // 设置颜色
            dashedLine.setStrokeColor('#fa004c');
            dashedLine.setStrokeOpacity(1);
            dashedLine.setStrokeStyle('dashed');
            solidLine.setStrokeColor('#fa004c');
            solidLine.setStrokeOpacity(1);
            map.addOverlay(dashedLine);
            map.addOverlay(solidLine);
        },
    };
});