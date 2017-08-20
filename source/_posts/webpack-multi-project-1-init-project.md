---
title: webpack多页面配置1--基础webpack配置
date: 2017-08-05 09:48:50
categories: webpack宾治
tags: 教程
---
最近项目中需要搭建一个多页面的环境，包括本地路由服务和分页面打包。
本节作为首节内容，主要简单介绍一些webpack相关的常用配置。
<!--more-->

## Webpack基本概念
---
更多的相关配置小伙伴们可以参考[《正确的Webpack配置姿势，快速启动各式框架》](https://godbasin.github.io/2017/05/21/webpack-common-setting/)。
这里我们主要介绍搭建时涉及的一些配置。

**四个核心概念：入口(entry)、输出(output)、loader、插件(plugins)。**

### 入口(entry)
将您应用程序的入口起点认为是根上下文(contextual root)或app第一个启动文件。
一般来说，在Angular中我们将是启动`.bootstrap()`的文件，在Vue中则是`new Vue()`的位置，在React中则是`ReactDOM.render()`或者是`React.render()`的启动文件。

``` js
module.exports = {
  entry: './path/to/my/entry/file.js'
};
```

### 出口(output)
output属性描述了如何处理归拢在一起的代码(bundled code)，在哪里打包应用程序。一般需要以下两点：
- filename: 编译文件的文件名(main.js/bundle.js/index.js等)
- path：对应一个绝对路径，此路径是你希望一次性打包的目录

``` js
module.exports = {
  output: {
    filename: 'bundle.js',
    path: '/home/proj/public/assets'
  }
};
```

### loader
webpack把每个文件(.css, .html, .scss, .jpg, etc.) 都作为模块处理。但webpack只理解JavaScript。

如果你看过生成的`bundle.js`代码就会发现，Webpack将所有的模块打包一起，每个模块添加标记id，通过这样一个id去获取所需模块的代码。
而我们的loader的作用，就是把不同的模块和文件转换为这样一个模块，打包进去。

**loader支持链式传递。能够对资源使用流水线(pipeline)。loader链式地按照先后顺序进行编译，从后往前，最终需要返回javascript。**

不同的应用场景需要不同的loader，这里我简单介绍几个（loader使用前都需要安装，请自行查找依赖安装）：

- babel-loader

[官网](https://babeljs.io/learn-es2015/)在此，想要了解的也可以参考[Babel 入门教程](http://www.ruanyifeng.com/blog/2016/01/babel.html)。
`babel-loader`将ES6/ES7语法编译生成ES5，当然有些特性还是需要`babel-polyfill`支持的（Babel默认只转换新的JavaScript句法，而不转换新的API，如Promise等全局对象）。

而对于babel-loader的配置，可以通过`options`进行，但一般更常使用`.babelrc`文件进行：

``` js
{
    "presets": [], // 设定转码规则
    "plugins": [] // 插件
}
```

- css相关loader
  - css-loader: 处理css文件中的url()
  - style-loader: 将css插入到页面的style标签
  - less-loader: less转换为css
  - postcss-loader(autoprefixer-loader): 自动添加兼容前缀(`-webkit-`、`-moz-`等)

- url-loader/file-loader: 修改文件名，放在输出目录下，并返其对应的url
  - url-loader在当文件大小小于限制值时，它可以返回一个Data Url

- html-loader/raw-loader: 把Html文件输出成字符串
  - html-loader默认处理html中的`<img src="image.png">`为require("./image.png")，需要在配置中指定image文件的加载器

### 插件(plugins)
loader仅在每个文件的基础上执行转换，**插件目的在于解决loader无法实现的其他事**。
由于plugin可以携带参数/选项，需要在wepback配置中，向plugins属性传入`new`实例。

### 解析(resolve)
这些选项能设置模块如何被解析，因为这里会使用到所以也介绍一下用到的：

- resolve.extensions
  - 自动解析确定的扩展。默认值为：`[".js", ".json"]`

- resolve.alias
  - 创建`import`或`require`的别名，来确保模块引入变得更简单。
  > 如果使用typescript的话，我们还需要配置`tsconfig.json`：

## 项目配置
---
### 目录组织
``` bash
├── build/                      # webpack配置参数文件
│   └── ...
├── src/                        # 项目代码入口
│   ├── page1/                  # 第一个页面或者应用
│   │   ├── main.js             # 页面/应用入口文件
│   │   └── ...
│   └── page2/                  # 第二个页面或者应用
│   │   ├── main.js             # 页面/应用入口文件
│   │   └── ...
│   └── pageN/                  # 第N个页面或者应用
│       ├── main.js             # 页面/应用入口文件
│       └── ...
├── .babelrc                    # babel编译参数
├── index.html                  # 主页模板，所有的页面共用该index.html入口
└── package.json                # 项目文件，记载着一些命令和依赖还有简要的项目描述信息
```

### 基本配置文件
由于我们需要实现开发时多页面共同启动，打包时分块打包的功能，故在不同环境下我们的入口`entry`和`plugins`等将会不一致，这里我们先省略：

``` js
var path = require('path')

var webpackConfig = {
  entry: {},
  output: {
    path: path.join(__dirname, 'dist'),
    filename: './[hash].js'
  },
  resolve: {
    extensions: ['.js', '.json'] // '.ts' and more
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [path.resolve(__dirname, "./src")]
      },
      // more loaders...
    ]
  },
  plugins: []
}

module.exports = webpackConfig;
```

## 结束语
-----
这里我们搭建了最基本的目录结构以及不完整的webpack配置，后续我们将深入进行build和dev的过程。
目前的代码并没有什么太大的作用，后面补上完整项目的代码吧。