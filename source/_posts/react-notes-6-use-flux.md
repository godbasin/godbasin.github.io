---
title: React使用笔记6--使用flux"单向流动"你的应用
date: 2016-08-21 02:19:51
categories: react沙拉
tags: 笔记
---
最近在学习使用React作为前端的框架，《React使用笔记》系列用于记录过程中的一些使用和解决方法。
本文简单介绍React Flux架构，以及记录使用flux改造当前应用的过程。
<!--more-->
## React Flux架构简介
-----
### 什么是Flux
Flux是Facebook用来构建客户端Web应用的应用架构。它利用单向数据流的方式来组合React中的视图组件。
Flux是一种架构思想，专门解决软件的结构问题。它跟MVC架构是同一类东西，更像一个模式而不是一个正式的框架。

### Flux基本概念
- Views： 视图层
  - controller-view
    - 可以理解成MVC模型中的controller，它一般由应用的顶层容器充当，负责从store中获取数据并将数据传递到子组件中。
    - 简单的应用一般只有一个controller-view，复杂应用中也可以有多个。
    - controller-view是应用中唯一可以操作state的地方(setState())
  - view(UI组件)
    - ui-component职责单一只允许调用action触发事件，数据从由上层容器通过属性传递过来。

- Action（动作）：视图层发出的消息，可通过调用它来响应用户交互
  - 是dispatcher提供了一个可以允许我们向store中触发分发的方法
  - 包含了一个数据的payload。action生成被包含进一个语义化的辅助方法中，来发送action到dispatcher

- Dispatcher（派发器）：用来接收Actions、执行回调函数
  - dispatcher就像是一个中央的集线器，管理着所有的数据流
  - 本质上是store callback的注册表，本身并没有实际的高度功能
  - 每个Store注册它自己并提供一个回调函数

- Store（数据层）：负责封装应用的业务逻辑跟数据的交互
  - 用来存放应用的状态，一旦发生变动，就提醒Views要更新页面
  - Store中包含应用所有的数据，是应用中唯一的数据发生变更的地方
  - Store中没有赋值接口---所有数据变更都是由dispatcher发送到store，新的数据随着Store触发的change事件传回view

### Flux数据流
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/bg2016011503.png)
- store在dispatcher中注册，并提供相应的回调。回调会接收action并把它当成自己的一个参数。
- 通过调用action来响应用户交互。
- 当action被触发，回调函数会使用switch语句来解析action中的type参数，并在合适的type下提供钩子来执行内部方法。
- action通过dispatcher来响应store中的state更新。
- store更新完成之后，会向应用中广播一个change事件，views可以选择响应事件来重新获取新的数据并更新。

