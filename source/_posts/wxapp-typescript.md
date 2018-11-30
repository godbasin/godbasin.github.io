---
title: 小程序上Typescript啦
date: 2018-11-30 22:36:46
categories: 小程序双皮奶
tags: 教程
---
[2018.11.14 A 新增 typescript 支持] 小程序开发工具静悄悄地更新了版本，添加上了对 Typescript 的支持。Typescript ??? Typescript !!!
<!--more-->

# 期待已久的 Typescript
---
## 为什么要用 Typescript
关于 Typescript，可以看看以前写过的这篇[《关于Typescript》](https://godbasin.github.io/2017/09/01/about-typescript/)。文末的故事，便是大多数情况下 Typescript 能帮我们解决的痛点。

过了很久之后，想法还是一样：**Typescript 这事情，当你管理大点的应用的时候，就会感受到它的好处了**。尤其涉及团队配合的时候！

当然，如果你的项目比较小，或是写个小公（工）举（具）、小 demo 的时候， store 状态管理、typescript 编译这些，除非已经很熟悉、没有额外成本的时候，才勉强适合接入。离了具体场景谈架构，都是耍（xia）流（che）氓（dan）。

为什么要用 Typescript？

### 变量类型不明确
之前带外包写小程序，除了代码风格不一致之外，还遇到一个会变的变量问题。

``` js
let formGroups = this.currentStep.formGroups; // 猜猜我的 formGroups 是数组数组 [[], [], []]，还是对象数组 [{}, {}, {}]？
let flattenFields = _.flatten(formGroups); // 不用猜了，我用个 flatten 抹平，它就一定是对象 [{}, {}, {}] 了！

flattenFields.forEach(item => {
  if (item.fields) { // 猜猜我的 item.fields 是数组还是对象？
    flattenFields.push(..._.values(item.fields)); // 不用猜了，我用个 values 抹平，它就一定是对象了！
  }
});
```

当我帮忙 debug 个问题的时候，打断点看到：
![这好像是个数组？](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/wxapp-typescript-1.png)
![这怎么变成个对象？？？](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/wxapp-typescript-2.png)

喵喵喵？？？

``` cmd
# 我和外包童鞋的对话：
我：话说你这些到底是什么类型，从命名和上下文都看不出来。。
我：得去翻更细的代码。。

外包童鞋：values好像可以改一下试试

我：是数组还是对象？

外包童鞋：有的是数组，有的是对象
外包童鞋：一般带复数的是数组

我：（刀.jpg）
我：卧槽
我：你这item.fields，有时候是数组，有时候是对象，这样真的好吗
我：大哥
我：（刀.jpg）* 2
```

或许有人想，即使上了 Typescript 也可能会被 any 打败啊。

什么？在我眼皮底下用 any？！！

### 接口协议不符合
``` cmd
前端：帮忙看看这个接口为什么返回失败了？
后台：你这个接口字段少了啊，这个xxx
（哼哧哼哧修改）
前端：帮忙看看这个接口为啥又报错了啊？
后台：你这个字段类型不对...我协议里有写的
前端：喔不好意思我改
（哼哧哼哧修改）
前端：（泪光）帮忙看看这个接口为啥还报错？
后台：...你这字段名拼错了啊！！！！
```
当然，这个案例里稍微夸张了一点，一般我们都会自己一个个对着协议检查哪里不对，但是很多时候被 bug 光环环绕的时候，你就是发现不了问题。

这个时候，我们就可以用 Typescript 来管理接口啦。

``` ts
interface IDemoResponse {
  date: string;
  someNumber: number;
  otherThing: any;
}
```

**1. 使用约定的变量的时候，会有相关提示**（请忽略我的强行any）。

![输入提示](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/wxapp-typescript-10.jpg)

**2. 使用约定以外的属性时候，会报错提示。**

![错误提示](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/wxapp-typescript-11.jpg)

除此以外，还有很多很棒的用法呢~

### 一键调整协议
前端和后台协议约定后，就开始各自开发了。但是，我们总会遇到各种各样的问题，可能导致我们的协议变更。

字段的变更什么的最讨厌了，例如后台要把某个接口下`date`改成`day`。一般来说前端是拒绝的，你不能说让我改我就得改，我得看看我写了多少代码，评估下工作量。

什么，全局替换？你知道使用`date`多普遍吗？万一我替换错了咋办？？

这时候，如果你使用了 Typescript 并定义了协议接口的话，就很好办了~

依然是这段代码：

``` ts
interface IDemoResponse {
  date: string;
  someNumber: number;
  otherThing: any;
}

const demoResponse: IDemoResponse = {} as any;
const date = demoResponse.date; 
```

**1. 选中需要重命名的属性。**

![选中需要重命名的属性](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/wxapp-typescript-12.jpg)

**2. 按下F2，重新输入属性名。**

![选中需要重命名的属性](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/wxapp-typescript-13.jpg)

**3. 按下回车，使用到的地方都会更新。**

![属性更新](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/wxapp-typescript-14.jpg)

是不是很酷~~~

### 跨过 Babel 直接使用 ES6/ES7，跨过 eslint 直接使用 prettier
其实小程序工具本身也支持了不少的 ES6 新语法，不过像`async/await`这种，则还是需要自己搞个 Babel 来编译。

现在直接上 Typescript，连 Babel 都可以直接跳过啦。

**Prettier**

这里重点推荐 [prettier](https://prettier.io/) 神器，也是团队配合的好工具啊：
- 项目代码没有配 eslint？导致每次拉下来的代码一大堆冲突？
- 团队成员使用不同的编辑器？有的没有自动格式化？导致拉下来代码还是一堆冲突？
- 用 standard？有些规范和实际项目不符合，但是偏偏没得改？？

偷偷地往项目里装个 Prettier，然后所有的矛盾都不见啦。不管你的代码格式多独特，最终在 Git commit 的时候，就被同化啦，而且 Prettier 的格式化也不会影响到 Git 记录。

## 小程序与 Typescript

### Typescript 编译下就可以用？
其实小程序它最终运行的还是 Javascript，那不是我们直接自己编译下就好了吗？

少年你太天真了。咱们写 Typescript 最重要的是什么呀？是 Typing 库呀！

![没错，就是这货](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/wxapp-typescript-3.jpg)

网上开源的关于小程序和 Typescript 的工具或者脚手架也一大堆，为啥不用呢？因为小程序的 API 在不断地变化呀~

有了官方的支持，即使小程序的 API 变了，我们也可以及时地更新呀（奸笑）~

### 开箱即用的尝鲜
既然官方提供支持了，义不容辞地使用呀！

1. 首先，我们更新到最近的工具版本，然后创建项目就能看到了：

![看到了没](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/wxapp-typescript-4.jpg)

2. 创建模版，我们来看看代码长什么样子。

![嗯，typing 在就足够了](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/wxapp-typescript-5.jpg)

我们可以看到，在 package.json 里面多了俩脚本，其实也就是将 ts 文件原地编译，然后上传代码的时候忽略掉了。

3. 仔细瞧瞧代码。

![emmmmm](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/wxapp-typescript-6.jpg)

额，好像混入了一些奇怪的东西进去，感叹号是什么鬼？？？

后面问了下开发GG，是因为这里比较特殊，目前定义的文件暂时没法兼顾，等后面的版本会兼容。

![但是还是很棒](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/wxapp-typescript-7.jpg)

终于用上 Typescript 啦，爽歪歪~

### 调整下代码结构
小项目的话，其实也不用带什么编译啦。不过如果你还想用 less，也想用 typescript，还不想看到项目下面乱糟糟的文件：
``` cmd
index.js
index.ts
index.json
index.less
index.wxss
index.wxml
```

我们就简单弄个 gulp，把编译加上吧~

![会长这样](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/wxapp-typescript-8.jpg)

然后我们再把 prettier 愉快地加上。这里就不多讲解啦，大家也可以参考我的 demo 项目:
[wxapp-typescript-demo](https://github.com/godbasin/wxapp-typescript-demo)

对了，目前官方的 typing 库也不是非常完善，如果需要写组件、插件、小游戏的你，可能会面临一大堆的 any 冲击波噢~

![emmmm](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/wxapp-typescript-9.jpg)

### 参考
- [小程序工具更新](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

## 结束语
---
Typescript 的普及度其实不算高，小程序的确是又一次给到惊喜。反观下我们自己呢？有没有被业务代码冲得找不到方向呢？
很多时候，我们总爱说写业务没啥技术提升，但真的是这样吗？我看过很棒的业务代码，从框架设计到具体的实现，开发者都对自己做了很高的要求。而写技术需求代码的，就一定会写得很好吗？
“我们是业务部门，技术肯定比不上”
“项目很紧急，怎么快怎么来”
“随便找一些能用的就好了，不要浪费时间在这些上面”
...
以上这些话，我是不认同的。当然项目急的时候可以理解，事后一定要把欠下的债务给还了。（较真脸）