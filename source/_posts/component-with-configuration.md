---
title: 组件配置化
date: 2018-06-09 17:59:18
categories: 思想棉花糖
tags: 分享
---
配置化思想，其实可以在很多的地方使用。很多时候，我们在设计接口、应用、数据等情况下，配置化的方式可以允许我们获得更高的自由度。这里我们简单讲讲组件的配置化吧。
<!--more-->

# 配置化思想
---

## 可配置的数据
数据的配置，或许大家会比较熟悉。像一些静态数据呀，或者说我们很多的管理端都是用来进行数据配置的。

### 应用中的可配置数据
最常见的数据配置，大概是应用里面的配置，文案呀、说明等，为此我们有了运营这样的职位。常见的方式，则是搭起一整套的运营管理平台，一些简单的文字或是数据，则可以通过平台进行配置。

### 代码中的可配置数据
有些时候，我们也会在代码里面放置一些可配置的数据。例如说，这个需求需要查询一周的数据，常见的做法是将天数配置为7天：

``` javascript
const QUERY_DAY_NUM = 7;
```

这样，当需要在紧急情况支持其他天数（五一、国庆、过年能假期）的时候，我们就可以只需要改动这里就好啦。

### 文件里的可配置数据
有些情况下，一些影响逻辑的配置数据，要是直接写到代码里，在调整的时候通常需要重新打包部署，这样情况下开销大、效率低。

所以在一些时候，我们会把这样的可配置数据，单独写到某个文件里维护。当需要调整的时候，只需要下发一个配置文件就好啦。

## 可配置的接口
关于接口的配置化，目前来说见过的不是特别多。毕竟目前来说，我们的很多数据和接口并不是简单的增删查改这样的功能，很多时候还需要在接口返回前后，做一系列的逻辑处理。

简单地说，很多的业务接口场景复用性不高，前后端除去协议、基础规范的定义之后，很少再能进行更深层次的抽象，导致接口配置化的改造成本较大。

