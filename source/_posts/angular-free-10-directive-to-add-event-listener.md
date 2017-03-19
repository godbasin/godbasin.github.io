---
title: 玩转Angular1(10)--使用Directive指令来添加事件监听
date: 2017-03-10 23:00:40
categories: angular混搭
tags: 笔记
---
AngularJS(v1.5.8)已经成为项目们的基本框架，《玩转Angular1》系列用于记录项目中的一些好玩或者比较特别的思路。
本文简单介绍使用Directive指令来添加事件监听的过程。
<!--more-->
## 监听按键
-----
### 使用KeyUp服务
在项目中，我们经常会有这样的需求：
- 按下Enter键，进行表单提交
- 按下Esc键，将最外层弹窗关闭
- ...

上一节我们创建了KeyUp服务，用来在控制器中注册按键监听回调，具体参考[《玩转Angular1(9)--按键事件队列KeyUp服务》](https://godbasin.github.io/2017/03/05/angular-free-9-event-callback-queue/)。

而在模板中，我们也会经常有监听按键的需求，因此这里我们可以创建一个指令用于注册事件：

- `[on-esc]`指令

``` javascript
// app/shared/components/onEsc.directive.ts
// 监听Esc按键事件，触发callback回调
import { EscKeyUp } from '../../shared/services/KeyUp';

export default (ngModule) => {
    ngModule.directive('onEsc',  () => ({
        restrict: 'A',
        link(scope, ele, attrs) {
            EscKeyUp(scope, attrs['onEsc']);
        }
    }));
};
```

- `[on-enter]`指令

``` javascript
// app/shared/components/onEnter.directive.ts
// 监听Enter按键事件，触发callback回调
import { EnterKeyUp } from '../../shared/services/KeyUp';

export default (ngModule) => {
    ngModule.directive('onEnter',  () => ({
        restrict: 'A',
        link(scope, ele, attrs) {
            EscKeyUp(scope, attrs['onEnter']);
        }
    }));
};
```

使用方法会是：

``` html
<div on-enter="callback()"></div>
<div on-esc="callback()"></div>
```

### 同时触发多个事件
上面我们调用KeyUp服务，每次只会把队列最前的事件进行调用。

有时候我们需要所有捕获到的事件都进行触发，这时候我们可以不实用KeyUp服务，而是直接在指令中注册事件：

- `[on-esc]`指令

``` javascript
// app/shared/components/onEsc.directive.ts
export default (ngModule) => {
    ngModule.directive('onEsc',  () => ({
        restrict: 'A',
        link(scope, ele, attrs) {
            document.addEventListener('keyup', onEsc, true);
            ele.on('$destroy', () => document.removeEventListener('keyup', onEsc, true));

            function onEsc(ev) {
                if (ev.keyCode === 27) {
                    scope.$apply(attrs['onEsc']);
                }
            }
        }
    }));
};
```

- `[on-enter]`指令

``` javascript
// app/shared/components/onEnter.directive.ts
export default (ngModule) => {
    ngModule.directive('onEnter',  () => ({
        restrict: 'A',
        link(scope, ele, attrs) {
            document.addEventListener('keyup', onEnter, true);
            ele.on('$destroy', () => document.removeEventListener('keyup', onEnter, true));

            function onEnter(ev) {
                if (ev.keyCode === 13 || ev.key === 'Enter') {
                    scope.$apply(attrs['onEnter']);
                    // 若需要只触发一次，则添加下面代码
                    // document.removeEventListener('keyup', onEnter, true);
                }
            }
        }
    }));
};
```


## 失焦事件
---
### 基本思路
很多时候，我们会遇到一些这样的设计：
- 下拉菜单，当点击其他地方的时候自动关闭
- 弹窗，点击其他地方时自动取消
- ...

我们可以封装个指令，来注册这样的失焦监听事件。
至于失焦的判断，我们可以通过点击事件click的event.target来获取事件对象，然后进行判断。

这里需要注意的是，如果我们阻止了事件的冒泡，也即`event.stopPropagation()`，这时候可能会使得我们的事件失效。

### [on-focuse-lost]指令
我们在`app/shared/components`文件夹下创建`onFocusLost.directive.ts`文件：

``` javascript
// onFocusLost.directive.ts
export default (ngModule) => {
    ngModule.directive('onFocusLost',  () => ({
        restrict: 'A',
        link(scope, ele, attrs) {
            // 注册事件
            document.addEventListener('click', onClick, true);
            // 销毁组件时注销事件
            ele.on('$destroy', () => document.removeEventListener('click', onClick, true));

            function onClick(ev) {
                // 判断是否为元素内
                if (!ele[0].contains(ev.target)) {
                    scope.$apply(attrs['onFocusLost']);
                }
            }
        }
    }));
};
```


## 结束语
-----
这节主要简单介绍了使用Directive指令来添加事件监听的过程，当然这也只是指令的一种简单用法（组内的小朋友想到的），不过很多时候，的确方便很多呢。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular-free/10-directive-to-add-event-listener)
[此处查看页面效果](http://ok2o5vt7c.bkt.clouddn.com/angular-free-10-directive-to-add-event-listener/index.html)