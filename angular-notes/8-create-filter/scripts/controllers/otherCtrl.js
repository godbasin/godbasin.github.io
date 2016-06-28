'use strict';

app.controller('OtherCtrl', ['$scope', '$filter',  function($scope, $filter) {
	$scope.string = 'This is a long long long long long long long long long long very long string.';
	$scope.date = new Date();
	$scope.number = 1263714072;
	$scope.number_with_currency = $filter('currency')($scope.number, '￥');
}]);