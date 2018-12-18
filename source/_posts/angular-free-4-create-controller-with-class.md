---
title: 玩转Angular1(4)--使用class写控制器
date: 2017-02-19 16:37:29
categories: angular混搭
tags: 笔记
---
AngularJS(v1.5.8)已经成为项目们的基本框架，《玩转Angular1》系列用于记录项目中的一些好玩或者比较特别的思路。
本文记录在angular中使用class写控制器controller的过程。
<!--more-->
## ES6 Class
-----
### 简单介绍
通过class关键字，可以定义类。基本上，ES6的class可以看作只是一个语法糖，它的绝大部分功能，ES5都可以做到，新的class写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已。

若是之前还没用过class的小伙伴们，可以参考一下阮一峰的[《ECMAScript 6 入门》](http://es6.ruanyifeng.com/#docs/class)，包括：
- Class基本语法
- Class的继承
- 原生构造函数的继承
- Class的取值函数（getter）和存值函数（setter）
- Class 的 Generator 方法
- Class 的静态方法
- Class的静态属性和实例属性
- 类的私有属性
...

这里我们会简单介绍其中的一些内容。

- constructor方法

constructor方法是类的默认方法，通过new命令生成对象实例时，自动调用该方法。
一个类必须有constructor方法，如果没有显式定义，一个空的constructor方法会被默认添加。

constructor方法默认返回实例对象（即this），完全可以指定返回另外一个对象。


- 类的实例对象

生成类的实例对象的写法，与ES5完全一样，也是使用new命令。如果忘记加上new，像函数那样调用Class，将会报错。


其他内容等遇到了我们再提及吧。

### 参考
- [《ECMAScript 6 入门》](http://es6.ruanyifeng.com/#docs/class)

## 添加LoginCtrl控制器
---
### login.controller.ts
我们在app/modules/login文件夹中，创建`login.controller.ts`文件：

``` typescript
//login.controller.ts
import { Notify } from '../../shared/services/BasicTools';

class LoginCtrl {
    // 获取依赖
    public static $inject = [
        '$scope',
        '$timeout'
    ];
    // 注入依赖
    constructor(
        private $scope,
        private $timeout
    ) {
        // VM用于绑定模板相关内容
        $scope.VM = this;
    }

    // 登录事件
    submitForm() {
        // 登录中提示
        const loading = Notify({
            title: `登录中`,
            type: 'info',
            hide: false
        });
        // 一秒后，提示登陆成功
        this.$timeout(() => {
            if (loading.remove) { loading.remove(); }
            Notify({
                title: `登录成功`,
                type: 'success'
            });
            location.href = 'index.html#/app';
        }, 1000);
    }
}
```

这里我们使用到了一个叫Notify的函数，这是通过gentelella的工具封装的一些通用工具，后面会简单说明。
可以看到，我们使用class定义了一个控制器，然后我们通过以下代码注册控制器：

``` typescript
//login.controller.ts
// 获取angular
const angular = require('angular');

// 定义angular模块，该模块注入控制器LoginCtrl
const ngModule = angular.module('LoginCtrl', []);
ngModule.controller('LoginCtrl', LoginCtrl)

// 输出模块
export default 'LoginCtrl';
```

我们需要在angular应用中使用控制器有两种方式：
1. 通过在模块中注册控制器。
2. 通过添加模块依赖，该模块依赖中已含有该控制器。

这里我们使用的是第二种，当然我们还需要一些处理才能使用。

### 使用LoginCtrl控制器
- 添加路由

首先我们需要在路由中，把控制器添加进相关路由：

``` typescript
// app.ts
// ui-router路由的参数
const routerStates = [{
    name: 'login',
    url: '/login',
    templateUrl: './modules/login/login.template.html',
    controller: 'LoginCtrl'
}];
```


- 注册控制器

我们在启动应用前，需要注册该控制器（或者包含该控制器的模块）：

``` typescript
// bootstrap.ts
// 注入控制器
import LoginCtrl from './modules/login/login.controller';

// 注入angular相关依赖
const dependencies = [
    ngRoute,
    uiRouter,
    
    LoginCtrl
];
```

- 在模板中添加登录事件

``` html
<form ng-submit="VM.submitForm()"> ... </form>
```

## BasicTools工具
---
这个文件主要用于存放一些集成的工具包，后面我们都只在使用到的时候简单说明相关的工具，大家有兴趣可以查看源码阅读。

### PNotify
PNotify是一个JavaScript通知插件，前身为Pines Notify。它旨在提供无与伦比的灵活性，同时很容易使用。它可以提供无阻塞的通知，允许用户无需关闭通知或者提示信息就可以点击通知后面的元素。

PNotify支持使用Bootstrap或者jQuery UI的界面，这意味着它能够很容易更换主题。可以在插件官方页面的右上角尝试使用一些现成的主题。它可以在所有主流浏览器中使用，并提供了一致性的界面。

以下是BasicTools中Notyfy简单封装PNotify的代码：

``` typescript
// BasicTools.ts
export function Notify({ title = '', text = '', type = 'info', styling = 'bootstrap3', animation = 'slide', delay = 2000, hide = true }) {
    return new PNotify({
        title,
        text,
        type,
        styling,
        animation,
        delay,
        hide
    })
}
```

可见，我们对该工具针对使用习惯和场景进行了些初始化，使得调用更加方便。

## 结束语
-----
这节主要简单介绍了在angular中使用class创建控制器，以及添加项目的一些常用工具（服务）。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular-free/4-create-controller-with-class)
[此处查看页面效果](http://angular-free.godbasin.com/angular-free-4-create-controller-with-class/index.html)
