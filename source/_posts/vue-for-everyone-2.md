---
title: 9102全员学Vue--2.怎么三两下拼出一个页面
date: 2019-07-11 23:09:51
categories: vue八宝粥
tags: 教程
---
本节内容主要包括使用Vue框架过程中需要掌握的一些基本概念，以及怎么使用现有的一些开源库和组件快速创建项目。另外再附赠对状态管理、数据传递的一些方法和理解叭。总而言之，这一节开始会是与Vue紧密相关的内容啦。
<!--more-->

# Vue基本概念
首先，要快速写出来一个 Vue 项目，要先理解一些基本的概念。概念这样的东西，一个个介绍讲解会很枯燥，那既然这一节内容是快速创建一个 Vue 项目，那我们就一边讲怎么写一边介绍相关概念叭。

这里会主要以管理端这样的页面为最终效果，毕竟这是最常见也是最容易写的一类型页面。

## Vue组件
本来想着从指令讲起的，不过既然上一节中介绍了数据驱动的编码思维，那我们就从数据结构设计起，所以直接开始讲 Vue 组件啦。

### 生命周期
既然要讲 Vue 组件，那生命周期得先了解下。经过上一节内容的讲解，我们知道在 Vue 中要渲染一块页面内容的时候，会有这么几个过程：
1). 解析语法生成 AST。
2). 根据 AST 结果，完成 data 数据初始化。
3). 根据 AST 结果和 data 数据绑定情况，生成虚拟 DOM。
4). 将虚拟 DOM 生成真正的 DOM 插入到页面中，此时页面会被渲染。

当我们绑定的数据进行更新的时候，又会产生以下这些过程：
5). 框架接收到数据变更的事件，根据数据生成新的虚拟 DOM 树。
6). 比较新旧两棵虚拟 DOM 树，得到差异。  
7). 把差异应用到真正的 DOM 树上，即根据差异来更新页面内容。

当我们清空页面内容时，还有：
8). 注销实例，清空页面内容，移除绑定事件、监听器等。

所以在整个页面或是组件中，我们会有以下的一些关键的生命周期钩子：

| 生命周期钩子 | 说明 | 对应上述步骤 |
| - | - | - |
| beforeCreate | 初始化实例前，data 属性等不可获取 | 1 之后，2 之前 |
| created | 实例初始化完成，此时可获取 data 里数据，无法获取 DOM | 2 之后，3 之前 |
| beforeMount | 虚拟 DOM 创建完成，此时未挂载到页面中 | 3 之后，4 之前 |
| mounted | 数据绑定完成，真实 DOM 已挂载到页面 | 4 之后 |
| beforeUpdate | 数据更新，DOM Diff 得到差异，未更新到页面 | 6 之后，7 之前 |
| updated | 数据更新，页面也已更新 | 7 之后 |
| beforeDestroy | 实例销毁前 | 8 之前 |
| destroyed | 实例销毁完成 | 8 之后 |

这些钩子有什么用呢，我们可以在某些生命周期中做一些事情，例如`created`事件中，可以拿到基础的数据，并根据这些数据可以开始进行后台请求了。

### 数据
假设我们要做一个管理端的页面，包括常见的增删查改，那会包括菜单、列表、表单这几种内容，如图：

![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/vue-for-everyone-2-1.jpg)

既然要使用数据驱动的方式，那么我们先来设计这个页面的数据包括哪些。每一个都可以抽象成一组数据设计，我们一个个详细来看。

#### 1. 菜单
![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/vue-for-everyone-2-2.jpg)

如图，我们能看到，菜单列表主要包括父菜单列表，每个父菜单包括：
- 图标 icon
- 菜单名字 text
- （可选）子菜单列表 subMenus
  - 子菜单名字 text

所以，我们可以抽象出这么一个数据结构:

