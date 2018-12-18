---
title: Vue2使用笔记17--路由懒加载
date: 2018-01-28 14:06:30
categories: vue八宝粥
tags: 笔记
---

最近在使用 Vue2 作为项目中前端的框架，《Vue2 使用笔记》系列用于记录过程中的一些使用和解决方法。本文记录配置路由懒加载，分块打包文件的过程。

<!--more-->

## 路由懒加载

---

当打包构建应用时，Javascript 包会变得非常大，影响页面加载。如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样就更加高效了。

### Webpack 代码分割功能

这里我们依赖了 Webpack 的代码分割功能，主要通过 require.ensure() 进行代码拆分。

webpack 在编译时，会静态地解析代码中的 require.ensure()，同时将模块添加到一个分开的 chunk 当中。这个新的 chunk 会被 webpack 通过 jsonp 来按需加载。

```js
require.ensure(dependencies: String[], callback: function(require), chunkName: String)
```

几个参数分别如下：

* 依赖`dependencies`
  这是一个字符串数组，通过这个参数，在所有的回调函数的代码被执行前，我们可以将所有需要用到的模块进行声明。

* 回调`callback`
  当所有的依赖都加载完成后，webpack 会执行这个回调函数。require 对象的一个实现会作为一个参数传递给这个回调函数。因此，我们可以进一步 require() 依赖和其它模块提供下一步的执行。

* chunk 名称`chunkName`
  chunkName 是提供给这个特定的 require.ensure() 的 chunk 的名称。通过提供 require.ensure() 不同执行点相同的名称，我们可以保证所有的依赖都会一起放进相同的 文件束(bundle)。

### Vue 异步组件

Vue.js 允许将组件定义为一个工厂函数，异步地解析组件的定义。Vue.js 只在组件需要渲染时触发工厂函数，并且把结果缓存起来，用于后面的再次渲染。

可以将异步组件定义为返回一个 Promise 的工厂函数 (该函数返回的 Promise 应该 resolve 组件本身)：

```js
const Foo = () =>
  Promise.resolve({
    /* 组件定义对象 */
  });
```

结合 Webpack 的代码分割，我们可以这样去定义异步组件：

```js
const Foo = r => require.ensure([], () => r(require("./Foo.vue")), "Foo");
```

所以我们的路由文件将会变成这样：

```js
// router/routes.js
import App from "../App";
const Services = r =>
  require.ensure([], () => r(require("components/Services")), "Services");
const ServiceList = r =>
  require.ensure(
    [],
    () => r(require("components/Services/ServiceList")),
    "ServiceList"
  );
const ServiceEdit = r =>
  require.ensure(
    [],
    () => r(require("components/Services/ServiceEdit")),
    "ServiceEdit"
  );
const Products = r =>
  require.ensure([], () => r(require("components/Products")), "Products");
const ProductList = r =>
  require.ensure(
    [],
    () => r(require("components/Products/ProductList")),
    "ProductList"
  );
const Logs = r =>
  require.ensure([], () => r(require("components/Logs")), "Logs");
const NoAuth = r =>
  require.ensure([], () => r(require("components/NoAuth")), "NoAuth");
const NotFound = r =>
  require.ensure([], () => r(require("components/NotFound")), "NotFound");
import Login from "../Login";
```

### 调整项目配置

由于我们在使用 babel，所以要加个 babel 插件[syntax-dynamic-import](https://babeljs.io/docs/plugins/syntax-dynamic-import/)。

```cmd
npm install --save-dev babel-plugin-syntax-dynamic-import
```

调整配置文件：

```cmd
# .babelrc
{
  "plugins": ["syntax-dynamic-import"]
}
```

另外，如果我们要根据模块名字`chunkName`来生成文件名字的话，还需要在 webpack 配置里面加个调整：

```js
// webpack.prod.conf.js
config = {
  output: {
    // 这里'js/[id].[chunkhash].js'换成'js/[name].[chunkhash].js'
    chunkFilename: utils.assetsPath("js/[name].[chunkhash].js")
  }
};
```

打包后，生成的文件如下：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1515581250%281%29.png)

大家会发现，除了我们上面单独打包的文件，还有：

* app
  我们正常的 bundle 文件，这里因为使用了`filename: utils.assetsPath('js/[name].[chunkhash].js')`命名，所以我们会根据 entries 名字 app 来命名。
* vendor
  使用 CommonsChunkPlugin 打包生成的文件。允许我们从不同的 bundle 中提取所有的公共模块，并且将他们加入公共 bundle 中。

在最终打包的页面中，我们能看到，当我们点击某个模块的时候，才会异步请求对应的 bundle 文件：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1515582002%281%29.png)

## 结束语

---

关于代码的打包和分割，不仅能减轻应用运行的负荷，还能在一定程度上方便我们进行维护。如果说我们需要远程定位一些问题，分块的打包还是有帮助的呢。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/vue2-notes/17-lazyload-chunk)
[此处查看页面效果](http://vue2-notes.godbasin.com/17-lazyload-chunk/index.html#/app/logs)
