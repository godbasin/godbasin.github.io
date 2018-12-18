---
title: 玩转Angular1(14)--使用$compile编译指令
date: 2017-03-19 14:28:19
categories: angular混搭
tags: 笔记
---
AngularJS(v1.5.8)已经成为项目们的基本框架，《玩转Angular1》系列用于记录项目中的一些好玩或者比较特别的思路。
本文简单介绍angular的$compile服务，同时实现动态创建指令的过程。
<!--more-->
## $compile
-----
### angular中页面处理
ng对页面的处理过程：
- 浏览器把HTML字符串解析成DOM结构
- ng把DOM结构给$compile，返回一个link函数
- 传入具体的scope调用这个link函数
- 得到处理后的DOM，这个DOM处理了指令，连接了数据

### $compile服务
$compile是个编译服务。编译服务主要是为指令编译DOM元素。
编译一段HTML字符串或者DOM的模板，产生一个将scope和模板连接到一起的函数。

$compile用法：

``` javascript
$compile(element,transclude,maxPriority);
```

- element：将要被编译和插入模板的元素或者HTML字符串
- transclude：指令内有效的函数。Function(angular.Scope,cloneAttachFn=)
- maxPriority：只有在指令比给定的优先级低时应用。只影响根元素，不影响子元素

返回一个用于绑定HTML模板到一个作用域的连接函数，此时我们需要再次传入作用域scope，则将scope和模板连接到一起。

### 参考
- [《AngularJs $compile编译服务与指令》](http://www.cnblogs.com/ys-ys/p/4969864.html)
- [官方文档$compile](https://docs.angularjs.org/api/ng/service/$compile)

## 确认弹窗服务
---
### 存在问题
上一节[《玩转Angular1(13)--服务与指令的配合使用》](https://godbasin.github.io/2017/03/18/angular-free-13-service-work-with-directive/)中，我们使用ES6的modules来创建弹窗确认的服务，这样会存在以下的问题：
1. 需要在`index.html`或者其他模板中插入该弹窗。
2. 无法实现多层弹窗的确认，只能同时出现一个弹窗。

这里，我们可以通过将服务注入angular（即调用ngModule.service或者ngModule.factory），来获取$compile服务。
我们需要实现的功能：
- 每次调用AlertMsg服务，返回一个Promise，可使用`.then()`方法
- 可通过配置needComfirm设置是否需要二次确认
- 弹窗动态创建，使用完后注销

### AlertMsg.ts
``` javascript
// app/shared/services/AlertMsg.ts
// 提示确认弹窗
// SetAlertMsg({
//     confirmText: '我是确认键',
//     cancelText: '我是取消键',
//     title: '我是头部',
//     text: '我是说明文字文字文字',
//     needConfirm: true/false
// }).then(() => {
//     console.log('点击了确定');
// }, () => {
//     console.log('关闭');
// });
interface IAlertMsg {
    confirmText?: string;
    cancelText?: string;
    title?: string;
    needConfirm?: boolean;
    text: string;
}

class AlertMsgService {
    $compile: any;
    $rootScope: any;

    constructor($compile, $rootScope) {
        this.$compile = $compile;
        this.$rootScope = $rootScope;
    }

    // 设置参数，并返回promise
    setMsg(scope, params: IAlertMsg) {
        // 创建新的作用域，用于编译指令
        let newScope = this.$rootScope.$new();
        // 创建新的Promise，并将回调传入作用域
        const promise = new Promise((resolve, reject) => {
            newScope.reject = reject;
            newScope.resolve = resolve;
        });
        // 传入数据
        newScope.params = params;
        // 模板
        const tmp = '<aside alert-msg params="params" reject="reject" resolve="resolve"></aside>';
        // 添加到页面中
        $('body').append(this.$compile(tmp)(newScope));
        return promise;
    }
}

export default (ngModule) => {
    // 注入$compile、$rootScope服务
    ngModule.factory('AlertMsg', ['$compile', '$rootScope', function ($compile, $rootScope) {
        return (scope, params) => new AlertMsgService($compile, $rootScope).setMsg(scope, params);
    }]);
};
```

我们在编译新建指令模板的时候，需要连接作用域，这里我们通过`$rootScope.$compile()(scope)`进行这个操作。
同时，我们还需要在`bootstrap.ts`文件中注册服务，这里就不详细讲了。

### alertMsg.directive.ts
组件的使用当然也需要调整了，如下：

``` javascript
export default (ngModule) => {
    ngModule.directive('alertMsg', ['AlertMsg', function (AlertMsg) {
        return {
            restrict: 'AE',
            templateUrl: './shared/components/alertMsg.template.html',
            transclude: true,
            replace: true,
            scope: {
                params: '=',
                reject: '=?',
                resolve: '=?'
            },
            link(scope, element, attrs) {
                // 关闭或者取消时，调用reject
                scope.close = () => {
                    scope.reject();
                    element[0].remove();
                };
                // 确认时，调用resolve
                scope.submit = () => {
                    // 若设置了再次确认，再次确认
                    if (scope.params && scope.params.needConfirm) {
                        AlertMsg(scope, { text: '再次确认？' }).then(() => {
                            scope.resolve();
                            element[0].remove();
                        }, () =>{
                            // 若需要取消上层的操作
                            // scope.close();
                        });
                    } else {
                        scope.resolve();
                        element[0].remove();
                    }
                };
                // 设置按下Esc键时默认取消
                EscKeyUp(scope, () => {
                    scope.close();
                });
            }
        };
    }])
};
```

我们通过传入Promise的`reject()`和`resolve()`方法，来控制确认和取消操作的回调。

### alertMsg.template.html
``` html
<aside ng-show="params" class="alert-module confirm-msg" ng-click="close()">
    <section ng-click="$event.stopPropagation()">
        <header ng-show="params.title">{{ params.title }}</header>
        <article>
            <p ng-show="params.text">{{params.text}}</p>
        </article>
        <footer>
            <a class="button-2" ng-click="submit()">{{params.confirmText || '确定'}}</a>
            <a class="button-2 secondary" ng-click="close()">{{params.cancelText || '取消'}}</a>
        </footer>
    </section>
</aside>
```

### 在登录时使用
- 注入依赖
- 在登录的时候使用

``` javascript
// login.controller.ts
this.AlertMsg(this.$scope,{ text: '确认？', needConfirm: true }).then(() => {
    // 登录
}, () =>{
    // 取消
});
```

这样，我们就不需在`index.html`中全局注入指令。

## 结束语
---
这节主要简单介绍angular的$compile服务，以及在服务中动态编译创建指令的实现过程。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular-free/14-angular-compile-directive)
[此处查看页面效果](http://angular-free.godbasin.com/angular-free-14-angular-compile-directive/index.html)
