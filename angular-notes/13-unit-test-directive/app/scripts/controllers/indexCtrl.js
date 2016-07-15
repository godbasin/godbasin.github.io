'use strict';

app.controller('IndexCtrl', ['$scope', function($scope) {
	$scope.loading = 'init';
	$scope.asidemenus = [{
		title: '基本资料',
		click: function() {
			$scope.loading = 'init';
		},
		menus: [{
			text: '名字',
			click: function() {
				$scope.loading = 'name';
			}
		}, {
			text: '邮箱',
			click: function() {
				$scope.loading = 'email';
			}
		}, {
			text: 'github',
			click: function() {
				$scope.loading = 'github';
			}
		}, ]
	}, {
		title: '设置头像',
		click: function() {
			$scope.loading = 'sethead';
		}
	}, {
		title: '修改资料',
		click: function() {
			$scope.loading = 'setinfo';
		}
	}, {
		title: '其他',
		click: function() {
			$scope.loading = 'other';
		}
	}];
	$scope.loadphoto = function(url){
		$scope.avatar = url;
	}
}]);