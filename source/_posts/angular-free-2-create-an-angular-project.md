---
title: 玩转Angular1(2)--搭建angular项目
date: 2017-02-11 11:54:19
categories: angular混搭
tags: 笔记
---
AngularJS(v1.5.8)已经成为项目们的基本框架，《玩转Angular1》系列用于记录项目中的一些好玩或者比较特别的思路。
本文记录用简单搭建angular项目的过程。
<!--more-->
## 启动文件
-----
### bootstrap.js
上一节[《玩转Angular1(1)--webpack/babel环境配置》](/2017/02/05/angular-free-1-webpack-and-babel-config/)中，我们在webpack中设置了webpack入口，为`app/bootstrap.js`文件。
这里我们创建文件夹app，然后新建文件`app/bootstrap.js`：

``` javascript
// bootstrap.js

// 注入babel-polyfill
require('babel-polyfill');

// 注入angular相关配置，如路由等
import app from './app.js';

// 获取angular相关依赖
const angular = require('angular');
const ngRoute = require('angular-route');
const uiRouter = require('angular-ui-router');

// 注入angular相关依赖
const dependencies = [
    ngRoute,
    uiRouter,
];

// 获取angular的app
const ngModule = angular.module('AngularFree', dependencies);

// 进行angular相关配置
app(ngModule, angular);

// 启动应用
angular.bootstrap(document, ['AngularFree']);
```

这里我们把启动应用单独提取出来了，这样有个好处，像我们项目中会需要提供一份前端配置的json文件，像配置一些模块显示、功能开关等，这样就可以进行异步加载后进行启动啦。
例如，我们的文件为`config.json`，我们上面启动应用的代码就可以是：

``` javascript
// 这里用jquery写，当然大家可以自由发挥
$.get("config.json", (config) =>{
    // 获取相关配置
    // 启动应用
    angular.bootstrap(document, ['AngularFree']);
}, false);
```

大家还看到有个`app.js`文件的注入，不着急，马上讲。

### app.js
`app.js`文件主要用于angular应用的相关配置，像一些全局http参数配置、路由配置等等。

``` javascript
// app.js
export default (ngModule, angular) => {
    ngModule.config(['$stateProvider', '$compileProvider', '$httpProvider', function ($stateProvider, $compileProvider, $httpProvider) {
        $compileProvider.debugInfoEnabled(true);

        // 未登录则跳转至登录页
        if (!sessionStorage.getItem('username') && location.href.indexOf('login') === -1) {
            location.href = 'index.html#/login';
        }

        // ui-router路由的参数
        const routerStates = [{
            name: 'login',
            url: '/login',
            templateUrl: require('file?name=[path][name].[ext]!./modules/login/login.template.html')
        }];

        // ui-router路由设置
        routerStates.forEach(stateParams => {
            $stateProvider.state(stateParams);
        });
    }]);
};
```
可知，我们的应用主要入口是登陆页面，设置了自动跳转，以及配置了登陆页面的路由。
这里我们并没有给路由添加controller，目前只是配置了个模板界面而已。

## 页面模板
---
### index.html
作为整个界面的模板入口：