``` js
const menus = [
  {
    text: "服务管理", // 父菜单名字
    icon: "el-icon-setting", // 父菜单图标
    subMenus: [{ text: "服务信息" }, { text: "新增" }]  // 子菜单列表
  },
  {
    text: "产品管理",
    icon: "el-icon-menu",
    subMenus: [{ text: "产品信息" }]
  },
  {
    text: "日志信息",
    icon: "el-icon-message"
  }
];
```

#### 2. 列表
![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/vue-for-everyone-2-3.jpg)

如图，我们能看到，列表里每行内容包括：
- 日期 date
- 姓名 name
- 电话 phone
- 地址 address

我们可以先整理到这么一个数据：

``` js
const tableItem = {
  date: "2019-05-20", // 日期
  name: "被删", // 姓名
  phone: "13888888888", // 电话
  address: "深圳市南山区滨海大道 888 号" // 地址
};
```

而在列表这样的增删查改的场景下，一般还需要一个唯一标识来作为标记，这里使用 id，用最简单的方式来拷贝出 20 个数据：

``` js
// 此处先以 tableItem 为数据源，拷贝生成 20 个数据，然后再根据索引 index 添加上 id
const tableData = Array(20).fill(tableItem).map((x, i) => {return {id: i + 1, ...x};});
console.log(tableData[1]);
// 例如第 2 个数据为：
/* {
    address: "深圳市南山区滨海大道 888 号"
    date: "2019-05-20"
    id: 2
    name: "被删"
    phone: "13888888888"
} */
```

### 方法
关于 Vue 的 methods 方法，如果说数据是状态机的话，那事件大概可以当成状态机的扭转。这里以列表作为举例吧，例如新增、删除、上移、下移，我们只需要处理数据就好了：

``` js
export default {
  data() {
    // 绑定数据
    return {
      menus: menus, // 菜单数据
      tableData: tableData // 列表数据
    };
  },
  methods: {
    // 新增一个数据
    addTableItem(item = {}){
      // 添加到列表中，同时自增 id 
      this.tableData.push({...item, id: this.tableData.length + 1});
    },
    // 删除一个数据
    deleteTableItem(id){
      // 查找到对应的索引，然后删除
      const index = this.tableData.findIndex(x => x.id === id);
      this.tableData.splice(index, 1);
    },
    // 移动一个数据
    moveTableItem(id, direction){
      const dataLength = this.tableData.length;
      // 查找到对应的索引，然后取出，再插入
      const index = this.tableData.findIndex(x => x.id === id);
      switch(direction){
        // 上移
        case 'up':
          if(index > 0) {
            // 第一个不进行上移
            const item = this.tableData.splice(index, 1)[0];
            this.tableData.splice(index - 1, 0, item);
          }
          break;
        // 下移
        case 'down':
          if(index < dataLength - 1) {
            // 最后一个不进行下移
            const item = this.tableData.splice(index, 1)[0];
            this.tableData.splice(index + 1, 0, item);
          }
          break;
      }
    }
  }
}
```

当我们把数据更新了之后，Vue 会自动帮我们更新到页面里，具体是怎么实现的呢，可以参考上一节的数据绑定的实现、虚拟 DOM 的内容哈。

## 组件
数据和事件都写好了，接下来就轮到拼页面了。其实前端写样式是一件很蛋疼的事情，但写页面又是一件很有成就感的事情，所以为了不打击大家的学习热情，我们直接跳过学习调节样式的环节，来到组装页面的环节吧~~

### 组件的自我修养
首先我们理解一下，组件是什么呢，个人的理解是（右侧是举例 Vue 中类似的属性或者 API）：
- 组件内维护自身的数据和状态：`data`
- 组件内维护自身的事件：`methods`、生命周期钩子
- 通过提供配置的方式，来控制展示，或者控制执行逻辑：`props`
- 通过一定的方式（事件触发/监听、API 提供），提供与外界（如父组件）通信的方式：`$emit`、`$on`

