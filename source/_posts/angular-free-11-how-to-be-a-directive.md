---
title: 玩转Angular1(11)--组件的自我修养
date: 2017-03-11 17:29:32
categories: angular混搭
tags: 笔记
---
AngularJS(v1.5.8)已经成为项目们的基本框架，《玩转Angular1》系列用于记录项目中的一些好玩或者比较特别的思路。
本文简单说明一下，目前来说，个人认为的较好的组件的设计思想。
<!--more-->
## 组件的划分和封装
-----
### 组件的划分
通常来说，组件的划分，与视觉、交互等密切相关，我们可通过功能、独立性来判断是否适合作为一个组件。

小组里面有个小朋友提出，所有的东西都可以当作一个组件，一个卡片可以是个组件，一个卡片+标题也可以作为一个组件。
不得不说，这种的想法也是挺有意思的，所以我们的可以根据两种情况进行组件的划分：
1. 视觉和交互上是一个完整的组件。
2. 写代码的时候，可重复的内容即可视为一个组件。

当然，在一个项目中，我们最好是使用其中一个规范，因为对于成员的相互配合和项目的维护来说，统一的规范是比较重要的。

这里可能需要简单说明一下两种思路的区别：
例如我们的界面中，有以下的设计场景：
- 单张卡片的展示
- 多张卡片的展示
- 标题+若干卡片的展示

若是按照1划分：
- 卡片是一个组件
- 多张卡片时，通过ng-repeat实现
- 标题+若干卡片时，通过header+ng-repeat实现

若是按照2划分：
- 标题+若干卡片是一个组件
- 多张卡片时，通过配置`is-title-shown="false"`，不显示title，并通过传入data[]，设置多张卡片形式
- 单张卡片时，通过配置`is-title-shown="false"`，不显示title，并通过传入item，设置单张卡片形式
- 卡片内根据传入的数据进行相应的初始化处理

对于第二种方式的实现，很有意思，但是这样的界限比较难划清，同时在设计上需要花费的精力和时间都相对较多，所以目前我们使用的多是第一种组件规范。


### 组件的封装
对于组件的封装，参考了小组成员的意见后，个人认为可以有以下的一些良好设计方式：
- 组件内维护自身的数据和状态
- 组件内维护自身的事件
- 通过初始化事件（event、绑定的scope事件，传入数据），来初始化组件状态，激活组件
- 通过更改某个配置，来控制展示
- 通过对外提供接口，可查询组件状态

现在，我们有一个筛选的模块，里面有多个单选、多选、填写内容等数据：
- 可点击查询，发送数据至后台接口
- 可点击重置，将所有选中数据恢复为初始状态
- 其中，选择第一个单选的时候，后面的所有数据都会根据该选项进行切换
- 第一个单选里，数组的数据通过固定的接口获取

这时候，我们可以这样来设计我们的组件：

``` javascript
export default (ngModule) => {
    /*
    * @ 筛选组件
    * @param: {
    *     getStates() 返回组件状态（所有选中）
    *     VM:{} 用于绑定视图相关对象
    * }
    * @event: {
    *     on: 'selectable:init'触发初始化事件
    *     emit: 'selectable:render'发送render事件
    * }
    * @attribute:{
    *     ui-config: 传入字符串，用于定制化组件显示，TaskName/DataSetting/DepolyFilte/TargetFilter/PropertyFilter
    * }
    *
    */
    ngModule
        .directive('selectable', () => {
            return {
                templateUrl: './shared/components/selectableSelection.template.html',
                restrict: 'AE',
                scope: {
                    getStates: '<',
                    uiConfig: '<',
                },
                link(scope, ele, attrs) {
                    const VM = {} as TODO; // 视图模板中将要绑定的数据
                    scope.VM = VM;
                    VM.states = {} as TODO; // 选中状态对象
                    scope.handleService = handleService; // 处理服务
                    scope.init = init; // 初始化与重置
                    scope.render = render; // 查询事件

                    // 监听'selectable:init'事件并进行初始化
                    scope.$on('selectable:init', (e, data) => {
                        // 获取服务数据
                        getServices();
                    });

                    // 处理服务
                    function handleService(service?) {
                        // 选中服务
                        VM.serviceSelected = service || VM.services[0];
                        // 其他选项数据更新
                    }

                    // 获取服务数据
                    function getServices() {
                        getService().then(res => {
                            // 获取服务数据，并进行初始化
                            VM.services = res;
                            init();
                        });
                    }

                    // 初始化&&重置事件
                    function init() {
                        // 初始化数据
                        angular.merge(VM, {...});
                        // 初始化状态
                        angular.extend(VM.states, {someSelected: value});
                        // 给states对象赋值get方法用于查询，查询的数据不可更改影响组件状态
                        if (scope.states) {
                            scope.getStates = () => angular.merge({}, VM.states);
                        }
                        handleService();
                        render();
                    }

                    // 查询事件
                    function render() {
                        scope.$emit('selectable:render');
                    }
                }
            };
      }]);
};
```

## 可配置的组件
---
### 通过配置控制组件的展示
上面我们也提到过，我们在开发产品的时候，未免会遇到这样的需求：
- 卡片A与卡片B、卡片C结构基本相似
- 卡片B没有头部
- 卡片C没有底部

这时候，我们可以设计一个组件，并提供视图配置，来适应不同场景的使用，我们可以有以下方法：
- 通过某个属性配置某个部分是否显示
- 通过一个属性配置需要显示的所有部分
- 通过传入初始值进行相关显示控制
- ...

### 通过某个属性配置某个部分是否显示
- 指令模板

``` html
<div>
    <header ng-show="hasHeader"></headesr>
    <body></body>
    <footer ng-show="hasFooter"></footer>
</div>
```

- 指令逻辑

``` javascript
...
scope: {
    hasFooter: '@?',
    hasHeader: '@?'
},
...
```

- 使用

``` html
<card has-header="yes" has-footer="yes">A</card>
<card has-footer="yes">B</card>
<card has-header="yes">C</card>
```

### 通过一个属性配置需要显示的所有部分
- 指令模板

``` html
<div>
    <header ng-show="uiConfig.indexOf('header') > -1"></headesr>
    <body></body>
    <footer ng-show="uiConfig.indexOf('footer') > -1"></footer>
</div>
```

- 指令逻辑

``` javascript
...
scope: {
    uiConfig: '@?'
},
...
```

- 使用

``` html
<card ui-config="header footer">A</card>
<card ui-config="footer">B</card>
<card ui-config="header">C</card>
```

## 结束语
-----
这节主要简单介绍了一些经过团队思想碰撞后，个人总结的一些组件的设计思想，有很多已经在项目中使用了。
所以其实，很多时候争论也是需要的，这是多人协作最有意思的地方，我们能在这样的过程中，扩大我们的视野，同时能学习到不同的思路和想法。