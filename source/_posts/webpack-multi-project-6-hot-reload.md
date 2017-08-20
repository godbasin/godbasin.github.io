---
title: webpack多页面配置6--热加载刷新
date: 2017-08-19 19:39:41
categories: webpack宾治
tags: 教程
---
最近项目中需要搭建一个多页面的环境，包括本地路由服务和分页面打包。
本节介绍开发部署时，实现热加载和页面刷新。
<!--more-->

## webpack插件
---

### Express和Webpack
`Express`本质是一系列`middleware`的集合，因此，适合`Express`的`webpack`开发工具是`webpack-dev-middleware`和`webpack-hot-middleware`。
详细例子说明也可参考[《Express结合Webpack的全栈自动刷新》](https://segmentfault.com/a/1190000004505747)。

### [webpack-dev-middleware](https://www.npmjs.com/package/webpack-dev-middleware)
`webpack-dev-middleware`是一个处理静态资源的`middleware`。

有时候我们无需使用到`Express`，我们常常使用`webpack-dev-server`开启动服务。
`webpack-dev-server`实际上是一个小型`Express`服务器，它也是用`webpack-dev-middleware`来处理`webpack`编译后的输出。

### [webpack-hot-middleware](https://www.npmjs.com/package/webpack-hot-middleware)
`webpack-hot-middleware`是一个结合`webpack-dev-middleware`使用的`middleware`，它可以实现浏览器的无刷新更新（`hot reload`）。
这也是`webpack`文档里常说的HMR（Hot Module Replacement）。

### 实现热加载和页面刷新
其实如果将热加载定义为文件变动时重新编译的话，其实我们上一节已经完成了。
但热加载的功能，不搭配页面自动刷新的话，其实就不完整了呢。

需要调整三个地方：
1. 每个页面入口需要添加`webpack-hot-middleware/client?reload=true`。
2. 在webpack配置中添加plugin插件`new webpack.HotModuleReplacementPlugin()`。
3. 在`Express`实例中添加中间件`'webpack-hot-middleware'`。

故我们的代码为：

``` js
// build/dev-server.js
// dev-server.js
var path = require('path')
var express = require('express')
var utils = require('./utils')
var webpack = require('webpack')
var webpackConfig = require('./webpack.config')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var WebpackDevMiddleware = require('webpack-dev-middleware')
var WebpackHotMiddleware = require('webpack-hot-middleware')

// Express实例
var app = express()

// 获取页面目录
var entries = utils.entries
// entry中添加HotUpdate地址
var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true'

// 重置入口entry
webpackConfig.entry = {}
// 设置output为每个页面[name].js
webpackConfig.output.filename = '[name].js'
webpackConfig.output.path = path.join(__dirname, 'dist')

Object.keys(entries).forEach(function (name) {
    // 每个页面生成一个entry
    // 这里修改entry实现HotUpdate
    webpackConfig.entry[name] = [entries[name], hotMiddlewareScript]
    
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

webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin())

// webpack编译器
var compiler = webpack(webpackConfig)

// webpack-dev-server中间件
app.use(WebpackDevMiddleware(compiler, {
    publicPath: '/',
    stats: {
        colors: true,
        chunks: false
    },
    progress: true,
    inline: true,
    hot: true
}))

app.use(WebpackHotMiddleware(compiler))

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

这样，我们就实现了代码的热加载以及页面自动刷新了。

## 结束语
---
本节我们讲述了在webpack中添加代码热加载和页面自动刷新的功能，主要使用了`webpack-dev-middleware`和`webpack-hot-middleware`两个插件工具。
可参考代码[github-vue-multi-pages](https://github.com/godbasin/vue-multi-pages)，主要是这套环境使用在vue上的demo。