---
title: React使用笔记8--组件间的通信
date: 2016-08-28 10:15:16
categories: react沙拉
tags: 笔记
---
最近在学习使用React作为前端的框架，《React使用笔记》系列用于记录过程中的一些使用和解决方法。
本文结合前面出现过的一些方法，简单介绍组件间的通信。
<!--more-->
## 父组件与子组件
-----
### 父-子 通信
- 利用props属性
父组件利用props向子组件传值，在使用React开发的过程中经常会使用到。

``` jsx
//父组件
var Parent = React.createClass({
	getInitialState: function () {
		return {
			parent: 'from parent'
		};
	},  
	render: function() {
		return (
			<Child parent={this.state.parent} />
		);
	}
});

// 子组件
var Child = React.createClass({
	render: function () {
		// 从父组件获取的值
		var parent = this.props.parent;
		return (
			<p>{parent}</p>
		);
	}
});
```

如果组件嵌套层次太深，那么从外到内组件的交流成本就变得很高，通过props传递值的优势就不那么明显了。
- 利用refs属性
refs属性可获取子组件，当然父组件可以通过调用子组件的方法来给子组件传值。

``` jsx
//父组件
var Parent = React.createClass({
	changeChild: function(){
		// 通过refs属性调用子组件方法改变子组件的值
		this.refs.child.setState({child: 'now from parent'});
	},
	render: function() {
		return (
			<div>
				//子组件绑定ref属性
				<Child ref="child" />
				<button onClick={this.changeChild} />
			</div>
		);
	}
});

// 子组件
var Child = React.createClass({
	getInitialState: function () {
		return {
			child: 'from child',
		};
	},  
	render: function () {
		return (
			<p>{this.state.child}</p>		
		);
	}
});
```

### 子-父 通信
- 利用props属性
既然父组件可以通过props属性向子组件传值，子组件可用父组件的方法反向给父组件传值。

``` jsx
//父组件
var Parent = React.createClass({
	getInitialState: function () {
		return {
			parent: 'from parent',
			child: '',
		};
	},  
	getFromChild: function(value){
		//子组件调用该方法返回值
		this.setState({child: value});
	},
	render: function() {
		return (
			<div>
				<p>child: {this.state.child}</p>
				<Child parent={this.state.parent} getFromChild={this.getFromChild} />
			</div>
		);
	}
});

// 子组件
var Child = React.createClass({
	render: function () {
		// 从父组件获取的值
		var parent = this.props.parent;
		return (
			<p>{parent}</p>
			// 从父组件获取的方法返回值
			<button onClick={this.props.getFromChild.bind(null,'form child')} />
		);
	}
});
```

- 利用refs属性
refs属性允许你引用render()返回的相应的支撑实例。该属性多用于获取子组件的真实DOM元素。

``` jsx
//父组件
var Parent = React.createClass({
	getInitialState: function () {
		return {
			parent: 'from parent',
			child: '',
		};
	},  
	getFromChild: function(){
		// 通过refs属性从子组件获取state状态
		this.setState({child: this.refs.child.state.child});
	},
	render: function() {
		return (
			<div>
				<p>child: {this.state.child}</p>
				//子组件绑定ref属性
				<Child ref="child" parent={this.state.parent} getFromChild={this.getFromChild} />
			</div>
		);
	}
});

// 子组件
var Child = React.createClass({
	getInitialState: function () {
		return {
			child: 'from child',
		};
	},  
	render: function () {
		// 从父组件获取的值
		var parent = this.props.parent;
		return (
			<p>{parent}</p>
			<button onClick={this.props.getFromChild} />
		);
	}
});
```

## 通用组件之间传值
-----
如果组件之间没有任何关系，组件嵌套层次比较深，或者你为了一些组件能够订阅、写入一些信号，不想让组件之间插入一个组件，让两个组件处于独立的关系时，我们可以使用下面的方法。

### Event
``` jsx
//使用EventEmitter
import {EventEmitter} from 'events';
EventEmitter.prototype.emit() //发送事件
EventEmitter.prototype.on() //捕获事件
//使用EventListener
addEventListener() //捕获change事件
var event =  Document.createEvent(); //创建事件
dispatchEvent(event) //发送事件
```

### Pub/Sub
全局广播的方式来处理事件，可参考Redux。

### 单向数据流
可以创建单向数据流，使用一个数据中心管理，可参考Flux。

### Events in React
使用 React 事件的时候，必须关注下面两个方法：
``` jsx
componentDidMount
componentWillUnmount
```
在componentDidMount事件中，如果组件挂载（mounted）完成，再订阅事件。
当组件卸载（unmounted）的时候，在componentWillUnmount事件中取消事件的订阅。

### 参考
[《React 组件之间如何交流》](http://www.tuicool.com/articles/AzQzEbq)

## 结束语
-----
React中没有像Angular中服务的概念，这也是因为React只是View层的原因吧。数据的流动和共享方面我们需要自己想办法，又或者是借助Flux、Redux等的模式来管理数据。