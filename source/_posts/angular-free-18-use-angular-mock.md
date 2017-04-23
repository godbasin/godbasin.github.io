---
title: 玩转Angular1(18)--使用mock本地数据模拟
date: 2017-04-03 16:33:49
categories: angular混搭
tags: 笔记
---
AngularJS(v1.5.8)已经成为项目们的基本框架，《玩转Angular1》系列用于记录项目中的一些好玩或者比较特别的思路。
本文介绍使用mock本地数据模拟的过程。
<!--more-->
## 模拟数据相关
-----
### angular-mock简介
Angular-mock模块为angular单元测试提供模块定义、加载、注入等支持。辅助Karma、Jasmine等JS测试工具来模拟angular方法，测试angular应用。
除此之外，Angular-mock还扩展了ng的多个核心服务，使之可以被测试代码以同步的方式进行审查和控制。

mock功能：
- 基于数据模板生成模拟数据
- 基于HTML模板生成模拟数据
- 拦截并模拟ajax请求

这里我们只需要用到最后一个功能即可。

模块组件：
- 对象
  - `angular.mock`：'angular-mocks.js'的命名空间，其中包含测试代码。

- 服务
  - `$exceptionHandler`：通过$exceptionHandler模拟实现重抛或记录错误信息。查看$exceptionHandlerProvider获取配置信息。
  - `$log`：模拟实现$log收集所有数组中已记录的日志信息(每一个记录等级一个数组)。这些数组被作为logs属性可每个具体等级的log方法获取。例：对于等级error数组可被 $log.error.logs获取。
  - `$interval`：模拟实现$interval服务。
  - `$httpBackend`：为使用了$http service的应用提供单元测试的伪HTTP后台。
  - `$timeout`：该服务仅是一个简单的装饰器，为$timeout服务添加了"flush"和"verifyNoPendingTasks" 方法。
  - `$controller`：为$controller提供了额外的bindings参数，这在测试使用了bindToController指令的控制器时很有用处。

### $httpBackend
$httpBackend是ngMock模块中的服务，可以模拟后端Http请求返回。
在路由匹配时，将会拦截请求并返回模拟的结果。

$httpBackend常用方法：
- when：新建一个后端定义（backend definition）。`when(method, url, [data], [headers]);`
- expect：新建一个请求期望（request expectation）。`expect(method, url, [data], [headers]);`

- when和expect都需要4个参数method, url, data, headers, 其中后2个参数可选。
  - method表示http方法注意都需要是大写(GET, PUT…)
  - url请求的url可以为正则或者字符串
  - data请求时带的参数
  - headers请求时设置的header

如果这些参数都提供了，那只有当这些参数都匹配的时候才会正确的匹配请求。
when和expect都会返回一个带respond方法的对象。
respond方法有3个参数status，data，headers通过设置这3个参数就可以伪造返回的响应数据了。

$httpBackend.when与$httpBackend.expect的区别在于：
$httpBackend.expect的伪后台只能被调用一次(调用一次后会被清除)，第二次调用就会报错，而且$httpBackend.resetExpectations可以移除所有的expect而对when没有影响。

when和expect都有对应的快捷方法whenGET, whenPOST,whenHEAD, whenJSONP, whenDELETE, whenPUT; expect也一样

### 参考
- [《Angular-mock之使用$httpBackend服务测试$http》](https://segmentfault.com/a/1190000003716613)
- [官方ngMock](https://docs.angularjs.org/api/ngMock)
- [官方$httpBackend](https://docs.angularjs.org/api/ngMock/service/$httpBackend)

## 添加mock模拟数据
---
### bootstrap.ts
``` typescript
// app/bootstrap.ts
// ...
// 注入angular相关依赖
const dependencies = [
    ...
    'ngMockE2E'
];

// 获取angular的app
const ngModule = angular.module('AngularFree', dependencies);

// 注入模拟服务
require('angular-mocks');
import mockModule from './mock';
mockModule(ngModule);
// ...
```

### 添加mock服务
我们在`app`文件夹下添加`mock`文件夹，用于放置mock相关的设置和数据。
添加`index.ts`文件，用于总的输出：

``` typescript
// 文件夹根据模块（路由）分相关的服务
import user from './user'; // 用户模块数据模拟
import service from './service'; // 服务模块数据模拟
import system from './system'; // 系统模块数据模拟

export default ngModule => {
    // 注入各个模块的模拟服务
    user(ngModule);
    service(ngModule);
    system(ngModule);

    ngModule.run(['$httpBackend', $httpBackend => {
        // 登录
        $httpBackend.whenPOST(/login[^/]*/).respond(require('./login.json'));
        // 需添加其余的passThrough，这样未添加拦截的则可以正常发送请求
        $httpBackend.whenGET(/.*/).passThrough();
        $httpBackend.whenPOST(/.*/).passThrough();
        $httpBackend.whenPUT(/.*/).passThrough();
        $httpBackend.whenDELETE(/.*/).passThrough();
    }]);
};
```

### 服务的数据模拟
每个服务都使用相似的方式来拦截路由和返回数据：

``` typescript
// app/mock/user/index.ts
export default ngModule => {
    ngModule.run(['$httpBackend', ($httpBackend) => {
        // 用户列表数据获取
        $httpBackend.whenGET(/users[^/]*/).respond(require('./userList.json'));
        // 用户详情获取
        $httpBackend.whenGET(/\/users\/(.+)/).respond(require('./userDetail.json'));
        // 用户新建
        $httpBackend.whenPOST(/\/users\/(.+)/).respond(200, '');
        // 用户编辑
        $httpBackend.whenPUT(/\/users\/(.+)/).respond(200, '');
    }]);
};
```

然后我们通过添加相应的json文件，里面保存着需要返回的数据，则可以很方便地使用了呢。

## 结束语
---
这节主要简单介绍使用mock本地数据模拟的过程，这也是为什么我们之前创建的一些http服务都经过angular的$http服务进行封装的原因，这样的话我们就能很方便地使用angular的mock和$httpBackend服务了。
