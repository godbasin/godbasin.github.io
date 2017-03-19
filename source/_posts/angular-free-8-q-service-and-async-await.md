---
title: 玩转Angular1(8)--$q.all与async/await
date: 2017-03-04 10:02:57
categories: angular混搭
tags: 笔记
---
AngularJS(v1.5.8)已经成为项目们的基本框架，《玩转Angular1》系列用于记录项目中的一些好玩或者比较特别的思路。
本文简单介绍angular的$q服务，ES7的async/await的说明和使用。
<!--more-->
## $q服务
-----
### $q简单介绍

- $q

$q是做为angularjs的一个服务而存在的，只是对promise异步编程模式的一个简化实现版。
$q是Angular的一种内置服务，它可以使你异步地执行函数，并且当函数执行完成时它允许你使用函数的返回值（或异常）。

$q常用的几个方法：
1. defer()
  > 创建一个deferred对象，这个对象可以执行几个常用的方法，比如resolve,reject,notify等
2. all()
  > 传入Promise的数组，批量执行，返回一个promise对象。
  > 可以把多个primise的数组合并成一个。当所有的promise执行成功后，会执行后面的回调。回调中的参数，是每个promise执行的结果。
3. when()
  > 传入一个不确定的参数，如果符合Promise标准，就返回一个promise对象。


- defer

defer的字面意思是延迟，$q.defer() 可以创建一个deferred实例（延迟对象实例）。
deferred实例旨在暴露派生的Promise实例，以及被用来作为成功完成或未成功完成的信号API，以及当前任务的状态。

``` javascript
var deferred = $q.defer();  //通过$q服务注册一个延迟对象 deferred
var promise = deferred.promise;  //通过deferred延迟对象，可以得到一个承诺promise，而promise会返回当前任务的完成结果
```

defer的方法：
1. deferred.resolve(value)
  > 成功解决(resolve)了其派生的promise。
  > 参数value将来会被用作promise.then(successCallback(value){...}, errorCallback(reason){...}, notifyCallback(notify){...})中successCallback函数的参数。
2. deferred.reject(reason)
  > 未成功解决其派生的promise。参数reason被用来说明未成功的原因。
  > 此时deferred实例的promise对象将会捕获一个任务未成功执行的错误，promise.catch(errorCallback(reason){...})。
  > 补充一点，promise.catch(errorCallback)实际上就是promise.then(null, errorCallback)的简写。
3. notify(value)
  > 更新promise的执行状态

- promise

当创建一个deferred实例时，promise实例也会被创建。通过deferred.promise就可以检索到deferred派生的promise。
promise的目的是允许interested parties访问deferred任务完成的结果。

promise 的方法:
1. then(successCallback, errorCallback, nitifyCallback)
  > 根据promise被resolve/reject，或将要被resolve/reject,调用successCallback/errorCallback。
2. catch(errorCallback)
  > then(null, errorCallback)的缩写。
3. finally(callback, notifyCallback)

