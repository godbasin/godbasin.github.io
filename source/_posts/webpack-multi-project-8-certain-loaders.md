---
title: webpack多页面配置8--静态资源loader们
date: 2017-08-25 23:48:38
categories: webpack宾治
tags: 教程
---
最近项目中需要搭建一个多页面的环境，包括本地路由服务和分页面打包。
本节介绍比较经常使用到的静态资源相关loader们，像css-loader、url-loader等。
<!--more-->

## Loader
---
参考[《Loader》](http://zhaoda.net/webpack-handbook/loader.html)。

### Loader的存在
Webpack本身只能处理JavaScript模块，如果要处理其他类型的文件，就需要使用loader进行转换。

Loader可以理解为是模块和资源的转换器，它本身是一个函数，接受源文件作为参数，返回转换的结果。
这样，我们就可以通过`require`来加载任何类型的模块或文件，比如`CoffeeScript、 JSX、 LESS`或图片。

### Loader的特性
- **Loader可以通过管道方式链式调用，每个`loader`可以把资源转换成任意格式并传递给下一个`loader`，但是最后一个`loader`必须返回JavaScript**。
- Loader可以同步或异步执行。
- Loader运行在`node.js`环境中，所以可以做任何可能的事情。
- Loader可以接受参数，以此来传递配置项给`loader`。
- Loader可以通过文件扩展名（或正则表达式）绑定给不同类型的文件。
- Loader可以通过`npm`发布和安装。
- 除了通过`package.json`的`main`指定，通常的模块也可以导出一个`loader`来使用。
- Loader可以访问配置。
- 插件可以让`loader`拥有更多特性。
- Loader可以分发出附加的任意文件。

Loader本身也是运行在`node.js`环境中的`JavaScript`模块，它通常会返回一个函数。
大多数情况下，我们通过`npm`来管理`loader`，但是你也可以在项目中自己写`loader`模块。

### 使用Loader
在你的应用程序中，有三种使用`loader`的方式：
1. 配置（推荐）：在`webpack.config.js`文件中指定`loader`。
2. 内联：在每个`import`语句中显式指定`loader`。
3. CLI：在`shell`命令中指定它们。

## 静态资源Loader
---
我们来看看静态资源相关的Loader们。

### CSS相关Loader
加载CSS需要`css-loader`和`style-loader`。
他们做两件不同的事情，`css-loader`会遍历CSS文件，然后找到`url()`表达式然后处理他们，`style-loader`会把原来的CSS代码插入页面中的一个`style`标签中。

1. [`css-loader`](https://doc.webpack-china.org/loaders/css-loader/)

我们看[webpack](https://doc.webpack-china.org/loaders/css-loader/)上解释：
`css-loader` 解释(interpret)`@import`和`url()`，会`import/require()`后再解析(resolve)它们。

说白了是用来处理css文件中的`url()`或者`@import`的路径。


2. [`style-loader`](https://doc.webpack-china.org/loaders/style-loader/)

通过注入`<style>`标签将CSS添加到DOM中。

``` js
// 通过webpack配置使用
// css-loader和style-loader推荐一起使用，注意顺序
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
}
```

3. [`less-loader`](http://www.css88.com/doc/webpack2/loaders/less-loader/)

一看就知道，`less-loader`主要用于将LESS转换成CSS的。
将`css-loader`、`style-loader`和`less-loader`链式调用，添加对webpack的LESS支持，可以把所有样式立即应用于DOM。

LESS将CSS赋予了动态语言的特性，如变量，继承，运算，函数。

如果需要启用CSS的source map，需要配置选项：

``` js
module.exports = {
    ...
    module: {
        rules: [{
            test: /\.less$/,
            use: [{
                loader: "style-loader"
            }, {
                loader: "css-loader", options: {
                    sourceMap: true
                }
            }, {
                loader: "less-loader", options: {
                    sourceMap: true
                }
            }]
        }]
    }
};
```

4. `postcss-loader`
`postcss-loader`提供了一种方式用JavaScript代码来处理CSS。负责把CSS代码解析成抽象语法树结构（Abstract Syntax Tree，AST），再交由插件来进行处理。
插件基于CSS代码的AST所能进行的操作是多种多样的，比如可以支持变量和混入（mixin），增加浏览器相关的声明前缀，或是把使用将来的CSS规范的样式规则转译（transpile）成当前的 CSS 规范支持的格式。

`postcss-loader`的使用依赖一些插件。

``` js
// 配置webpack.config.js
module: {
  loaders: [
    {
      test: /\.css$/,
      // loader: "style-loader!css-loader!postcss-loader"
    }
  ]
},
postcss: function () {
	return [ 
    // 里面是我们要用的插件
	];
}
```

以下插件都需要单独安装相关npm模块：

- `autoprefixer`
  - 解析CSS文件并且添加浏览器前缀到CSS规则里，对浏览器兼容补全还是挺方便的
- `stylelint`
  - Stylelint插件可以让你在编译的时候就知道自己CSS文件里的错误
- `postcss-cssnext`
  - 可以让你写CSS4的语言，并能配合autoprefixer进行浏览器兼容的不全，而且还支持嵌套语法
- `postcss-import`
  - 在`@import` css文件的时候让webpack监听并编译

更多的可以参考[《PostCSS配置指北》](https://github.com/ecmadao/Coding-Guide/blob/master/Notes/CSS/PostCSS%E9%85%8D%E7%BD%AE%E6%8C%87%E5%8C%97.md)。

### 文件相关Loader
1. `file-loader`

`file-loader`主要用来处理图片。

2. `url-loader`

`url-loader`的功能类似`file-loader`加载器，但是在文件大小低于指定的限制时（单位 bytes）可以返回一个`Data Url`。

大小限制可以通过传递查询参数来指定。（默认为无限制）
如果文件大小大于限制，将转为使用`file-loader`，所有的查询参数也会透传过去。

``` js
// => 如果 "file.png" 大小小于 10kb 将返回 DataUrl
require("url-loader?limit=10000!./file.png");

// webpack配置
module: {
  loaders: [
    {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      }
  ]
}
```

## 结束语
---
本节我们大致了解静态资源相关loader们，当时具体使用的时候还是得历练一番的。
代码的话，大家可以看看[github-vue-multi-pages](https://github.com/godbasin/vue-multi-pages)，主要是这套环境使用在vue上的demo。