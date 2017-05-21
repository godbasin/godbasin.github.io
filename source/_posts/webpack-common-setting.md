---
title: 正确的Webpack配置姿势，快速启动各式框架
date: 2017-05-21 11:20:18
categories: webpack宾治
tags: 教程
---
本文介绍一些Webpack常用或者有意思的一些配置，教你快速启动各种框架（这里主要是React和Angular）。该篇我们不聊原理，只讲实战。
<!--more-->

在去年的这个时候，本骚年还在被Grunt和Gulp以及各种Requirejs、Seajs团团围住攻击，狼狈不堪。后面认识了Webpack之后，基本所有项目框架都拿它来构建了。
当然也不包括本骚年负责项目都是纯前端的PC端单页应用的原因，还没遇到什么项目使用Webpack上太难的问题。

## Hello Webpack
---
Webpack是一个现代的JavaScript应用程序的模块打包器(module bundler)。其实Webpack不应该拿来跟Grunt/Gulp比较的，但在本骚年这边它就是承担起了很大一部分工作。

### 初始Webpack
这里主要基于Webpack2来讲吧，Webpack1迁移到2还是不是特别难的，官方也配了[迁移文档](https://doc.webpack-china.org/guides/migrating/)。
其实[官方的文档](https://doc.webpack-china.org/concepts/)也有很详细的说明了，对于一般的项目还是可以完全驾驭的。

下面我们先跟随着原始的脚步过一遍概念吧。

**四个核心概念：入口(entry)、输出(output)、loader、插件(plugins)。**

### 入口(entry)
将您应用程序的入口起点认为是根上下文(contextual root)或app第一个启动文件。
一般来说，在Angular中我们将是启动`.bootstrap()`的文件，在Vue中则是`new Vue()`的位置，在React中则是`ReactDOM.render()`或者是`React.render()`的启动文件。

``` js
module.exports = {
  entry: './path/to/my/entry/file.js'
};
```

同时，`entry`还可以是个数组，这个时候「文件路径(file path)数组」将创建“多个主入口(multi-main entry)”。

常见的使用方式是我们需要把"babel-polyfill.js"这样的文件也注入进去（如果需要React的话还可以加个"react-hot-loader/patch"进去）：

``` js
module.exports = {
  entry: ['babel-polyfill', './path/to/my/entry/file.js']
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

**1. babel-loader**

[官网](https://babeljs.io/learn-es2015/)在此，想要了解的也可以参考[Babel 入门教程](http://www.ruanyifeng.com/blog/2016/01/babel.html)。
`babel-loader`将ES6/ES7语法编译生成ES5，当然有些特性还是需要`babel-polyfill`支持的（Babel默认只转换新的JavaScript句法，而不转换新的API，如Promise等全局对象）。

``` js
// 在webpack1里使用loader属性，在webpack2中为rules属性
module.exports = {
  module: {
    rules: [
      {test: /\.(js)$/, use: 'babel-loader'}
    ]
  }
};
```

而对于babel-loader的配置，可以通过`options`进行，但一般更常使用`.babelrc`文件进行：

``` js
{
    "presets": [], 
    "plugins": [] // 插件
}
```

- `presets`: 设定转码规则

有"es2015", "stage-0/1/2/3"，如果你使用React则还加上"react"，而我一般使用"lastest"装满最新特性。
当然这些都需要安装，你选择了对应的转码规则也要安装相应的依赖：

``` js
npm install --save-dev babel-preset-latest
```

**2. ts-loader**

一看就知道，是个typescript的loader，同样的还有awesome-typescript-loader，关于两者的不同可参考[作者的话](https://www.npmjs.com/package/awesome-typescript-loader)。
这里我们使用ts-loader也就足够了：

``` js
{
    test: /\.(ts)$/,
    use: ["babel-loader", "ts-loader"],
    exclude: /node_modules/
}
```

3. 其他loader

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

这里也介绍几个常用的插件：

**1. HtmlwebpackPlugin**

功能有下：
- 为html文件中引入的外部资源如script、link动态添加每次compile后的hash，防止引用缓存的外部文件问题
- 可以生成创建html入口文件，比如单页面可以生成一个html文件入口

但其实最常使用的，无非是把`index.htnm`页面插入（因为入口文件为js文件）:

``` js
new HtmlwebpackPlugin({
    template: path.resolve(__dirname, 'src/index.html'),
    inject: 'body'
})
```

**2. CommonsChunkPlugin**

提取代码中的公共模块，然后将公共模块打包到一个独立的文件中，以便在其他的入口和模块中使用。

像之前有个项目有远程服务器调试代码的需求[捂脸]，这时候我们需要把依赖单独抽离出来（不然文件太大了）：

``` js
new CommonsChunkPlugin({
    name: 'vendors',
    filename: 'vendors.js',
    minChunks: function(module) {
        return isExternal(module);
    }
})
```

关于`isExternal()`函数，用了很简单的方式进行：

``` js
function isExternal(module) {
    var userRequest = module.userRequest;
    if (typeof userRequest !== 'string') {
        return false;
    }
    return userRequest.indexOf('node_modules') >= 0; // 是否位于node_modules里
}
```

**3. webpack.ProvidePlugin**

定义标识符，当遇到指定标识符的时候，自动加载模块。像我们常用的jQuery：

``` js
new webpack.ProvidePlugin({
    jQuery: 'jquery',
    $: 'jquery'
})
```

**4. ExtractTextPlugin**
可以将样式从js中抽出，生成单独的`.css`样式文件（同样因为方便调试[捂脸+1]）。即把所以的css打包合并：

``` js
new ExtractTextPlugin('style.css', {
    allChunks: true // 提取所有的chunk（默认只提取initial chunk，而上面CommonsChunkPlugin已经把部分抽离了）
})
```

### 解析(resolve)
这些选项能设置模块如何被解析。这里本骚年只讲两个常用的：

**1. resolve.extensions**

自动解析确定的扩展。默认值为：

``` js
resolve: {
    extensions: [".js", ".json"]
    // 当我们需要使用typescript的时候，需要修改：
    extensions: [".js", ".ts"]
    // 当我们需要使用React时，还要修改：
    extensions: ['.ts', '.tsx', '.js']
}
```

**2. resolve.alias**

创建`import`或`require`的别名，来确保模块引入变得更简单。

``` js
resolve: {
    alias: {
        shared: path.resolve(__dirname, 'src/shared'),
    }
}
```

如果使用typescript的话，我们还需要配置`tsconfig.json`：

``` js
{
    "compilerOptions": {
        "paths": {
            "shared": ["src/shared"]
        }
    }
}
```

这样我们就可以跟长长的路径定位说拜拜了：

``` js
// 原代码
import {something} from '../../../../../shared/something';
// 配置后
import {something} from 'shared/something';
```

### 开发工具(devtool)
**此选项控制是否生成，以及如何生成source map。**
要开启source map，我们还需要安装`source-map-loader`：

``` js
npm i -D source-map-loader
```

同时添加loader的配置：

``` js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre"
      }
    ]
  },
  devtool: 'source-map' // 然后我们就可以开启了
};
```

### webpack-dev-server
`webpack-dev-server`是webpack官方提供的一个小型Express服务器，主要提供两个功能：
1. 为静态文件提供服务
2. 自动刷新和热替换(HMR)

**在实际开发中，`webpack-dev-server`可以实现以下需求：**
- **每次修改代码后，webpack可以自动重新打包**
- **浏览器可以响应代码变化并自动刷新**

一般来说，我们可以通过引入`webpack.config.js`文件然后调整配置就可以启用了：

``` js
// webpackServer.config.js文件
// 生成配置
var webpack = require('webpack');
var path = require('path'); // 引入node的path库
var config = require("./webpack.config.js"); // 引入webpack.config.js
config.entry.concat(['webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:3333'
]);
module.exports = config;
```

然后命令行启动：

``` js
webpack-dev-server --config webpackServer.config.js --host 0.0.0.0 --port 3333 --devtool eval --progress --colors --hot --content-base dist
```

看着有点长，其实`webpack-dev-server --config webpackServer.config.js`后面的都是配置，也可以在webpackServer.config.js文件中写入。

常用配置：
- `devServer.contentBase`: 告诉服务器从哪里提供内容
- `devServer.port`(CLI): 指定要监听请求的端口号
- `devServer.host`(CLI): 指定使用一个host。默认是localhost
- `devServer.hot`： 启用webpack的模块热替换特性
- `devServer.progress`(CLI): 将运行进度输出到控制台。

其余配置请移步[官方文档](https://doc.webpack-china.org/configuration/dev-server/)。

## 前端框架与Webpack
---
这里本骚年就不一个个讲解了，简单分享几个用过的`webpack.config.js`配置吧。
### Angular1 + Webpack
``` js
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