- 参考
  - [《AngularJS 中的Promise --- $q服务详解》](http://www.cnblogs.com/xing901022/p/4928147.html)
  - [《浅谈Angular的 $q, defer, promise》](http://www.cnblogs.com/big-snow/p/5126059.html?utm_source=tuicool&utm_medium=referral)

### 使用$q.all合并多个请求
项目中会存在以下情况：
1. 需要同时获取多个请求的数据。
2. 请求时间较长，可进行取消操作。

这里我们可通过angular的$q服务进行封装，来实现我们的需求：

``` javascript
ngModule.factory('qService', ['$http', '$q', function ($http, $q) {
    return {
        query(param) {
            const deferred = $q.defer(); //声明承诺
            const cancel = function (reason) {
                deferred.reject(reason);
            };
            $http(param).then(res => { errCodeHandler(res); deferred.resolve(res.data); }, res => { errCodeHandler(res); deferred.reject() });
            return {
                cancel, // 返回取消事件
                promise: deferred.promise // 返回承诺
            };
        },
        multiquery(params) {
            const promises = params.map(param => $http(param).then(res => {
                errCodeHandler(res);
                return res;
            }));
            return {
                all: $q.all(promises)
            };
        }
    };
}])
```

当然，上面使用的是defer，是挺久前的代码了呢。
其实我们也可以使用Promise来进行，我们还可以拆分成两个服务，更加方便使用：

``` javascript
ngModule.factory('qService', ['$http', function ($http) {
    return params => {
        let resolve;
        let reject;
        const promise = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
        });
        $http(params).then(res => { errCodeHandler(res); resolve(res.data); }, res => { errCodeHandler(res); reject() });
        return {
            cancel: reject, // 返回取消事件
            promise: promise // 返回承诺
        };
    };
}])

ngModule.factory('qMultiService', ['$http', '$q', function ($http, $q) {
    return params => {
        const promises = params.map(param => $http(param).then(res => { errCodeHandler(res); return res.data; }, res => { errCodeHandler(res); }));
        return $q.all(promises);
    };
}])
```

其中errCodeHandler为前面介绍过的错误码处理，大家可翻阅[《玩转Angular1(5)--$http服务封装为异常处理服务》](https://godbasin.github.io/2017/02/24/angular-free-5-http-error-code-handle/)。


## async/await
---
### 语法
ES2017 标准提供了async函数，使得异步操作变得更加方便。

1. async函数返回一个Promise对象

async函数内部return语句返回的值，会成为then方法回调函数的参数。
async函数内部抛出错误，会导致返回的Promise对象变为reject状态。抛出的错误对象会被catch方法回调函数接收到。

2. async函数返回的Promise对象，必须等到内部所有await命令的Promise对象执行完，才会发生状态改变，除非遇到return语句或者抛出错误。也就是说，只有async函数内部的异步操作执行完，才会执行then方法指定的回调函数。

3. 正常情况下，await命令后面是一个Promise对象。如果不是，会被转成一个立即resolve的Promise对象。

await命令后面的Promise对象如果变为reject状态，则reject的参数会被catch方法的回调函数接收到。

4. 如果await后面的异步操作出错，那么等同于async函数返回的Promise对象被reject。

### 与Promise、Generator的比较 
async函数就是Generator函数的语法糖。

Async函数的实现最简洁，最符合语义，几乎没有语义不相关的代码。
它将Generator写法中的自动执行器，改在语言层面提供，不暴露给用户，因此代码量最少。如果使用Generator写法，自动执行器需要用户自己提供。

- 参考
以上均来自阮一峰[《异步操作和Async函数》](http://es6.ruanyifeng.com/#docs/async)。

### async/await使用场景
现在，我们存在这样的需求：
- 从一个接口中获取一个角色数组，该数组包括一些角色信息
- 每个角色都需要二次获取对应的权限信息
- 需要同时获取角色信息以及其相应的权限信息

此时，我们若需要进行多次的请求，嵌套以及等待请求返回都会显得比较被动。

我们可以使用async/await，大大简化该过程：

``` javascript
getRolesAndPermissions() {
    return qHttp.get('/roles').then(
        async (roles) => {
            const roleMap = {};
            const resourcesArray = await Promise.all(roles.map(role => qHttp.get('/roles/permissions/' + role.roleId)));
            resourcesArray.forEach((res, index) => {
                roleMap[roles[index].roleId] = res;
            });
            return [roles, roleMap];
        }
    );
}
```

## 结束语
-----
这节主要简单介绍了angular的$q服务，并对ES7的async/await进行了一些说明，以及介绍了在某些场景下的使用。
其实async/await的使用是其中一个小朋友引进来的，很多想法和思路也需要跟其他人切磋和学习，果然团队合作什么的最棒了，二十一世纪了，要合作共赢呀。