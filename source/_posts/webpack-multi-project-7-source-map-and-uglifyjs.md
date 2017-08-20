---
title: webpack多页面配置7--source map和代码压缩
date: 2017-08-20 11:23:18
categories: webpack宾治
tags: 教程
---
最近项目中需要搭建一个多页面的环境，包括本地路由服务和分页面打包。
本节介绍开发部署和生产环境打包时，启用source map相关配置。
<!--more-->

## devtool
---
此选项控制是否生成，以及如何生成`source map`。

### 关于source map
当webpack打包源代码时，可能会很难追踪到错误和警告在源代码中的原始位置。
例如，如果将多个源文件打包到一个文件中，而其中一个源文件包含一个错误，那么堆栈跟踪就会简单地指向到该文件。这并通常没有太多帮助，因为你可能需要准确地知道错误来自于哪个源文件。

为了更容易地追踪错误和警告，JavaScript提供了`source map`功能，将编译后的代码映射回原始源代码。

### devtool选项
对于开发环境，通常希望更快速的`Source Map`，需要添加到`bundle`中以增加体积为代价。
但是对于生产环境，则希望更精准的`Source Map`，需要从`bundle`中分离并独立存在。

- 开发环境
  - `eval` 
    - 每个模块都使用`eval()`执行，并且都有`//@ sourceURL`。
    - 此选项会相当快地构建。主要缺点是，由于会映射到转换后的代码，而不是映射到原始代码，所以不能正确的显示显示行数。
  - `inline-source-map` 
    - `SourceMap`转换为`DataUrl`后添加到`bundle`中。
  - `eval-source-map`
    - 每个模块使用`eval()`执行，并且`SourceMap`转换为`DataUrl`后添加到`eval()`中。
    - 初始化`SourceMap`时比较慢，但是会在重构建时提供很快的速度，并且生成实际的文件。行数能够正确映射，因为会映射到原始代码中。
  - `cheap-eval-source-map`
    - 和`eval-source-map`类似，每个模块都使用`eval()`执行。
    - 使用此选项，`Source Map`将传递给`eval()`作为`Data URL`调用。它是“低性能开销”的，因为它没有映射到列，只映射到行数。
  - `cheap-module-eval-source-map`（推荐使用）
    - 和`cheap-eval-source-map`类似，然而，在这种情况下，`loader`能够处理映射以获得更好的结果。

- 生产环境
  - `source-map` 
    - 生成完整的`SourceMap`，输出为独立文件。
    - 由于在`bundle`中添加了引用注释，所以开发工具知道在哪里去找到`SourceMap`。
  - `hidden-source-map` 
    - 和`source-map`相同，但是没有在`bundle`中添加引用注释。
    - 如果你只想要`SourceMap`映射错误报告中的错误堆栈跟踪信息，但不希望将`SourceMap`暴露给浏览器开发工具。
  - `cheap-source-map` 
    - 不带列映射(column-map)的`SourceMap`，忽略加载的`Source Map`。
  - `cheap-module-source-map`
    - 不带列映射(column-map)的`SourceMap`，将加载的`Source Map`简化为每行单独映射。
  - `nosources-source-map` 
    - 创建一个没有`sourcesContent`的`SourceMap`。
    - 它可以用来映射客户端上的堆栈跟踪，而不会暴露所有的源码。

参考[开发辅助调试工具(Devtool)](https://doc.webpack-china.org/configuration/devtool/)。

### 开发环境添加source map
这里我们简单地添加`devtool`：

``` js
// build/dev-server.js
webpackConfig.devtool = 'eval-cheap-module-source-map'
```

同时，在配置文件中，还有一个要点是`publicPath`不是`/`这样的值，而是`http://localhost:3000/`这样的绝对地址。这是因为，在使用?sourceMap的时候，style-loader会把css的引入做成这样：

``` html
<link rel="stylesheet" href="blob:http://localhost:3000/asdasd" />
```

这种blob的形式可能会使得css里的url()引用的图片失效，因此建议用带http的绝对地址（这也只有开发环境会用到）。

所以我们有：

``` js
// webpack-dev-server中间件
app.use(WebpackDevMiddleware(compiler, {
    publicPath: 'http://localhost:3000/',
    stats: {
        colors: true,
        chunks: false
    },
    progress: true,
    inline: true,
    hot: true
}))
```

### 生产环境source map
同样的我们添加`devtool`：

``` js
// build/dev-server.js
webpackConfig.devtool = 'source-map'
// 或者不需要source map
webpackConfig.devtool = false
```

生产环境很多时候我们会压缩代码，压缩的时候如果需要生成source map还需要配置：

``` js
plugins: [
    new webpack.optimize.UglifyJsPlugin({
        sourceMap: true
    })
    // ...
]
```

参考了[《Express结合Webpack的全栈自动刷新》](http://acgtofe.com/posts/2016/02/full-live-reload-for-express-with-webpack)。

### 代码压缩
既然说到`UglifyJsPlugin`了，就顺便讲一下代码压缩吧。

其实也没有多少东西，就是上面大家看到的`new webpack.optimize.UglifyJsPlugin()`，不过配置选项除了`sourceMap`还有注释`comments`相关、压缩`compress`相关。

还有一个问题就是，`UglifyJs`不支持ES6的压缩，如果代码压缩前没有编译到ES5，则打包任务会报错，通常显示：

``` js
ERROR in xx/xxxxx.js from UglifyJs
Unexpected token xxxx
```

这时候我们需要将代码先通过`babel`生成`ES5`，然后再压缩：

``` js
module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      // 其他loader排在后面
    ]
}
```

大致就酱啦。

## 结束语
---
本节我们大致了解了source map的功能和一些devtool的选项，包括生产环境和开发环境可能需要注意的地方，以及简单说了个代码压缩的坑。
可参考代码[github-vue-multi-pages](https://github.com/godbasin/vue-multi-pages)，主要是这套环境使用在vue上的demo。