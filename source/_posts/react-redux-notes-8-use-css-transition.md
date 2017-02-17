---
title: React-Redux使用笔记8--使用CSS过渡动画
date: 2017-01-26 23:10:55
categories: react沙拉
tags: 笔记
---
最近又重新拾起了React框架，并配合开源模板gentelella以及Redux建立了个简单的项目。《React-Redux使用笔记》系列用于记录过程中的一些使用和解决方法。
本文记录在SidebarList组件中使用CSS过渡动画的过程。
<!--more-->

## React动画
---
React为动画提供一个ReactTransitonGroup插件组件作为一个底层的API，一个ReactCSSTransitionGroup来简单地实现基本的CSS动画和过渡。

### ReactCSSTransitionGroup：高级API
ReactCSSTransitionGroup是基于ReactTransitionGroup的，在React组件进入或者离开DOM的时候，它是一种简单地执行CSS过渡和动画的方式。

ReactCSSTransitionGroup是ReactTransitions的接口。这是一个简单的元素，包含了所有你对其动画感兴趣的组件。

注意： 
- 你必须为ReactCSSTransitionGroup的所有子级提供键属性，即使只渲染一项。这就是React确定哪一个子级插入了，移除了，或者停留在那里
- 为了能够给它的子级应用过渡效果，ReactCSSTransitionGroup必须已经挂载到了DOM

可以给ReactCSSTransitionGroup添加`transitionEnter={false}`或者`transitionLeave={false}`props来禁用入场或者出场动画


### ReactTransitionGroup：底层API
ReactTransitionGroup是动画的基础。它可以通过React.addons.TransitionGroup得到。
当子级被添加或者从其中移除的时候，特殊的生命周期函数就会在它们上面被调用。

- componentWillEnter(callback)
  > 在组件被添加到已有的TransitionGroup中的时候，该函数和componentDidMount()被同时调用。
  > 这将会阻塞其它动画触发，直到callback被调用。
  > 该函数不会在TransitionGroup初始化渲染的时候调用。

- componentDidEnter()
  > 该函数在传给componentWillEnter的callback函数被调用之后调用。

- componentWillLeave(callback)
  > 该函数在子级从ReactTransitionGroup中移除的时候调用。
  > 虽然子级被移除了，ReactTransitionGroup将会使它继续在DOM中，直到callback被调用。

- componentDidLeave()
  > 该函数在willLeave callback被调用的时候调用（与componentWillUnmount是同一时间）。

虽然说底层的API我们较少会用到，但是其实从这些API就能了解到生命周期，以及相关的实现方式了呢。

## 给SidebarList添加动画
---
### 安装React动画插件
使用npm安装：
``` shell
npm install --save react-addons-transition-group react-addons-css-transition-group
```

### 添加CSS样式
我们在static/gentelella/build/css文件夹下，创建animation.css文件，并添加动画样式：
``` css
.slide-enter {
    max-height: 0;
    overflow: hidden;
}

.slide-enter.slide-enter-active {
    max-height: 100px;
    transition: all 300ms ease-in-out;
}

.slide-leave {
    max-height: 100px;
}

.slide-leave.slide-leave-active {
    max-height: 0;
    overflow: hidden;
    transition: all 300ms ease-in-out;
}
```
我们使用设置max-height的方式来实现slide的动画效果。


### 在SidebarList组件添加
在SidebarList.jsx添加动画的使用：
``` jsx
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import '../../../../static/gentelella/build/css/animation.css'

<ReactCSSTransitionGroup transitionName="slide" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
    ... // 子菜单内容
</ReactCSSTransitionGroup>
```

## 给HomeContainer组件添加路由过渡动画
---

### 添加CSS样式
我们在animation.css文件添加动画样式：
``` css
.fade-enter {
    opacity: 0.01;
    transition: opacity 100ms ease-in;
}

.fade-enter.fade-enter-active {
    opacity: 1;
}
```
因为react动画的淡入淡出使用的时候，会存在两个元素同时出现在页面中的情况，所以此处为了方便，本骚年就把离场动画关掉啦。


### 在HomeContainer组件添加
在HomeContainer.jsx添加动画的使用：
``` jsx
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import '../../../static/gentelella/build/css/animation.css'

<ReactCSSTransitionGroup transitionName="fade" transitionEnterTimeout={200} transitionLeave={false}>
    <div key={this.props.location.pathname}>{that.props.children}</div>
</ReactCSSTransitionGroup>
```

这里需要注意的是，为了使子路由过渡可用，我们需要给其添加一个独一无二的key，这里我们使用location.pathname来作为这个key。

## 结束语
-----
本节简单举例介绍了下React中CSS动画过渡效果，其实关于路由切换同时存在两个组件的问题，我们也可以调用底层API去处理，小伙伴们下去也可以自己研究一下呗。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/react-redux-notes/8-use-css-transition)
[此处查看页面效果](http://ohpt01s4n.bkt.clouddn.com/8-use-css-transition/index.html)