配置化的实现有两点很重要的东西：**规范**和**解决方案**。如果说目前较好的从前端到后台的规范，可能 [GrapgQL](https://graphql.cn/) 和 Restful ，大家不熟悉的也可以去看看啦。

当然，或许有些团队已经实现了，也希望尽快能看到一些相关的解决方案啦。

## 可配置的页面
页面的配置化，可能也已经不少见了吧。像我刚出道的时候，也写过[一个拖拽的 demo](http://o907xb1mi.bkt.clouddn.com/index.html)，虽然现在光想想那时候的 jQuery 代码就惨不忍睹，不过当时还是觉得自己挺牛逼的。

有些时候，一些页面比较简单，里面的板块、功能比较相似，可能文案不一致、模块位置调整了、颜色改变等等。虽然说复制粘贴再改一改，很多时候也能满足要求，但是配置化的思想，就是要把重复性的工作交给机器呀。

这种页面的配置，基本上有两种实现方式：
1. 配置后生成静态页面的代码，直接加载生成的页面代码。
2. 写通用的配置化逻辑，在加载页面的时候拉取配置数据，动态生成页面。

基于 SEO 和实现复杂度各种情况，第一种方式大概是目前比较常用的，第二种的实现难度会稍微大一些，同时对于 SEO 与单页应用有着相同的困境。

第一种方式，很多适用于一些移动端的模版页面开发，例如简单的活动页面、商城页面等等。

第二种的话，更多的是一些管理平台的实现，毕竟大多数都是增删查改，形式无非列表、表单和菜单等。之前我也捣鼓过一小会的 Angular 表单、列表等配置，可以看看[Angular自定义页面](http://otaj284f8.bkt.clouddn.com/#/home/custom-app)和这个[Angular2 Schema Form Exemple](http://p2n7500x0.bkt.clouddn.com/index.html)。嗯，可能有些bug，don't mind don't mind~

## 可配置的应用
可配置的应用，大概更多地是从业务和应用设计的角度出发。当我们设计一个应用的时候，页面是活动的、可变的、可配置的，这些都是需要考虑到的地方。

当然，如果说涉及到代码实现的话，那大概与上面的相关。配置化的思想，其实或许不局限于代码、工程和我们的工作，甚至我们完全可以拓展至我们的生活中。


# 组件配置化
---
那么这里我们来讲一下简单的配置化组件的实现把。关于组件的封装，我们在[《一个组件的自我修养》](https://godbasin.github.io/2018/06/02/component-with-itself/)一文也讲述过。

下面的组件，我们同样拿这样一个卡片组件来作为例子吧。

![image](http://o905ne85q.bkt.clouddn.com/1524133892%281%29.jpg)


## 可配置的数据
首先是数据的配置，这大概是最基础的，当我们在封装组件的时候，很多数据都是通过作用域内的变量来动态绑定的，例如 Vue 里面则是`data`、`props`、`computed`等维护 scope 内的数据绑定。

作为一个卡片，内容是从外面注入的，所以我们可以通过 `props` 来获取：

``` html
<template>
    <div>
        <h2>{{model.question}}</h2>
        <div>
            <div v-if="model.withImage"><img :url="model.imageUrl" /></div>
            <div>{{model.content}}</div>
        </div>
        <div>
            <span @click="likeIt()">点赞</span>
            <span @click="keepIt()">收藏</span>
        </div>
        <div>
          <p v-for="comment in model.comments">{{comment}}</p>
        </div>
    </div>
</template>
<script>
export default {
  name: 'my-card',
  props: { // 传入数据
    model: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isContextShown: false
    };
  },
  methods: {
    likeIt() {},
    keepIt() {}
  },
  mounted() {}
};
</script>
```

这里只展示简单的方式，我们会这样使用：

``` html
<my-card :model="cardModel"></my-card>
```

## 可配置的样式
样式的配置，通常是通过`class`来实现的。其实这更多地是对样式的配置化设计，与我们的 HTML 和 Javascript 关系则比较少。

样式的配置，需要我们考虑 CSS 的设计，通常来说我们有两种方式：
1. 根据子元素匹配，来描述 CSS。
2. 根据子 class 匹配，来描述 CSS。

### 根据子元素配置CSS
这是以前比较常用的一种方式，简单地说，就是通过 CSS 匹配规则中的父子元素匹配，来完成我们的样式设计。

例如，我们有个模块：

``` html
<div class="my-dialog">
  <header>I am header.</header>
  <section>
    blablablabla...
  </section>
  <footer>
    <button>Submit</button>
  </footer>
</div>
```

样式则会这样设计：

``` CSS
.my-dialog {
  background: white;
}
.my-dialog > header {}
.my-dialog > section {}
.my-dialog > footer {}
```

或者说用 LESS 或是 SASS：

``` LESS
.my-dialog {
  background: white;
  > header {}
  > section {}
  > footer {}
}
```

通过这种方式设计，或许我们在写代码的时候会稍微方便些，但是在维护上面很容易踩坑。曾经我也喜欢这种方式写，后来在一次次的 DOM 结构调整过程中，差点掉坑里出不来，于是乎后面慢慢改用第二种方式。

### 根据子 class 配置CSS
其实相对于匹配简单的父子和后代元素关系，使用 class 来辅助匹配，则可以解决 DOM 调整的时候带来的问题。

这里我们使用 BEM 作为例子来解释下大概的想法吧：

**BEM**
BEM的意思就是块（block）、元素（element）、修饰符（modifier），是一种前端命名方法论。更多的大家可以去谷歌或者百度下。

简单说，我们写 CSS 的时候就是这样的：

``` CSS
.block{}
.block__element{}
.block--modifier{}
```

- block：可以与组件和模块对应的命名，如 card、dialog 等
- element：元素，如 header、footer 等
- modifier：修饰符，可视作状态等描述，如 actived、closed 等

这样的话，我们上述的代码则会变成：

``` html
<div class="my-dialog">
  <header class="my-dialog__header">I am header.</header>
  <section class="my-dialog__section">
    blablablabla...
  </section>
  <footer class="my-dialog__footer">
    <button class="my-dialog__btn--inactived">Submit</button>
  </footer>
</div>
```

搭配 LESS 的话，其实样式还是挺好写的：

``` LESS
.my-dialog {
  background: white;
  &__header {}
  &__section {}
  &__footer {}
  &__btn {
    &--inactived
  }
}
```

Emmmmmm。。其实大家看了下，就发现这样的弊端了，这样我们在写 HTML 的时候，需要耗费很多的时间来写这些 class 名字，更惨的是，当我们需要切换某个元素状态的时候，判断条件会变得很长，像：

``` HTML
<button :class="isActived ? 'my-dialog__btn--actived' : 'my-dialog__btn--inactived'">Submit</button>
```

简直惨不忍睹。当然我们也可以把修饰符部分脱离，这样使用：

``` HTML
<button class="my-dialog__btn" :class="isActived ? 'actived' : 'inactived'">Submit</button>
```

这样会稍微好一些。BEM 的优势和弊端也都是很明显的，大家也可以根据具体的团队规模、项目规模、使用场景等，来决定要怎么设计。

当然，如今很多框架都支持样式的作用域，通常是通过在 class 里添加随机MD5等，来保持局部作用域的 class 样式。常见的话，我们是搭配第一和第二种方式一起使用的。

## 可配置的展示
可配置的展示，更多时候是指某些模块是否展示、展示的样式又是如何等。

例如，我们需要一个对话框，其头部、正文文字、底部按钮等功能都可支持配置：

``` HTML
<div class="my-dialog" :class="{'show': isShown}">
  <header v-if="model.title">{{model.title}}</header>
  <section v-if="model.content">{{model.content}}</section>
  <footer>
    <button v-for="button in model.buttons">{{button.text}}</button>
  </footer>
</div>
```

我们可以通过`model.title`来控制是否展示头部，可以通过`model.buttons`来控制底部按钮的数量和文字。

这只是最简单的实例，我们甚至可以通过配置，来控制出完全不一样的展示效果。搭配样式的配置，更是能让组件出神入化。当然，很多时候我们组件的封装是需要与业务设计相关，这样维护性能也会稍微好一些，这些前面也都有说到过。

## 可配置的功能
功能的配置，其实很多也与展示的配置相关。但是我们有些与业务相关的功能，则可以结合展示、功能来定义这样的配置。

举个例子，我们的这个卡片可以是视频、图片、文字的卡片：
- 视频：点击播放
- 图片：点击新窗口查看
- 文字：点击无效果

这种时候，我们可以两种方式：
1. 每个功能模块自己控制，同时通过配置控制哪个功能模块的展示。
2. 模块展示会有些耦合，但在点击事件里，根据配置来进行不同的事件处理，获取不同的效果。

对应维护性和可读性来说，第一种方式会获得更好的效果。如果问什么情况下会用到第二种，唔。。。大概是同样的呈现效果，在不同场景下的逻辑功能不一样时，使用比较方便吧。

功能配置化这块就不过多描述啦，毕竟这块需要与业务场景密切结合，大家更多地可以思考下，自己的项目中，是否可以有调整的空间，来使得整体的项目更好维护呢？

# 结束语
---
我们讲述了很多的配置化场景，也针对组件来详细描述了一些配置化的方向和方式。随着科技越来越发达，很多简单和重复性的事情我们可以交给机器去做，这就需要我们把相似的部分提取出来抽象封装，把可变的部分结合配置来高效地调整。
抽象封装和配置化的搭配，其实能获得很不错的效果，我们在对一些事物的认知上，也能进行更深层次的概括和思考。