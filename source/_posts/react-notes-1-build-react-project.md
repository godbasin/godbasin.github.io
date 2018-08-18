---
title: React使用笔记1--使用webpack搭建React项目
date: 2016-08-06 08:52:22
categories: react沙拉
tags: 笔记
---
最近在学习使用React作为前端的框架，《React使用笔记》系列用于记录过程中的一些使用和解决方法。
本文记录使用webpack初步搭建项目的过程。
<!--more-->

## 初步使用React应用

### 直接使用React源码
- 下载[React源代码](https://facebook.github.io/react/downloads.html)
- 引入到页面内
- 页面模板

``` html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Hello React!</title>
	<!-- 引入源文件到页面内 -->
    <script src="build/react.js"></script>
    <script src="build/react-dom.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.34/browser.min.js"></script>
  </head>
  <body>
    <div id="example"></div>
	<!-- type属性为text/babel -->
    <script type="text/babel">
      ReactDOM.render(
        <h1>Hello, world!</h1>,
        document.getElementById('example')
      );
    </script>
  </body>
</html>
```
- 注意
  - 在这里type属性为text/babel，原因是React的JSX语法，跟 JavaScript不兼容
  - ReactDOM.render是React的最基本方法，用于将模板转为HTML语言，并插入指定的DOM节点
- 参考[React官方教程](https://facebook.github.io/react/docs/getting-started.html)

### 自动化搭建
- 本骚念使用的是Webpack自动搭建，后面附上详细教程
- 自动化搭建的好处：
  - 1.可快速了解React通过Webpack工程化的过程
  - 2.通过npm可选择引入需要使用的React模块，像React/React-dom/bootstrap/jQuery/less等可以添加并导入到应用中
  - 3.自动ES6转换，React对ES6的支持程度很不错，怎么能错过使用的机会呢
  - 4.自动jsx格式转换，React的特色JSX也必须少不了哒
  - 5.热部署，文件修改保存之后自动刷新页面
  - 6.可快速搭建单元测试环境
- 参考[《手把手教你基于ES6架构自己的React Boilerplate项目》](http://www.open-open.com/lib/view/open1462013660085.html)

### Webpack
- webpack支持的功能特性：
1. 支持CommonJs和AMD模块，意思也就是我们基本可以无痛迁移旧项目。
2. 支持模块加载器和插件机制，可对模块灵活定制。特别是babel-loader，有效支持ES6。
3. 可以通过配置，打包成多个文件。有效利用浏览器的缓存功能提升性能。
4. 将样式文件和图片等静态资源也可视为模块进行打包。配合loader加载器，可以支持sass，less等CSS预处理器。
5. 内置有source map，即使打包在一起依旧方便调试。

- loader加载器
  - loaders被应用于应用程序的资源文件中，通常用来做转换。
  - 它们都是函数（运行在nodejs中），将资源文件的源码作为入参，处理完后，返回新的源码文件。
  - less/sass loader加载器
  - url-loader可对图片资源打包
  - babel ES6预处理器

- webpack安装

``` javascript
//按照webpack依赖
$ npm install webpack -g
//html-webpack-plugin插件用来简化创建服务于webpack bundle的HTML文件
$ npm install html-webpack-plugin --save-dev
//在本地启动一个web服务器
$ npm install webpack-dev-server --save-dev
//安装各个必须的loader
$ npm install style-loader css-loader url-loader babel-loader less-loader file-loader --save-dev
```
- 参考[《webpack前端模块加载工具》](http://www.cnblogs.com/YikaJ/p/4586703.html)

## 目录组织
-----
React的目录组织相对自由，但自由通常也会带来不好维护的问题呢，所以建议大家好好管理文件哦。
### 本骚年目录组织
如下：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/C315.tmp.png)
- build用于存放最终生成的代码
- components用于存放React的组件
- images/less不用说当然是用来存放图片和样式文件的
- node_modules大家都知道是npm的依赖文件
- templates里面存放页面模板，index.ejs则是主页的模板
- index.js是启动入口啦
- package.json是管理npm依赖的文件
- webpack.config.js则是webpack的配置项

### webpack.config.js
``` javascript
var webpack = require('webpack'); //引入node的webpack库
var path = require('path'); //引入node的path库
var HtmlwebpackPlugin = require('html-webpack-plugin'); //引入node的html-webpack-plugin库
var config = {
	//页面入口文件配置
	entry: [
		'webpack/hot/dev-server', //热部署
		'webpack-dev-server/client?http://localhost:3000', //本地服务端口
		'./index.js' //入口文件
	],
	//入口文件输出配置
	output: {
		path: path.resolve(__dirname, 'build'), // 指定编译后的代码位置为 build
		filename: 'bundle.js' //打包JavaScript文件以及依赖(就是那些第三方的库)文件
	},
	module: {
		//加载器配置
		loaders: [
			//.jsx 文件使用babel-loader来编译处理
			{test: /\.jsx?$/, loader: 'babel', exclude: /node_modules/, query: {presets: ['react', 'es2015']}},
			//.less 文件使用 style-loader/css-loader/less-loader 来处理
			{test: /\.less$/, loaders: ['style', 'css', 'less'], include: path.resolve(__dirname, 'less')},
			//.jsx 文件使用babel-loader来编译处理
			{test: /\.js$/, loaders: ['babel'], exclude: /node_modules/ },
			//图片文件使用 url-loader 来处理，小于8kb的直接转为base64
			{test: /\.(jpg|png)$/, loader: "url?limit=8192"}
		]
	},
	//插件项
	plugins: [
		new HtmlwebpackPlugin({
			title: 'React',
			template: path.resolve(__dirname, 'templates/index.ejs'),
			inject: 'body'
		}),
	],
};
module.exports = config;
```

### package.json
``` json
"devDependencies": {
	"babel-core": "^6.10.4",
	"babel-loader": "^6.2.4",
	"babel-preset-es2015": "^6.9.0",
	"babel-preset-react": "^6.11.1",
	"bootstrap": "^3.3.6",
	"css-loader": "^0.23.1",
	"file-loader": "^0.9.0",
	"html-webpack-plugin": "^2.21.0",
	"jquery": "^3.0.0",
	"less": "^2.7.1",
	"less-loader": "^2.2.3",
	"moment": "^2.13.0",
	"npm-install-webpack-plugin": "^4.0.3",
	"sass-loader": "^4.0.0",
	"style-loader": "^0.13.1",
	"url-loader": "^0.5.7",
	"webpack": "^1.13.1",
	"webpack-dev-server": "^1.14.1"
},
"dependencies": {
	"react": "^15.1.0",
	"react-dom": "^15.1.0",
	"webpack": "^1.13.1"
}
```

### 基本搭建项目
- 在templates/index.ejs中添加初始模板

``` javascript
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>react-test</title>   
  </head>
  <body>
    <div id="test"></div>
  </body>
</html>
```

- 在index.js中加入启动和依赖文件

``` javascript
import './less/index.less'; //less样式文件
import React from 'react'; //react
import ReactDOM from 'react-dom'; //react-dom
import Component from  './components/component.jsx'; //你的自定义组件
import $ from 'jquery'; //这里引入jquery
//将其渲染到页面上id为test的DOM元素内
ReactDOM.render(<Component></Component>, $('#test')[0]);
```

- 在components/component.jsx中添加组件

``` javascript
import React from 'react';

class Component extends React.Component{
  render() {
    return <h1>Hello React</h1>;
  }
}
module.exports = Component;
```

- 启动本地服务以及热部署

``` javascript
npm run dev
```

- 生成文件到build

``` javascript
npm run build
```
生成文件要注意把webpack.config.js里的热部署相关去掉哦
``` javascript
entry: [
	'./index.js' //入口文件
],
```
- 至此，我们初步搭建了个React的项目
效果如下：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/3867.tmp.png)

## 结束语
-----
自动化搭建可是个高效又酷酷的工程哦，而且在这过程中学到的也很多呢。
[此处查看项目代码（仅包含app部分）](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/react-notes/1-build-react-project)
[此处查看页面效果](http://o9j9owc7b.bkt.clouddn.com/1-build-react-project/index.html)