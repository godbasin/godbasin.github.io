---
title: Vue2使用笔记16--自定义指令
date: 2018-01-27 00:02:07
categories: vue八宝粥
tags: 笔记
---

最近在使用 Vue2 作为项目中前端的框架，《Vue2 使用笔记》系列用于记录过程中的一些使用和解决方法。本文记录开发自定义指令的过程。

<!--more-->

## 自定义指令

---

和Angular一样，Vue也支持自定义指令。通常我们会在需要给某个元素添加简单的事件处理逻辑的时候，会使用到自定义指令。

### 聚焦例子
我们先来看[官方文档](https://cn.vuejs.org/v2/guide/custom-directive.html)中的一个表单自动聚焦的例子：

``` js
// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})
```

然后我们可以在模板中任何元素上使用新的 v-focus 属性：

```html
<input v-focus>
```

当然，跟components、filter等一致，directive也支持局部添加，这里也不多说。

### 钩子函数

我们的指令定义对象有一下的钩子函数 (均为可选)：
- `bind`：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
- `inserted`：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
- `update`：所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，也可能没有。需要通过比较更新前后的值来忽略不必要的模板更新。
- `componentUpdated`：指令所在组件的 VNode 及其子 VNode 全部更新后调用。
- `unbind`：只调用一次，指令与元素解绑时调用。常常用来解除一些事件的绑定、或者定时器的清除等。

每个钩子函数都能拿到下面的一些参数：
- `el`：指令所绑定的元素，可以用来直接操作 DOM 。
- `binding`：一个对象，包含以下属性：
  - `name`：指令名，不包括 v- 前缀。
  - `value`：指令的绑定值，例如：`v-my-directive="1 + 1"` 中，绑定值为 2。
  - `oldValue`：指令绑定的前一个值，仅在 update 和 componentUpdated 钩子中可用。无论值是否改变都可用。
  - `expression`：字符串形式的指令表达式。例如 `v-my-directive="1 + 1"` 中，表达式为 `"1 + 1"`。
  - `arg`：传给指令的参数，可选。例如 `v-my-directive:foo` 中，参数为 "foo"。
  - `modifiers`：一个包含修饰符的对象。例如：`v-my-directive.foo.bar` 中，修饰符对象为 `{ foo: true, bar: true }`。
- `vnode`：Vue 编译生成的虚拟节点，参考[VNode class declaration](https://github.com/vuejs/vue/blob/dev/src/core/vdom/vnode.js)。
- `oldVnode`：上一个虚拟节点，仅在 update 和 componentUpdated 钩子中可用。

### 编写v-click-outside指令
又是很常见的一个使用，点击某个元素的外面时，执行一些操作（常见关闭某些元素）。

```js
Vue.directive("click-outside", {
  bind: function(el, binding, vnode) {
    el.event = function(event) {
      // 检查点击是否发生在节点之内（包括子节点）
      if (!(el == event.target || el.contains(event.target))) {
        // 如果没有，则触发调用
        // 若绑定值为函数，则执行
        if(typeof vnode.context[binding.expression] == 'function'){
            vnode.context[binding.expression](event);
        }
      }
    };
    // 绑定事件
    // 设置为true，代表在DOM树中，注册了该listener的元素，会先于它下方的任何事件目标，接收到该事件。
    document.body.addEventListener("click", el.event, true);
  },
  unbind: function(el) {
    // 解绑事件
    document.body.removeEventListener("click", el.event, true);
  }
});
```

这里我们可以通过钩子函数中的`vnode.context`，来获取当前组件的作用域，参考[VNode class declaration](https://github.com/vuejs/vue/blob/dev/src/core/vdom/vnode.js)。

我们可以这样使用：

```html
<template>
	<div>
    <div class="row" style="margin-left: 20px;">
      <label class="mr5" style="font-size: 14px;">下拉菜单</label>
      <div class="btn-group" v-click-outside="closeMenu">
        <button type="button" class="btn btn-default dropdown-toggle" @click="isMenuShown = !isMenuShown">
            点击 <span class="caret"></span>
        </button>
        <ul v-show="isMenuShown" class="dropdown-menu" style="display:block;">
          <li><a href="#">Action</a></li>
          <li><a href="#">Another action</a></li>
          <li><a href="#">Something else here</a></li>
          <li role="separator" class="divider"></li>
          <li><a href="#">Separated link</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Logs",
  data() {
    return {
      isMenuShown: false
    };
  },
  methods: {
    closeMenu(ev){
      console.log({ev})
      this.isMenuShown = false
    }
  }
};
</script>
```

这里有个需要注意的地方是，这种带条件判断的逻辑，我们需要绑定函数来使用。
因为我们在自定义指令的时候，我们的钩子函数参数里面包括`value`指令的绑定值，也就是说，指令会执行求值操作。

如果我们直接绑定表达式的话，则每次触发都会求值，并不能跟进条件判断是否求值。

## 结束语

---

自定义指令其实也是一个很有用的工具，不管在Angular还是在Vue中，我们对一些可复用性的逻辑封装起来使用，能提升不少的工作效率。
像一些表单校验、输入控制等等，很多功能可以通过自定义指令来实现哒~
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/vue2-notes/16-custom-directive)
[此处查看页面效果](http://vue2-notes.godbasin.com/16-custom-directive/index.html#/app/logs)
