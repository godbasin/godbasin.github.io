---
title: Vue2使用笔记10--路由鉴权
date: 2018-01-06 00:03:42
categories: vue八宝粥
tags: 笔记
---

最近在使用 Vue2 作为项目中前端的框架，《Vue2 使用笔记》系列用于记录过程中的一些使用和解决方法。本文记录给路由添加鉴权的过程。

<!--more-->

## 给路由添加鉴权

---

[Vue router](https://router.vuejs.org/zh-cn/)提供了导航守卫的功能，主要用来通过跳转或取消的方式守卫导航。参数或查询的改变并不会触发进入/离开的导航守卫。

### 全局守卫

这里我们使用全局的守卫，来进行整体的路由鉴权。

使用`router.beforeEach`注册一个全局前置守卫：

```js
import Router from "vue-router";
import routes from "./routes";

Vue.use(Router);

const pageRouter = new Router({
  routes // 路由配置
});

pageRouter.beforeEach((to, from, next) => {
  // 若进入登录页面，则默认不做鉴权
  if (to.name == "Login") {
    next();
  }
  // 其他的来吧鉴权吧
  routerNext(to, from, next);
});
```

这里我们讲一下三个参数：

* `to: Route`: 即将要进入的目标路由对象
* `from: Route`: 当前导航正要离开的路由
* `next: Function`: 一定要调用该方法来`resolve`这个钩子

### 路由配置

我们来调整下路由配置，增加以下三个选项：

* `meta.title`：配置`document.title`，即标签页说明
* `meta.accessRole`：配置允许进入的角色，支持`string`或是`[string]`类型
* `meta.forbidRole`：配置禁止进入的角色，优先级大于`accessRole`，同样支持`string`或是`[string]`类型

同时我们加上个 404 Not Found 和 No Auth 的页面，配置如下：

```js
// routes.js
import App from "../App";
import Services from "components/Services";
import ServiceAdd from "components/ServiceAdd";
import Products from "components/Products";
import Logs from "components/Logs";
import NoAuth from "components/NoAuth";
import NotFound from "components/NotFound";
import Login from "../Login";

export default [
  { path: "/login", component: Login, name: "Login" },
  {
    path: "/app",
    component: App,
    name: "App",
    redirect: "/app/services",
    // 设置子路由
    children: [
      {
        // 服务列表
        path: "services",
        component: Services,
        name: "Services",
        meta: {
          title: "服务列表",
          forbidRole: "visitor"
        }
      },
      {
        // 添加服务
        path: "add/service",
        component: ServiceAdd,
        name: "ServiceAdd",
        meta: {
          title: "添加服务",
          forbidRole: "visitor",
          accessRole: "owner"
        }
      },
      {
        // 修改服务
        path: "edit/service/:id",
        component: ServiceAdd,
        name: "ServiceEdit",
        meta: {
          title: "添加服务",
          forbidRole: "visitor",
          accessRole: ["owner", "maintainer"]
        }
      },
      {
        // 产品列表
        path: "products",
        component: Products,
        name: "Products",
        meta: {
          title: "产品列表"
        }
      },
      {
        // 日志列表
        path: "logs",
        component: Logs,
        name: "Logs",
        meta: {
          title: "日志列表"
        }
      },
      {
        // 无权限
        path: "noauth",
        component: NoAuth,
        name: "NoAuth",
        meta: {
          title: "无权限"
        }
      },
      {
        // 404
        path: "404",
        component: NotFound,
        name: "NotFound",
        meta: {
          title: "404"
        }
      }
    ]
  },
  { path: "*", redirect: { name: "NotFound" } }
];
```

这里的 visitor、maintainer、owner 分别为对应的角色，我们结合一起来看看鉴权的逻辑吧。

### 鉴权逻辑

权限的计算在后面会讲到，我们只需要知道 accessCompute 可根据权限 Map 和角色名单来匹配是否命中。

```js
import accessCompute from "./accessCompute";

// 这里设置了三个角色，我们知道当前维护者为true，代表拥有这个角色
// 在真实项目中，我们通常需要动态拉取这样的权限Map
const operationMap = {
  maintainer: true, // 维护者
  owner: false, // 拥有者
  visitor: false // 访客
};

function routerNext(to, from, next) {
  // 对于命中路由，每个都分别鉴权，有不通过则跳转到No Auth页面
  let matchLen = to.matched.length
  // 从路由最里层开始鉴权
  for (let index = (matchLen - 1); index >= 0; index--) {
    let m = to.matched[index]
    let meta = m.meta
    // 若有配置禁止名单，则检测是否在禁止名单内，在则进入No Auth页面
    // 若无禁止名单，或者不匹配名单，则校验是否在允许进入名单内
    if (meta.forbidRole && accessCompute(operationMap, meta.forbidRole) || !accessCompute(operationMap, meta.accessRole)) {
      next({
        name: 'NoAuth'
      })
      // 若鉴权已不通过，则不进行后续match的鉴权
      return
    }
    // 若设置了title，则切换为设置的title
    if (meta && typeof meta.title != "undefined") {
      document.title = meta.title;
    }
  }

  // 其他则继续通过
  next();
}
```

### 权限计算

这里我们通过获取一个权限列表里的角色拥有，来进行名单命中：

```js
// accessCompute.js
export default function accessCompute(permissionMap, accessKey) {
  //如果没有传鉴权队列，默认通过
  if (!accessKey) {
    return true;
  }
  let access = false;
  let keys = typeof accessKey == "string" ? [accessKey] : [...accessKey];

  // 遍历查询是否有符合的，有一个以上符合则返回true
  // 只有当所有都校验不通过的时候，才返回false
  keys.forEach(key => {
    access = access || permissionMap[key];
  });

  return access;
}
```

### 页面效果

* 进入服务管理->新建(无权限)

![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/%7BE4F2FDE9-E812-4894-B398-4FF7130D5BF3%7D.png)

## 结束语

---

这里面还有一些东西没考虑，就是当我们的权限并不能简单地只用true和false来表示，很多时候会有更复杂的场景。同时，我们需要在路由守卫鉴权前拿到权限Map，针对具体场景来调整吧。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/vue2-notes/10-access-route)
[此处查看页面效果](http://ofyya1gfg.bkt.clouddn.com/10-access-route/index.html#/app/add/service)
