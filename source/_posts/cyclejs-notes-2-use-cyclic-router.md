---
title: Cycle.js学习笔记2--使用cyclic-router来启动路由
date: 2017-08-27 12:28:40
categories: cyclejs哈根达斯
tags: 笔记
---
因为对Rxjs的好感玩上了Cycle.js，《Cycle.js学习笔记》系列用于记录使用该框架的一些笔记。
本文记录使用cyclic-router来启动页面路由的过程。
<!--more-->

## 启用页面路由
---
### [cyclic-router](https://github.com/cyclejs-community/cyclic-router)
cyclic-router是为Cycle.js设计的路由驱动。

- 安装模块：

``` cmd
npm install --save cyclic-router switch-path
```

这里面我们直接使用了官方推荐的[`switch-path`](https://github.com/staltz/switch-path)，它提供路由匹配功能。
cyclic-router在V3和V4版本是需要注入路由匹配模块，而在V2版本前是内置`switch-path`，则不需要安装。

更多关于cyclic-router大家可以参考[github--cyclic-router](https://github.com/cyclejs-community/cyclic-router)。

### 路由入口
我们将在启动主入口`run()`的时候添加进路由：

``` js
import {run} from '@cycle/run'
import xs from 'xstream';
import {makeDOMDriver} from '@cycle/dom';
import {makeRouterDriver} from 'cyclic-router';
// 这里我们使用hash锚做路由，故使用createHashHistory替代createBrowserHistory
import {createHashHistory} from 'history';
import switchPath from 'switch-path';  // Required in v3, not required in v2 or below 
import {AppComponent} from './app'
import {LoginComponent} from './login'

function main(sources) {
  // 设置路由匹配规则
  // 这里需要注意的是，必须有跟路由'/'，否则将会报错：
  const match$ = sources.router.define({
    '/login': LoginComponent,
    '/app': AppComponent,
    '*': LoginComponent
  });
  
  // 匹配路由后处理
  const page$ = match$.map(({path, value}) => {
    return value(Object.assign({}, sources, {
      router: sources.router.path(path)
    }));
  });
  
  return {
    // 匹配路由后获取DOM作为流
    DOM: page$.map(c => c.DOM).flatten(), 
    // 匹配路由后获取对应的router作为流，为空则设置''
    // 然后flatten()将多个流抚平
    router: xs.merge(page$.map(c => c.router).filter(x => x || '').flatten()),
  };
}

run(main, {
  DOM: makeDOMDriver('#app'),
  router: makeRouterDriver(createHashHistory(), switchPath)  // v3
  // router: makeRouterDriver(createHistory()) // <= v2
});
```

### 添加登陆页面跳转
这里我们添加一个登陆页面，主要用于登陆后路由跳转：

``` js
import { html } from 'snabbdom-jsx';
import xs from 'xstream';

export function LoginComponent(sources) {
    const domSource = sources.DOM;
    // 添加点击事件流
    const loginClick$ = domSource.select("#submit").events("click");

    // 添加html流
    const loginView$ = xs.merge().startWith(
        <form>
            <h1>System</h1>
            <div><input type="text" placeholder="username" /></div>
            <div><input type="password" placeholder="password" /></div>
            <div><button>Login</button></div>
        </form>
    );
    return {
        DOM: loginView$,
        router: xs.merge(
            // 点击事件将流转为'/app'
            loginClick$.mapTo("/app")
        ),
    };
}
```

跳转这个功能，本骚年可能尝试了无数遍，终于发现并不是登录页面的路由有问题，而是主入口的路由：

``` js
return {
    DOM: page$.map(c => c.DOM).flatten(),
    // 官方文档这个坑，这样写的话，是无法获取页面里面的router流了
    // 这只是设置了个初始的流，匹配到'/other'路由
    router: xs.of('/other'),
};
```

经过深思熟虑之后，本骚年这样使用：

``` js
return {
    DOM: page$.map(c => c.DOM).flatten(), 
    // 匹配路由后获取对应的router作为流，为空则设置''
    // 然后flatten()将多个流抚平
    router: xs.merge(page$.map(c => c.router).filter(x => x || '').flatten()),
};
```

终于成功啦。

## 结束语
-----
这节主要讲了使用cyclic-router来搭建路由，实现路由匹配和页面跳转等功能。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/cyclejs-notes/2-use-cyclic-router)
[此处查看页面效果](http://cyclejs-notes.godbasin.com/2-use-cyclic-router/index.html)