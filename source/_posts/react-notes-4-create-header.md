---
title:  React使用笔记4--创建头部组件
date: 2016-08-14 14:51:07
categories: react沙拉
tags: 笔记
---
最近在学习使用React作为前端的框架，《React使用笔记》系列用于记录过程中的一些使用和解决方法。
本文记录创建头部组件的过程。
<!--more-->

## react-bootstrap
-----
想要在react中使用bootstrap吗？
如果只是需要使用样式相关的，可以在tempaltes的index.ejs中引用css文件就可以。
``` html
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css">
```
如果你还想要使用bootstrap的组件，那么就可以使用[react-bootstrap库](http://react-bootstrap.github.io/introduction.html)啦。
### 安装react-bootstrap
- 使用npm安装

``` bash
$ npm install react-bootstrap --save
```

- 引用css文件

``` html
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css">
```

### 导入相关组件
react-bootstrap的组件都需要一一导入。
``` jsx
import Button from 'react-bootstrap/lib/Button';
//或者
import { Button } from 'react-bootstrap';
```

### 使用
使用方法如下，其中组件会有大写的标签，以及一定的属性。
``` jsx
<Button bsStyle="success" bsSize="small" onClick={someCallback}>
  Something
</Button>
```
具体每个组件的使用方法可到[组件库](http://react-bootstrap.github.io/components.html)中查看。

## 创建头部菜单
-----
该头部菜单与前一个AngularJS使用笔记中完全一致。如图：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/C902.tmp.png)

### 添加头部组件
- 在components文件夹中添加header.jsx文件
- 定义并输出Header组件

``` jsx
import React from 'react'; //导入react组件
//定义Header组件
const Header = React.createClass({
	render() {
		return <header>暂时头部</header>;
	}
});
module.exports = Header; //输出Header组件
```

- 在components中的index.jsx中使用该组件

``` jsx
import Header from  './header.jsx'; //Header自定义组件
const Index = React.createClass({
  render() {
    return <Header></Header>;
  }
});
```

此时我们可以在/index路由页面看到头部了。
接下来会运用到react有关的Props/State和生命周期，大家如果不是很清楚可以翻上一篇[《React使用笔记3--组件的State/Props与生命周期》](/2016/08/13/react-notes-3-props-state-lifecycle/)进行预热。

### 添加属性Props
由于菜单的内容不变，我们可以将其写成Props属性。
``` jsx
propTypes: { //属性校验器
		menus: React.PropTypes.array, //表示menus属性必须是array，否则报错
		usermenus: React.PropTypes.array, //表示usermenus属性必须是array，否则报错
},
getDefaultProps: function() {
	return { //设置默认属性
		menus: [{
			title: 'index', //title用于储存路由对应的路径
			href: '/index', //href用于设定该菜单跳转路由
			text: '首页', //text用于储存该菜单显示名称
		}, {
			title: 'others',
			href: '/other',
			text: '其他',
		}],
		//usermenus用于储存侧边下拉菜单
		usermenus: [{
			click: function(){}, //click用于设置该菜单点击事件
			text: '退出', //text用于储存该菜单显示名称
		}],
	};
},
```

### 添加state状态
像时间这种每500毫秒刷新一次的，我们将其放在state中。
``` jsx
getInitialState: function() {
	return {clock: ''}; //设置初始state值
},
//定义clockRender事件，用于改变this.state.clock值
clockRender: function(){
	let numberStandard = function(num) {
		let _val = Number(num), _num;
		_num = (_val < 10) ? ('0' + _val) : ('' + _val);
		return _num;
	}, _date = new Date(),
		clock = _date.getFullYear() + '年' + (_date.getMonth() + 1) + '月' +
			_date.getDate() + '日' + ' ' + numberStandard(_date.getHours()) + ':' + numberStandard(_date.getMinutes()) +
			':' + numberStandard(_date.getSeconds());
	this.setState({clock: clock});
},
```
注意：state不应存储计算后的值，计算应该在render中进行，但由于比较长，本骚年也就这样将就用了。小伙伴们有更好的方法也可以提出来哦。

### setInterval时钟
在componentDidMount中进行setInterval时钟。componentDidMount属于react生命周期，在初始化渲染执行之后立刻调用一次，仅客户端有效。
render就是一个模板的作用，他只处理和展示相关的逻辑，如果有业务逻辑，应放在componentWillMount和componentDidMount中执行。
``` jsx
//进行setInterval时钟
componentDidMount: function(){
	let that = this;			
	this.interval = setInterval(function() {
		that.clockRender();
	}, 500);
},
//组件注销时需销毁定时器
componentWillUnmount: function(){
	clearInterval(this.interval);
},
```

### 设置render模板
在这里大家可以看到react-bootstrap的使用方法啦。当然每个组件都是已经在该文件中引入了的。
还有jsx的遍历方法也会在这里展示。
- 在index.jsx页面引入Header时添加属性active="index"，作为菜单选中样式的判断

``` jsx
render() {
	return (
		let active = this.props.active; //获取父组件传递的props
		<Navbar className="header" fluid>
			<Navbar.Header className="navbar-header">
				<Navbar.Brand>Godbasin</Navbar.Brand>
			</Navbar.Header>
			<Navbar.Collapse id="bs-example-navbar-collapse-1">
				<Nav navbar>     	
				{ //遍历头部菜单menus
					this.props.menus.map(function(menu, i) {
						//判断，若title等于active，则加载选中样式
						return (<li key={i} className={ menu.title == active ? "active" : ""}><a href={menu.href}>{ menu.text }<span className="sr-only">(current)</span></a></li>);
					})
				}
				</Nav>
				<Nav navbar pullRight>
					<li><a>{ this.state.clock }</a></li>
					<NavDropdown title="菜单" id="top-aside-menu">
						{ //遍历右侧下拉菜单usermenus
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
```

## 结束语
-----
不得不说框架之间的切换还是有很多问题呢，这时候需要的就是坚持不懈地学习和排除bug啦。
当然本骚年本来还想用ES6装装逼的，奈何不熟练的使用后果就是很多报错，看来也还是要加强ES6语法呀。
[此处查看项目代码（仅包含app部分）](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/react-notes/4-create-header)
[此处查看页面效果](http://o9j9owc7b.bkt.clouddn.com/4-create-header/index.html?#/index)
