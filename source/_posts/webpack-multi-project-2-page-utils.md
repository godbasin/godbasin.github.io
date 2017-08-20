---
title: webpack多页面配置2--拿取页面目录名
date: 2017-08-06 10:44:13
categories: webpack宾治
tags: 教程
---
最近项目中需要搭建一个多页面的环境，包括本地路由服务和分页面打包。
本节介绍获取每个页面目录的名字的过程。
<!--more-->

## 项目约定
---

### 多页面
上节我们讲述了项目的目录结构：
``` bash
├── build/                      # webpack配置参数文件
│   └── ...
├── src/                        # 项目代码入口
│   ├── page1/                  # 第一个页面或者应用
│   │   ├── main.js             # 页面/应用入口文件
│   │   └── ...
│   ├── page2/                  # 第二个页面或者应用
│   │   ├── main.js             # 页面/应用入口文件
│   │   └── ...
│   └── pageN/                  # 第N个页面或者应用
│       ├── main.js             # 页面/应用入口文件
│       └── ...
├── dist/                       # 项目打包代码
│   ├── page1/                  # 第一个页面或者应用
│   │   ├── [hash].js           
│   │   └── index.html          # 页面/应用入口文件
│   ├── page2/                  # 第二个页面或者应用
│   │   ├── [hash].js           
│   │   └── index.html          # 页面/应用入口文件
│   └── pageN/                  # 第N个页面或者应用
│       ├── [hash].js           
│       └── index.html          # 页面/应用入口文件
```

这里我们可以看到我们项目代码的入口位于`src`文件夹，并且每个页面或者app都以目录名为页面的名字。
而打包后的文件也一样，以目录为单位，支持单个打包或是全部打包。

## 获取目录名
---
既然目录名字会在我们的项目搭建中起这么重要的作用，这里我们就将它们获取存起来。

### glob模块
这里我们将使用[`glob`模块](https://www.npmjs.com/package/glob)，它允许你使用`*`等符号，来写一个`glob`规则，像在shell里一样，获取匹配对应规则的文件。

- 安装依赖

``` cmd
npm i glob
```

- 使用方式

``` js
var glob = require("glob")
 
// options可选 
glob("**/*.js", options, function (er, files) {
  // files是匹配到文件的文件名数组 
  // 如果 `nonull` 选项被设置为true，而且没有找到任何文件
  // 那么files就是glob规则本身，而不是空数组
  // er是当寻找的过程中遇的错误
})
```

- 匹配规则
  - `*`: 匹配该路径段中0个或多个任意字符
  - `?`: 匹配该路径段中1个任意字符
  - `[...]`: 匹配该路径段中在指定范围内字符
  - `*(pattern|pattern|pattern)`: 匹配括号中多个模型的0个或多个或任意个的组合
  - `!(pattern|pattern|pattern)`: 匹配不包含任何模型
  - `?(pattern|pattern|pattern)`: 匹配多个模型中的0个或任意1个
  - `+(pattern|pattern|pattern)`: 匹配多个模型中的1个或多个
  - `@(pattern|pat*|pat?erN)`: 匹配多个模型中的任意1个
  - `**`: 和`*`一样，可以匹配任何内容，但`**`不仅匹配路径中的某一段，而且可以匹配`'a/b/c'`这样带有`'/'`的内容，所以它还可以匹配子文件夹下的文件

如果熟悉正则的你，相信也对这些规则了如指掌了。

- 参考
  - [《node-glob学习》](http://www.cnblogs.com/liulangmao/p/4552339.html)

### utils
我们把这块获取目录名的功能作为工具单独管理起来，放在`build/utils.js`文件里。

``` js
// build/utils.js文件
var glob = require('glob');

function getEntries(globPath) {
    // 获取所有匹配文件的文件名数组
    var files = glob.sync(globPath),
        entries = {}

    files.forEach(function (filepath) {
        // 取倒数第二层(view下面的文件夹)做包名
        var split = filepath.split('/')
        var name = split[split.length - 2]

        // 保存{'目录名': '目录路径'}
        entries[name] = './' + filepath
    })
    return entries
}

// 获取所有匹配src下目录的文件夹名字，其中文件夹里main.js为页面入口
var entries = getEntries('src/**/main.js')

module.exports = {
    entries: entries
}
```

## 结束语
-----
本节介绍的内容不是很多，主要是声明了单页面的目录规范，以及简单介绍了`glob`模块，并提供了个获取目录名的工具。
可参考代码[github-vue-multi-pages](https://github.com/godbasin/vue-multi-pages/blob/master/build/utils.js)，主要是这套环境使用在vue上的demo。