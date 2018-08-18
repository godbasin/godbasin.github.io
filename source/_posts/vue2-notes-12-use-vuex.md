---
title: Vue2使用笔记12--使用vuex
date: 2018-01-13 00:01:46
categories: vue八宝粥
tags: 笔记
---

最近在使用 Vue2 作为项目中前端的框架，《Vue2 使用笔记》系列用于记录过程中的一些使用和解决方法。本文记录使用 vuex，并进行登录检测的过程。

<!--more-->

## Vuex

---

[Vuex](https://vuex.vuejs.org/zh-cn/intro.html)是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。

### Vuex 使用

Vuex 使用单一状态树，即用一个对象就包含了全部的应用层级状态。

Vuex 主要在什么时候用呢？

1. 当我们一些数据需要共享的时候，例如用户信息，可能会在多个组件中使用到的。
2. 一些 ajax 请求的数据，可通过 action 来触发请求，完成后更新到 state，页面可直接更新。

至于 Vuex 的使用方式和管理模式多种多样，如：

1. 根据 Vuex 的核心概念分文件管理，像把所有的 action 放一起管理、mutation 放一起。
2. 根据业务功能分文件管理，相似业务数据维护在一个 store 中。

本骚年更趋向第二种。

### 添加 Store

这里我们添加个 Store，用来保存登录用户信息。

当然首先需要安装一下依赖：

```bash
npm install vuex --save
```

主要用于保存用户名，来判断是否已登录、展示在菜单侧（通常来说是否登录应该使用 cookie 等方式来进行，这里只是做个简单的示例）。

```js
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

let store = new Vuex.Store({
  state: {
    username: ""
  },
  mutations: {
    setUserName(state, username) {
      state.username = username;
    }
  },
  actions: {
    // 登入，保存用户名
    login({ commit, dispatch, state }, params = {}) {
      commit("setUserName", params.username);
    },
    // 登出，清除用户名
    logout({ commit, dispatch }) {
      commit("setUserName", "");
    }
  }
});

export default store;
```

### 使用 Store

这里我们需要在 Sidebar 上使用到这个用户名，故我们需要在该组件中引入：

```js
// Sidebar.vue
import userStore from "stores/userStore";

export default {
  // ...其他配置
  computed: {
    username() {
      return userStore.state.username;
    }
  }
};
```

同时我们的模版中则可以直接使用：

```html
<h2><span>欢迎回来, </span> {{username}}</h2>
```

### 登录检测

这里我们加个简单的判断，若在 Store 中保存了用户名，则视为已登录。

```js
// Sidebar.vue
import userStore from "stores/userStore";

export default {
  // ...其他配置
  computed: {
    username() {
      return userStore.state.username;
    }
  },
  created() {
    // 判断无用户名，则视为未登录，则跳转登录页面
    if (!this.username) {
      this.$router.push({ name: "Login" });
    }
  }
};
```

聪明的你是否发现了一些问题？没错，因为我们用户信息保存在 Store 中，所以当我们刷新页面的时候，是不会保留这些数据的，表现为每次登录进入应用后，刷新会回到登录页面。

所以我们可以采取存到 sessionStorage 的方式，使用 sessionStorage 的话其实也没必要使用 Store，所以这里就不多说啦。

### 页面效果

说是页面效果，其实就是多了个登录之后的用户名显示而已：

![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1514884155%281%29.png)

## 结束语

---

这里我们简单使用了Vuex，添加了个保存用户信息的userStore，在业务中我们常常会遇到很多不同的功能数据。
而对于Store的管理，很多时候也是需要思考的地方。不过在项目还没有很大的时候，够用就好啦。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/vue2-notes/12-use-vuex)
[此处查看页面效果](http://ofyya1gfg.bkt.clouddn.com/12-use-vuex/index.html#/app/add/service)
