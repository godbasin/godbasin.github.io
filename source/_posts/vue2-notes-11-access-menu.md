---
title: Vue2使用笔记11--菜单鉴权
date: 2018-01-07 00:12:15
categories: vue八宝粥
tags: 笔记
---

最近在使用 Vue2 作为项目中前端的框架，《Vue2 使用笔记》系列用于记录过程中的一些使用和解决方法。本文记录将路由与菜单结合，对部分菜单不显示的逻辑实现。

<!--more-->

## 路由嵌套的调整

---

前面我们在搭建整个应用的时候，路由和菜单的配置是分离的，这里我们要实现使用一个配置文件来同时控制菜单和路由。首先我们根据整个应用，来将路由进行嵌套转换。

### 嵌套路由

我们的应用界面，由多层嵌套的组件组合而成。同样地，URL 中各段动态路径也按某种结构对应嵌套的各层组件。

这里根据菜单我们能获取到层级结构：

```bash
│
├── 服务管理/
│   ├── 服务信息
│   ├── 新建
│   └── 编辑 # 隐藏菜单
│  
├── 产品管理/
│   └── 产品信息
│
├── 日志管理
├── 404页面 # 隐藏菜单
└── No Auth页面 # 隐藏菜单
```

可以看到，我们路由的配置，要完全转换成菜单的配置，需要进行以下处理：

1. 路由嵌套调整。
2. 提供部分路由在菜单中隐藏的功能。

调整后我们的菜单配置：

```javascript
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
          title: "服务管理",
          icon: "fa-home"
        },
        redirect: "/services/list",
        children: [
          {
            // 服务列表
            path: "list",
            component: ServiceList,
            name: "ServiceList",
            meta: {
              title: "服务信息"
            }
          },
          {
            // 添加服务
            path: "add",
            component: ServiceEdit,
            name: "ServiceAdd",
            meta: {
              title: "新建",
              forbidRole: "visitor",
              accessRole: "owner"
            }
          },
          {
            // 修改服务
            path: "edit/:id",
            component: ServiceEdit,
            name: "ServiceEdit",
            hideNav: true,
            meta: {
              title: "修改",
              forbidRole: "visitor",
              accessRole: ["owner", "maintainer"]
            }
          }
        ]
      },
      {
        // 产品列表
        path: "products",
        component: Products,
        name: "Products",
        meta: {
          title: "产品管理",
          icon: "fa-cubes"
        },
        redirect: "/products/list",
        children: [
          {
            // 修改服务
            path: "list",
            component: ProductList,
            name: "ProductList",
            meta: {
              title: "产品信息"
            }
          }
        ]
      },
      {
        // 日志管理
        path: "logs",
        component: Logs,
        name: "Logs",
        meta: {
          title: "日志管理",
          icon: "fa-file-o"
        }
      },
      {
        // 无权限
        path: "noauth",
        component: NoAuth,
        name: "NoAuth",
        hideNav: true,
        meta: {
          title: "无权限"
        }
      },
      {
        // 404
        path: "404",
        component: NotFound,
        name: "NotFound",
        hideNav: true,
        meta: {
          title: "404"
        }
      }
    ]
  },
  { path: "*", redirect: { name: "NotFound" } }
];
```

可见，我们使用了`hideNav`该参数来对需要的菜单进行隐藏。

### 文件路径调整

由于使用了路由嵌套，为了方便理解和管理，我们对相关的文件也调整了下位置:

![image](http://o905ne85q.bkt.clouddn.com/1514790077%281%29.png)

至于每个文件夹里的`index.vue`，则是一个简单的路由内容展示：

```html
<template>
	<router-view></router-view>
</template>

<script>
export default {};
</script>
```

## Sidebar 调整

前面我们使用单独的配置选项，来控制菜单的层次展示、路由跳转，现在我们要直接从路由配置里面获取这样的信息：

```js
import routes from "../router/routes";
import accessCompute from "../router/accessCompute";
import { operationMap } from "../router";

export default {
  // ...其他的调整不在这里展示，具体可以参考源码
  mounted() {
    const menuList = [];
    // 我们的菜单位于App路由中，即routes[1].children
    const menuRoutes = routes[1].children;
    menuRoutes.forEach((item, index) => {
      if (item.hideNav) {
        // 设置了菜单影藏的父路由不添加进菜单
        return;
      } else {
        // 若有配置禁止名单，则检测是否在禁止名单内，在则不添加进菜单
        // 若无禁止名单，或者不匹配名单，则校验是否在允许进入名单内
        if (
          !(
            item.meta.forbitRole &&
            accessCompute(operationMap, item.meta.forbitRole)
          ) &&
          accessCompute(operationMap, item.meta.accessRole)
        ) {
          if (item.children) {
            const children = [];
            item.children.forEach(x => {
              // 子菜单也做一样的鉴权过滤
              // 同时设置了菜单隐藏的不添加
              if (
                !(
                  x.meta.forbitRole &&
                  accessCompute(operationMap, x.meta.forbitRole)
                ) &&
                accessCompute(operationMap, x.meta.accessRole) &&
                !x.hideNav
              ) {
                children.push(x);
              }
            });
            item.children = children;
          }
          // 父菜单添加默认的class为空，用来兼容原本的菜单逻辑
          menuList.push({ ...item, class: "" });
        }
      }
    });
    this.menus = menuList;
  }
};
```

这里面由于部分配置参数的调整，我们对其他的逻辑主要修改：

1. 模板里绑定的参数调整。
2. 路由跳转，从使用`string`调整为`{name: menu.name}`。
3. 检测一级菜单是否激活的逻辑，使用`matched`属性和`name`进行匹配。

检测的部分调整如下：

```js
checkMenuActived(name) {
  // 遍历所有的一级菜单
  const matched = this.$route.matched;
  this.menus.forEach(item => {
    // 检查是否匹配
    let isMatch = false;
    matched.forEach(x => {
      if (item.name && item.name == x.name) {
        isMatch = true;
      }
    });
    // 若非当前路由，则取消激活状态
    if (!isMatch) {
      item.class = "";
    }
  });
}
```

### 页面效果

* 作为 owner 角色进入看到菜单：

![image](http://o905ne85q.bkt.clouddn.com/1514791214%281%29.png)

* 作为 maintainer 角色进入看到菜单：

![image](http://o905ne85q.bkt.clouddn.com/1514791290%281%29.png)

## 结束语

---

本节我们将菜单的显示关联至路由，后面我们每添加一个页面，就可以自动生成菜单啦。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/vue2-notes/11-access-menu)
[此处查看页面效果](http://ofyya1gfg.bkt.clouddn.com/11-access-menu/index.html#/app/add/service)
