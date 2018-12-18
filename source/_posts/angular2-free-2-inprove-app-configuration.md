---
title: 玩转Angular2(2)--改善应用配置
date: 2017-05-29 13:41:47
categories: angular2火锅
tags: 笔记
---
因为项目原因又玩上了Angular2(v4.0+)，《玩转Angular2》系列用于探索一些灵活或者新的用法。
本文记录改善应用中一些html和css加载的问题。
<!--more-->
## Component中加载html/css
-----
### 使用file-loader
上一节我们使用简单粗暴的`file-loader`生成文件路径方式进行模板加载，我们的组件定义的代码长这样：

``` js
@Component({
  selector: 'app-root',
  templateUrl: require('file-loader?name=[path][name].[ext]!./app.component.html')
})
export class AppComponent {
  title = 'app works!';
}
```

这样做会有一些问题：
1. 使用的时候很不方便，要写一长串。

该方法可以通过在webpack里对file-loader进行配置解决，但可能会产生一些其他问题。本骚年折腾了下没折腾好，估计是姿势不正确吧，大家可以下来试试。

2. 生成的代码不打包进`bundle.js`文件。

这样有个很明显的问题，就是生成的代码体积和大小都比较浪费资源。除非是像本骚年之前的项目一样需要远程debug和直接线上修bug，一般来说都不会需要这样处理的。

### 其他方式
当然，像angular-cli以及Angular2 Webpack Starter这些脚手架和项目，已经对loader进行了调整，最终我们是感受不到对html/css等的文件加载，同时也能很方便地通过sourcemap定位bug。

这里要不使用以上脚手架的话，就得自己想办法实现这个过程了，当然有能力的话自己写个loader也完全没问题，可惜目前本骚年对npm和node的掌握也很是局限(T_T)。实话说，个人觉得使用一个`file-loader`其实说不定也能解决这样的问题了。

下面是从[Angular2 Webpack Starter](https://github.com/AngularClass/angular2-webpack-starter)里面翻到的，其中使用的`angular2-template-loader`的使用过程。

## 使用angular2-template-loader
---
### angular2-template-loader
关于安装和使用等说明，都可以参考[angular2-template-loader文档](https://github.com/TheLarkInn/angular2-template-loader)。

这里我们不再需要`file-loader`了，同时我们需要添加`angular2-template-loader`以及`raw-loader`。

其中`raw-loader`常用于把文件内容作为字符串返回。

### package.json

``` json
{
  "name": "angular-free",
  "version": "0.0.0",
  "scripts": {
    "build": "webpack --config webpack.config.js",
    "dev": "webpack-dev-server --config webpackServer.config.js --host 0.0.0.0 --port 3333 --devtool eval --progress --colors --hot --content-base dist"
  },
  "dependencies": {
    "@angular/common": "~4.1.2",
    "@angular/compiler": "~4.1.2",
    "@angular/compiler-cli": "~4.1.2",
    "@angular/core": "~4.1.2",
    "@angular/forms": "~4.1.2",
    "@angular/http": "~4.1.2",
    "@angular/platform-browser": "~4.1.2",
    "@angular/platform-browser-dynamic": "~4.1.2",
    "@angular/router": "~4.1.2",
    "rxjs": "^5.1.0",
    "zone.js": "^0.8.10"
  },
  "devDependencies": {
    "@types/node": "^7.0.18",
    "angular2-template-loader": "~0.6.2",
    "babel-core": "~6.24.1",
    "babel-loader": "~7.0.0",
    "babel-polyfill": "~6.23.0",
    "babel-preset-latest": "^6.24.1",
    "html-webpack-plugin": "^2.28.0",
    "raw-loader": "^0.5.1",
    "ts-loader": "^2.0.3",
    "tslint": "^5.2.0",
    "typescript": "~2.2.0",
    "webpack": "~2.5.1",
    "webpack-dev-server": "~2.4.5"
  }
}
```

这里本骚年也调整了一下依赖对应的版本，毕竟像angular这样的不兼容升级方式，还是做点记号的好。

### webpack.config.js

``` js
// 这里调整了loader
rules: [
    {
        test: /\.ts$/,
        use: ["babel-loader", "ts-loader", 'angular2-template-loader'],
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
    },
    ...
]
```

### app.component.ts

``` js
@Component({
  selector: 'app-root',
  templateUrl:'./app.component.html',
  styleUrls: ['app.style.css']
})
export class AppComponent {
  title = 'app works!';
}
```

最终使用的方式如上，与`angular2-template-loader`官方推荐的`require`方法不一致，但是这样更加方便了。

## 结束语
-----
这节主要讲了使用`angular2-template-loader`替换之前的`file-loader`，来改善angular2中html文件的引入方式。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular2-free/2-inprove-app-configuration)
[此处查看页面效果](http://angular2-free.godbasin.com/2-inprove-app-configuration/index.html)