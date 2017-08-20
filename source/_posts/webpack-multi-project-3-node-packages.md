---
title: webpack多页面配置3--打包相关node模块介绍
date: 2017-08-11 21:27:58
categories: webpack宾治
tags: 教程
---
最近项目中需要搭建一个多页面的环境，包括本地路由服务和分页面打包。
本节实现单个页面或是完整页面的打包过程的过程。
<!--more-->

## npm模块
---
打包页面需要用到一些npm模块（需单独安装），这里我们简单介绍一下。

### [`ora`模块](https://www.npmjs.com/package/ora)
主要用来实现`node.js`命令行环境的loading效果，和显示各种状态的图标等。

``` js
const ora = require('ora')
// 开始显示
const spinner = ora('Loading unicorns').start()
 
setTimeout(() => {
    // 一秒后设置颜色和内容
    spinner.color = 'yellow'
    spinner.text = 'Loading rainbows'
}, 1000)
```

更多的选项，大家到[官方说明](https://www.npmjs.com/package/ora)上面看吧。

### [`rimraf`模块](https://www.npmjs.com/package/rimraf)
实现`node.js`环境的UNIX命令`rm -rf`。

``` js
rimraf(f, [opts], callback)
```

- `f`，可为`glob`匹配规则的文件
- `[opts]`，一些选项，具体可参考[官方说明](https://www.npmjs.com/package/rimraf)
- `callback`，若执行过程中出错，则回调参数为`error`

如果大家用过`shalljs`，这是一个`node.js`环境的`Unix shell`命令，里面当然已经包括`rm`命令了。

### [`chalk`模块](https://www.npmjs.com/package/chalk)
命令行输出各种样式的字符串。

- 使用方式

`chalk.<style>[.<style>...](string, [string...])`

``` js
// 例如，红色带下划线的粗体字
chalk.red.bold.underline('Hello', 'world')
```

## node.js模块
---
介绍将使用到的node.js自带API和内置模块（无需安装）。

### [`path`模块](https://nodejs.org/api/path.html)
`path`模块提供了一些工具函数，用于处理文件与目录的路径。这是`node.js`一个自带的模块。

`path`模块的默认操作会根据`Node.js`应用程序运行的操作系统的不同而变化。比如，当运行在`Windows`操作系统上时，`path`模块会认为使用的是`Windows`风格的路径。

- `path.join([...paths])`

使用平台特定的分隔符把全部给定的`path`片段连接到一起，并规范化生成的路径。
这个大概是我们写webpack配置的时候，最常用的一个方法啦，像`path.join(__dirname, 'src')`。

- `path.parse(path)`

返回一个对象，对象的属性表示`path`的元素。返回属性包括：`dir`, `root`, `base`, `name`, `ext`。

- `path.format(pathObject)`

会从一个对象返回一个路径字符串，与`path.parse()`相反。

- `path.dirname(path)`

返回一个`path`的目录名，类似于`Unix`中的`dirname`命令。

### [`process`模块](https://nodejs.org/api/process.html)
`process`对象是一个`global`（全局变量），提供有关信息，控制当前`Node.js`进程。
作为一个对象，它对于`Node.js`应用程序始终是可用的，故无需使用`require()`。

- `process.execPath`

返回启动`Node.js`进程的可执行文件所在的绝对路径。

- `process.argv`

`process.argv`属性返回一个数组，这个数组包含了启动`Node.js`进程时的命令行参数。第一个元素为`process.execPath`。
如果需要获取`argv[0]`的值请参见`process.argv0`。第二个元素为当前执行的JavaScript文件路径，剩余的元素为其他命令行参数。

``` js
// 运行以下命令，启动进程：
$ node process-args.js one two=three four

// 将输出：
0: /usr/local/bin/node
1: /Users/mjr/work/node/process-args.js
2: one
3: two=three
4: four
```

- `process.env`

`process.env`属性返回一个包含用户环境信息的对象。
像我们经常看到生产环境`process.env.NODE_ENV = 'production'`和开发环境`process.env.NODE_ENV = 'dev'`。

- 输入流`process.stdin`和输出流`process.stdout`

`process`还有更多的进程管理相关的方法和参数，大家可以参考[官方说明](http://nodejs.cn/api/process.html)。

## 结束语
-----
本节主要介绍了后面打包页面时会使用到的一些node.js内置和依赖模块，包括终端输出样式、命令、`path`、`process`等。后面一节也会用到来进行页面的打包。
可参考代码[github-vue-multi-pages](https://github.com/godbasin/vue-multi-pages/blob/master/build/build.js)，主要是这套环境使用在vue上的demo。