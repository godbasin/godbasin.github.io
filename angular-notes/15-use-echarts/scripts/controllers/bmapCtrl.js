'use strict';

app.controller('BmapCtrl', ['$scope',  function($scope) {
	$scope.location = {
            searchText: '', // 保存搜索输入
            longitude: undefined, // 保存位置经度信息
            latitude: undefined, // 保存位置纬度信息
        };
}]);