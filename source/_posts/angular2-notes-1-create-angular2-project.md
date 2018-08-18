---
title: Angular2使用笔记1--搭建Angular2项目
date: 2016-09-25 10:24:19
categories: angular2火锅
tags: 笔记
---
最近在学习Angular2作为前端的框架，《Angular2使用笔记》系列用于记录过程中的一些使用和解决方法。
本文记录初步搭建项目的过程。
<!--more-->

## 初步使用Angular2应用

### 学习Angular2教程快速起步搭建
Angular2有个比较好的地方，就是有很详细（甚至啰嗦？玩笑话...）的[教程文档](https://angular.cn/docs/ts/latest/)。
这里面会有个[五分钟快速起步教程](https://angular.cn/docs/ts/latest/quickstart.html)，基本步骤如下：
- 环境准备 : 安装 Node.js
- 步骤 1 ：创建本应用的项目文件夹，并且定义包的依赖以及特别的项目设置
- 步骤 2: 创建本应用的 Angular 根组件
- 步骤 3: 创建一个 Angular 模块
- 步骤 4: 添加 main.ts ，用来告诉 Angular 哪个是根组件
- 步骤 5: 添加 index.html ，本应用的宿主页面
- 步骤 6: 构建并运行本应用

感兴趣的小伙伴们可以按照这个教程试一遍。

### 自动化搭建
其实说白了，自动化搭建也就是把别人搭建好整理好的项目样板下载下来，然后安装和使用罢了。
其中[Angular2 Webpack Starter](https://github.com/AngularClass/angular2-webpack-starter)和[angular2-webpack](https://github.com/preboot/angular2-webpack)算是里面比较完善和有一定使用者的吧。
这里我们使用前者，[Angular2 Webpack Starter](https://github.com/AngularClass/angular2-webpack-starter)。
git上自带有比较详细的目录组织以及安装使用说明，这里我就贴过来简单讲述一下吧。

## Angular2 Webpack Starter搭建
---
### 快速搭建
首先确保你的Node版本 >= 5.0，NPM版本 >= 3。
``` cmd
# 拷贝分支
git clone --depth 1 https://github.com/angularclass/angular2-webpack-starter.git

# 进入该文件夹
cd angular2-webpack-starter

# 安装npm依赖
npm install

# 启动服务
npm start

# 使用热部署
npm run server:dev:hmr

# 若你在中国，请使用cnpm
# https://github.com/cnpm/cnpm
```
安装和启动服务过后，我们可以看到页面效果如下:
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/4D9F.tmp.png)

### 目录组织
使用Angular2 Webpack Starter搭建后，我们能看到详细的目录组织如下：
``` md
angular2-webpack-starter/
 ├──config/                    * 配置文件
 |   ├──helpers.js             * helper functions for our configuration files
 |   ├──spec-bundle.js         * angular2测试环境配置文件
 |   ├──karma.conf.js          * 单元测试karma配置文件
 |   ├──protractor.conf.js     * protractor端到端测试配置文件
 │   ├──webpack.dev.js         * 开发环境webpack配置文件
 │   ├──webpack.prod.js        * 生产环境webpack配置文件
 │   └──webpack.test.js        * 测试webpack配置文件
 │
 ├──src/                       * 将会被编译成js文件的源文件
 |   ├──main.browser.ts        * 浏览器环境的入口文件
 │   │
 |   ├──index.html             * Index.html
 │   │
 |   ├──polyfills.ts           * polyfills文件
 │   │
 |   ├──vendor.ts              * vendor文件
 │   │
 │   ├──app/                   * WebApp文件夹
 │   │   ├──app.spec.ts        * app.ts中组件测试
 │   │   ├──app.e2e.ts         * 端到端测试
 │   │   └──app.ts             * App.ts组件
 │   │
 │   └──assets/                * 静态资源
 │
 ├──tslint.json                * typescript lint配置
 ├──typedoc.json               * typescript文件生成
 ├──tsconfig.json              * 设置使用typescript的webpack
 ├──package.json               * npm依赖
 └──webpack.config.js          * webpack配置文件 
```
这样搭建的angular2应用有个好处是带有完整的模板文件，包括组件、路由、测试等等，对如何使用angular2很有帮助。

### 常用命令
``` bash
# server相关命令
npm run server // 开发环境
npm run server:prod // 生产环境

% build相关命令
npm run build:dev // 开发环境
npm run build:prod // 生产环境

# 热部署
npm run server:dev:hmr

# 监视文件
npm run watch

# 测试
npm run test
# 监视并测试
npm run watch:test

# 端到端测试
npm run e2e
```
生成后的文件要注意在index.html中设置根目录位置哦。
``` html
<!-- 根目录位置 -->
<base href="/">
```

## 结束语
-----
Angular2使用的最大感受就是，遇见未来。
即使angular 1和2已经是完全的改革，但是2的一些理念和标准真的很棒呢。
[此处查看项目代码（仅包含src部分）](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular2-notes/1-create-angular2-project)
[此处查看页面效果](http://oc8qsv1w6.bkt.clouddn.com/1-create-angular2-project/index.html)