'use strict';

/*选择模块加载*/
app.directive('contentNav', ['$filter', function($filter) {
	return {
		restrict: 'AE',
		scope: {
			datas: "=datas"
		},
		template: '<div class="btn-group" role="group" aria-label="...">' +
			'<button ng-repeat="data in datas" type="button" class="btn btn-default" ng-click="data.click()">{{ data.text }}</button>' +
			'</div>',
		link: function(scope, element, attrs) {
			scope.choose = function(index) {
				scope.current = scope.navs[index].text;
			};
		},
	};
}])

/*面包屑统一加载*/
.directive('breadcrumb', ['$filter', function($filter) {
	return {
		restrict: 'AE',
		scope: {
			datas: "=datas"
		},
		template: '<ol class="breadcrumb">' +
			'<li ng-repeat="data in datas" ng-class="$index == (datas.length - 1) ? \'active\' : \'\' ?"><a ng-click="data.click()">{{ data.text }}</a></li>' +
			'</ol>',
	};
}]);