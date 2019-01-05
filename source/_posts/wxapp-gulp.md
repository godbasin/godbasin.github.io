---
title: 小程序 gulp 简单构建
date: 2018-12-30 12:00:30
categories: 小程序双皮奶
tags: 教程
---
虽然 webpack 用的比较多，不过在小程序这种场景下，简单的 gulp 也是个不错的选择吧~
<!--more-->

## gulp 构建小程序
---
### 简单的 copy
对小程序来说，除了`app.js`作为程序入口之外，每个`page`页面都可以作为一个页面入口，更倾向是固定路径模式的多页应用。

最终提交的代码，便是这种结构的代码：

``` cmd
├── app.js
├── app.json
├── app.wxss
├── pages
│   │── index
│   │   ├── index.wxml
│   │   ├── index.js
│   │   ├── index.json
│   │   └── index.wxss
│   └── logs
│       ├── logs.wxml
│       └── logs.js
```

所以，在编译的过程，很多文件都是需要简单地 copy 到目标目录的。我们定义复制和变动复制的任务：

``` js
// 待复制的文件，不包含需要编译的文件
var copyPath = [
  "src/**/!(_)*.*",
  "!src/**/*.less",
  "!src/**/*.ts",
  "!src/img/**"
];
// 复制不包含需要编译的文件，和图片的文件
gulp.task("copy", () => {
  return gulp.src(copyPath, option).pipe(gulp.dest(dist));
});
// 复制不包含需要编译的文件，和图片的文件(只改动有变动的文件）
gulp.task("copyChange", () => {
  return gulp
    .src(copyPath, option)
    .pipe(changed(dist))
    .pipe(gulp.dest(dist));
});
```

### 文件编译
我们想要用高级语法，想要写`async/await`，想要用`less`来写样式，想要用`typescript`来写代码，则需要针对每种文件做编译。

这里用`ts`来举例：

``` js
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var sourcemaps = require("gulp-sourcemaps");
var tsPath = ["src/**/*.ts", "src/app.ts"]; // 定义ts文件
// 编译
gulp.task("tsCompile", function() {
  return tsProject
    .src(tsPath)
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .js.pipe(sourcemaps.write()) // 添加sourcemap
    .pipe(gulp.dest("dist")); // 最终输出到dist目录对应的位置
});
```

当然，用到 typescript 的话，也记得把`tsconfig.json`和`tslint.json`加上哇。

### watch 任务
在我们写代码的时候，就需要监听文件变动并自动复制、编译和更新，这时候我们就需要 watch 任务：

``` js
//监听
gulp.task("watch", () => {
  gulp.watch(tsPath, gulp.series("tsCompile")); // ts编译
  var watcher = gulp.watch(copyPath, gulp.series("copyChange")); // 复制任务
  gulp.watch(watchLessPath, gulp.series("less")); // less处理
  gulp.watch(imgPath, gulp.series("imgChange")); // 图片处理
  watcher.on("change", function(event) {
    // 删除的时候，也更新删除任务到目标文件夹
    if (event.type === "deleted") {
      var filepath = event.path;
      var filePathFromSrc = path.relative(path.resolve("src"), filepath);
      // Concatenating the 'build' absolute path used by gulp.dest in the scripts task
      var destFilePath = path.resolve("dist", filePathFromSrc);
      del.sync(destFilePath);
    }
  });
});
```

### 最终任务
最后，我们需要把这些任务一个个拼起来，最终对外输出两种：`dev`和`build`一般就够了：

``` js
// dev && watch
gulp.task(
  "default",
  gulp.series(
    // sync
    gulp.parallel("copy", "img", "less", "tsCompile"),
    "watch"
  )
);

// build
gulp.task(
  "build",
  gulp.series( // 串行任务
    // sync
    "clear",
    gulp.parallel( // 并行任务
      // async
      "copy",
      "img",
      "less",
      "tsCompile"
    )
  )
);
```

### 项目目录结构
``` cmd
├─dist                              //编译之后的项目文件（带 sorcemap，支持生产环境告警定位）
├─src                               //开发目录
│  │  app.ts                        //小程序起始文件
│  │  app.json
│  │  app.less
│  │
│  ├─assets                     	//静态资源
│     ├─less						//公共less
│     ├─img						    //图片资源
│  ├─components                     //组件
│  ├─utils                          //工具库
│  ├─config                         //配置文档
│  ├─pages                          //小程序相关页面
│
│  project.config.json              //小程序配置文件
│  gulpfile.js                      //工具配置
│  package.json                     //项目配置
│  README.md                        //项目说明
│  tsconfig.json                    //typescript配置
│  tslint.json                      //代码风格配置
```

最终效果，可以参考[wxapp-typescript-demo](https://github.com/godbasin/wxapp-typescript-demo)。

## 结束语
---
其实小程序也有人出了框架，像 mpvue 和 wepy，开发风格类似 Vue。
不过个人的想法不一样，小程序开发和浏览器开发不一样，小程序官方的 API 会一直不停地进化和完善。如果再使用二次封装的框架，框架是否能跟上小程序 API 的更新节奏，二次封装带来更多的学习成本，这些都需要考虑的。或许有一天，框架的能力优势，最终会被小程序自身取代呢。
而简单的构建任务，却可以很棒地使用到 ES6/ES7、Less、Typescript 这些好用的语法和工具呢。