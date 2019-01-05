---
title: 如何发布 typescript npm 包
date: 2019-01-05 09:09:58
categories: 柴米油盐工具集
tags: 教程
---
有些时候，我们需要搞个 npm 包，typescript 那么棒，我们要怎么发布个带 typing 的 npm 依赖包呢。
<!--more-->

## 为啥要用 npm 包捏
---

傻孩子，因为你不想在每个项目里都复制一遍你的代码，然后每次改动和修 bug 的时候，在每个使用到的项目里都改一遍吧？

这个时候，你就可以用 npm 包来管理啦，自带版本功能，你可以用简单的一句`npm install my-package@n.m.l`就可以更新代码啦。另外，我们还可以不占用自己的任何空间，npm 就会帮你保管各个版本的依赖包，你还可以把每个版本的代码都翻出来看。

## npm 发布
---
别急，首先我们来讲下常规的 npm 包发布的流程。

### 1. 申请 npm 账号
[点这里](https://www.npmjs.com/signup)

### 2. 登录 npm 账号
很简单，在终端命令行直接敲下：
``` cmd
npm login
```

对的，就是这么直接。然后根据提示输入账号和密码就好啦，成功之后会看到这样的提示：

``` cmd
Logged in as bamblehorse to scope @username on https://registry.npmjs.org/.
```

棒！

### 3. 初始化 npm 设置
同样的，你只需要输入以下命令行：
``` cmd
npm init
```

就可以根据提示，把你的依赖包名字、介绍、email、github 啥的都一块生成，这样：
![你问的有点多耶](	https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1546593090.jpg)

**配置说明**
更多常用的配置可以看看[官网](https://docs.npmjs.com/files/package.json)，这里我们简单讲几个跟代码相关的：
- `main`: 入口文件。别人安装了你的依赖包之后，会根据这里的路径来寻找入口，通常你要`module.exports = xxx`来输出
- `scripts`: 构建命令，例如你可能会需要`dev`、`test`、`build`等一些构建命令
- `bin`: 脚手架命令。通常在做脚手架的时候，你会通过`bin`来提供一些脚手架的命令来给开发者使用，像`vue init`，这里的`init`便指向一个可执行的脚本文件
- `dependencies`: 这里管理你的依赖包里使用到的一些依赖包，用户在安装你的包的时候，也会将对应的依赖包安装上，这也是为啥通常我们`npm install`一个包的时候，会看到好多的依赖安装

### 4. 发布代码
嗯，发布也就一句命令：
``` cmd
npm publish
```

这里需要注意的是，你如果想发布一个 npm 包，先去[官网](https://www.npmjs.com)查一下有没有人已经用了这个名字哇，不然发布的时候会提示你咩有权限：
![像酱紫](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1546594083.jpg)
一看，发现别人已经占用了：
![被占用啦](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1546596854.jpg)

正常发布的话，应该就是这样提示成功的：
![成功！](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1546595444.jpg)

你会发现，你只有一个`package.json`文件，也能依然成功发布。

**取消发布**
注意，npm 包的最新版本，跟你发布的`version`并没有多大关系，即使你上一次发布的是`1.1.0`版本，你发布个`0.0.1`版本，也依然会盖掉。

像上面这里，我就很悲剧地把原有代码给盖掉了。这个时候你可以赶紧取消发布（24小时内有效，更久的得自己申述了）：
![还好还好](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1546595796.jpg)

### 5. 提交到 github
通常，我们发布个 npm 依赖包，也多半是想要开源的。

这个时候，我们就能在自己的 github 账号下开一个 repo，然后直接把源码提交上去啦。酱紫，别人也可以给你提交 pr 啦。

## typescript npm 包发布
---
我们接着讲讲怎么发布 typescript 的依赖包叭~

### 1. webpack 构建？
很多时候，我们的依赖包也想用高大上的 ES6/ES7/Typescript 来写，但是这样的代码并不能直接输出到用户，因为他们如果没有构建的话，使用起来兼容性可能就会出翔。

通常的做法，我们也跟平时一样去搞个 webpack 环境就好啦。然后我们生成两份代码，一份压缩一份不压缩：
``` js
// webpack.config.js
let path = require("path");
let webpack = require("webpack");
let pk = require("./package.json");

module.exports = [
  { // 第一份生产环境的压缩代码
    mode: "production",
    entry: "./src/index.ts", // 入口文件呀
    module: {
      rules: [ // ts loader
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/
        }
      ]
    },
    resolve: { // 解析文件呀
      extensions: [".tsx", ".ts", ".js"]
    },
    output: {
      path: path.join(__dirname, "build"),
      filename: "yourLibName.min.js",
      library: "yourLibName",
      libraryTarget: "commonjs-module"
    }
  },
  { // 第二份开发环境的不压缩代码
    mode: "development",
    entry: "./src/index.ts",
    module: {
      rules: [ // 如果只是正常的 js 构建，请改成 babel-loader 啦
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"]
    },
    output: {
      path: path.join(__dirname, "build"),
      filename: "yourLibName.js",
      library: "yourLibName",
      libraryTarget: "commonjs-module"
    },
    devtool: "inline-source-map"
  }
];
```

**tsc 构建**
在一些时候，我们其实并不需要搞很复杂，我们只需要简单的弄一下`tsc`原地产生js文件输出就好啦。

### 2. 生成 typing？
我们既然自己用了 typescript 写代码爽歪歪，怎么可以不让其他开发者一起用呢？

我们不用再重新弄一份整齐的`xxx.d.ts`文件，只需要在`tsconfig.json`里加一个命令就好啦：
``` json
{
  "compilerOptions": {
    // ...其他配置
    "declaration": true // 对，就是它！
  }
}
```

加上这个，不管是 webpack 还是 tsc，每个 ts 文件都会生成一个`xxx.d.ts`文件，里面包括你的所有方法的 typing 定义啦~

效果如图：
![用得开心用得放心](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1546598800.jpg)

如果你想要了解更多，可以直接拉[这里的代码看看](https://github.com/godbasin/weRequest/tree/1.1.0_ts)，记得是ts分支噢~

## 结束语
---
开源的意义，在于和更多的人去合作和分享，结合大家的智慧，来打造很棒的东西！