---
title: 玩转Angular2(1)--用Webpack启动Angular2应用
date: 2017-05-28 22:12:26
categories: angular2火锅
tags: 笔记
---
因为项目原因又玩上了Angular2(v4.0+)，《玩转Angular2》系列用于探索一些灵活或者新的用法。
本文记录用webpack配置环境，启动app的过程。
<!--more-->
## 基本依赖
-----
其实angular2快速启动的脚手架也不少，官方的[angular-cli](https://github.com/angular/angular-cli)，[Angular2 Webpack Starter](https://github.com/AngularClass/angular2-webpack-starter)等等。

这里选择自己搭建的原因，大概是脚手架什么的生成最后的项目总有一些不需要的，还有像单元测试和e2e等等基本不会用到的。

本骚年更偏向的是，一点一点地搭建起来，缺了就慢慢补，这样里面的每个东西都是自己很清楚的。

### package.json
首先，当然要介绍下我们的一些基本依赖，一般都会选择从package.json开始。

``` json
{
  "name": "angular-free",
  "version": "0.0.0",
  "scripts": {
    "build": "webpack --config webpack.config.js",
    "dev": "webpack-dev-server --config webpackServer.config.js --host 0.0.0.0 --port 3333 --devtool eval --progress --colors --hot --content-base dist"
  },
  "dependencies": {
    "@angular/common": "^4.0.0",
    "@angular/compiler": "^4.0.0",
    "@angular/compiler-cli": "^4.0.0",
    "@angular/core": "^4.0.0",
    "@angular/forms": "^4.0.0",
    "@angular/http": "^4.0.0",
    "@angular/platform-browser": "^4.0.0",
    "@angular/platform-browser-dynamic": "^4.0.0",
    "@angular/router": "^4.0.0",
    "rxjs": "^5.1.0",
    "zone.js": "^0.8.10"
  },
  "devDependencies": {
    "@types/node": "^7.0.18",
    "babel-core": "^6.24.1",
    "babel-loader": "^7.0.0",
    "babel-polyfill": "^6.23.0",
    "babel-preset-latest": "^6.24.1",
    "file-loader": "^0.11.1",
    "html-webpack-plugin": "^2.28.0",
    "ts-loader": "^2.0.3",
    "tslint": "^5.2.0",
    "typescript": "~2.2.0",
    "webpack": "^2.5.1",
    "webpack-dev-server": "^2.4.5"
  }
}
```

这里可以大概看到，除了基本的angularv4.0+（这里本骚年安装的是v4.1.2版本），我们还用到了其他的一些工具或者库，像：
- webpack
- babel
- typescript
- ...

本节我们主要涉及的是webpack。
webpack依赖安装，除了`npm install`外，还需要全局安装`npm install -g webpack`。

webpack本骚年使用的是v2.0+版本，而1迁2其实也不是什么难事情，官方有个很详细的[migration说明](https://webpack.js.org/guides/migrating/)，大家可以参考看看。

- `script`命令

至于scripts命令，这里有两个：
1. `npm run dev`：启动webpack服务。
2. `npm run build`: 构建生成dist目录。

## webpack配置
---
### webpack.config.js
这里简单介绍一下几个使用到的loader。

- babel-loader：将ES6甚至ES7编译成ES5
- css/style-loader：基本的样式文件编译打包
- ts-loader：将ts编译成js。
- file-loader：这里主要是方便angular组件声明`templateUrl`等一些文件路径的时候比较方便。

关于插件plugins，这里主要用了一个`html-webpack-plugin`，用于插入`index.html`页面。

上码：

``` javascript
var webpack = require('webpack');
var path = require('path');
var HtmlwebpackPlugin = require('html-webpack-plugin');

var config = {
    // 入口
    entry:  ['babel-polyfill', './src/bootstrap.ts'],
    // 生成的文件
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    // 文件后缀
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        // babel
        rules: [
            {
            test: /\.ts$/,
            use: ["babel-loader", "ts-loader"],
            exclude: /node_modules/
        },
        {
            test: /\.css$/, // Only .css files
            use: ["style-loader", "css-loader"]
        }]
    },
    plugins: [
        // plugins
        new HtmlwebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html'),
            inject: 'body'
        })
    ],
    devtool: 'source-map'
};

module.exports = config;
```

其中主要涉及的文件生成：
- bundle.js: 为主要代码的编译打包

之前在[《玩转angular1》系列](https://godbasin.github.io/2017/02/05/angular-free-1-webpack-and-babel-config/)中讲过一种将依赖单独打包成vendors.js，而将项目代码打包成bundle.js，这样的方式使用场景不一样，大家需要也可以去看看。

### webpackServer.config.js
``` javascript
var webpack = require('webpack');
var path = require('path');
var config = require("./webpack.config.js");
config.entry.concat(['webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:3333'
]);
module.exports = config;
```

## 其他配置
---
### .babelrc
babel-loader的配置通常使用.babelrc文件进行配置：

``` json
{
    "presets": [
        "latest", {
            "ignore": ["./node_modules"]
        }
    ],
    "plugins": []
}
```

至于`presets`参数，我们直接上最新的特性就好啦。当然小伙伴们也可以根据自己的喜好配置像"es-2015"、"stage-0"等阶段，当然需要安装相应的babel依赖啦。

更多的babel解读可参考阮一峰的[《Babel入门教程》](http://www.ruanyifeng.com/blog/2016/01/babel.html)。

### tsconfig.json
直接上json：

``` json
{
    "compilerOptions": {
        "baseUrl": "src",
        "target": "es5",
        "module": "commonjs",
        "sourceMap": true,
        "noImplicitAny": false,
        "noFallthroughCasesInSwitch": true,
        "noImplicitReturns": true,
        "importHelpers": true,
        "noEmitHelpers": true,
        "pretty": true,
        "strictNullChecks": false,
        "experimentalDecorators": true,
        "lib": [
            "dom",
            "es7",
            "es6"
        ]
    },
    "exclude": [
        "node_modules",
        "src/assets",
        "dist"
    ]
}
```

## 启动应用
---
### 项目代码
关于代码其实很简单，从angular-cli里偷过来一个`app-root`的模块组件，然后拼到项目里，最终长这么一个样：

![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/@IA9G2NI16PS9O$ERF%25%28E%29Q.png)

打包之后生成的dist目录长这样：

![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/3B8D%25PM%7DFA$%25B2G58~%25%28H%5B4.png)

其实这里大家可以看到这样使用file-loader的话，对应的文件并不会一起打包进去bundle.js文件里，这样有好处也有不好的地方。

## 结束语
-----
这节主要讲了webpack/babel/Typescript一些相关配置，项目其实已经搭建起来了，但是目前看来并不是特别完善，后面我们可以做些改善和调整。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular2-free/1-init-angular-app-with-webpack)
[此处查看页面效果](http://angular2-free.godbasin.com/1-init-angular-app-with-webpack/index.html)