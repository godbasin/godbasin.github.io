---
title:  React使用笔记3--组件的State/Props与生命周期
date: 2016-08-13 02:30:45
categories: react沙拉
tags: 笔记
---
最近在学习使用React作为前端的框架，《React使用笔记》系列用于记录过程中的一些使用和解决方法。
本文记录组件的生命周期与状态State相关的学习笔记。
<!--more-->

## React State(状态)
-----
### React与State
- React把组件看成是一个状态机（State Machines）
- 通过与用户的交互，实现不同状态，然后渲染UI，让用户界面和数据保持一致
- React里，只需更新组件的state，然后根据新的state重新渲染用户界面（不要操作 DOM）

### State的方法和属性
- this.state属性可获取状态对象
- getInitialState方法用于定义初始状态，也就是一个对象，这个对象可以通过this.state属性读取
- this.setState方法就修改状态值，每次修改以后，自动调用this.render方法，再次渲染组件
- this.replaceState方法替换状态值，与setState相似，但删除之前所有已存在的state键，这些键都不在nextState中

### 使用State
- 使用state的组件
> 大部分组件的工作应该是从props里取数据并渲染出来。需要对用户输入、服务器请求或者时间变化等作出响应时，才需要使用state。
> 常用的模式是创建多个只负责渲染数据的无状态（stateless）组件，在它们的上层创建一个有状态（stateful）组件并把它的状态通过 props 传给子级。这个有状态的组件封装了所有用户的交互逻辑，而这些无状态组件则负责声明式地渲染数据。

- 作为State
> State应该包括那些可能被组件的事件处理器改变并触发用户界面更新的数据。
> 当创建一个状态化的组件时，想象一下表示它的状态最少需要哪些数据，并只把这些数据存入this.state。

- 不作为State
this.state 应该仅包括能表示用户界面状态所需的最少数据。不应该包括：
  - 计算所得数据
  - React组件
  - 基于props的重复数据

### 参考
[《富交互性的动态用户界面》](http://www.css88.com/react/docs/interactivity-and-dynamic-uis.html)
[《React State(状态)》](http://www.runoob.com/react/react-state.html)

## React Props(属性)
-----
### Props用法
this.props表示一旦定义，就不再改变的特性。
- 键值对（键： 值）
- 展开语法{...props}
  - React会自动把对象中的属性和值当做属性的赋值。

### Props方法和属性
- propTypes属性
  - 属性校验器，用来验证组件实例的属性是否符合要求。
- getDefaultProps方法
  - 可以用来设置组件属性的默认值。
- this.props.children属性
  - this.props.children表示组件的所有子节点，除此之外this.props对象的属性与组件的属性一一对应。
  - 如果当前组件没有子节点，数据类型是undefined
  - 如果有一个子节点，数据类型是object
  - 如果有多个子节点，数据类型是array
- React.Children方法
  - React提供一个工具方法React.Children来处理this.props.children，不用处理this.props.children的数据类型。
  - React.Children.map/forEach/count/only

### Props与State
state和props主要的区别在于props是不可变的，而state可以根据与用户交互来改变。
- 状态只与组件本身相关，由自己本身维护。与父组件与子组件无关
- 组件不能修改自己的属性，但可以从父组件获取属性，父组件也能修改其属性，组件也可以修改子组件的属性

### 参考
[《React.js学习笔记之组件属性与状态》](https://segmentfault.com/a/1190000004490882)

## React生命周期
-----
React组件就是一个状态机，它接受两个输入参数: this.props和this.state，返回一个虚拟DOM。
React组件的生命周期分几个阶段，每个阶段会有若干个回调函数可以响应不同的时刻。
组件的生命周期包含三个主要部分：
- 挂载： 组件被插入到DOM中。
- 更新： 组件被重新渲染，查明DOM是否应该刷新。
- 移除： 组件从DOM中移除。

### 创建类
- getDefaultProps
  - 在组件类创建的时候调用一次，然后返回值被缓存下来。
  - 该方法在任何实例创建之前调用，因此不能依赖于 this.props。
  - 返回的任何复杂对象将会在实例间共享，而不是每个实例拥有一份拷贝。

### 首次实例化/挂载
类创建完成之后，就可以进行实例化。
- getInitialState
  - 在组件挂载之前调用一次。返回值将会作为this.state的初始值。
- componentWillMount: 
  - 在初始化渲染执行render之前立刻调用。
  - 如果在这个方法内调用setState，render()将会感知到更新后的state，将会执行仅一次，尽管state改变了。
  - render就是一个模板的作用，他只处理和展示相关的逻辑，如果有业务逻辑，应放在componentWillMount中执行。
- render: 渲染并返回一个虚拟DOM
- componentDidMount
  - 在初始化渲染render后，react会使用render返回的虚拟DOM来创建真实DOM，之后立刻调用此方法一次。
  - 在生命周期中的这个时间点，组件拥有一个DOM展现，可以通过this.getDOMNode()来获取相应DOM节点。
  - 如果想和其它JavaScript框架集成，使用setTimeout或者setInterval来设置定时器，或者发送AJAX请求，可以在该方法中执行这些操作。

### 更新
当组件实例化完成，就进入了存在期，这时候一般会响应用户操作和父组件的更新来更新视图。
- componentWillRecieveProps
  - 在组件接收到新的props的时候调用。在初始化渲染的时候，该方法不会调用。
  - 用此函数可以作为react在prop传入之后， render()渲染之前更新state的机会。
- shouldComponentUpdate
  - 在接收到新的props或者state，将要渲染之前调用。
  - 如果确定新的props和state不会导致组件更新，则此处应该 返回 false。
- componentWillUpdate
  - 在接收到新的props或者state之前立刻调用。在初始化渲染的时候该方法不会被调用。
  - 使用该方法做一些更新render之前的准备工作。
- render: 更新并返回一个虚拟DOM
- componentDidUpdate
  - 在组件的更新已经同步到DOM中之后立刻被调用。该方法不会在初始化渲染的时候调用。
  - 使用该方法可以在组件更新之后操作DOM元素。

### 移除
- componentWillUnmount
  - 在组件从 DOM 中移除的时候立刻被调用。
  - 在该方法中执行任何必要的清理，比如无效的定时器，或者清除在componentDidMount中创建的DOM元素。

### 参考
[《组件的详细说明和生命周期》](http://reactjs.cn/react/docs/component-specs.html)
[《ReactJS读书笔记二：组件生命周期》](http://blog.csdn.net/lihongxun945/article/details/46334379)

## 结束语
-----
该节主要记录本骚年在使用过程中遇到的一些不理解的地方，其实大都是借鉴，而且也是不是很深入的呢。
下节我们就使用这些东西来建个头部的组件吧。