如何在一个页面中，抽象出某些组件出来，涉及的篇幅会很长，大家也可以参考前端抽象+配置化系列：[《页面区块化与应用组件化》](https://godbasin.github.io/2018/05/26/app-component-isolation/)、[《一个组件的自我修养》](https://godbasin.github.io/2018/06/02/component-with-itself/)、[《组件配置化》](https://godbasin.github.io/2018/06/09/component-with-configuration/)、[《数据抽离与数据管理》](https://godbasin.github.io/2018/06/17/component-communication-with-data-model/)。（真的很多，加油看）

一般来说，我们可以使用所见即所得的方式，例如上面的，菜单就是个组件，或者表格就是个组件，来划分。

### Vue 组件
在 Vue 里，页面也好、某块内容也好，都可以定义为一个组件。而关于组件的，前面也说了会包括生命周期、数据状态、事件处理、模板样式等，基本的可以参考一下[Vue-组件基础](https://cn.vuejs.org/v2/guide/components.html)，了解一下下面的内容，避免后面直接使用组件的时候有些不了解：
- [Vue 组件的 api 包括哪些](https://cn.vuejs.org/v2/api/)
- [data 为什么必须是一个函数](https://cn.vuejs.org/v2/guide/components.html#data-%E5%BF%85%E9%A1%BB%E6%98%AF%E4%B8%80%E4%B8%AA%E5%87%BD%E6%95%B0)
- [组件怎么组织和设计](https://cn.vuejs.org/v2/guide/components.html#%E7%BB%84%E4%BB%B6%E7%9A%84%E7%BB%84%E7%BB%87)
- [组件的 slot 是什么](https://cn.vuejs.org/v2/guide/components-slots.html)

### Element
这套系列的教程，会直接使用 [Element](https://element.eleme.cn/#/zh-CN/component/installation) 组件。不要误会，没有收取广告费，是因为我们这边大家都要用 Vue + Element 啦，所以教程以自己人为最高优先级。

#### 1. 使用 Element
首先，我们把 Element 装上，很简单：

``` cmd
npm i element-ui -S
```

官方教程也有教我们怎么在 Vue 里使用，也很简单，在 main.js 中写入以下内容：

``` js
import Vue from 'vue';
import ElementUI from 'element-ui'; // 引入 element 组件
import 'element-ui/lib/theme-chalk/index.css'; // 加上 element 样式
import App from './App.vue';

Vue.use(ElementUI); // 在 Vue 里使用 Element

// 启动一个 Vue 应用
new Vue({
  el: '#app',
  render: h => h(App)
});
```

#### 2. 使用 Element 组件
在官网中，我们能找到很多的组件，如图：
![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/vue-for-everyone-2-4.jpg)

左侧列表里，全是 Element，接下来就是要拼成一个表单+列表的页面了。

首先我们得去偷个合适的布局，翻到布局容器 Container 这一个组件页面，我们可以看到一个理想的示例：

![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/vue-for-everyone-2-5.jpg)

点开显示代码，然后尽情拷贝吧~~~鉴于上一节我们用 vue-cli 脚手架生成了个 demo，我们就用在这个 demo 里改，由于主页面内容都放在`HelloWorld.vue`这个文件里，我们就拷进去吧。

![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/vue-for-everyone-2-6.jpg)

粘贴的时候，会发现编辑器有报错？没有比官方代码贴进来直接报错更糟糕的事情了，我们来瞧瞧是因为什么。

上一节我们讲了，浏览器里面会解析 HTML/CSS/Javascript 这三种文件，那`.vue`是什么鬼来的？`.vue`文件其实是单文件组件，就是把 HTML/CSS/Javascript 写在一个文件里，对于简单的组件来说其实是件好事情，一眼就能看完它做了什么（不过个人还是喜欢分开几个文件的方式，看个人喜好啦）。我们来看看一个`.vue`文件包括啥：

``` html
<!-- my-component.vue -->
<!-- 
  .vue 文件里，
  使用 <template> 隔离 HTML，
  使用 <script> 隔离 Javascript，
  使用 <style> 隔离 CSS
  -->
<template>
  <div>This will be pre-compiled</div>
</template>
<!-- 不喜欢写到一起，script 和 styles 也可以用 src 引入文件 -->
<script src="./my-component.js"></script>
<style src="./my-component.css"></style>
```

所以，原来的示例代码里少了`<template></template>`，这里包裹起来就好啦：

![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/vue-for-everyone-2-7.jpg)

然后打开页面，发现跟想象的差不多，除了几处需要调整：

![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/vue-for-everyone-2-8.jpg)

1) Vue logo 要去掉 -> 在`App.vue`文件里，把`<img alt="Vue logo" src="./assets/logo.png">`去掉，还有 body 自带的 margin 也去掉。
2) 这些滚动条太丑了，干掉！ -> 把`<el-container>`里的`height: 500px;`去掉，然后我们调整下

然后我们得到一个这个页面：
![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/vue-for-everyone-2-9.png)

### 页面绑定
前面我们给页面抽象了数据和事件，现在要做的是把它们绑定到我们的页面里，我们要先来看看 Element 是怎么设置数据和配置的。

#### 0. Vue 绑定语法
既然我们要把数据绑定到组件或是元素里，我们先了解下 Vue 中与数据绑定相关的，各位也可以参考[Vue-模板语法](https://cn.vuejs.org/v2/guide/syntax.html)一节内容。

**数据绑定**
我们先来看看数据绑定有哪些最基本的方式：

``` html
<!-- 双大括号可绑定普通文本，此处会把 data 中的 msg 的值绑定到对应的模版上 -->
<span>Message: {{ msg }}</span>
<!-- 双大括号可使用 JavaScript 表达式 -->
<span>{{ msg.split('').reverse().join('') }}/span>
<!-- v-html 输出的内容不会被模版引擎过滤（可参考上节内容），故需要小心 XSS 漏洞 -->
<p v-html="rawHtml"></p>
<!-- v-bind 可用来绑定属性（对比双大括号{{}}只能插入到节点内容中） -->
<div v-bind:id="dynamicId"></div>
<!-- v-bind:xxx 可缩写为 :xxx -->
<div :id="dynamicId"></div>

`v-bind`还可用来传参，关于 props 可以参考[Vue-Prop](https://cn.vuejs.org/v2/guide/components-props.html)一节:

``` html
<template>
  <!-- 这里传入 tableData 给到 my-table 组件的 data 值里 -->
  <my-table :data="tableData"></my-table>
  <!-- my-table 组件中可以通过 props 中获取到这个值 -->
</template>
<script>
export default {
  props: {
    data: {
      type: Array, // 这是个数组
      default: () => {}, // 默认值为空数组 []
    }
  },
  methods: {
    someFunction(){
      // 可以获取到传入 props 中的 data 值，为父组件中的 tableData 变量
      console.log(this.data); 
    }
  }
}
</script>
```

父子组件间的数据传递，通常通过 props 和事件进行传递（父组件通过 props 绑定数据给到子组件，通过事件监听获取子组件的数据更新），当然也可以自定义一些状态机制来传递，也可以使用[Vuex](https://vuex.vuejs.org/zh/guide/)、[Rxjs](https://cn.rx.js.org/)这种状态管理的工具。

**事件绑定**
我们来看看，在 Vue 里是怎样进行事件绑定的：

``` html
<!-- v-on:事件名 可以绑定事件监听，在事件触发的时候，则会执行绑定的 js 代码 -->
<button v-on:click="counter += 1">Add 1</button>
<!-- v-on:事件名 可以缩写为 @事件名 -->
<button @click="counter += 1">Add 1</button>
<!-- 事件绑定除了简单的 js 代码，还可以绑定 methods 里的函数 -->
<button @click="counterAddOne">Add 1</button>
```

事件监听还能用于父子组件的事件传递：

``` html
<!-- 我是子组件 -->
<template>
  <!-- v-model 请参考后面的说明 -->
  <input v-model="val" />
  <button @click="clickDone">done</button>
</template>
<script>
export default {
  data(){
    return {
      val: '' // 输入框的值
    }
  },
  methods: {
    clickDone(){
      // 触发一个 done 名字的事件，把输入框的值传递出去
      this.$emit('done', this.val);
    }
  }
}
</script>

<!-- 我是父组件 -->
<template>
  <!-- 监听下子组件的 done 事件 -->
  <child-component @done="getChildData"></child-component>
</template>
<script>
export default {
  methods: {
    getChildData(value){
      // 参数 value，是子组件触发事件时传的参数，这里是输入框的值
      alert(value);
    }
  }
}
</script>
```

关于 Vue 的事件，还有很多方便的用法噢（例如过滤某个按键等），可以参考[Vue-事件处理](https://cn.vuejs.org/v2/guide/events.html)一节内容，以及[Vue-自定义事件](https://cn.vuejs.org/v2/guide/components-custom-events.html)一节内容。

**表单绑定**
Vue 里有个很好用的指令`v-model`，常常用来绑定表单的值，可以参考[Vue-表单输入绑定](https://cn.vuejs.org/v2/guide/forms.html)一节内容。但其实`v-model`也是语法糖，最终是通过前面的数据和事件绑定结合实现的：

``` html
<template>
  <!-- 事件绑定除了简单的 js 代码，还可以绑定 methods 里的函数 -->
  <!-- 例如我们最简单的 v-model 指令，其实是下面的语法糖 -->
  <input :value="val" @input="updateValue" />
  <!-- 它也可以写成 v-model -->
  <input v-model="val" />
</template>
<script>
export default {
  data(){
    return {
      val: ''
    }
  },
  methods: {
    updateValue(event){
      this.val = event.target.value;
    }
  }
}
</script>
```

`v-model`也可以自定义表单绑定，可参考[《Vue2使用笔记15--自定义的表单组件》](https://godbasin.github.io/2018/01/21/vue2-notes-15-custom-v-model/)一文。

其他的，还有挺常用的一些指令（例如`v-if`条件、`v-for`遍历），可以参考[条件渲染](https://cn.vuejs.org/v2/guide/conditional.html)和[列表渲染](https://cn.vuejs.org/v2/guide/list.html)，当然你还可以自行开发[自定义指令](https://cn.vuejs.org/v2/guide/custom-directive.html)，可参考[《Vue2使用笔记16--自定义指令》](https://godbasin.github.io/2018/01/27/vue2-notes-16-custom-directive/)一文。

#### 1. 菜单绑定
我们先来看看 Elmenet 里的菜单是怎么用的，可以参考[Element-NavMenu导航菜单文档](https://element.eleme.cn/#/zh-CN/component/menu)：

``` html
<!-- default-openeds 为默认展开的菜单项，以 index 序号 -->
<el-menu :default-openeds="['1', '3']">
  <!-- el-submenu 为带子菜单的父菜单，index 为每组菜单的序号 -->
  <el-submenu index="1">
    <!-- 下面是父菜单内容，包括父菜单 icon 和父菜单名字 -->
    <template slot="title"><i class="el-icon-message"></i>导航一</template>
    <el-menu-item-group>
      <!-- 子菜单选项，包括 index 序号和子菜单名字 -->
      <el-menu-item index="1-1">选项1</el-menu-item>
      <el-menu-item index="1-2">选项2</el-menu-item>
    </el-menu-item-group>
  </el-submenu>
  <!-- el-menu-item 为不带子菜单的父菜单，index 为每组菜单的序号 -->
  <el-menu-item index="2">
    <!-- 父菜单内容，包括父菜单 icon 和父菜单名字 -->
    <i class="el-icon-menu"></i>
    <span slot="title">导航二</span>
  </el-menu-item>
</el-menu>
```

绑定数据之后，就会变成这样啦：

``` html
<!-- 顺便调整了下颜色 -->
<el-menu :default-openeds="['0', '1']" class="el-menu-vertical-demo"
   background-color="#545c64" text-color="#fff" active-text-color="#ffd04b"
  >
  <!-- 遍历生成父菜单选项 -->
  <template v-for="menu in menus">
    <!-- 有子菜单的时候，就用 el-submenu，再绑个序号 index -->
    <el-submenu v-if="menu.subMenus && menu.subMenus.length" :index="menu.index" :key="menu.index">
      <template slot="title">
        <!-- 绑个父菜单的 icon -->
        <i :class="menu.icon"></i>
        <!-- 再绑个父菜单的名称 text -->
        <!-- slot 其实类似于占位符，可以去 Vue 官方文档了解一下插槽 -->
        <span slot="title">{{menu.text}}</span>
      </template>
      <el-menu-item-group>
        <!-- 子菜单也要遍历，同时绑上子菜单名称 text，也要绑个序号 index -->
        <el-menu-item v-for="subMenu in menu.subMenus" :key="subMenu.index" :index="subMenu.index">{{subMenu.text}}</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <!-- 没子菜单的时候，就用 el-menu-item，也要绑个序号 index -->
    <el-menu-item v-else :index="menu.index" :key="menu.index">
      <!-- 绑个父菜单的 icon -->
      <i :class="menu.icon"></i>
      <!-- 再绑个父菜单的名称 text -->
      <span slot="title">{{menu.text}}</span>
    </el-menu-item>
  </template>
</el-menu>
```

我们之前的 menus 并没有`index`，这里可以顺便遍历生成一下：

``` js
menus = menus.map((x, i) => {
  return {
    ...x,
    // 子菜单就拼接${父菜单index}-${子菜单index}
    subMenus: (x.subMenus || []).map((y, j) => {
      return { ...y, index: `${i}-${j}` };
    }),
    // 父菜单就把 index 加上好了
    index: `${i}`
  };
});
```

看~菜单成功生成了：
![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/vue-for-everyone-2-10.png)

#### 2. 列表绑定
Demo 里的列表是不带操作按钮的，我们参考[Element-Table表格文档](https://element.eleme.cn/#/zh-CN/component/table)以及[Button按钮文档](https://element.eleme.cn/#/zh-CN/component/button)把自定义选项加上：

``` html
<!-- data 里绑定表格数据，同时这里调整了下样式 -->
<el-table stripe :data="tableData" style="border: 1px solid #ebebeb;border-radius: 3px;margin-top: 10px;">
  <!-- prop 传绑定 tableData 的数据 id，表头名称 id，同时设了下宽度 -->
  <el-table-column prop="id" label="id" width="100"></el-table-column>
  <!-- prop 传绑定 tableData 的数据 date，表头名称日期 -->
  <el-table-column prop="date" label="日期" width="200"></el-table-column>
  <!-- prop 传绑定 tableData 的数据 name，表头名称姓名 -->
  <el-table-column prop="name" label="姓名" width="200"></el-table-column>
  <!-- prop 传绑定 tableData 的数据 phone，表头名称电话 -->
  <el-table-column prop="phone" label="电话" width="200"></el-table-column>
  <!-- prop 传绑定 tableData 的数据 address，表头名称地址 -->
  <el-table-column prop="address" label="地址"></el-table-column>
  <!-- 该列固定在右侧，表头名称操作 -->
  <el-table-column fixed="right" label="操作" width="300">
    <template slot-scope="scope">
      <!-- 添加了个删除按钮，绑定了前面定义的删除事件 deleteTableItem，传入参数 id -->
      <el-button @click="deleteTableItem(scope.row.id)" type="danger" size="small">删除</el-button>
      <!-- 分别添加了上移和下移按钮，绑定了前面定义的移动事件 moveTableItem，传入参数 id 和移动方向 -->
      <el-button @click="moveTableItem(scope.row.id, 'up')" size="small">上移</el-button>
      <el-button @click="moveTableItem(scope.row.id, 'down')" size="small">下移</el-button>
    </template>
  </el-table-column>
</el-table>
```

然后我们就顺利获得了这样一个列表：
![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/vue-for-everyone-2-11.jpg)

#### 3. 表单绑定
有列表的地方，当然也少不了表单啦~~那么，同样的方法，我们直接去[Element-Form表单](https://element.eleme.cn/#/zh-CN/component/form)这里偷代码吧~~因为这里打算用弹窗的方式来装这个表单的内容，所以我们也抠了[Element-Dialog对话框](https://element.eleme.cn/#/zh-CN/component/dialog)的代码出来~

有了前面数据设计和绑定的基础，这里可以直接给出我们的代码：

``` html
<!-- 找个地方添加一个新增的按钮，点击的时候出现表单的弹窗，以及把表单内容设置为初始值 -->
<el-button type="primary" @click="dialogFormVisible = true;form = {};">新增</el-button>
<!-- Form -->
<!-- el-dialog 是弹窗样式，title 绑定弹窗的标题内容，visible 绑定弹窗是否展示 -->
<el-dialog title="新增" :visible.sync="dialogFormVisible">
  <el-form :model="form">
    <!-- el-form-item 绑定表单样式，label 表单的名称，formLabelWidth 设置 label 的宽度 -->
    <el-form-item label="日期" :label-width="formLabelWidth">
      <!-- 里面装载表单元素，这里装了个选择日期的组件，v-model 绑定选择值，value-format设置绑定值的格式，type 设置选择的范围，这里 date 表示到天 -->
      <el-date-picker v-model="form.date" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
    </el-form-item>
    <el-form-item label="姓名" :label-width="formLabelWidth">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="电话" :label-width="formLabelWidth">
      <el-input v-model="form.phone" type="tel"></el-input>
    </el-form-item>
    <el-form-item label="地址" :label-width="formLabelWidth">
      <el-input v-model="form.address"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <!-- 点击取消的时候，设置弹窗不可见 -->
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <!-- 点击确定的时候，设置弹窗不可见，同时添加一项内容 -->
    <el-button type="primary" @click="dialogFormVisible = false; addTableItem(form)">确 定</el-button>
  </div>
</el-dialog>
```

我们需要新增的数据变量包括：

``` js
export default {
  data() {
    return {
      dialogFormVisible: false, // 弹窗是否出现
      form: {}, // 用作表单绑定的内容
      formLabelWidth: '120px', // 表单 label 的宽度
    };
  }
}
```

Okay，我们的表单就写好了：
![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/vue-for-everyone-2-12.jpg)

### 课后作业
其实到这里，我们已经成功地东拼西凑成一个带菜单、列表和表单的页面了，这也是我们在管理端里最常见的一种页面类型。

这个页面也有挺多可以完善的地方，例如：
1. 左侧菜单可以支持收起。
2. 列表支持修改。
3. 列表支持批量删除。
4. 表单支持校验手机号和其他选项不为空。

这些就当作课后作业来完成吧，如果很懒的你，也可以直接看最终结果：
- [页面的效果查看](http://vue-for-everyone.godbasin.com/2/index.html)
- [页面代码查看](https://github.com/godbasin/vue-element-demo/tree/master/2)

## 结束语
---
其实前端发展到现在，已经有很多开源轮子了。所以前端开发的效率在不断提升，会让人有种我很厉害的幻觉。而常常在这样的幻觉消失之后，会发现自己除了会用工具以外，什么都没剩下了。为了避免陷入恐慌的这一天到来，我们应该沉静下来，缺啥补啥，相对于囫囵吞枣，更应该多深入理解和研究下。