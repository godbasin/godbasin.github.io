---
title: Vue2使用笔记13--添加Promise弹窗
date: 2018-01-14 14:47:03
categories: vue八宝粥
tags: 笔记
---

最近在使用 Vue2 作为项目中前端的框架，《Vue2 使用笔记》系列用于记录过程中的一些使用和解决方法。本文记录添加 Promise 弹窗的过程。

<!--more-->

## 弹窗设计

---

我们原生的`window.confirm()`会阻塞进程，同时也不支持自定义样式。所以我们这里使用自己的弹窗，同时希望以 Promise 的方式来调用。

### 逻辑实现

首先，我们最终想要的效果是：使用 Promise 来调用弹窗确认，通过 resolve 和 reject 的方式来进行确认操作。故我们需要生产以下功能：

1. 一个调用方法，返回一个 Promise。
2. 该方法会触发弹窗，该弹窗为一个组件。
3. 通过 Store 的方式控制弹窗的影藏展示、提示内容等。

### 弹窗调用方法

为了方便拓展性，我们这样操作：

1. setDialog: 可控制按钮的数量和显示，resolve 返回按钮的序号。
2. confirmDialog：在 setDialog 的基础上，封装成常用的 confirm 调用方式。

来看看实现：

```js
import dialogStore from "components/AppDialog/dialogStore";
/*
 * 提示框
 * 
 * 返回Promise，参数index为点击的按钮的索引
 * 
*/
export function setDialog({
  title,
  contents = [],
  buttons = [{ text: "确定", class: "btn-primary" }]
}) {
  // 默认只有一个确定按钮
  return new Promise((resolve, reject) => {
    dialogStore.commit("setDialog", {
      title,
      contents,
      buttons,
      resolve,
      reject
    });
  });
}

// 确认弹窗，点击确定则resolve，其他则reject
export function confirmDialog(content) {
  return new Promise((resolve, reject) => {
    setDialog({
      contents: [content],
      buttons: [
        { text: "确定", class: "btn-primary" },
        { text: "取消", class: "btn-default" }
      ]
    }).then(index => {
      if (index == 0) {
        resolve();
      } else {
        reject();
      }
    });
  });
}

export default setDialog;
```

这里我们主要处理调用的逻辑，而 confirmDialog 多处理了 index 是否为确认按钮的逻辑。更多的时候，我们是通过 dialogStore 来控制弹窗的内容和展示。

### dialogStore

不多说，上码：

```js
import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

const dialogStore = new Vuex.Store({
  state: {
    data: {
      // 展示数据
      title: "",
      contents: [""],
      buttons: [
        {
          text: "确定",
          class: "btn-primary"
        }
      ]
    },
    promise: null // 保存promise
  },
  mutations: {
    // 点击时，promise resolve，并返回点击的button的序号
    click(state, index) {
      $("#confirmModal").modal("hide");
      state.promise.resolve(index);
    },
    // 关闭弹窗，promise reject
    close(state) {
      $("#confirmModal").modal("hide");
      state.promise.reject();
    },
    // 设置弹窗内容，同时显示弹窗
    setDialog(state, { title, contents, buttons, resolve, reject }) {
      // 设置弹窗内容
      state.data = {
        title,
        contents,
        buttons
      };
      // 保存promise
      state.promise = {
        resolve,
        reject
      };
      $("#confirmModal").modal("show");
    }
  }
});

export default dialogStore;
```

我们在 dialogStore 中提供了三个 mutations：

1. 设置弹窗内容，同时显示弹窗。
2. 点击按钮，同时 promise resolve，并返回点击的 button 的 index。
3. 关闭弹窗，同时 promise reject。

其实我们在控制一些内容的时候，使用一个公共的对象也是可以实现的。为什么要用Store呢？因为Store能在模版中使用，这里主要是依赖它来控制弹窗的展示内容，当然我们还可以用各种各样的方式来实现的。

### 弹窗组件

这里我们需要在 Sidebar 上使用到这个用户名，故我们需要在该组件中引入：

```html
<template>
  <div class="modal fade in" id="confirmModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog" role="document" style="margin-top: 200px;">
      <div class="modal-content" >
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title" id="myModalLabel">{{data.title || '请确认'}}</h4>
        </div>
        <div class="modal-body">
          <!-- 多行文字需要 -->
            <p v-for="content in data.contents" :key="content">{{content}}</p>
        </div>
        <div class="modal-footer" v-if="data.buttons && data.buttons.length">
            <!-- 多个按钮需要 -->
            <button v-for="(btn, index) in data.buttons" :key="index" type="button" class="btn" :class="btn.class" @click="clickButton(index)">{{btn.text}}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import dialogStore from "./dialogStore";
export default {
  name: "app-dialog",
  computed: {
    data() {
      return dialogStore.state.data;
    }
  },
  methods: {
    clickButton(index) {
      dialogStore.commit("click", index);
    },
    close() {
      dialogStore.commit("close");
    }
  }
};
</script>
```

当然，我们还需要在最外层注册和引入该组件，这里就不多说了，感兴趣可以参考下源码。

### 弹窗使用

我们在登录页面，添加该弹窗提示。

```js
// Login.vue
import { confirmDialog } from "tools/setDialog";

export default {
  // ...其他配置
  methods: {
    // 登陆事件
    login() {
      const { username, password } = this;
      if (!username || !password) {
        this.error.text = "用户名和密码不能为空";
        this.error.shown = true;
        return;
      }
      confirmDialog(`确定登录？`).then(() => {
        userStore.dispatch("login", { username, password });
        this.$router.push({ name: "App" });
      });
    }
  }
};
```

- 页面效果

![image](http://o905ne85q.bkt.clouddn.com/1514887347%281%29.png)

## 结束语

---

本节我们介绍了使用Promise方式实现弹窗的过程，这里面有个比较尴尬的问题就是，由于全局弹窗只有这么一个，所以如果有二次确认的过程（两个以上弹窗），这样子就不合适啦。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/vue2-notes/13-dialog-component)
[此处查看页面效果](http://ofyya1gfg.bkt.clouddn.com/13-dialog-component/index.html)
