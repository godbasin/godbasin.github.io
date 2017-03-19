---
title: 玩转Angular1(9)--按键事件队列KeyUp服务
date: 2017-03-05 11:42:32
categories: angular混搭
tags: 笔记
---
AngularJS(v1.5.8)已经成为项目们的基本框架，《玩转Angular1》系列用于记录项目中的一些好玩或者比较特别的思路。
本文简单介绍创建一个事件队列，来监听按键，并进行回调处理的过程。
<!--more-->
## 基本思路
-----
### 提供队列注册事件
通常，我们会需要在控制器中直接添加这样的按键监听事件，故这里我们通过服务的方式进行。

我们需要提供一个注册函数，来给控制器调用，需要传入：
- scope：作用域，用于提供执行环境
- callback：回调函数

因此，我们的注册服务的使用应该是这样的：

``` javascript
// 添加Esc按键事件
EscKeyUp($scope, () => { callback(); });
```

我们可以提供一个缓存对象，里面通过随机产生的uuid来绑定`{scope, callback}`数据。

``` javascript
// 添加按键事件队列
addCallback(callbacks, scope, callback) {
    // 产生随机数
    const uuid = Math.random().toString(36).substr(2);
    // 需有回调函数
    if (typeof callback !== 'function') {
        console.log('callback is not a function.');
        return;
    }
    // 关联uuid的作用域和回调
    this.CallbackObjscts[uuid] = { scope, callback };
    // 添加到队列的头部
    callbacks.unshift(uuid);
    // 初始化监听事件
    if (!this.isEventInit) {
        this.initEvent();
        this.isEventInit = true;
    }
}
```

可以看到，除了scope和callback，还需传入队列数组，该队列我们针对按键来分：

``` javascript
// Esc按键队列
EscCallbacks = [];
// Space按键队列
SpaceCallbacks = [];
```

### 注册监听事件
我们需要在文档添加事件监听：

``` javascript
// 监听按键事件
initEvent() {
    const that = this;
    // 添加按键事件监听
    document.addEventListener('keyup', ((e = (window as MyWindow).event as any) => {
        if (e && e.keyCode) {
            switch (e.keyCode) {
                case 27:
                    // Esc按键事件
                    that.executeCallback(that.EscCallbacks);
                    break;
                case 32:
                    // Space按键事件
                    that.executeCallback(that.SpaceCallbacks);
                    break;
            }
        }
    }).bind(this), true);
}
```

### 执行回调，并销毁注册
当按键事件触发时，我们需要：
- 取出队列头部回调，并执行
- 注销缓存对象及其引用

``` javascript
// 执行回调队列
executeCallback(callbacks) {
    if (!callbacks.length) { return; }
    // 获取队列头部uuid
    const uuid = callbacks.shift();
    // 取出uuid关联的对象缓存
    const {scope, callback} = this.CallbackObjscts[uuid] as any;
    // 执行回调
    scope.$apply(callback());
    // 移除和注销
    this.CallbackObjscts.splice(this.CallbackObjscts.findIndex(item => item === this.CallbackObjscts[uuid]), 1);
}
```

## KeyUp服务代码
---
### KeyUp.ts
这里需要注意的是，方法中的this，默认指向KeyUp类的实例。但是，如果将这个方法提取出来单独使用，this会指向该方法运行时所在的环境，因为找不到内部的方法而导致报错。
一个比较简单的解决方法是，在构造方法中绑定this。

我们在`app/shared/services`文件夹下添加`KeyUp.ts`文件：

``` javascript
class KeyUpService {
    private CallbackObjscts: Object[] = [];
    private EscCallbacks: string[] = [];
    private SpaceCallbacks: string[] = [];
    private isEventInit: boolean = false;

    constructor() {
        // 绑定this
        this.addEscCallback = this.addEscCallback.bind(this);
        this.addSpaceCallback = this.addSpaceCallback.bind(this);
    }

    // 添加Esc按键队列
    addEscCallback(scope, callback) {
        this.addCallback(this.EscCallbacks, scope, callback);
    }

    // 添加Space按键队列
    addSpaceCallback(scope, callback) {
        this.addCallback(this.SpaceCallbacks, scope, callback);
    }

    // 添加按键事件队列
    private addCallback(callbacks, scope, callback) {
        // 产生随机数
        const uuid = Math.random().toString(36).substr(2);
        // 需有回调函数
        if (typeof callback !== 'function') {
            console.log('callback is not a function.');
            return;
        }
        // 关联uuid的作用域和回调
        this.CallbackObjscts[uuid] = { scope, callback };
        // 添加到队列的头部
        callbacks.unshift(uuid);
        // 初始化监听事件
        if (!this.isEventInit) {
            this.initEvent();
            this.isEventInit = true;
        }
    }

    // 执行回调队列
    private executeCallback(callbacks) {
        if (!callbacks.length) { return; }
        // 获取队列头部uuid
        const uuid = callbacks.shift();
        // 取出uuid关联的作用域和回调
        const {scope, callback} = this.CallbackObjscts[uuid] as any;
        // 执行回调
        scope.$apply(callback());
        // 移除
        this.CallbackObjscts.splice(this.CallbackObjscts.findIndex(item => item === this.CallbackObjscts[uuid]), 1);
    }

    // 监听按键事件
    private initEvent() {
        const that = this;
        // 添加按键事件监听
        document.addEventListener('keyup', ((e = (window as MyWindow).event as any) => {
            if (e && e.keyCode) {
                switch (e.keyCode) {
                    case 27:
                        // Esc按键事件
                        that.executeCallback(that.EscCallbacks);
                        break;
                    case 32:
                        // Space按键事件
                        that.executeCallback(that.SpaceCallbacks);
                        break;
                }
            }
        }).bind(this), true);
    }
}

// 新建按键服务
const KeyUp = new KeyUpService();
// 取出Esc按键添加和Space按键添加
const {addEscCallback, addSpaceCallback} = KeyUp;

export {
    addEscCallback as EscKeyUp,
    addSpaceCallback as SpaceKeyUp
};

export default KeyUp;
```

### 在控制器中使用
这里，我们为了方便，直接在登录页面进行监听：

``` javascript
import { EscKeyUp, SpaceKeyUp } from '../../shared/services/KeyUp';
class KeyUp{
    constructor(...){
        ...
        for (let i = 1; i <= 3; i++) {
            EscKeyUp($scope, () => { Notify({ title: `Esc按下第${i}次注册` }) });
            SpaceKeyUp($scope, () => { Notify({ title: `Space按下第${i}次注册` }) });
        }
    }
    ...
}
```

效果图：
![image](http://o905ne85q.bkt.clouddn.com/1485143276%281%29.png)

可见，我们后注册的事件，会先执行。

## 结束语
-----
这节主要简单介绍创建一个事件队列，来监听按键，并进行回调处理的KeyUp服务，并对外提供`EscKeyUp()`和`SpaceKeyUp()`方法。当然小伙伴们也可以拓展这些按键，又或者当队列为空的时候取消事件的监听等等。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular-free/9-event-callback-queue)
[此处查看页面效果](http://ok2o5vt7c.bkt.clouddn.com/angular-free-9-event-callback-queue/index.html)