---
title: Angular使用笔记10-有关路由以及控制器间通信
date: 2016-07-29 22:02:47
categories: angular混搭
tags: 笔记
---
最近的一个项目使用AngularJS(v1.2.6)作为前端的框架，《Angular使用笔记》系列用于记录过程中的一些使用和解决方法。
本文记录使用有关路由以及控制器间通信的过程。
<!--more-->

## ngRoute
-----
前面篇章我们已经讲述过路由的简单使用方法，这里我们将对路由传参等进行更详细的介绍。
### ngRoute包括的内容
ng的路由机制是靠ngRoute提供的，通过hash和history两种方式实现了路由，可以检测浏览器是否支持history来灵活调用相应的方式。
- 服务$routeProvider用来定义一个路由表，即地址栏与视图模板的映射
- 服务$routeParams保存了地址栏中的参数，例如{id : 1, name : 'tom'}
- 服务$route完成路由匹配，并且提供路由相关的属性访问及事件，如访问当前路由对应的controller
- 指令ngView用来在主视图中指定加载子视图的区域
ng-view的实现原理，是根据路由的切换，动态编译html模板——$compile(html)(scope)

以上内容再加上$location服务，则可实现一个单页面应用。

### $routeProvider
$routeProvider服务提供两种方法：
- when()：配置路径和参数
  - when的第二个参数
    - controller： 对应路径的控制器函数，或者名称
    - controllerAs： 给控制器起个别名
    - template： 对应路径的页面模板，会出现在ng-view处
    - templateUrl： 对应模板的路径
    - resolve： 该属性会以键值对对象的形式，给路由相关的控制器绑定服务或者值。然后把执行的结果值或者对应的服务引用，注入到控制器中。如果resolve中是一个promise对象，那么会等它执行成功后，才注入到控制器中，此时控制器会等待resolve中的执行结果
    - redirectTo：重定向地址
    - reloadOnSearch：设置是否在只有地址改变时，才加载对应的模板;search和params改变都不会加载模板
    - caseInsensitiveMatch ：路径区分大小写

``` javascript
resolve: {
	//设置三秒的延迟Promise，该页面在3秒后才会加载成功
	delay: function($q, $timeout) {
		var delay = $q.defer();
		$timeout(delay.resolve, 3000);
		return delay.promise;
	}
}
```
- otherwise：配置其他的路径跳转，即default

### $route
- $route.reload()方法可以实现刷新路由
- $route服务提供了current和routes属性
- $route服务提供以下几个事件：
使用$on来调用事件
  - $routeChangeStart 路由发生变化时被触发
  - $routeChangesSuccess 路由成功时被触发
  - $routeChangeError 路由异常时被触发
  - $routeUpdate 路由更新时被触发

### $routeParams
$routeParams服务可获取路由中的参数，当路由成功后才能获取。
``` javascript
.when('/example/:id',{}) //设置路由参数id
//控制器中获取参数
app.controller('ExampleController', ['$routeParams', function($routeParams){
    var id = $routeParams.id;
    //使用id获取相关id值
}]);
```
- $routeParams和$route.current.params
	> $route.current.params在路由发生变化时会改变
	> $routeParams只有当路由成功时才会改变
	> 这里有个很好的[例子](https://docs.angularjs.org/api/ngRoute/service/$route#example)

### $location
$location服务解析地址栏中的URL（基于window.location），可在应用代码中获取到。
- 暴露当前地址栏的URL，可获取并监听或改变URL
- 当出现以下情况时同步URL
  - 改变地址栏
  - 点击了后退按钮（或者点击了历史链接）
  - 点击了一个链接
- 可用（protocol, host, port, path, search, hash）获取URL对象的具体内容

### 参考
- [《走进AngularJs(八) ng的路由机制》](http://www.2cto.com/kf/201312/265979.html)
- [《AngularJs ng-route路由详解》](http://www.cnblogs.com/xing901022/p/5154358.html?utm_source=tuicool&utm_medium=referral)
- [《AngularJS开发指南27：使用$location》](http://www.angularjs.cn/A00M)

## Controller间通信
-----
### angular控制器通信的方式
- 1.利用作用域继承的方式
即子控制器继承父控制器中的内容。
- 2.基于事件的方式
即$on,$emit,$boardcast这三种方式。
- 3.服务方式
写一个服务的单例然后通过注入来使用。

### 利用作用域的继承方式
作用域的继承是基于javascript的原型继承方式。
- 当作用域上面的值为基本类型的时候，修改父作用域上面的值会影响到子作用域，修改子作用域只会影响子作用域的值，不会影响父作用域上面的值
- 作用域上的值为对象（引用类型），任何一方的修改都能影响另一方

### 基于事件的方式
Angularjs为在scope中为我们提供了冒泡和隧道机制。
- $broadcast会把事件广播给所有子级以下的作用域
- $emit则会将事件冒泡传递给父级以上的作用域
- $on则是angularjs的事件注册函数，表示事件监听
> 兄弟控制间进行通信：
> 兄弟控制中向父作用域触发一个事件，然后在父作用域中监听事件，再广播给子作用域。

### angular服务的方式
angular服务中生成一个对象，该对象就可以利用依赖注入的方式在所有的控制器中共享。

### 参考
[《AngularJS控制器controller如何通信？》](https://segmentfault.com/a/1190000000639592)

## 结束语
-----
路由参数的传递以及控制器直接的通信，配合使用能获得更多的功能呢。