教程请移步[玩转Angular1(1)--webpack/babel环境配置](https://godbasin.github.io/2017/02/05/angular-free-1-webpack-and-babel-config/)。

### React + Webpack
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

教程请移步[React-Redux使用笔记1--使用webpack搭建React开发环境](https://godbasin.github.io/2016/12/24/react-redux-notes-1-build-react-project/)。

### Angular2 + Typescript + Webpack
``` js
var webpack = require('webpack');
var path = require('path');
var HtmlwebpackPlugin = require('html-webpack-plugin');

var config = {
    entry: ['babel-polyfill', './src/bootstrap.ts'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: './bundle.js'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: ["babel-loader", "ts-loader", "angular2-template-loader"],
                exclude: /node_modules/
            },
            {
                test: /\.(html|css)$/,
                use: ['raw-loader'],
                exclude: [path.resolve(__dirname, 'src/index.html')]
            },
            {
                test: /\.async\.(html|css)$/,
                loaders: ['file?name=[name].[ext]']
            }, {
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre"
      }]
    },
    plugins: [
        new HtmlwebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html'),
            inject: 'body'
        }),
        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)@angular/,
            path.resolve(__dirname, 'src'),
            {}
        )
    ],
    devtool: 'source-map'
};

module.exports = config;
```

教程...敬请期待。

## 结束语
-----
很可惜，当时玩Vue本骚年是用的`vue-cli`，所以这里没有Vue相关的代码。不过经过上面的讲解以及课后的练习，相信你一定可以搭建自己想要的应用。
Webpack的资源很多，而深入理解的你也能去开发自己想要的loader或是插件的，多了解多尝试总是很棒的。