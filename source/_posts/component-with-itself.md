---
title: 一个组件的自我修养
date: 2018-06-02 11:07:40
categories: 思想棉花糖
tags: 分享
---
曾经我在面试的时候，面试官问我，觉得做过的有意思的东西是什么，答组件相关的。结果被面试官鄙视了，sign~不过呢，再小的设计，当你把满腔热情和各种想法放进里面，它似乎有了灵魂。或许是我当时面试的表达，没有传达到真正的想法，那么在这里，我希望能很好地表达。
<!--more-->

# 组件的划分
---
前面我们简单说明了下组件的封装和划分，参考[《页面区块化与应用组件化》](https://godbasin.github.io/2018/05/26/app-component-isolation/)。

## 通过视觉和交互划分
通常来说，组件的划分，与视觉、交互等密切相关，我们可通过功能、独立性来判断是否适合作为一个组件。

这次我们拿知乎的内容卡片来说吧，上图：

![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1524128850.jpg)

可以看到，这里我们每个卡片，内容都稍微有些不一样。但毫无疑问，它们拥有相同的功能，可通过一个组件来控制内容的展示。

那么我们大概可以这样来表示这个组件（为了方便，该文章大部分代码基于 Vue 来表示吧）：

``` html
<my-card :innerData="eachCardData" :cardType="'videoCard' | 'photoCard' | 'textCard'"></my-card>
```

其中，innerData 传入卡片内容，包括标题、文字、图片、附加信息（点赞数、评论数、日期等）。
同时，我们可以通过 cardType 来告诉组件，这是个视频类型、图片类型、还是纯文字类型的内容，来让组件控制内容和样式展示。

## 通过代码复用划分
我们在写代码的时候，观察到一些代码，他们在结构和功能上其实是可复用的，这个时候我们也可以通过封装的办法，把它们封装一起，以减少重复的代码。

同样的，我们拿右侧的一个快捷导航模块来看：

![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1524131302%281%29.jpg)

一般来说，从功能划分的话，我们会把外面那层封装成一整个组件：

``` html
<quick-link-panel>
    <div v-for="item in quickLinkItem">...</div>
</quick-link-panel>
```

这时候有人跑出来说，每一行我们都可以视为独立的一个组件，看：

``` html
<quick-link-line link="where/to/go" :text="lineText" :tagNum="numberWithTag"></quick-link-line>
```

Emmmmmmm。。好像这样也看不出来区别把？似乎也没有简化到什么代码？

不！对方说，在这样的模块里面就可以快速使用了：

``` html
<quick-link-panel-with-text>
    <h1>我可是有标题的噢</h1>
    <quick-link-line v-for="item in quickLinkItem" :link="item.link" :text="item.lineText" :tagNum="item.numberWithTag"></quick-link-line>
</quick-link-panel-with-text>>
```

=.=好吧，可能这里举得例子不够特别鲜明。不过大抵意思是这样啦。

但其实这不是很好运用的一种方式，因为控制不好的话，可能你的代码会过度封装，导致别人在维护的时候，表示：卧槽！！！这得跳多少层才能找到想看的代码！！！

# 组件的封装
---
怎样才能算是一个合格的组件呢？我们在设计的时候，经常要考虑解耦，但很多时候，过度的解耦反而会导致项目复杂度变高，维护性降低。

## 独立的组件
组件的独立性，可以包括以下几个方面：
- 维护自身的数据和状态、作用域
- 维护自身的事件

同样拿之前的内容卡片来看：

![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1524133892%281%29.jpg)

这是个独立的卡片：
1. 它拥有自己的数据，包括标题、文字、图片、点赞数、评论数、日期等。
2. 它拥有自身的状态，是否已点赞、是否已收藏、是否详细展示内容、是否展示评论等。
3. 它维护着自己的事件，包括点击分享、收藏、点赞、回复等等。

``` html
<template>
    <div>
        <h2>{{model.question}}</h2>
        <div :class="isContextShown ? 'content-detail' : 'content-brief'">
            <div v-if="model.withImage"><img :url="model.imageUrl" /></div>
            <div>{{model.content}}</div>
        </div>
        <div>
            <span @click="likeIt()">点赞</span>
            <span @click="keepIt()">收藏</span>
        </div>
    </div>
</template>
<script>
export default {
  name: 'my-card',
  data() {
    return {
      model: {},
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

嗯，去掉很多功能之后，大概是这么简单的一个组件吧[捂脸]。

## 组件与外界
我们在保持组件独立性的时候，当然还需要考虑它与外界的交互，主要包括：

**对外提供配置项，来控制展示以及具体功能。**

这里最简单的，我们每个卡片都需要传入内容，我们一次性拉取列表数据，并传入每个卡片，在 Vue 中可以使用 props。

**对外提供查询接口，可从外界获取组件状态。**

这个的话，更多时候我们是通过事件等方式来告诉外界一些事情。在这里举个例子，我们这里假设一个页面只允许一个卡片内容处于详细展开状态，故我们需要获取其展开的操作，方便控制。

``` html
<template>
    <div>
        <h2>{{model.question}}</h2>
        <div @click="toggleContext()" :class="isContextShown ? 'content-detail' : 'content-brief'">
            <div v-if="model.withImage"><img :url="model.imageUrl" /></div>
            <div>{{model.content}}</div>
        </div>
        <div>
            <span @click="likeIt()">点赞</span>
            <span @click="keepIt()">收藏</span>
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
    keepIt() {},
    toggleContext() {
        // 点击展开/收起的时候通知
        this.isContextShown = !this.isContextShown;
        this.$emit('toggle', this.isContextShown);
    }
  },
  mounted() {}
};
</script>
```

简单调整之后，我们会这样使用：

``` html
<my-card :model="cardModel" @toggle="doSomething()"></my-card>
```

这是最简单的对内和对外的联系，对一个组件来说，它也有 in 和 out 两个方向的流动。

在 Vue 里，如果父组件需要获取子组件的实例，也可以通过通过`vm.$refs`来获取。

# 结束语
---
这里主要从单个组件的角度来进行说明，搭配一点点的代码，防止文字太多难以理解。
其实组件的封装，与我们很相似。我们需要拥有独立的空间，但不能完全封闭，我们需要从其他地方获取能量，同时也需要反馈给其他人，来完成更多的协助与配合。