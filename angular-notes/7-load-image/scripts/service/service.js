'use strict';

app.factory('qService', ['$http', '$q', function($http, $q) {
	return {
		query: function(param) {
			var deferred = $q.defer(), //声明承诺
				cancel = function(reason) {
					deferred.reject(reason);
				};
			$http(param).
			success(function(data) {
				deferred.resolve(data); //请求成功
			}).
			error(function(data) {
				deferred.reject(data); //请求失败
			});
			return {
				promise: deferred.promise, // 返回承诺
				cancel: cancel // 返回取消事件
			};
		},
		multiquery: function(params) {
			var promises = [];
			for (var i in params) {
				var promise = $http(params[i]);
				promises.push(promise);
			}
			return $q.all(promises);
		}
	};
}])
//异步提交带图片表单
/* params:
 * {
 * 	fileinput: 传入file input的dom对象,
 * 	url: 服务器地址,
 * 	other: 其他需要发送的参数{键：值}
 *  callback: 成功回调
 *  errback: 失败回调
 * }
 */
.factory('AsyncForm', function() {
	var feature = {}; //用于检查FormData和fileAPI的兼容性
	feature.fileapi = (window.File && window.FileReader && window.FileList && window.Blob);
	feature.formdata = window.FormData !== undefined;
	var fileAPI = feature.fileapi && feature.formdata,
		formData,
		xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP'),
		AsyncForm = function(params) {
			if (fileAPI) {
				var otherparams = params.other, //其他需要发送的参数{键：值}
					callback = params.callback, //成功回调
					errback = params.errback, //失败回调
					files = (params.fileinput && params.fileinput.files) ? params.fileinput.files : {}, //传入file input的dom对象
					onreadystatechange;
				//设置onreadystatechange
				onreadystatechange = function(func, _xhr, errfunc) {
					_xhr.onreadystatechange = function() {
						if (_xhr.readyState == 4) {
							if (_xhr.status == 200) {
								//判断若有成功回调，则执行
								if (typeof func == 'function') {func(_xhr.responseText);} 
							} else {
								//判断若有失败回调，则执行
								if (typeof errfunc == 'function') {errfunc();}
							}
						}
					}
				};
				//新建formData对象
				formData = new FormData();
				//判断是否有图片对象，有则添加进队列
				if (files) {
					for (var i = 0; i < files.length; i++) {
						formData.append('file', files[i]);
					}
				}
				//若有其他表单项，添加进队列
				for (i in otherparams) {
					formData.append(i, otherparams[i]);
				}
				//设置POST方法，以及服务器地址
				xhr.open('post', params.url);
				onreadystatechange(callback, xhr, errback);
			} else {
				alert("浏览器不支持FormData或fileAPI");
			}
		};
	AsyncForm.prototype = {
		//提交表单事件
		submit: function() {
			xhr.send(formData);
		},
	};
	return AsyncForm;
});