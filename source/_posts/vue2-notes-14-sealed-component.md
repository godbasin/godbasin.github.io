---
title: Vue2使用笔记14--Datetimepicker组件封装
date: 2018-01-20 23:01:37
categories: vue八宝粥
tags: 笔记
---

最近在使用 Vue2 作为项目中前端的框架，《Vue2 使用笔记》系列用于记录过程中的一些使用和解决方法。本文记录简单封装组件的过程。

<!--more-->

## 组件封装

---

在 MVVM 框架盛行的今天，组件封装的思维必不可少。不管是 Angular、Vue、React，还是又新兴的一些框架，我们在写代码的过程中，老生常谈的都是抽象和封装这样的事情。

### 组件的自我修养

这里，我们在封装 Datetimepicker 的时候，主要是要把这种可重复使用的组件提取的思维，给发散到各个地方。

前面我们在使用一些插件的时候，更多的是在页面和业务逻辑中封装一些方法，方便使用，像这几个：

```js
// 设置iCheck插件初始化
SetICheck(that);
// 设置switchery插件初始化
SetSwitchery(that);
// 设置daterangepicker插件初始化
SetDaterangepicker(that, "#single_cal3");
```

但是，其实我们也可以将逻辑结合视图部分，一起封装成一个组件。
通常来说，一个组件的自我修养包括以下内容：
- 组件内维护自身的数据和状态
- 组件内维护自身的事件
- 通过初始化事件（event、绑定的scope事件，传入数据），来初始化组件状态，激活组件
- 通过更改某个配置，来控制展示
- 通过对外提供接口，可查询组件状态

如上，作为一个独立的组件，我们需要提供与外界交互的接口。

同时，我们在设计一个组件时，需要考虑视图配置，来适应不同场景的使用，例如：
- 通过某个属性配置某个部分是否显示
- 通过一个属性配置需要显示的所有部分
- 通过传入初始值进行相关显示控制

这些都是基本的配置化思想，与组件结合使用会有很不错的效果。

### Datetimepicker 组件封装
首先，我们使用的插件是[bootstrap-datetimepicker](http://www.bootcss.com/p/bootstrap-datetimepicker/)。
更多的配置项，可以参考官方文档，这里我们直接看代码吧。

```html
<template>
  <input type="text" class="form-control form-input" :placeholder="placeholder" :value="date" style="position: relative;">
</template>

<script>

export default {
  name: "Datetimepicker",
  data() {
    return {
      date: ""
    };
  },
  props: {
    placeholder: { // 占位提示
      type: String,
      default: ""
    },
    format: { // 格式化日期时间
      type: String,
      default: "yyyy-mm-dd hh:ii:ss"
    },
    minView: { // 最小视图
      type: Number,
      default: 0
    },
    startView: { // 起始视图
      type: Number,
      default: 2
    },
    maxView: { // 最大视图
      type: Number,
      default: 4
    },
    startDate: { // 最早可选时间
      type: Date,
      default: null
    },
    endDate: { // 最晚可选时间
      type: Date,
      default: null
    },
    defaultDate: { // 默认时间
      type: String,
      default: ''
    }
  },
  mounted() {
    // 设置默认时间
    this.date = this.defaultDate
    // 初始化表单事件
    $(this.$el)
      .datetimepicker({
        language: "zh-CN",
        format: this.format,
        autoclose: true,
        startView: this.startView,
        minView: this.minView,
        maxView: this.maxView,
        startDate: this.startDate,
        endDate: this.endDate
      })
      .on("hide", ev => {
        this.date = $(ev.target).val();
        // 触发change事件
        this.$emit("change", this.date);
      });
  },
  beforeDestroy() {
    // 销毁
    $(this.$el)
      .datetimepicker("remove");
  }
};
</script>
```

是不是很简单，其实Vue提供的封装功能也是很方便的。
组件化和配置化思想，不应该局限于框架，应该是要发散到各个地方的。

### 使用Datetimepicker组件
封装过后，我们使用起来就是很简单的事情了，只需要两个步骤：
1. 引入组件（全局或局部）。

``` js
// main.js 全局引入
import Datetimepicker from 'components/Datetimepicker'

Vue.component('Datetimepicker', Datetimepicker)

// ...其他配置

new Vue({
    // ...
}).$mount('#app')
```

2. 使用组件，绑定配置和事件。

``` html
<Datetimepicker :defaultDate="new Date().format('yyyy-MM-dd')" :endDate="new Date()" :format="'yyyy-mm-dd'" :minView="4" @change="getValue($event)"  />
```

上面的使用中，我们设置了默认时间为今天的日期，结束时间为当前（即可选择今天以前的时间），格式化为“年-月-日”方式，最小视图为日期选择，同时选择时间变更的时候绑定`getValue`事件。

* 页面效果

![image](http://o905ne85q.bkt.clouddn.com/1514893996%281%29.jpg)

## 结束语

---

组件封装和配置化，乃是程序员必备技能。提高开发效率，同时锻炼逻辑思维抽象能力，你值得拥有。
这里我们的Datetimepicker是基于input来实现的，但其实还能用v-model来改善，这块后面会说到。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/vue2-notes/14-sealed-component)
[此处查看页面效果](http://ofyya1gfg.bkt.clouddn.com/14-sealed-component/index.html#/app/logs)
