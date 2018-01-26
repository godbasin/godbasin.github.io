---
title: Vue2使用笔记15--自定义的表单组件
date: 2018-01-21 00:05:12
categories: vue八宝粥
tags: 笔记
---

最近在使用 Vue2 作为项目中前端的框架，《Vue2 使用笔记》系列用于记录过程中的一些使用和解决方法。本文记录封装自定义的表单组件的过程。

<!--more-->

## 自定义的表单组件

---

我们在很多场景下，需要对一些表单组件封装一些逻辑，如上一节的日期选择、常见的搜索功能等。本节我们来讲述下一个使用 select2 插件的自定义下拉组件的封装过程吧。

### 自定义事件

每个 Vue 实例都实现了事件接口，即：

* 使用`$on(eventName)`监听事件
* 使用`$emit(eventName)`触发事件

更多的时候，我们会组件封装的时候使用，例如我们这么一个组件，点击会触发 clickMe 事件：

```html
<template>
  <div @click="clickMe">点击我啊</div>
</template>

<script>
export default {
  name: "ClickMe",
  methods: {
    clickMe(){
      this.$emit('clickMe', 11111)
    }
  }
};
</script>
```

我们可以这么去监听这个事件：

```html
<ClickMe @clickMe="dealWithClick($event)" />
```

我们绑定了一个`dealWithClick`的方法，这里传进去的 $event 则是 11111。这是个简单的自定义事件的例子，当然我们也可以直接在父组件里面使用`$on('dealWithClick')`来监听事件。

### 使用自定义事件的表单输入组件

自定义事件可以用来创建自定义的表单输入组件，使用 v-model 来进行数据双向绑定。但其实不管是在 Angular 还是在 Vue 中，双向绑定都只是语法糖。

在 Vue 里，我们常用的 v-model：

```html
<input v-model="something">
```

其实相当于下面的简写：

```html
<input @value="something" @input="something = $event.target.value">
```

所以我们如果需要自定义 v-model，需要做两个事情：

1. 接受一个`value` prop。
2. 在有新的值时触发`input`事件并将新值作为参数。

默认情况下，一个组件的 v-model 会使用`value` prop 和`input`事件。但是诸如单选框、复选框之类的输入类型可能把`value`用作了别的目的。`model`选项可以避免这样的冲突：

```js
Vue.component("my-checkbox", {
  model: {
    prop: "checked", // 绑定的值
    event: "change" // 自定义事件
  },
  props: {
    checked: Boolean,
    // 这样就允许拿 `value` 这个 prop 做其它事了
    value: String
  }
  // ...
});
```

### Select2 组件封装

来来来我们直接看个 Select2 的组件封装：

```html
<template>
  <div>
    <select class="form-control" :placeholder="placeholder" :disabled="disabled"></select>
  </div>
</template>

<script>
export default {
  name: "Select2",
  data() {
    return {
      select2: null
    };
  },
  model: {
    event: "change", // 使用change作为自定义事件
    prop: "value" // 使用value字段，故这里其实不用写也可以
  },
  props: {
    placeholder: {
      type: String,
      default: ""
    },
    options: {
      type: Array,
      default: []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: null
  },
  watch: {
    options(val) {
      // 若选项改变，则更新组件选项
      this.setOption(val);
    },
    value(val) {
      // 若绑定值改变，则更新绑定值
      this.setValue(val);
    }
  },
  methods: {
     setOption(val = []) {
      // 更新选项
      this.select2.select2({ data: val });
      // 若默认值为空，且选项非空，则设置为第一个选项的值
      if (!this.value && val.length) {
        const { id, text } = val[0];
        this.$emit("change", id);
        this.$emit("select", { id, text });
        this.select2.select2("val", [id]);
      }
      // 触发组件更新状态
      this.select2.trigger("change");
    },
    setValue(val) {
      this.select2.select2("val", [val]);
      this.select2.trigger("change");
    }
  },
  mounted() {
    // 初始化组件
    this.select2 = $(this.$el)
      .find("select")
      .select2({
        data: this.options
      })
      .on("select2:select", ev => {
        const { id, text } = ev["params"]["data"];
        this.$emit("change", id);
        this.$emit("select", { id, text });
      });
    // 初始化值
    if (this.value) {
      this.setValue(this.value);
    }
  },
  beforeDestroy() {
    // 销毁组件
    this.select2.select2("destroy");
  }
};
</script>
```

这个组件本骚年也弄了个npm package包包，可以直接安装使用：

``` bash
npm install v-select2-component --save
# 当然你需要安装jquery来正常使用select2
npm install jquery --save
```

你还可以到骚年的git上找：[godbasin/vue-select2](https://github.com/godbasin/vue-select2)

* 页面效果

![image](http://o905ne85q.bkt.clouddn.com/1514984491%281%29.jpg)

## 结束语

---

之前一直以为，Vue中并没有自定义表单的功能。不过如果说Angular里面能使用的飞天入地，相比Vue里面也应该会有才对。
优秀的东西都可以拿来借鉴，其实合作共赢也是个不错的选择，当然竞争也是很激烈滴~
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/vue2-notes/15-custom-v-model)
[此处查看页面效果](http://ofyya1gfg.bkt.clouddn.com/15-custom-v-model/index.html#/app/logs)
