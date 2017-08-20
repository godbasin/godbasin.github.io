---
title: webpack多页面配置5--开发服务启动
date: 2017-08-13 11:12:27
categories: webpack宾治
tags: 教程
---
最近项目中需要搭建一个多页面的环境，包括本地路由服务和分页面打包。
本节介绍开发环境路由的设计，以及实现服务启动过程。
<!--more-->

## 开发部署
---

### 逻辑思路
开发环境的部署和生产环境不一致，我们规划的本地环境实现的效果如下：
1. 整个项目启动一次，多页面共享相同环境。
2. 根据路由来匹配不同页面，路由与页面目录一致。

如：
路由为`/page1`时，打开`page1`页面。
路由为`/page2`时，打开`page2`页面。
路由匹配不到对应页面时，进行相关提示。

### [`Express`模块](http://www.expressjs.com.cn/)
`Express`是一个基于`Node.js`平台的极简、灵活的`web`应用开发框架，它提供一系列强大的特性，帮助你创建各种`Web`应用。

既然我们需要路由的匹配，这里我们使用`express`模块。

路由（`Routing`）是由一个`URI`（或者叫路径）和一个特定的`HTTP`方法（`GET`、`POST`等）组成的，涉及到应用如何响应客户端对某个网站节点的访问。
每一个路由都可以有一个或者多个处理器函数，当匹配到路由时，这个/函数将被执行。

路由的定义由如下结构组成：`app.METHOD(PATH, HANDLER)`。
其中，`app`是一个`express`实例，`METHOD`是某个`HTTP`请求方式中的一个，`PATH`是服务器端的路径，`HANDLER`是当路由匹配到时需要执行的函数。

官方示例：

``` js
// 对网站首页的访问返回 "Hello World!" 字样
app.get('/', function (req, res) {
  res.send('Hello World!');
});

// 网站首页接受 POST 请求
app.post('/', function (req, res) {
  res.send('Got a POST request');
});
```

- 请求对象（`req`）
  - `req.params`: 这是一个数组对象，命名过的参数会以键值对的形式存放
    - 比如有一个路由`/user/:name`，`"name"`属性会存放在`req.params.name`， 这个对象默认为`{}`
  - `req.query`: 一个解析过的请求参数对象，默认为`{}`
  - `req.body`: 这个对应的是解析过的请求体，
    - 这个特性是`bodyParser()`中间件提供，其它的请求体解析中间件可以放在这个中间件之后。当`bodyParser()`中间件使用后，这个对象默认为`{}`
  - `req.route`: 这个对象里是当前匹配的`Route`里包含的属性，比如原始路径字符串，产生的正则，等等
  - `req.path`: 返回请求的`URL`的路径名
  - `req.host`: 返回从`"Host"`请求头里取的主机名,不包含端口号
  - ...

- 响应对象（`res`）
  - `res.end()`: 终结响应处理流程
  - `res.json()`:	发送一个`JSON`格式的响应
  - `res.jsonp()`:	发送一个支持`JSONP`的`JSON`格式的响应
  - `res.redirect()`:	重定向请求
  - `res.render()`:	渲染视图模板
  - `res.send()`:	发送各种类型的响应
  - `res.sendFile`:	以八位字节流的形式发送文件
  - `res.sendStatus()`:	设置响应状态代码，并将其以字符串形式作为响应体的一部分发送
  - ...

### 代码实现
我们的开发部署代码放置在`build`文件夹下的`dev-server.js`，则我们的`package.json`中的`script`：

``` json
{
  "scripts": {
    "dev": "node build/dev-server.js",
    "build": "node build/build.js"
  }
}
```

同时，我们将每个页面的主页面命名为`[pageName].html`，然后匹配路由之后就能获取相关页面：

``` js
// dev-server.js
var path = require('path')
var express = require('express')
var utils = require('./utils')
var webpack = require('webpack')
var webpackConfig = require('./webpack.config')
var HtmlWebpackPlugin = require('html-webpack-plugin')

// Express实例
var app = express()

// 获取页面目录
var entries = utils.entries

// 重置入口entry
webpackConfig.entry = {}
// 设置output为每个页面[name].js
webpackConfig.output.filename = '[name].js'
webpackConfig.output.path = path.join(__dirname, 'dist')

Object.keys(entries).forEach(function (name) {
    // 每个页面生成一个entry，如果需要HotUpdate，在这里修改entry
    webpackConfig.entry[name] = entries[name]
    
    // 每个页面生成一个[name].html
    var plugin = new HtmlWebpackPlugin({
        // 生成出来的html文件名
        filename: name + '.html',
        // 每个html的模版，这里多个页面使用同一个模版
        template: './index.html',
        // 自动将引用插入html
        inject: true,
        // 每个html引用的js模块，也可以在这里加上vendor等公用模块
        chunks: [name]
    })
    webpackConfig.plugins.push(plugin)
})

// webpack编译器
var compiler = webpack(webpackConfig)

// webpack-dev-server中间件
var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: '/',
    stats: {
        colors: true,
        chunks: false
    },
    progress: true,
    inline: true,
    hot: true
})

// 使用webpack中间件
app.use(devMiddleware)

// 路由
app.get('/:pagename?', function (req, res, next) {
    var pagename = req.params.pagename
        ? req.params.pagename + '.html'
        : 'index.html'

    var filepath = path.join(compiler.outputPath, pagename)

    // 使用webpack提供的outputFileSystem
    compiler.outputFileSystem.readFile(filepath, function (err, result) {
        if (err) {
            // something error
            return next('输入路径无效，请输入目录名作为路径，有效路径有：\n/' + Object.keys(entries).join('\n/'))
        }
        // 发送获取到的页面
        res.set('content-type', 'text/html')
        res.send(result)
        res.end()
    })
})

module.exports = app.listen(8080, function (err) {
    if (err) {
        // do something
        return
    }

    console.log('Listening at http://localhost:8080\n')
})
```

这里面我们使用到`webpack-dev-middleware`模块，主要用于监视文件变化后重新编译，但这里并没有结合热加载来刷新页面，后面我们一起讲吧。

## 结束语
---
本节我们针对开发部署的场景，来对服务的启动做了些调整，当然还有很多地方如热加载、source-map等都需要完善。
可参考代码[github-vue-multi-pages](https://github.com/godbasin/vue-multi-pages)，主要是这套环境使用在vue上的demo。