---
title: webpack多页面配置4--页面打包实现
date: 2017-08-12 22:42:41
categories: webpack宾治
tags: 教程
---
最近项目中需要搭建一个多页面的环境，包括本地路由服务和分页面打包。
本节实现单个页面或是完整页面的打包过程的过程。
<!--more-->

## 打包实现
---

### 逻辑思路
我们规划最终打包能实现的效果：
1. 可输入目录名，来只打包对应的页面。
2. 不输入目录名的时候，则将全部页面重新打包。

如：
输入`npm run build page1`时，打包`page1`页面。
输入`npm run build page1 page2`时，打包`page1`和`page2`页面。
输入`npm run build`时，打包所有`page`页面。

这里我们可以通过`process.argv`获取命令行参数。

同时我们需要针对每个页面单独打包，这里我们将多个页面拆分成多个并行的任务，每个任务需要设置以下内容：
- `entry`：设置单个页面入口
- `output.path`：设置最终生成文件目录
- `plugins`：设置打包后`index.html`，这里我们使用相同的模板

### 代码实现
我们的页面打包代码放置在`build`文件夹下的`build.js`，则我们的`package.json`中的`script`：

``` json
{
  "scripts": {
    "build": "node build/build.js"
  }
}
```

这样，我们的`process.argv`前两个参数分别是`node`和`build/build.js`，故我们需要先去掉前面两个参数，才能获取剩余页面参数。

``` js
var ora = require('ora')
var rm = require('rimraf')
var path = require('path')
var utils = require('./utils')
var chalk = require('chalk')
var webpack = require('webpack')
var webpackConfig = require('./webpack.config')
var HtmlWebpackPlugin = require('html-webpack-plugin')

var entries = utils.entries
var pageArray

// 取掉前两个参数，分别为node和build
process.argv.splice(0, 2)

if (process.argv.length) {
  // 若传入页面参数，则单页面打包
  pageArray = process.argv;
} else {
  // 若无传入页面参数，则全块打包
  pageArray = Object.keys(entries)
  console.log(pageArray)
}

// 开始输出loading状态
var spinner = ora('building for production...\n')
spinner.start()

pageArray.forEach(function (val, index, array) {
  rm(path.join(__dirname, '..', 'dist', val), err => {
    if (err) throw err
    // print pageName[]
    console.log(index + ': ' + val)
    // 输出目录dist/pageName
    webpackConfig.output.path = path.join(__dirname, '..', 'dist', val)
    // 入口文件设定为指定页面的入口文件
    // main.js这里为通用入口文件
    webpackConfig.entry = {}
    webpackConfig.entry[index] = path.join(__dirname, '..', 'src', val, 'main.js')
    // 添加index.html主文件
    webpackConfig.plugins = [
      new HtmlWebpackPlugin({
        // 生成出来的html文件名
        filename: 'index.html',
        // 每个html的模版，这里多个页面使用同一个模版
        template: './index.html',
        // 或使用单独的模版
        // template: './src/' + val + '/index.html',
        // 自动将引用插入html
        inject: true,
        // 每个html引用的js模块，也可以在这里加上vendor等公用模块
        // chunks: [name]
      })
    ];
    // 开启打包
    webpack(webpackConfig, function (err, stats) {
      spinner.stop()

      // 输出错误信息
      if (err) throw err

      // 输出打包完成信息
      process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
      }) + '\n\n')

      console.log(chalk.cyan('  Build complete.\n'))
      console.log(chalk.yellow(
        '  Tip: built files are meant to be served over an HTTP server.\n' +
        '  Opening index.html over file:// won\'t work.\n'
      ))
    })
  })
})
```

## 结束语
---
这里简单实现了打包逻辑，我们可以指定页面打包，也可以整项目分页面分块打包。这里还缺一些错误信息，后面我们还需要完善错误提示呢。
可参考代码[github-vue-multi-pages](https://github.com/godbasin/vue-multi-pages/blob/master/build/dev-server.js)，主要是这套环境使用在vue上的demo。