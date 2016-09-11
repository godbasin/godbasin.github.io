'use strict';

//上传图片模块加载
app.directive('fileInput', ['$timeout', function($timeout) {
	return {
		restrict: 'AE',
		transclude: true,
		replace: true,
		template: '<div class="file-input" ng-click="click()">' +
			'<a class="btn btn-default">{{ text }}</a>' +
			'</div>',
		scope: {
			loadphoto: "=loadphoto",
			text: "@text",
		},
		link: function(scope, element, attrs) {
			scope.click = function() {
				//从该指令根节点元素element中查找input
				var $input = element[0].getElementsByTagName("input");
				//如果已经存在则先移除input
				if ($input.length) {
					element[0].removeChild($input[0]);
				}
				//创建新的file input
				$input = document.createElement("input");
				$input.setAttribute("type", "file");
				$input.setAttribute("name", "file");
				$input.setAttribute("accept", "image/*");
				//将input添加进该指令根节点元素element中
				element[0].appendChild($input);
				//绑定click事件，取消事件的传播
				$input.addEventListener("click", function() {
					event.stopPropagation();
				});
				//绑定change事件，分析获取图片url
				$input.addEventListener("change", function(e) {
					var fReader = new FileReader(),
						file = e.target.files[0];
					fReader.readAsDataURL(file); //获取图片url
					fReader.onload = function(e) {
						var url = e.target.result;
						scope.loadphoto(url); //返回图片url
					};
				}, false);
				//即刻触发点击
				$timeout(function() {
					$input.click();
				});

			};
		},
	};
}]);
