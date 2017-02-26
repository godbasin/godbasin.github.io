---
title: 玩转Angular1(5)--$http服务封装为异常处理服务
date: 2017-02-24 19:43:49
categories: angular混搭
tags: 笔记
---
AngularJS(v1.5.8)已经成为项目们的基本框架，《玩转Angular1》系列用于记录项目中的一些好玩或者比较特别的思路。
本文记录在angular中简单介绍了Promise，以及使用$http服务进行些简单封装、进行错误码处理的过程。
<!--more-->
## $http
-----
### Promise
- 什么是Promise

一个Promise对象代表一个目前还不可用，但是在未来的某个时间点可以被解析的值。它允许你以一种同步的方式编写异步代码。
Promises将嵌套的callback，改造成一系列的.then的连缀调用，去除了层层缩进的糟糕代码风格。

- Promises/A规范

promise表示一个最终值，该值由一个操作完成时返回。

promise有三种状态：未完成(unfulfilled)，完成(fulfilled)和失败(failed)。
promise的状态只能由未完成转换成完成，或者未完成转换成失败。
promise的状态转换只发生一次。


### angular的$http服务
$http是AngularJS中的一个核心服务，通过浏览器的XMLHttpRequest对象或者JSONP，用于读取远程服务器的数据。
$http服务是基于$q服务上的拓展。

$q服务是基于Promises/A+规范的异步运行服务，可视为angular的Promise服务吧。

$http服务的使用很简单，提供一些描述请求的参数，请求就出去了，然后返回一个扩充了success方法和error方法的promise对象，你可以在这个对象中添加需要的回调函数。

至于$http的具体使用，大家可以参考[官方文档](https://docs.angularjs.org/api/ng/service/$http)。

``` javascript
// 简单的GET请求:
$http({
  method: 'GET',
  url: '/someUrl'
}).then(function successCallback(response) {
    // 成功回调
  }, function errorCallback(response) {
    // 失败回调
  });
```

回调中传入的response参数里面有：
- data – {string|Object} – 回调数据
- status – {number} – Http状态码
- headers – {function([headerName])}
- config – {Object}
- statusText – {string}

利用返回的数据和Http状态码，我们可以进行一些通用的异常处理。


## 异常处理服务
---
### 位于data中的错误码
有些时候，后台会通过data中某个code参数返回我们的错误码，此时data中的json对象为：

``` json
{
    "code":"0103010112", // 为0时则为正确
    "data":""
}
```

这时候我们就需要拿到data之后再进行异常处理。

``` typescript
$http(config).then(res => errCodeHandler(res)).then(res => res.data).catch(res => { throw (new Error('error response')); });
```

可以看到，我们在$http服务发送后拿到Promise，然后进行异常处理之后，再提取出data数据返回。
这里需要注意的是，因为我们并没有在promise链中提供失败回调，这里我们也可以通过在链的尾部添加catch来进行错误处理。


### 位于http状态码中的错误码
还有些时候，后台会直接通过data中返回我们的错误码，此时data中的json对象为：

``` json
{
    "data": "0103010112"
}
```

这时候我们需要通过http状态码来判断，我们拿到的data，到底是数据呢，还是错误码。

``` typescript
$http(config).then(res => errCodeHandler(res)).then(res => res.data).catch(res => { errCodeHandler(res); throw (new Error('error response')); });
```

这里与前面不同的地方是，当失败回调的时候，我们依然需要判断http状态码，然后进行处理。


### 异常处理函数errCodeHandler
``` typescript
// 错误码获取处理
function errCodeHandler(res) {
    if (res.status >= 400) {
        const err = errCodeTranslate(res.data.errorCode);
        const errText = err ? `错误：${err}` : '';
        alert(errText);
    } else if (res.status >= 200) {
        const body = res.data;
        if (body.code !== '0') {
            const err = errCodeTranslate(body.code);
            const errText = err ? `错误：${err}` : '';
            alert(errText);
        }
    }
    return res;
}
// 错误码转换
function errCodeTranslate(code) {
    const translation = constant.errCodes;
    return translation[code] || (code ? `错误码${code}` : '');
}
```

其中`constant`维护一些常用的转换数据，而`constant.errCodes`维护一个对象，来进行错误码的转换展示，其格式如下：

``` javascript
constant.errCodes = {
    '0101010101': '名称重复',
};
```

## 封装易用的qHttp服务
---
### 包含异常处理的qHttp服务
``` javascript
ngModule.factory('qHttp', ['$http', ($http) => (function () {
    function qHttp(config) {
        return $http(config).then(res => errCodeHandler(res)).then(res => res.data).catch(res => { errCodeHandler(res); throw (new Error('error response')); });
    }
    return qHttp;
})()])
```

这里我们通过在原有$http服务外简单封装了一层，达到了提供可以自动进行异常处理，且只把data数据返回的Promise。
调用很简单，和$http服务基本一致：

``` javascript
// 简单的GET请求:
qHttp({
  method: 'GET',
  url: '/someUrl'
}).then(data => {
    // 处理data
});
```

### 对method提供简单调用
上面的qHttp服务中，每次调用都需要手动提供method参数，我们也可以添加一些简单的处理：

``` javascript
ngModule.factory('qHttp', ['$http', ($http) => (function () {
    function qHttp(config) {
        return $http(config).then(res => errCodeHandler(res)).then(res => res.data).catch(res => { errCodeHandler(res); throw (new Error('error response')); });
    }
    // 方便使用的方法
    ['post', 'get', 'delete', 'put'].forEach(method => {
        qHttp[method] = (...obj) => $http[method](...obj).then(res => errCodeHandler(res)).then(res => res.data).catch(res => { errCodeHandler(res); throw (new Error('error response')); });
    });
    return qHttp;
})()])
```

此时我们就可以很方便地使用qHttp服务了：

``` javascript
// 简单的GET请求:
qHttp.get({
  url: '/someUrl'
}).then(data => {
    // 处理data
});
```

至于为什么我们使用angular的$http服务呢，虽然我们的后续规划倾向是尽量脱离angular而使用ES6的modules来进行，但是后面我们会说到一个比较好用的服务: angular的mock模拟数据服务。

## 结束语
-----
这节主要简单介绍了简单封装$http服务、进行错误码处理的过程。当然大家也可以自行发挥，根据具体情况封装易用的服务，像如果通过JSON传输，就可以封装像postJSON/putJSON等方法，代码中也有提供，大家可以去翻翻看[HttpServices](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular-free/5-http-error-code-handle/app/shared/services/HttpServices.ts)这个文件。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular-free/5-http-error-code-handle)