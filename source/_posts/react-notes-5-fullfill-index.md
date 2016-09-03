---
title: React使用笔记5--理解jsx以及制作index页面
date: 2016-08-20 18:49:32
categories: react沙拉
tags: 笔记
---
最近在学习使用React作为前端的框架，《React使用笔记》系列用于记录过程中的一些使用和解决方法。
本文简单介绍jsx，以及记录制作首页的过程。
<!--more-->
## 理解jsx
-----
### 什么是JSX
JSX即JavaScript XML，是一个看起来很像XML的JavaScript语法扩展。
JSX能定义简洁且我们熟知的包含属性的树状结构语法。

### 使用JSX
JSX把类XML的语法转成纯粹JavaScript，XML元素、属性和子节点被转换成React.createElement的参数。
- JSX标签
React的JSX里约定分别使用首字母大、小写来区分本地组件的类和HTML标签。
- JavaScript表达式
  - 表达式用{}包起来，不要加引号，加引号就会被当成字符串。
  - JSX是HTML和JavaScript混写的语法，当遇到<，JSX就当HTML解析，遇到{就当JavaScript解析。
  - 同样地，JavaScript表达式可用于描述子结点。

### JSX与HTML区别
- HTML实体
如果想在JSX表达式中显示HTML实体，可以会遇到二次转义的问题，因为React默认会转义所有字符串，为了防止各种XSS攻击。
  - 1.安全的做法是先找到实体的Unicode编号 ，然后在JavaScript字符串里使用。
  - 2.可以在数组里混合使用字符串和JSX元素。
  - 3.万不得已，可以直接使用原始HTML。
- HTML属性
一些标识符像class和for不建议作为XML属性名。作为替代，React DOM使用className和htmlFor来做对应的属性。
- 内联样式
在React中写行内样式时，要使用双大括号，不能采用引号的书写方式
- 自定义HTML属性
如果往原生HTML元素里传入HTML规范里不存在的属性，React不会显示它们。如果需要使用自定义属性，要加data-前缀。
- 注释
JSX里添加注释很容易，它们只是JS表达式而已。你只需要在一个标签的子节点内(非最外层)小心地用单大括号包围要注释的部分。
- 事件绑定
在JSX中事件属性都是以驼峰命名的方式，HTML中的内嵌事件的编写方式在JSX语法中是无效的。

### 参考
[《深入理解JSX》](http://reactjs.cn/react/docs/jsx-in-depth.html)

## JSX的if...else...
-----
你没法在JSX中使用if-else语句，因为JSX只是函数调用和对象创建的语法糖。
这里我们结合首页来说明一些使用方法吧。

### 使用三元表达式
页面中我们使用一个loading的state(状态来表示当前查看的模块)。现在我们结合hidden样式来进行界面的显示控制吧。
- hidden样式

``` css
.hidden { display:none; }
```
- 显示控制

``` javascript
<div className={loading == 'sethead' ? '' : 'hidden'}>这里是设置头像页面</div>
<div className={loading == 'setinfo' ? '' : 'hidden'}>这里是修改资料页面</div>
<div className={loading == 'other' ? '' : 'hidden'}>这里是其他页面</div>
```

### JS代码中使用if表达式
当三元操作表达式不够健壮，你也可以使用if语句来决定应该渲染那个组件。
这里我们使用两层的map遍历菜单，需要判断是否有子菜单，然后加载。
``` javascript
if(menu.menus){ //判断是否有子菜单
	menus = menu.menus.map(function(item, j){
		return (<ListGroupItem} key={j}>{ item.text }</ListGroupItem>);
	});
	menusgroup = (
		<ListGroup>
		{ menus }
		</ListGroup>
	);  			
}
```

## 制作index页面
-----
页面结构如下：
![image](http://o905ne85q.bkt.clouddn.com/F3A2.tmp.png)

### 添加props属性值
菜单内容等使用pros属性保存（不会发生改变）。
``` javascript
getDefaultProps : function () {
	var that = this;
	return {//设置默认属性
		asidemenus: [{
			title: '基本资料', //title用于储存该菜单显示名称
			click: 'init', //click用于储存该菜单对应点击时loading的状态值
			menus: [{
				text: '名字',
				click: 'name',
			}, {
				text: '邮箱',
				click: 'email',
			}, {
				text: 'github',
				click: 'github',
			}, ]
		}, {
			title: '设置头像',
			click: 'sethead',
		}, {
			title: '修改资料',
			click: 'setinfo',
		}, {
			title: '其他',
			click: 'other',
		}],
	};
},
```

### 添加state值
loading状态使用state状态保存（会发生改变）。
``` javascript
getInitialState: function() {
	return {loading: 'init'};
},
```

### 添加改变状态事件
创建事件用来改变loading状态。
``` javascript
changeState: function(state){
	this.setState({loading: state});
},
```

### map遍历数据
上面也有提到map的使用。
在这里有个需要注意的地方就是，遍历的时候需要给元素设置key，下面介绍一下key。
- key
给组件设置独一无二的键，并确保它在一个渲染周期中保持一致，是的React能够更智能地决定应该重用一个组件，还是销毁并重新创建一个组件，进而提升渲染性能。
``` javascript
menus = menu.menus.map(function(item, j){
	return (<ListGroupItem} key={j}>{ item.text }</ListGroupItem>);
});
```

### 添加点击事件onClick
- 事件处理
React里只需把事件处理器（event handler）以骆峰命名（camelCased）形式当作组件的props传入即可，就像使用普通HTML那样。
- 自动绑定
React中，所有方法被自动绑定到了它的组件实例上。React还缓存这些绑定方法，所以CPU和内存都是非常高效。
- 事件代理
  - React实际并没有把事件处理器绑定到节点本身。
  - 当React启动的时候，它在最外层使用唯一一个事件监听器处理所有事件。
  - 当组件被加载和卸载时，只是在内部映射里添加或删除事件处理器。
  - 当事件触发，React根据映射来决定如何分发。当映射里处理器时，会当作空操作处理。
- 虚拟事件对象
  - 事件处理器将会传入虚拟事件对象的实例，一个对浏览器本地事件的跨浏览器封装。
  - 它有和浏览器本地事件相同的属性和方法，包括 stopPropagation()和preventDefault()，但是没有浏览器兼容问题。
  - 要在捕获阶段触发某个事件处理器，在事件名字后面追加Capture字符串

介绍完了React的事件处理相关，我们这里提一个在map里面使用事件绑定需要注意的地方。
当使用map遍历时，map函数里面的this对象不再指向该组件，此时我们只需要在函数后面添加.bind(this)就好。

需要传递参数时，可以在事件的后面使用bind进行传参，然后直接在事件函数中获取就好啦。
- bind
  - bind与call很相似，例如，可接受的参数都分为两部分，且第一个参数都是作为执行时函数上下文中的this的对象。
  - 不同点有两个：
  - 1.bind的返回值是函数。
  - 2.call是把第二个及以后的参数作为函数方法的实参传进去，而bind虽说也是获取第二个及以后的参数用于之后方法的执行，但是返回的函数中传入的实参则是在bind中传入参数的基础上往后排的。

``` javascript
menus = menu.menus.map(function(item, j){
	return (<ListGroupItem} key={j} onClick={this.changeState.bind(null,item.click)>{ item.text }</ListGroupItem>);
}.bind(this));
```

### 组件代码
这里贴一下我们组件的代码，有点长哦。
``` javascript
import React from 'react';
import { Panel, PanelGroup, ListGroup, ListGroupItem } from 'react-bootstrap';
import Header from  './header.jsx'; //login自定义组件

const Index = React.createClass({
	getDefaultProps : function () {
	   return {//设置默认属性
			asidemenus: '', //这里就省略啦，大家可以看前面的菜单数据
		};
	},
	changeState: function(state){
		this.setState({loading: state});
	},
	getInitialState: function() {
		return {loading: 'init'};
	},
  render() {
  	var loading = this.state.loading;
  	var that = this;
  	var changeState = this.changeState;
  	var asidemenus = this.props.asidemenus.map(function(menu, i){
  		var menus, menusgroup; 		
  		if(menu.menus){
  			menus = menu.menus.map(function(item, j){
  				return (<ListGroupItem onClick={this.changeState.bind(null,item.click)} key={j}>{ item.text }</ListGroupItem>);
  			}.bind(this));
  			menusgroup = (
  				<ListGroup>
  					{ menus }
  				</ListGroup>
  			);  			
  		}
  		var menuheader = (
  			<ul class="panel-title ">
				<li onClick={this.changeState.bind(null,menu.click)}>
						{ menu.title }
				</li>
			</ul>
  		);
  		return (
  			<Panel collapsible defaultExpanded className="list-group" key={i} header={menuheader}>
				<div id="collapse{i}" className="panel-collapse collapse in">
					{ menusgroup }										
				</div>
			</Panel>
  		);
  	}.bind(this));
    return (
    	<div className="container-fluid row">
    		<Header active="index"></Header>
				<aside className="col-md-2 col-md-offset-1">
					<PanelGroup id="accordion">
						{	asidemenus }						
					</PanelGroup>
				</aside>
				<article className="col-md-7">
					<section className="index-content">
						<p className={loading == 'init' || loading == 'name' ? '' : 'hidden'}>昵称：被删</p>
						<p className={loading == 'init' || loading == 'email' ? '' : 'hidden'}>邮箱：wangbeishan@163.com</p>
						<p className={loading == 'init' || loading == 'github' ? '' : 'hidden'}>github: <a href="https://github.com/godbasin">github.com/godbasin</a></p>
						<div className={loading == 'sethead' ? '' : 'hidden'}>这里是设置头像页面</div>
						<div className={loading == 'setinfo' ? '' : 'hidden'}>这里是修改资料页面</div>
						<div className={loading == 'other' ? '' : 'hidden'}>这里是其他页面</div>
					</section>
				</article>
			</div>
		);
	}
});

module.exports = Index;
```

## 结束语
-----
其实从AngularJS转React的时候，有很多模板引擎的使用方式不一致了，还是很不习惯的呢。相对Angular来说，React似乎教程更少呢，所以本骚年有些时候遇到bug也不是很懂，大家一起来探寻吧。
[此处查看项目代码（仅包含app部分）](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/react-notes/5-fullfill-index)
[此处查看页面效果](http://o9j9owc7b.bkt.clouddn.com/5-fullfill-index/index.html?#/index)