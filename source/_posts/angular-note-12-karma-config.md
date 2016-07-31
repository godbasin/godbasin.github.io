---
title: Angular使用笔记12-Karma的一些配置项
date: 2016-07-31 10:32:41
categories: angular混搭
tags: 笔记
---
最近的一个项目使用AngularJS(v1.2.6)作为前端的框架，《Angular使用笔记》系列用于记录过程中的一些使用和解决方法。
本文记录Angular中会使用到Karma的一些配置项。
<!--more-->

## Karma基本配置
-----
### karma.conf.js
这里我们先直接查看yaomen工程生成的配置文件：
``` js
module.exports = function(config) {
  'use strict';

  config.set({
    // 是否启动热部署，且当文件改变时自动进行测试
    autoWatch: true,

    // 解析文件和运行的根地址
    basePath: '../',

    // 使用的测试框架，如jasmine/mocha/qunit/...
    // 以及其他框架，如requirejs/chai/sinon/...
    frameworks: [
      'jasmine'
    ],

    // 在浏览器中加载的文件/模式
    files: [
   'app/bower_components/angular/angular.js',
   'app/bower_components/angular-mocks/angular-mocks.js',
   'app/scripts/*.js',
   'app/scripts/**/*.js',
   //'test/mock/**/*.js',
   'test/spec/**/*.js',
   'app/bower_components/angular-resource/angular-resource.js',
   'app/bower_components/angular-cookies/angular-cookies.js',
   'app/bower_components/angular-sanitize/angular-sanitize.js',
   'app/bower_components/angular-route/angular-route.js'
    ],

    // 运行的文件/模式
    exclude: [
    ],

    // 服务端口
    port: 8080,

    // 启动的浏览器，可选如下:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      'PhantomJS'
    ],

    // 启用的插件
    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine'
    ],

    // 持续积累模式
    // 若为true捕获浏览器运行测试然后离开
    singleRun: false,

	// 输出的日志和报告是启用颜色标注
    colors: true,

    // 日志的级别
    // 可使用的值: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // 如果你在使用grunt服务进行测试，可取消注释以下的代码
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // 根路径，防止与站点根目录冲突
    // urlRoot: '_karma_'
  });
};
```

## 完善Angular单元测试
-----

### 优化测试报告
上一节我们已经简单说过控制器的单元测试了，运行结果如下：
![image](http://o905ne85q.bkt.clouddn.com/F184.tmp.png)
这样的结果显示并不是很清晰，我们下面将使用mocha的测试报告，这里使用插件[karma-mocha-reporter](https://github.com/litixsoft/karma-mocha-reporter)。
- 安装依赖

``` cmd
npm install karma-mocha-reporter --save-dev
```
- karma.conf.js配置
我们需要在karma配置文件中添加相关的配置：

``` js
// 使用的测试结果报告
// 可选的值: 'dots', 'progress', 'mocha'
reporters: ['mocha'],
// 添加插件
plugins: [
	'karma-phantomjs-launcher',
	'karma-jasmine'，
	'karma-mocha-reporter'
],
```

现在运行我们的测试，可以看到测试结果如下：
![image](http://o905ne85q.bkt.clouddn.com/36EE.tmp.png)
这样的测试报告会比之前的清晰多了呢。

### 测试覆盖率
karma的插件[karma-coverage](https://github.com/karma-runner/karma-coverage)提供了测试代码覆盖率的支持。
- 安装依赖

``` cmd
npm install karma karma-coverage --save-dev
```
- karma.conf.js配置
我们需要在karma配置文件中添加相关的配置：

``` js
// 激活覆盖率报告器
reporters: ['mocha', 'coverage'],
// 配置预处理器
preprocessors: {
	// 需要统计测试覆盖率的源文件
	// 不要添加测试文件和库文件
	'app/scripts/*.js': ['coverage'],
	'app/scripts/**/*.js': ['coverage']
},
// 配置报告选项
coverageReporter: {
	type : 'html',
	dir : 'test/coverage/' // 生成报告的位置
},
// 添加插件
plugins: [
	'karma-coverage',
	'karma-phantomjs-launcher',
	'karma-jasmine'，
	'karma-mocha-reporter'
],
```
运行`grunt test`进行测试之后，会自动生成代码覆盖率测试报告：
![image](http://o905ne85q.bkt.clouddn.com/40E2.tmp.png)
生成的目录如下：
![image](http://o905ne85q.bkt.clouddn.com/80EB.tmp.png)

### 添加Chrome浏览器测试
如果需要增加对不同浏览器的测试，需要按照对应的插件，以及进行一些配置。
这里我们介绍一下添加Chrome浏览器测试的步骤，这里使用[karma-chrome-launcher](https://github.com/karma-runner/karma-chrome-launcher)。
- 安装依赖

``` cmd
npm install karma-chrome-launcher --save-dev
```
- karma.conf.js配置
我们需要在karma配置文件中添加相关的配置：

``` js
// 添加测试的浏览器
browsers: [
	'PhantomJS',
	'Chrome'
],
// 添加插件
plugins: [
	'karma-phantomjs-launcher',
	'karma-chrome-launcher',
	'karma-jasmine'，
	'karma-mocha-reporter'
],
```
测试中，chrome浏览器会自动打开并运行测试，完毕之后自动关闭。我们可以看到coverage中也新增了Chrome的测试覆盖率报告。
![image](http://o905ne85q.bkt.clouddn.com/4B40.tmp.png)

## 结束语
-----
这里我们介绍了一些Karma相关的配置，karma.conf.js这个文件也需要耐心折腾呢。不过对核心代码进行单元测试的确是个不错的选择，这样我们就能放心去优化代码，知道产品的功能是否受损了呢。
[此处查看项目代码（仅包含test部分）](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular-notes/12-karma-config)