### 参考
[《Flux 架构入门教程》](http://www.ruanyifeng.com/blog/2016/01/flux.html)
[《谈一谈我对 React Flux 架构的理解》](http://www.cocoachina.com/webapp/20150928/13600.html)

## 使用Flux
-----
这里使用改造头部组件作为例子，简述使用flux过程。

### 目录组织
使用flux之后，目录组织如下：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/FCB5.tmp.png)
这里再简单描述一下新增和改变的文件：
- actions: 存放Flux的Action文件
- components: 存放Flux的Views文件（包括Controller-Views）
- dispatcher: 存放Flux的Dispatcher文件
- stores: 存放Flux的Store文件

### 添加HeaderStore
在stores文件夹添加HeaderStore.js文件，封装头部相关的业务逻辑和数据交互。
``` javascript
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
//封装头部相关的业务逻辑和数据交互
var HeaderStore = assign({}, EventEmitter.prototype, {
	menus: [{
		title: 'index', //title用于储存路由对应的路径
		href: '?#/index', //href用于设定该菜单跳转路由
		text: '首页', //text用于储存该菜单显示名称
	}, {
		title: 'others',
		href: '?#/other',
		text: '其他',
	}],
	usermenus: [{
		click: function() {}, //click用于设置该菜单点击事件
		text: '退出', //text用于储存该菜单显示名称
	}],
	clock: '', //clock用于保存时钟
	getMenus: function() {return this.menus;}, //获取menus
	getUsermenus: function() {return this.usermenus;}, //获取usermenus
	getClock: function() {return this.clock;}, //获取clock
	clockRender: function(callback) { //刷新时钟
		let numberStandard = function(num) {
				let _val = Number(num),
					_num;
				_num = (_val < 10) ? ('0' + _val) : ('' + _val);
				return _num;
			},
			_date = new Date();
		this.clock = _date.getFullYear() + '年' + (_date.getMonth() + 1) + '月' +
			_date.getDate() + '日' + ' ' + numberStandard(_date.getHours()) + ':' + numberStandard(_date.getMinutes()) +
			':' + numberStandard(_date.getSeconds());
		callback(); //可使用回调触发刷新
	},
});
module.exports = HeaderStore;
```

### 通过Controller-View传递数据
在components文件夹添加HeaderController.jsx和Header.jsx文件。
- HeaderController.jsx
HeaderController负责从Headerstore中获取数据并将数据传递到Header中，以及定义相关交互逻辑。

``` javascript
import React from 'react'; //导入react组件
import HeaderStore from '../stores/HeaderStore.js';  //获取HeaderStore
import HeaderActions from '../actions/HeaderActions.js'; //获取HeaderActions
import Header from './Header.jsx'; //获取子组件Header

const HeaderController = React.createClass({
	getDefaultProps : function () { //设置props数据
	  return {
			menus: HeaderStore.getMenus(), //从HeaderStore获取menus数据
			usermenus:  HeaderStore.getUsermenus(), //从HeaderStore获取usermenus数据
		};
	},
	getInitialState: function() { //设置state数据
		return {clock: HeaderStore.getClock()}; //从HeaderStore获取clock数据
	},
	setClock: function(time) { //从HeaderStore获取clock并更新状态
		this.setState({clock: HeaderStore.getClock()});
	},
	componentDidMount: function(){
		var that = this;
		this.interval = setInterval(function() { //设置定时器500ms刷新一次clock
			HeaderActions.clockRender(that.setClock); //传入回调触发刷新
		}, 500);
	},
	componentWillUnmount: function(){
		clearInterval(this.interval); //移除定时器
	},
	render() {
		//将数据以props传入子组件
		return <Header clock={this.state.clock} menus={this.props.menus} usermenus={this.props.usermenus} active={this.props.active}  />;
	}
});

module.exports = HeaderController;
```
当然，如果需要更新页面的事件变多了，也可以使用event事件来进行广播哦。
- Header.jsx
Header只负责简单的页面显示即可。

``` javascript
import React from 'react'; //导入react组件
import { NavDropdown, MenuItem, Navbar, Nav } from 'react-bootstrap';

const Header = React.createClass({
	render() {
		let active = this.props.active;
		return (
			<Navbar className="header" fluid>
				<Navbar.Header className="navbar-header">
					<Navbar.Brand>Godbasin</Navbar.Brand>
				</Navbar.Header>
				<Navbar.Collapse id="bs-example-navbar-collapse-1">
					<Nav navbar>     	
					{							
						this.props.menus.map(function(menu, i) {
							return (<li key={i} className={ menu.title == active ? "active" : ""}><a href={menu.href}>{ menu.text }<span className="sr-only">(current)</span></a></li>);
						})
					}
					</Nav>
					<Nav navbar pullRight>
						<li><a>{ this.props.clock }</a></li>
						<NavDropdown title="菜单" id="top-aside-menu">
							{
								this.props.usermenus.map(function(usermenu,i) {
									return (<MenuItem key={i}>{ usermenu.text }</MenuItem>);
								})
							}
						</NavDropdown>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		)
	}
});

module.exports = Header;
```

### 添加Actions
在actions文件夹添加HeaderActions.js文件，负责发送Action到Dispatcher。
``` javascript
import AppDispatcher from '../dispatcher/AppDispatcher.js';

var HeaderActions = {
  clockRender: function (callback) { //定义clockRender事件
    AppDispatcher.dispatch({
      actionType: 'CLOCK_RENDER', //发送Action的类型
      callback: callback //携带回调事件参数
    });
  },
};

module.exports = HeaderActions;
```

### 注册Store到Dispatcher
在dispacther文件夹添加AppDispatcher.js文件，用来注册所有的Store。
``` javascript
import { Dispatcher } from 'flux'; //导入react组件
import HeaderStore from '../stores/HeaderStore.js'; //导入HeaderStore

var AppDispatcher = new Dispatcher();
AppDispatcher.register(function(action) {
	switch (action.actionType) {
		case 'CLOCK_RENDER':
			HeaderStore.clockRender(action.callback); //执行clockRender事件
			break;
		default:
	}
});

module.exports = AppDispatcher;
```

## 结束语
-----
虽然说使用Flux会使得代码量增加了不少，但这样的架构模式也不失为一种管理应用逻辑的方法呢，使用之后应用结构也清晰很多了。
[此处查看项目代码（仅包含app部分）](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/react-notes/6-use-flux)
[此处查看页面效果](http://react-notes.godbasin.com/6-use-flux/index.html)