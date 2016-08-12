---
title:  React使用笔记2--创建登录组件
date: 2016-08-12 23:34:32
categories: react沙拉
tags: 笔记
---
最近在学习使用React作为前端的框架，《React使用笔记》系列用于记录过程中的一些使用和解决方法。
本文记录搭建登录页面的过程。
<!--more-->

## 根据产品规划划分模块
-----
### 主要页面逻辑
在这里，本骚年就建一个比较简单的项目。该项目与之前的Angular使用笔记项目长得完全一致，但我们这里用React来实现吧。
- 我们的主要页面逻辑如下：
  - 1.登录页面，输入账号和密码即可
  - 2.模块页面

### 创建登录页面
- 首先我们在components文件夹内添加一个login.jsx

``` jsx
import React from 'react';
const Login = React.createClass({
	render() {
		return (
			<div className="container" id="login">
				<form id="login-form">
					<h3 className="text-center">login</h3>
					<div className="form-group">
						<label>account</label>
						<input type="text" className="form-control" placeholder="Account" ref="loginName" required />
					</div>
					<div className="form-group">
						<label>Password</label>
						<input type="password" className="form-control" placeholder="Password" ref="loginPwd" required />
					</div>
					<button type="submit"  className="btn btn-default" onClick={this.loginSubmit}>登录</button>
				</form>
			</div>
		)
	}
});

module.exports = Login;
```
- 在jsx中，因为js中class为保留字，所以要写成className
- 此处引用了Bootstrap的样式，在templates/index.ejs中添加

``` html
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css">
```

## React Router
-----
### 安装使用
- 通过npm安装

``` bash
$ npm install history react-router@latest
```
- 还需要安装history，它也是React Router的依赖，且在npm 3+下不会自动安装

``` bash
$ npm install --save history
```
- 添加Route组件

``` javascript
import { Router, Route, Link, hashHistory, IndexRoute } from 'react-router';
```

### React Router组件
- Router组件
Router组件本身只是一个容器，真正的路由要通过Route组件定义。
- Route组件
Route组件还可以嵌套。
``` html
<Router history={hashHistory}>
  <Route path="/" component={App}>
    <Route path="/repos" component={Repos}/>
  </Route>
</Router>
```
- Link组件
Link组件用于取代<a>元素，生成一个链接，允许用户点击后跳转到另一个路由，可接收Router的状态。
- IndexLink组件
如果链接到根路由/，不要使用Link组件，而要使用IndexLink组件。
- IndexRoute组件
IndexRoute显式指定Home是根路由的子组件，即指定默认情况下加载的子组件，即该路径的index.html。
- Redirect组件
Redirect组件用于路由的跳转，即用户访问一个路由，会自动跳转到另一个路由。
- IndexRedirect组件
IndexRedirect组件用于访问根路由的时候，将用户重定向到某个子组件。

### path属性
Route组件的path属性指定路由的匹配规则。
path属性可以使用相对路径（不以/开头），匹配时就会相对于父组件的路径。
- :paramName
 - 匹配URL的一个部分，直到遇到下一个/、?、#为止。
 - 这个路径参数可以通过this.props.params.paramName取出。
- ()
 - ()表示URL的这个部分是可选的。
- *
*匹配任意字符，直到模式里面的下一个字符为止。匹配方式是非贪婪模式。
- **
**匹配任意字符，直到下一个/、?、#为止。匹配方式是贪婪模式。

### Histories
React Router是建立在history之上的。 简而言之，一个history知道如何去监听浏览器地址栏的变化，并解析这个URL转化为location对象，然后router使用它匹配到路由，最后正确地渲染对应的组件。
- createHashHistory
 - 这是一个你会获取到的默认history，如果你不指定某个history（即 <Router>{/* your routes */}</Router>）。
 - 它用到的是URL 的hash（#）部分去创建形如example.com/#/some/path的路由。
 - ?_k=ckuvup是每一个location创建的一个唯一的key，并把它们的状态存储在session storage中。当访客点击“后退”和“前进”时，我们就会有一个机制去恢复这些location state。可使用queryKey: false关闭。
- createBrowserHistory
 - Browser history使用History API在浏览器中被创建用于处理URL，新建一个像这样真实的URL example.com/some/path。
 - 使用Browser history需要在服务器进行配置。
- createMemoryHistory
 - Memory history不会在地址栏被操作或读取。

### js中设置跳转
- 使用browserHistory.push

``` javascript
import { browserHistory } from 'react-router';
example(event) {
	browserHistory.push(path);
}
```
- 使用context对象

``` javascript
export example React.createClass({
  // ask for `router` from context
  contextTypes: {
    router: React.PropTypes.object
  },
  example(event) {
    this.context.router.push(path)
  },
})
```

## 添加路由
-----
### 在index.js设置路由
``` javascript
import { Router, Route, Link, hashHistory, IndexRoute, useRouterHistory } from 'react-router'; //router组件
import { createHistory, createHashHistory } from 'history'; //history组件
import Login from  './components/login.jsx'; //login自定义组件
import Index from  './components/index.jsx'; //index自定义组件
let history = useRouterHistory(createHashHistory)({ queryKey: false });
//将其渲染到页面上id为test的DOM元素内
ReactDOM.render(<Router history={history}>
    <Route path="/">
      <Route path="index" component={Index} />
      <IndexRoute component={Login} />
    </Route>
  </Router>, 
document.body);
```

### 在components里login.ejs添加路由跳转
- 添加登录按钮的click事件
- 添加loginSubmit属性以及跳转

``` jsx
import React from 'react'; //导入react组件
const Login = React.createClass({
	contextTypes: {
		router: React.PropTypes.object
	},
	loginSubmit: function() {
		this.context.router.push('/index'); //使用this.content进行跳转
	},
	render() {
		return (
			<div className="container" id="login">
				<form id="login-form">
					<h3 className="text-center">login</h3>
					<div className="form-group">
						<label>account</label>
						<input type="text" className="form-control" placeholder="Account" ref="loginName" required />
					</div>
					<div className="form-group">
						<label>Password</label>
						<input type="password" className="form-control" placeholder="Password" ref="loginPwd" required />
					</div>
					<button type="submit"  className="btn btn-default" onClick={this.loginSubmit}>登录</button>
				</form>
			</div>
		)
	}
});
module.exports = Login;
```

## 结束语
-----
从Angular转React中遇到不少问题呢，毕竟两者很多概念和使用方法都很不一样，使用过程中也是大开眼界了呀。
[此处查看项目代码（仅包含app部分）](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/react-notes/2-create-login)
[此处查看页面效果](http://o9j9owc7b.bkt.clouddn.com/2-create-login/index.html)
