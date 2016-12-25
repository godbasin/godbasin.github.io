---
title: React-Redux使用笔记2--完善打包生产代码流程
date: 2016-12-25 12:23:23
categories: react沙拉
tags: 笔记
---
最近又重新拾起了React框架，并配合开源模板gentelella以及Redux建立了个简单的项目。《React-Redux使用笔记》系列用于记录过程中的一些使用和解决方法。
本文记录完善打包生产代码流程的过程。
<!--more-->

## 分离webpack和webpack-dev配置
---
在开发过程中，我们需要使用到webpack-dev-server。
而在打包生产代码的过程中，我们仅需要使用webpack进行编译打包就够了。

### 安装babel-polyfill
Babel默认只转换新的JavaScript句法（syntax），而不转换新的API，比如Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise等全局对象，以及一些定义在全局对象上的方法（比如Object.assign）都不会转码。
举例来说，ES6在Array对象上新增了Array.from方法。Babel就不会转码这个方法。如果想让这个方法运行，必须使用babel-polyfill，为当前环境提供一个垫片。

使用命令安装：
``` npm 
npm install babel-polyfill --save-dev
```

- 参考[《Babel 入门教程》](http://www.ruanyifeng.com/blog/2016/01/babel.html)

### webpack.config.js
``` js
// webpack.config.js
var webpack = require('webpack');
var path = require('path'); //引入node的path库
var HtmlwebpackPlugin = require('html-webpack-plugin');

var config = {
    entry: ['babel-polyfill',
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
            },
            { test: /\.css$/, loader: "style-loader!css-loader" }
        ]
    },
    plugins: [
        new HtmlwebpackPlugin({
            title: 'React Biolerplate by Linghucong',
            template: path.resolve(__dirname, 'templates/index.ejs'),
            inject: 'body'
        })
    ],
    devtool: 'source-map'
}

module.exports = config;
```

### webpackdev.config.js
``` js
// webpackdev.config.js
var webpack = require('webpack');
var path = require('path'); //引入node的path库
var HtmlwebpackPlugin = require('html-webpack-plugin');
var config = require("./webpack.config.js");
config.entry.unshift('webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:3333');
module.exports = config;
```

### 修改package.json的命令
``` json
// package.json
"scripts": {
	"dev": "webpack-dev-server --config webpackdev.config.js --port 3333 --host 0.0.0.0 --devtool eval --progress --colors --hot --content-base dist",
	"build": "webpack --config webpack.config.js"
}
```

## 打包代码
---
### 使用shell脚本打包代码
本项目中使用shell脚本打包代码：
``` sh
// publish.sh
# clean dist
rm -rf dist

# webpack build
npm run build

# copy static
cp -r app/static dist
```
### 使用shelljs打包代码
像windows下面，默认没有运行shell脚本的命令，此时我们可以借助shelljs来完成。
``` js
// publish.js
// https://github.com/shelljs/shelljs
require('shelljs/global');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');

// clean dist
rm('-rf', 'dist');

// webpack build
webpack(webpackConfig, function (err, stats) {
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n')
});

// copy static
cp('-R', 'app/static/*', 'dist');
```

## 结束语
-----
至此，我们完成了打包代码的过程。其实我们也可以直接使用webpack来完成后续的打包流程，不过本骚年还没仔细去研究，这里就先使用shell脚本打包啦，后面如果有改进再更新哈。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/react-redux-notes/2-complete-publish)
[此处查看页面效果](http://ohpt01s4n.bkt.clouddn.com/2-complete-publish/index.html)