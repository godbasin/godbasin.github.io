---
title: 玩转Angular1(1)--webpack/babel环境配置
date: 2017-02-05 17:07:42
categories: angular混搭
tags: 笔记
---
AngularJS(v1.5.8)已经成为项目们的基本框架，《玩转Angular1》系列用于记录项目中的一些好玩或者比较特别的思路。
本文记录用webpack以及babel配置环境的过程。
<!--more-->
## 基本依赖
-----
### package.json
首先，当然要介绍下我们的一些基本依赖，一般都会选择从package.json开始。

``` json
{
  "name": "angular-free",
  "version": "0.0.0",
  "dependencies": {
    "angular": "1.5.8",
    "angular-route": "1.5.8",
    "angular-ui-router": "^0.3.2",
    "tslib": "^1.2.0"
  },
  "scripts": {
    "webpack": "webpack --config webpack.config.js --watch --watch-polling -d",
    "webpack-dev-server": "webpack-dev-server --config webpackServer.config.js  --hot --port 9999"
  },
  "devDependencies": {
    "@types/angular": "^1.5.20",
    "@types/angular-ui-router": "^1.1.35",
    "babel-cli": "^6.18.0",
    "babel-core": "^6.18.0",
    "babel-loader": "^6.2.7",
    "babel-polyfill": "^6.16.0",
    "babel-preset-latest": "^6.16.0",
    "extract-text-webpack-plugin": "^1.0.1",
    "css-loader": "^0.25.0",
    "file-loader": "^0.9.0",
    "less": "^2.7.1",
    "less-loader": "^2.2.3",
    "style-loader": "^0.13.1",
    "ts-loader": "^1.2.2",
    "tslint": "^4.0.2",
    "typescript": "^2.1.4",
    "webpack": "^1.13.3",
    "webpack-dev-server": "^1.16.2"
  },
  "engines": {
    "node": ">=0.8.0"
  },
  "main": "main.js"
}
```

这里可以大概看到，除了基本的angularv1.5.8，我们还用到了其他的一些工具或者库，像：
- webpack
- babel
- typescript
- ui-router
- ...
是的，我们项目改造了不少，后面章节的话，这些工具和库也会说到，本节我们主要涉及的是webpack。
webpack依赖安装，除了`npm install`外，还需要全局安装`npm install -g webpack`。

至于scripts命令，这里有两个：
1. `npm run webpack`：启动webpack，以及文件更改的监控。
2. `npm run webpack-dev-server`: 启动本地服务，以及热加载。

### webpack
webpack已经在前端领域占据了一个很重要的位置了呢，毕竟功能比较强大，也比较灵活自由。我们也把之前的一些基于grunt和gulp的功能切换到webpack上去了。
这里简单介绍一下几个比较基本的loader。

- babel-loader
首先当然少不了我们的babel啦，ES6甚至ES7的一些很方便的语法和特性，在babel的帮助下都能尽情使用了。

- css/less/style-loader
基本的样式文件编译打包和生成sourcemap，这里我们依然锲而不舍地使用less。

- ts-loader
关于在angular1中使用typescript，是一个小伙伴提出的，毕竟团队协作也是需要一些规范和代码提示，typescript后面我们也会讲到的。

- file-loader
这个不得不说是最近才察觉到的，功能强大的loader，对自动“搬运”文件以及生成相应的url上面可是很方便使用的呢。

其他的等本骚年心情愉悦的时候再说吧。

## webpack配置
---
### webpack.config.js
不说话，直接上码：

``` javascript
var webpack = require('webpack');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');

var config = {
    entry: {
        app: ['./app/bootstrap.js'] // 入口文件
    },
    output: {
        path: path.resolve(__dirname, 'app/entry'), // 编译后文件
        publicPath: '/entry/',
        filename: 'bundle.js' // 生成文件名
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }]
    },
    plugins: [
        // 使用CommonChunksLoader来提取公共模块
        new CommonsChunkPlugin({
            name: 'vendors',
            filename: 'vendors.js',
            minChunks: function (module) {
                var userRequest = module.userRequest;
                if (typeof userRequest !== 'string') {
                    return false;
                }
                return userRequest.indexOf('node_modules') >= 0
            }
        })
    ]
};

module.exports = config;
```

其中主要涉及的文件生成：
- bundle.js: 为主要代码的编译打包
- vendors.js: 注入依赖的编译打包

这里并没有涉及typescript的相关配置，后面我们会在typescript添加的时候一并加入讲解的。

### webpackServer.config.js
``` javascript
var WebpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");

var port = 9999;
var config = require("./webpack.config.js");
config.entry.app.unshift("webpack-dev-server/client?http://localhost:" + port + "/", "webpack/hot/dev-server");
var compiler = webpack(config);
var server = new WebpackDevServer(compiler, {
    hot: true,
    inline: true,
    contentBase: "./app",
    stats: {
        colors: true
    },
});
server.listen(port);
```

## babel
---
### .babelrc
babel-loader的配置通常使用.babelrc文件进行配置：

``` json
{
    "presets": [
        "latest", {
            "ignore": ["./app/node_modules"]
        }
    ],
    "plugins": []
}
```

至于`presets`参数，我们直接上最新的特性就好啦。当然小伙伴们也可以根据自己的喜好配置像"es-2015"、"stage-0"等阶段，当然需要安装相应的babel依赖啦。

官方提供以下的规则集，大家可以根据需要安装。

``` shell
# ES2015转码规则
$ npm install --save-dev babel-preset-es2015

# react转码规则
$ npm install --save-dev babel-preset-react

# ES7不同阶段语法提案的转码规则（共有4个阶段），选装一个
$ npm install --save-dev babel-preset-stage-0
$ npm install --save-dev babel-preset-stage-1
$ npm install --save-dev babel-preset-stage-2
$ npm install --save-dev babel-preset-stage-3
```

### babel-polyfill
Babel默认只转换新的JavaScript句法（syntax），而不转换新的API，比如Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise等全局对象，以及一些定义在全局对象上的方法（比如Object.assign）都不会转码。
举例来说，ES6在Array对象上新增了Array.from方法。Babel就不会转码这个方法。如果想让这个方法运行，必须使用babel-polyfill，为当前环境提供一个垫片。

然后在脚本头部，加入如下一行代码：

``` javascript
import 'babel-polyfill';
// 或者
require('babel-polyfill');
```

Babel默认不转码的API非常多，详细清单可以查看babel-plugin-transform-runtime模块的[definitions.js](https://github.com/babel/babel/blob/master/packages/babel-plugin-transform-runtime/src/definitions.js)文件。

### 参考
以上内容部分来自阮一峰的[《Babel入门教程》](http://www.ruanyifeng.com/blog/2016/01/babel.html)。

## 结束语
-----
这节主要讲了webpack和babel一些相关配置，以及部分说明，可能和angular关系一般般吧。下一节我们将在这个基础上，简单搭建个angular项目。