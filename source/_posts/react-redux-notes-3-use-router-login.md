---
title: React-Redux使用笔记3--使用router完成简单登陆功能
date: 2017-01-01 10:37:38
categories: react沙拉
tags: 笔记
---
最近又重新拾起了React框架，并配合开源模板gentelella以及Redux建立了个简单的项目。《React-Redux使用笔记》系列用于记录过程中的一些使用和解决方法。
本文记录使用router完成简单登陆功能的过程。
<!--more-->

## 使用gentelella开源模板
---
这个项目中我们使用gentelella的开源模板，故我们需要引入一些该模板的相关文件。
### 获取gentelella模板
- 从github上获取源码
- 下载后选择需要的文件放置在app/static/gentelella/文件夹中
  - lib文件夹放置相关依赖代码文件
  - build文件夹放置自定义的css和js文件

### 模板引入相关js和css
这里简单列出大概会用到的库和组件。
``` html
<!--templates/index.ejs-->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>运维管理系统</title>  
    <meta http-equiv="X-UA-Compatible" content="IE=9;IE=8;IE=7;IE=EDGE">
    <!-- Bootstrap -->
    <link href="./static/gentelella/lib/css/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="./static/gentelella/lib/css/font-awesome/css/font-awesome.min.css" rel="stylesheet">
    <!-- iCheck -->
    <link href="./static/gentelella/lib/css/iCheck/green.css" rel="stylesheet">
    <!-- Select2 -->
    <link href="./static/gentelella/lib/css/select2.min.css" rel="stylesheet">
    <!-- Switchery -->
    <link href="./static/gentelella/lib/css/switchery.min.css" rel="stylesheet">
    <!-- Datatables -->
    <link href="./static/gentelella/lib/css/dataTables.bootstrap.min.css" rel="stylesheet">
    <link href="./static/gentelella/lib/css/buttons.bootstrap.min.css" rel="stylesheet">
    <link href="./static/gentelella/lib/css/fixedHeader.bootstrap.min.css" rel="stylesheet">
    <link href="./static/gentelella/lib/css/responsive.bootstrap.min.css" rel="stylesheet">
    <link href="./static/gentelella/lib/css/scroller.bootstrap.min.css" rel="stylesheet">

    <!-- PNotify -->
    <link href="./static/gentelella/lib/css/pnotify.css" rel="stylesheet">
    <link href="./static/gentelella/lib/css/pnotify.buttons.css" rel="stylesheet">
    <link href="./static/gentelella/lib/css/pnotify.nonblock.css" rel="stylesheet">

    <!-- Custom Theme Style -->
    <link href="./static/gentelella/build/css/custom.css" rel="stylesheet">
    <link href="./static/gentelella/build/css/common.css" rel="stylesheet"> 
  </head>
  <body class="nav-md">
    <div id="root"></div>
    <!-- built files will be auto injected -->
    <!-- jQuery -->
    <script src="./static/gentelella/lib/js/jquery.min.js"></script>
    <script src="./static/gentelella/lib/js/jquery.form.min.js"></script>
    <!-- Bootstrap -->
    <script src="./static/gentelella/lib/js/bootstrap.min.js"></script>
    <!-- bootstrap-daterangepicker -->
    <script src="./static/gentelella/lib/js/moment.min.js"></script>
    <script src="./static/gentelella/lib/js/daterangepicker.js"></script>
    <!-- iCheck -->
    <script src="./static/gentelella/lib/js/icheck.min.js"></script>
    <!-- Switchery -->
    <script src="./static/gentelella/lib/js/switchery.min.js"></script>
    <!-- Select2 -->
    <script src="./static/gentelella/lib/js/select2.full.min.js"></script>
    <!-- bootstrap-progressbar -->
    <script src="./static/gentelella/lib/js/bootstrap-progressbar.min.js"></script>
    <!-- Datatables -->
    <script src="./static/gentelella/lib/js/jquery.dataTables.min.js"></script>
    <script src="./static/gentelella/lib/js/dataTables.bootstrap.min.js"></script>
    <script src="./static/gentelella/lib/js/dataTables.buttons.min.js"></script>
    <script src="./static/gentelella/lib/js/dataTables.fixedHeader.min.js"></script>
    <script src="./static/gentelella/lib/js/dataTables.keyTable.min.js"></script>
    <script src="./static/gentelella/lib/js/dataTables.responsive.min.js"></script>
    <script src="./static/gentelella/lib/js/responsive.bootstrap.js"></script>
    <script src="./static/gentelella/lib/js/dataTables.scroller.min.js"></script>

    <!-- PNotify -->
    <script src="./static/gentelella/lib/js/pnotify.js"></script>
    <script src="./static/gentelella/lib/js/pnotify.buttons.js"></script>
    <script src="./static/gentelella/lib/js/pnotify.nonblock.js"></script>

    <!-- Echarts -->
    <script src="./static/gentelella/lib/js/echarts.min.js"></script>

    <!-- Custom Theme Scripts -->
    <script src="./static/gentelella/build/js/common.js"></script>
  </body>
</html>
```

## 完成登陆功能
---

### 添加登录组件
新建app/components/login.jsx文件：
``` jsx
// app/components/login.jsx
import React from 'react'; //导入react组件

const Login = React.createClass({
	render() {
		return (
			<div>
				<a className="hiddenanchor" id="signup"></a>
				<a className="hiddenanchor" id="signin"></a>

				<div className="login_wrapper">
					<div className="animate form login_form">
						<section className="login_content">
							<form>
								<h1>管理系统</h1>
								<div>
									<input type="text" className="form-control" placeholder="用户名" ref="username" required />
								</div>
								<div>
									<input type="password" className="form-control" placeholder="密码" ref="password" required />
								</div>
								<div>
									<a className="btn btn-default submit" href="javascript:;" onClick={this.loginSubmit}>登录</a>
								</div>

								<div className="clearfix"></div>

							</form>
						</section>
					</div>

				</div>
			</div>
		);
	},
	getInitialState() {
		return {//设置默认属性
			username: '',
			password: ''
		};
	},
	contextTypes: {
		router: React.PropTypes.object
	},
	loginSubmit() {
		this.context.router.push('/index'); //使用this.content进行跳转
	},
	componentDidMount() {
		sessionStorage.removeItem('username')
		$('body').attr('class', 'login')
	}
});

module.exports = Login;
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

### 添加路由
``` js
// index.js
import React from 'react'; //react
import ReactDOM from 'react-dom'; //react-dom
import { Router, Route, Link, hashHistory, IndexRoute, useRouterHistory } from 'react-router';
import { createHistory, createHashHistory } from 'history';
import Login from  './components/login.jsx'; //login自定义组件
import Index from  './components/index.jsx'; //index自定义组件

let history = useRouterHistory(createHashHistory)();
//将其渲染到页面上id为root的DOM元素内
ReactDOM.render(<Router history={history} >
    <Route path="/">
      <IndexRoute component={Login} />
      <Route path="index" component={Index} />
    </Route>
  </Router>, document.getElementById("root"));
```

页面效果图：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/5147.tmp.png)

## 结束语
-----
至此，我们初步完成了登陆界面以及登陆跳转，后面我们会进行登陆后页面的开发。当然这里的模板css和js本骚年使用了最简单粗暴的方法进行，其实大家也可以尝试使用import和require这些来进行注入哒。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/react-redux-notes/3-use-router-login)
[此处查看页面效果](http://react-redux-notes.godbasin.com/3-use-router-login/index.html)