``` html
<!doctype html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!-->
<html class="no-js">
<!--<![endif]-->

<head>
    <meta charset="utf-8">
    <meta name="renderer" content="webkit"> 
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>AngularFree</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width">
    <meta http-equiv="Access-Control-Allow-Origin" content="*">
    <!-- Bootstrap -->
    <link href="./gentelella/lib/css/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="./gentelella/lib/css/font-awesome/css/font-awesome.min.css" rel="stylesheet">
    <!-- NProgress -->
    <link href="./gentelella/lib/css/nprogress.css" rel="stylesheet">
    <!-- jQuery custom content scroller -->
    <link href="./gentelella/lib/css/jquery.mCustomScrollbar.min.css" rel="stylesheet" />
    <!-- iCheck -->
    <link href="./gentelella/lib/css/iCheck/green.css" rel="stylesheet">
    <!-- Select2 -->
    <link href="./gentelella/lib/css/select2.min.css" rel="stylesheet">
    <!-- Switchery -->
    <link href="./gentelella/lib/css/switchery.min.css" rel="stylesheet">
    <!-- starrr -->
    <link href="./gentelella/lib/css/starrr.css" rel="stylesheet">
    <!-- Datatables -->
    <link href="./gentelella/lib/css/dataTables.bootstrap.min.css" rel="stylesheet">
    <link href="./gentelella/lib/css/buttons.bootstrap.min.css" rel="stylesheet">
    <link href="./gentelella/lib/css/fixedHeader.bootstrap.min.css" rel="stylesheet">
    <link href="./gentelella/lib/css/responsive.bootstrap.min.css" rel="stylesheet">
    <link href="./gentelella/lib/css/scroller.bootstrap.min.css" rel="stylesheet">

    <!-- PNotify -->
    <link href="./gentelella/lib/css/pnotify.css" rel="stylesheet">
    <link href="./gentelella/lib/css/pnotify.buttons.css" rel="stylesheet">
    <link href="./gentelella/lib/css/pnotify.nonblock.css" rel="stylesheet">

    <!-- Custom Theme Style -->
    <link href="./gentelella/build/css/custom.css" rel="stylesheet">
    <link href="./gentelella/build/css/common.css" rel="stylesheet">
    <!-- endbuild -->
</head>

<body scroll='scroll'>
    <section ui-view class="main-router"></section>
    <!--[if lt IE 7]>
      <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
    <![endif]-->
    <!-- jQuery -->
    <script src="./gentelella/lib/js/jquery.min.js"></script>
    <script src="./gentelella/lib/js/jquery.form.min.js"></script>
    <!-- Bootstrap -->
    <script src="./gentelella/lib/js/bootstrap.min.js"></script>
    <!-- bootstrap-daterangepicker -->
    <script src="./gentelella/lib/js/moment.min.js"></script>
    <script src="./gentelella/lib/js/daterangepicker.js"></script>
    <!-- FastClick -->
    <script src="./gentelella/lib/js/fastclick.js"></script>
    <!-- NProgress -->
    <script src="./gentelella/lib/js/nprogress.js"></script>
    <!-- jQuery custom content scroller -->
    <script src="./gentelella/lib/js/jquery.mCustomScrollbar.concat.min.js"></script>
    <!-- iCheck -->
    <script src="./gentelella/lib/js/icheck.min.js"></script>
    <!-- jQuery Tags Input -->
    <script src="./gentelella/lib/js/jquery.tagsinput.js"></script>
    <!-- Switchery -->
    <script src="./gentelella/lib/js/switchery.min.js"></script>
    <!-- Select2 -->
    <script src="./gentelella/lib/js/select2.full.min.js"></script>
    <!-- Parsley -->
    <script src="./gentelella/lib/js/parsley.min.js"></script>
    <!-- Autosize -->
    <script src="./gentelella/lib/js/autosize.min.js"></script>
    <!-- NProgress -->
    <script src="./gentelella/lib/js/nprogress.js"></script>
    <!-- bootstrap-progressbar -->
    <script src="./gentelella/lib/js/bootstrap-progressbar.min.js"></script>
    <!-- Datatables -->
    <script src="./gentelella/lib/js/jquery.dataTables.min.js"></script>
    <script src="./gentelella/lib/js/dataTables.bootstrap.min.js"></script>
    <script src="./gentelella/lib/js/dataTables.buttons.min.js"></script>
    <script src="./gentelella/lib/js/buttons.bootstrap.min.js"></script>
    <script src="./gentelella/lib/js/buttons.flash.min.js"></script>
    <script src="./gentelella/lib/js/buttons.html5.min.js"></script>
    <script src="./gentelella/lib/js/buttons.print.min.js"></script>
    <script src="./gentelella/lib/js/dataTables.fixedHeader.min.js"></script>
    <script src="./gentelella/lib/js/dataTables.keyTable.min.js"></script>
    <script src="./gentelella/lib/js/dataTables.responsive.min.js"></script>
    <script src="./gentelella/lib/js/responsive.bootstrap.js"></script>
    <script src="./gentelella/lib/js/dataTables.scroller.min.js"></script>
    <script src="./gentelella/lib/js/jszip.min.js"></script>
    <script src="./gentelella/lib/js/pdfmake.min.js"></script>
    <script src="./gentelella/lib/js/vfs_fonts.js"></script>

    <!-- PNotify -->
    <script src="./gentelella/lib/js/pnotify.js"></script>
    <script src="./gentelella/lib/js/pnotify.buttons.js"></script>
    <script src="./gentelella/lib/js/pnotify.nonblock.js"></script>

    <!-- Custom Theme Scripts -->
    <script src="./gentelella/build/js/common.js"></script>
    <script src="./entry/vendors.js"></script>
    <script src="./entry/bundle.js"></script>
</body>

</html>
```

