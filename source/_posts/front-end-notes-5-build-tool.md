---
title: 前端阶段性总结之「自动化和构建工具」
date: 2017-05-14 09:49:48
categories: 前端满汉全席
tags: 分享
---
该篇主要整理接触过的一些前端工具。
<!--more-->

## 前端工具
---
### 开发环境
对于nodejs和npm的事情，还需要本骚年讲解的话，不合格重考了噢。

### 构建套件/工具
- 程序产生器
  - Yaomen：可快速生产Angular/Backbone等所需的专门类别程式，以及单元测试程式(现在基本没啥人用了呢)
  - git：Git只是代码管理工具，但是把写好的原型程式下载下来这样的事情，也可以当作程序产生器吧哈哈
  - 各种框架自带的脚手架、CLI等等

- 依赖管理
  - bower: 能自动下载安装CSS以及JS套件，并自动处理依赖性(Again，已经很少人用了)
  - npm: nodejs用来下载以及安装依赖的工具

- 自动化工具
  - Grunt: Task Runner，常用来执行JS/CSS打包压缩、编译、单元测试等工作
  - Gulp：用来简化Grunt的设定，常用来监视+编译打包一系列连续整合工作
  - Webpack：其实Webpack只是个模块化工具，但是很多时候我们会使用它完成以上Grunt/Gulp等能完成的工作，所以不小心被归类了

- 校验工具
  - eslint/tslint：可在支持的编译器进行代码校验
  - typescript：编译过程的强类型校验

- 测试工具
  - Karma: 单元测试执行工具
  - Mocha/Jasmine: js测试语言
  
测试相关的本骚年也没接触过，但除了单元测试之外，似乎还有自动化测试相关的，请小伙伴们自行查找。

- 调试工具
  - 强大的浏览器：像Chrome等自带了强大的控制台，包括断点、sourcemap、http等功能
  - Fiddler：主要用于抓包、代理等等，很方便的http调试工具

### 关于Grunt/Gulp/Webpack
以下摘自[知乎网友-一波不是一波](https://www.zhihu.com/question/37020798/answer/71621266):

Gulp应该和Grunt比较，他们的区别我就不说了，说说用处吧。Gulp/Grunt是一种工具，能够优化前端工作流程。比如自动刷新页面、combo、压缩css、js、编译less等等。简单来说，就是使用Gulp/Grunt，然后配置你需要的插件，就可以把以前需要手工做的事情让它帮你做了。

说到browserify/webpack，那还要说到seajs/requirejs。这四个都是JS模块化的方案。

其中seajs/require是一种类型，是一种在线"编译" 模块的方案，相当于在页面上加载一个CMD/AMD解释器。这样浏览器就认识了define、exports、module这些东西。

browserify/webpack是另一种类型，是一个预编译模块的方案，相比于上面，这个方案更加智能。没用过browserify，这里以webpack为例。首先，它是预编译的，不需要在浏览器中加载解释器。另外，你在本地直接写JS，不管是AMD/CMD/ES6风格的模块化，它都能认识，并且编译成浏览器认识的JS。

### Webpack
这里单独把webpack拉出来讲，其实只是因为骚年对其稍微有过些使用经验和总结而已。再说Webpcak可配置性这么棒，当然要多了解了解啦。

优秀的Webpack：
- 拆分依赖树（dependency tree）为多个按需加载的chunk
- 保证快速首屏加载
- 每种静态资源都可成为模块
- 能够将第三方库视作一个模块来处理
- 能够定制模块打包器的几乎任何部分
- 适合大型项目

- webpack-dev-server
  - webpack-dev-server是webpack官方提供的一个小型Express服务器。使用它可以为webpack打包生成的资源文件提供web服务。
  - webpack-dev-server主要提供两个功能：
    - 为静态文件提供服务
    - 自动刷新和热替换(HMR)

- Webpack常用配置
  - entry: 设置入口
  - resolve: 配置文件后缀名(extensions)，除了js，还有jsx、coffee等等。alias配置项，可以为常用模块配置改属性，可以节省编译的搜索时间
  - output: 配置输出文件的路径，文件名等
  - module(loaders): 配置要使用的loader。把资源文件（css、图片、html等非js模块）处理成相应的js模块，然后其它的plugins才能对这些资源进行下一步处理

比如babel-loader可以把es6的文件转换成es5。大部分的对文件的处理的功能都是通过loader实现的。loader可以用来处理在入口文件中require的和其他方式引用进来的文件。

loader一般是一个独立的node模块，要单独安装。

  - plugins: 顾名思义，就是配置要使用的插件。
    - plugin是比loader功能更强大的插件，能使用更多的wepack api。

- 常用Loader
  - less-loader, sass-loader: 处理样式
  - url-loader, file-loader: 处理文件路径
  - babel-loader，babel-preset-es2015，babel-preset-react: js处理，将最新特性的es6/es7语法编译成es5
  - ts-loader：ts -> js代码编译，当然中间有类型检测的过程
  - json-loader

- 常用Plugin
  - CommonsChunkPlugin: 多个html共用一个js文件(chunk)
  - UglifyJsPlugin: 压缩js
  - DefinePlugin: 定义变量，一般用于开发环境log或者全局变量
  - ProvidePlugin: 自动加载模块，当配置（$:'jquery'）例如当使用$时，自动加载jquery
  -  HtmlWebpackPlugin: 生成html

- 参考文章
  - [《Webpack 常用配置总结》](https://toutiao.io/posts/fiq8wd/preview)

Webpack的配置性很强大噢，而且相关的loader/plugin都很多很强大，其实现在的话，基本不需要grunt/gulp这些工具，单使用webpack就能实现整个项目的自动化构建、编译打包等等功能了呢。

## 结束语
-----
对于层出不穷的工具，最好的态度是接受不抗拒。同时有空我们也可以多去了解和研究，毕竟一个新事物的出现和流行，总是有它自身的闪光之点呢。