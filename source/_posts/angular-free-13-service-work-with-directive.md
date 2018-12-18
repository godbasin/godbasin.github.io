---
title: 玩转Angular1(13)--服务与指令的配合使用
date: 2017-03-18 07:33:56
categories: angular混搭
tags: 笔记
---
AngularJS(v1.5.8)已经成为项目们的基本框架，《玩转Angular1》系列用于记录项目中的一些好玩或者比较特别的思路。
本文简单介绍通过服务来调用Directive指令的过程。
<!--more-->
## 确认弹窗服务
-----
### 基本思路
有时候，我们需要在控制器逻辑中进行确认操作，例如删除、注销等一些操作，是需要用户进行确认的。
这时候我们想要这样的一个服务，用来进行确认操作：
- 调用函数，传入title、text等参数，显示确认的信息
- 函数返回一个Promise，可使用`.then`来进行后续的处理
- then函数传入两个回调，分别是确认继续的回调，和取消的回调

我们的服务还需要对外提供以下功能：
- 设置函数`SetAlertMsg`
- 是否已设置弹窗`isAlertMsgSet`
- 设置的数据`GetAlertMsgParams`
- 取消函数`AlertMsgReject`
- 确认函数`AlertMsgResolve`

后面的几个，主要是为了在指令中使用。

### AlertMsg.ts
``` javascript
// app/shared/services/AlertMsg.ts
// 提示确认弹窗
// SetAlertMsg({
//     confirmText: '我是确认键',
//     cancelText: '我是取消键',
//     title: '我是头部',
//     text: '我是说明文字文字文字',
// }).then(() => {
//     console.log('点击了确定');
// }, () => {
//     console.log('关闭');
// });

interface IAlertMsg {
    confirmText?: string;
    cancelText?: string;
    title?: string;
    icon?: string;
    text: string;
}

class AlertMsgService {
    private isSet: boolean = false;
    private params: IAlertMsg = undefined;
    private resolve: any = undefined;
    private reject: any = undefined;

    constructor() {
        // 单独提取方法需要绑定this
        this.getIsSet = this.getIsSet.bind(this);
        this.getParams = this.getParams.bind(this);
        this.setMsg = this.setMsg.bind(this);
        this.msgReject = this.msgReject.bind(this);
        this.msgResolve = this.msgResolve.bind(this);
    }

    // 获取是否设置
    getIsSet() {
        return this.isSet;
    }

    // 获取设置的数据
    getParams() {
        return this.params;
    }

    // 设置参数，并返回promise
    setMsg(params: IAlertMsg) {
        this.isSet = true;
        this.params = params;

        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }

    // reject并清除数据
    msgReject() {
        if (typeof this.reject === 'function') { this.reject(); }
        this.clearMsg();
    }

    // resolve并清除数据
    msgResolve() {
        if (typeof this.resolve === 'function') { this.resolve(); }
        this.clearMsg();
    }

    // 清除数据
    private clearMsg() {
        this.params = undefined;
        this.isSet = false;
    }
}

const AlertMsg = new AlertMsgService();
const {getParams, getIsSet, setMsg, msgReject, msgResolve} = AlertMsg;
export {
    getIsSet as isAlertMsgSet,
    setMsg as SetAlertMsg,
    getParams as GetAlertMsgParams,
    msgReject as AlertMsgReject,
    msgResolve as AlertMsgResolve,
};
export default AlertMsg;
```

## 确认弹窗组件
---
### 基本思路
弹窗组件需要满足的一些需求：
- 获取弹窗服务的状态，来控制是否显示
- 获取弹窗服务的数据，并进行相应的展示控制
- 取消或关闭时，调用reject
- 添加按键Esc事件，进行取消或关闭
- 确认时，调用resolve回调


### alertMsg.directive.ts
``` javascript
export default (ngModule) => {
    ngModule.directive('alertMsg', ['$parse', function ($parse) {
        return {
            restrict: 'AE',
            templateUrl: './alertMsg.template.html',
            transclude: true,
            replace: true,
            link(scope, element, attrs) {
                // watch是否设置，来控制是否显示
                scope.$watch(isAlertMsgSet, function (newValue, oldValue) {
                    if (newValue === true) {
                        // 获取相应的现实数据
                        scope.params = GetAlertMsgParams();
                        // 设置按下Esc键时默认取消
                        EscKeyUp(scope, () => {
                            scope.close();
                        });
                    }
                });
                // 关闭或者取消时，调用reject
                scope.close = () => {
                    AlertMsgReject();
                    scope.params = undefined;
                };
                // 确认时，调用resolve
                scope.submit = () => {
                    AlertMsgResolve();
                    scope.params = undefined;
                };
            }
        };
    }])
};
```

关于EscKeyUp服务，有兴趣或者疑问的小伙伴可以到[《玩转Angular1(9)--按键事件队列KeyUp服务》](https://godbasin.github.io/2017/03/05/angular-free-9-event-callback-queue/)查看。

### alertMsg.template.html
``` html
<aside ng-show="params" class="alert-module confirm-msg">
    <section on-focus-lost="close()">
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

这里，若我们不传入title参数，是不会显示头部的，这也是配置的一种。
而关于[on-focus-lost]指令，前面[《玩转Angular1(10)--使用Directive指令来添加事件监听》](https://godbasin.github.io/2017/03/10/angular-free-10-directive-to-add-event-listener/)也提到过，其实这里我们的EscKeyUp服务，也可以转成[on-esc]指令来实现的。

### 注册指令并使用
- 在`bootstrap.ts`启动文件中注册指令

``` javascript
...
import AlertDirective from './shared/components/alertMsg.directive';
[
    ...
    AlertDirective
].forEach((service) => service(ngModule));
```

- 在登录的时候使用

``` javascript
// login.controller.ts
SetAlertMsg({ text: '确认？' }).then(() => {
    // 登录
}, () =>{
    // 取消
});
```

- 在`index.html`中全局注入指令

``` html
<aside alert-msg></aside>
```

效果图：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1485230275%281%29.png)

## 结束语
---
这节主要简单介绍服务和组件配合着使用的过程，当然其实要实现这样的设计，还有一些其他的方法，小伙伴们也可以去想一下啦。还可以把弹窗模块进行拓展，加入可配置输入框、选择框等等去做呢。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular-free/13-service-work-with-directive)
[此处查看页面效果](http://angular-free.godbasin.com/angular-free-13-service-work-with-directive/index.html)
