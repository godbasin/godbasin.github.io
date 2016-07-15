'use strict';

app.controller('LoginCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.username = '';
	$scope.password = '';
	//定义submit事件，对应html中ng-submit
	$scope.submit = function() {
		sessionStorage.setItem('username', $scope.username);
		window.location.href = 'index.html#/index';
		//http服务POST账户密码
		/*$http({
				method: 'POST',
				url: 'your url',
				params: {
					"username": $scope.username, //ng-model双向绑定的用户名
					"password": $scope.password //ng-model双向绑定的密码
				}, 
			})
			.success(function(data) {				
				if (data.result === 'success') {			
					window.location.href = 'index.html#/index'; //判断登录成功，跳转
				} else {					
					alert("error"); //登录失败提示
				}				
			})
			//连接服务失败
			.error(function() {
				alert("connecting fail");
			});*/
	};
}]);