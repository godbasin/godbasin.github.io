---
title: React-Redux使用笔记1--使用webpack搭建React开发环境
date: 2016-12-24 12:09:26
categories: react沙拉
tags: 笔记
---
最近又重新拾起了React框架，并配合开源模板gentelella以及Redux建立了个简单的项目。《React-Redux使用笔记》系列用于记录过程中的一些使用和解决方法。
本文记录使用Webpack初步搭建开发环境的过程。
<!--more-->

自从引入了一套后台管理模板gentelella，越使用越感觉心情愉快呢。
[gentelella github](https://github.com/puikinsh/gentelella)

## 安装配置webpack
---

Webpack将项目中的所有静态资源都当做模块，模块之间可以互相依赖，由webpack对它们进行统一的管理和打包发布。

这里主要参考[《手把手教你基于ES6架构自己的React Boilerplate项目》](http://www.open-open.com/lib/view/open1462013660085.html)。

### Webpack
- webpack支持的功能特性：
1.支持CommonJs和AMD模块，意思也就是我们基本可以无痛迁移旧项目。
2.支持模块加载器和插件机制，可对模块灵活定制。特别是babel-loader，有效支持ES6。
3.可以通过配置，打包成多个文件。有效利用浏览器的缓存功能提升性能。
4.将样式文件和图片等静态资源也可视为模块进行打包。配合loader加载器，可以支持sass，less等CSS预处理器。
5.内置有source map，即使打包在一起依旧方便调试。

- loader加载器
> loaders被应用于应用程序的资源文件中，通常用来做转换。
> 它们都是函数（运行在nodejs中），将资源文件的源码作为入参，处理完后，返回新的源码文件。
  - less/sass loader加载器
  - url-loader可对图片资源打包
  - babel ES6预处理器

### 安装nodejs和npm
在[nodejs官网](https://nodejs.org/)下载nodejs(里面携带npm)并安装。

### 初始化项目环境
新建package.json文件，如下：
``` bash
// package.json
{
    "dependencies": {
        "react": "^15.3.2",
        "react-dom": "^15.3.2",
        "react-router": "^3.0.0",
        "webpack": "^1.13.3"
    },
    "scripts": {},
    "devDependencies": {}
}
```
使用`npm install`则可安装webpack和react。

### 初始化项目结构
项目代码结构如下：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/703C.tmp.png)
其中入口文件为`app/index.js`，模板文件为`templates/index.js`。

### webpack设置
新建webpack.config.js文件，如下：
``` js
// webpack.config.js
var webpack = require('webpack');
var path = require('path'); //引入node的path库

var config = {
    entry: [path.resolve(__dirname, 'app/index.js')], //入口文件
    output: {
        path: path.resolve(__dirname, 'dist'), // 指定编译后的代码位置为 dist/bundle.js
        filename: 'bundle.js'
    },
    module: {
        loaders: []
    },
    devtool: 'source-map'
}

module.exports = config;
```

### 安装 html-webpack-plugin
- 使用命令安装：

``` npm 
npm install html-webpack-plugin --save-dev
```

- 在webpack.config.js中增加:

``` js
plugins: [
	// 入口模板文件解析
	new HtmlwebpackPlugin({
		title: 'React Redux Test',
		template: path.resolve(__dirname, 'templates/index.ejs'),
		inject: 'body'
	})
]
```

### 添加less样式loader
- 使用命令安装：

``` npm 
npm install css-loader style-loader less-loader --save-dev
```

- 在webpack.config.js中增加loader:

``` js
{
	test: /\.less$/,
	loaders: ['style', 'css', 'less'],
	include: path.resolve(__dirname, 'app')
},
{ test: /\.css$/, loader: "style-loader!css-loader" }
```

### 添加jsx loader
- 使用命令安装：

``` npm 
npm install babel-core babel-loader babel-preset-latest babel-preset-react --save-dev
```

- 在webpack.config.js中增加loader:

``` js
{
	test: /\.jsx?$/,
	loader: 'babel-loader',
	exclude: 'node_modules'
}
```

- 新建.babelrc文件

``` json
{
    "presets": [
        "latest", "react", {
            "ignore": ["/node_modules"]
        }
    ],
    "plugins": []
}
```

### 安装webpack-dev-server
webpack-dev-server是一个小型的node.js Express服务器,它使用webpack-dev-middleware中间件来为通过webpack打包生成的资源文件提供Web服务。
webpack-dev-server可以让我们在本地启动一个web服务器，使我们更方便的查看正在开发的项目。

webpack-dev-server支持两种模式来自动刷新页面：
1. iframe模式(页面放在iframe中,当发生改变时重载)
2. inline模式(将webpack-dev-sever的客户端入口添加到包(bundle)中)
具体的大家查看[文档](http://webpack.github.io/docs/webpack-dev-server.html)呗。

- 使用命令安装：

``` npm 
npm install webpack-dev-server --save-dev
```

- 在webpack.config.js中修改entry:

``` js
entry: [
	'webpack/hot/dev-server',
	'webpack-dev-server/client?http://localhost:3333',
	path.resolve(__dirname, 'app/index.js')
], //入口文件
```

- 在 package.json 中增加 webpack-dev-server 的快捷方式

``` json
// package.json
"scripts": {
	"dev": "webpack-dev-server --port 3333 --devtool eval --progress --colors --hot --content-base dist --host 0.0.0.0",
}
```
配置中指定web服务器端口号为3333，指定目录为dist。

### 完整的package.json
代码如下：
``` json
{
    "dependencies": {
        "react": "^15.3.2",
        "react-dom": "^15.3.2",
        "react-router": "^3.0.0",
        "webpack": "^1.13.3"
    },
    "scripts": {
        "dev": "webpack-dev-server --port 3333 --devtool eval --progress --colors --hot --content-base dist --host 0.0.0.0"
    },
    "devDependencies": {
        "babel-core": "^6.18.2",
        "babel-loader": "^6.2.7",
        "babel-preset-latest": "^6.16.0",
        "babel-preset-react": "^6.16.0",
        "css-loader": "^0.25.0",
        "html-webpack-plugin": "^2.24.1",
        "less-loader": "^2.2.3",
        "style-loader": "^0.13.1",
        "webpack-dev-server": "^1.16.2"
    }
}
```

### 完整的webpack.config.js
``` js
var webpack = require('webpack');
var path = require('path'); //引入node的path库
var HtmlwebpackPlugin = require('html-webpack-plugin');

var config = {
    entry: ['webpack/hot/dev-server',
        'webpack-dev-server/client?http://localhost:3000',
        path.resolve(__dirname, 'app/index.js')
    ], //入口文件
    output: {
        path: path.resolve(__dirname, 'dist'), // 指定编译后的代码位置为 dist/bundle.js
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            // 为webpack指定loaders
            {
                test: /\.less$/,
                loaders: ['style', 'css', 'less'],
                include: path.resolve(__dirname, 'app')
            },
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: 'node_modules'
            }
        ]
    },
    plugins: [
        // 入口模板文件解析
        new HtmlwebpackPlugin({
            title: 'React Redux Test',
            template: path.resolve(__dirname, 'templates/index.ejs'),
            inject: 'body'
        })
    ],
    devtool: 'source-map'
}

module.exports = config;
```

此时我们使用`npm run dev`就可以启动项目。

## 项目代码初始化
---
### 模板文件
``` ejs
// templates/index.ejs
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>react-redux-test</title>   
  </head>
  <body class="nav-md">
    <div id="app"></div>
  </body>
</html>
```

### index.js入口文件
``` js
import React from 'react'; //react
import ReactDOM from 'react-dom'; //react-dom
import Index from './components/index.jsx'; //index自定义组件

//将其渲染到页面上id为app的DOM元素内
ReactDOM.render( < Index / > , document.getElementById("app"));
```

### Index组件
``` jsx
// app/components/index.ejs
import React from 'react';

const Index = React.createClass({
	render() {
		return (
			<div>Hello	World!</div>
		);
	}
});

module.exports = Index;
```

至此，我们初步搭建了个React的项目。
[打开页面](http://localhost:3333/)就可以看到输出的Hello World!啦。

## 结束语
-----
关于webpack，其实大家可以花更多的时间去学习一下，这个工具真的是棒棒哒，像其他热加载方式或者是其他更加自动化的流程也是需要大家不断去发现和完善的呢。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/react-redux-notes/1-build-react-project)