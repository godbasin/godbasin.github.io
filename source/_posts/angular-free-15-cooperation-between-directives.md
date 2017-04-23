---
title: 玩转Angular1(15)--指令们的相互协作
date: 2017-03-24 22:01:04
categories: angular混搭
tags: 笔记
---
AngularJS(v1.5.8)已经成为项目们的基本框架，《玩转Angular1》系列用于记录项目中的一些好玩或者比较特别的思路。
本文简单介绍指令的相互协作，也即多个简单指令的配合使用来获取想要的结果。下面我们介绍的东西，大部分来自于组内的小朋友的设计。
<!--more-->
## 按钮的有效点击
-----
### 基本思路
很多时候，我们会遇到这样的按钮设计需求：
- 当满足一些条件时，该按钮激活，可点击触发事件
- 当不满足时，该按钮为不可用状态，不可点击

通常来说，我们会在点击的时候判断，是否触发回调。这样会有以下问题：
- 判断条件和点击事件耦合在一起
- 判断条件还需要通过ng-class更改按钮状态

所以我们可以设计这样的两个指令：
- [beDisableIf]指令，通过传入boolen值，控制按钮的样式(active/disable)
- [safeClick]指令，通过判断按钮是否有激活或失活的样式，判断能否执行

### [beDisableIf]指令
``` javascript
// 
export default (ngModule) => {
    ngModule.directive('beDisableIf',  () => ({
        restrict: 'A',
        link(scope, ele, attrs) {
            // watch属性[be-disable-if]，触发更新
            scope.$watch(attrs['beDisableIf'], changeListener);
            changeListener(scope.$eval(attrs['beDisableIf']));

            // 若有效，则添加disable的class，若没有则移除
            function changeListener(shouldBeDisable) {
                if (shouldBeDisable) {
                    if (!ele.hasClass('disable')) {
                        ele.addClass('disable');
                    }
                } else {
                    if (ele.hasClass('disable')) {
                        ele.removeClass('disable');
                    }
                }
            }
        }
    }));
};
```

### [safeClick]指令
``` javascript
export default (ngModule) => {
    ngModule.directive('safeClick',  () => {
        return (scope, element, attrs) => {
            // 添加click事件监听，在有效时触发回调
            element.on('click', ev => {
                ev.stopPropagation();
                // 通过是否有disable这个class来判断是否有效
                if (!element.hasClass('disable')) {
                    scope.$apply(attrs['safeClick']);
                }
            });
        };
    });
};
```

### 简单使用
- 在`bootstrap.ts`中注册指令
- 添加按钮样式
- 在页面中使用

``` html
<!--login.template.html-->
<p><input type="checkbox" ng-model="check" />勾选后可点击下面按钮触发消息</p>
<p><span class="button-2" be-disable-if="!check" safe-click="VM.Notify({title: '恭喜你点击成功'})">点击按钮发送消息</span></p>
```

效果图：
![image](http://o905ne85q.bkt.clouddn.com/1485252152%281%29.png)
![image](http://o905ne85q.bkt.clouddn.com/1485252279%281%29.png)

## 结束语
---
这节主要简单介绍在angular中使用多个指令配合工作，同时把组内小朋友的设计拿出来讲解。果然现在都是年轻人的世界呀，大家的想法都很有意思，看代码变成了工作中很有意思的一件事。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular-free/15-cooperation-between-directives)
[此处查看页面效果](http://ok2o5vt7c.bkt.clouddn.com/angular-free-15-cooperation-between-directives/index.html)