这里，我们同样的使用后台管理模板[gentelella](https://github.com/puikinsh/gentelella)。

由于木有提供npm依赖，这些静态文件我们也就只能手动引入啦，所以`index.html`文件中会有一大堆的js和css文件呢。

当然也包括我们生成的`vendors.js`和`bundle.js`文件。

### login.template.html
关于文件组织的管理，后面或许我们可以讨论一下，目前的话，我们将模块相关的模板和逻辑、控制器等根据路由在`modules`文件夹下进行管理，而剩余公用的部分则在`shared`文件夹下进行分类。
目前的文件如图：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1484902174%281%29.png)

我们的login则作为单独的路由，自己有一个`login`文件夹，现在里面只有一个模板文件`login.template.html`：

``` html
<div>
    <a class="hiddenanchor" id="signup"></a>
    <a class="hiddenanchor" id="signin"></a>

    <div class="login_wrapper">
        <div class="animate form login_form">
            <section class="login_content">
                <form>
                    <h1>管理系统</h1>
                    <div>
                        <input type="text" class="form-control" placeholder="用户名" ng-model="username" required="" />
                    </div>
                    <div>
                        <input type="password" class="form-control" placeholder="密码" ng-model="password" required="" />
                    </div>
                    <div>
                        <a class="btn btn-default submit" type="submit">登录</a>
                    </div>

                    <div class="clearfix"></div>

                </form>
            </section>
        </div>

    </div>
</div>
<script>
    // 这里使用点小技巧来调整样式，是的本骚年很懒。。
    $('body').attr('class', 'login');
</script>
```

到这里，我们的项目已经基本搭建ok了呢。此时通过命令`npm run webpack`和`npm run webpack-dev-server`就可以启用环境啦，在[http://localhost:9999](http://localhost:9999)就能看到效果了。
如图：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1484902936%281%29.png)

## 打包
---
### shell脚本打包
我们可以写个简单的打包脚本`publish.sh`，用于打包发布，如下：

``` shell
# clean app/entry
rm -rf app/entry

# webpack build
webpack --config webpack.config.js

# clean build
rm -rf build
mkdir build

# copy to build
cp -r app/entry build/entry
cp -r app/gentelella build/gentelella
cp app/index.html build/index.html
# cp app/config.json build/config.json

# generate zip file
# zip -r build.zip build

# clean up build
# rm -rf build
```

当然我们也可以通过shelljs来写这个脚本，总之怎么方便怎么来吧。

## 结束语
-----
这节主要讲了简单搭建个angular项目的一些较详细的步骤。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular-free/2-create-an-angular-project)
[此处查看页面效果](http://angular-free.godbasin.com/2-create-an-angular-project/index.html)
