---
title: 图片居中新用法--巧妙使用background
date: 2017-05-16 21:07:23
categories: CSS炒饭
tags: 分享
---
想必大家都常被页面居中这个问题困扰吧，这里简单分享一下一个使用background样式属性来实现图片居中的新用法。
<!--more-->

很久以前本骚年常用`image.onload()`这样的方式获取图片大小再进行调整，得到图片原比例居中的效果，自从发现这个新用法，就跟长长的js代码说拜拜了。

## background
---
### background简介
`background`是CSS简写属性，用来集中设置各种背景属性。

`background`可以用来设置一个或多个属性:
`background-color`, `background-image`, 
`background-position`, `background-repeat`, 
`background-size`, `background-attachment`, 
等等。

具体大家可以上[background | MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background)上查看，里面有每个值的默认值、支持值、以及浏览器的兼容性等等，这里先对成员简单做些介绍。


### background-color

CSS属性中的`background-color`会设置元素的背景色, 属性的值为颜色值或关键字"transparent"二者选其一。

### background-image

CSS `background-image`属性用于为一个元素设置一个或者多个背景图像。

图像在绘制时，以z方向堆叠的方式进行。先指定的图像会在之后指定的图像上面绘制。因此指定的第一个图像最接近用户。

绘制层次关系如下：
1. 元素的`borders`会在`background-image`之上被绘制
2. `background-color`会在`background-image`之下绘制

> 图像的绘制与盒子以及盒子的边框的关系，需要在CSS属性`{cssxref("background-clip")}}`和`background-origin`中定义，后面我们会讲到。

巧妙使用`background-image`除了可以拼接多图片，还可以结合渐变`linear-gradient`、透明度`rgba()`、重复方式`background-repeat`做出很棒的效果，具体可以参考[使用CSS渐变 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Using_CSS_gradients)，效果图如下：

![image](https://mdn.mozillademos.org/files/4275/linear_multibg_transparent2.png)
![image](https://developer.mozilla.org/@api/deki/files/3959/=radial_gradient_varied.png)

甚至是：

![image](https://developer.mozilla.org/@api/deki/files/6192/=repeat_background_gradient_checked.png?size=thumb)
![image](https://developer.mozilla.org/@api/deki/files/3965/=repeating_radial_gradient.png)

### background-repeat

`background-repeat` CSS属性定义背景图像的重复方式。背景图像可以沿着水平轴，垂直轴，两个轴重复，或者根本不重复。

### background-attachment

如果指定了`background-image`，那么`background-attachment`决定背景是在视口中固定的还是随包含它的区块滚动的。

### background-position

`background-position`指定背景图片的初始位置。

对于每一个被设定的背景图片来说，`background-position`这个CSS属性设置了一个初始位置。 这个初始位置是相对于以`background-origin`定义的背景位置图层（`padding-box|border-box|content-box`）来说的，后面有讲。

关于该属性的取值，当然常用的`center`之外，像`left|bottom|...`等等，以及百分比percentage、甚至具体的值px等都是可以支持的。该属性比较简单常见，具体大家可以去[background-position | MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-position)上查看。

### background-clip
  - `background-clip`设置元素的背景（背景图片或颜色）是否延伸到边框下面
  - 'border-box': 背景延伸到边框外沿（但是在边框之下）
  - 'padding-box': 边框下面没有背景，即背景延伸到内边距外沿
  - 'content-box': 背景裁剪到内容区(content-box)外沿

### background-origin
  - `background-origin`规定了指定背景图片`background-image`属性的原点位置的背景相对区域
  - 'border-box': 背景将会延伸到延伸到外边界的边框，而且是「边框在上、背景在下」
  - 'padding-box': 背景描绘在padding盒子，边框里不会有背景出现。同样，背景将会延伸到最外边界的padding
  - 'content-box': 背景描绘在内容区范围

### background-clip与background-origin
这是两个很相似的CSS属性，前面也提到了几遍了，主要是用来设置背景与border/padding等关系的。

乍一看两者怎么都长一样，但是有个关键性的区别是：`background-clip`对多余内容进行裁剪，而`background-origin`则会调整位置保证效果。

### background-size
`background-size`设置背景图片大小。
这个看起来很不起眼的属性，其实正是后面我们进行图片居中的关键。

除了基本的length值、percentage值，`background-size`还有几个很棒的值：
- auto: 以背景图片的比例缩放背景图片。
- cover: 缩放背景图片以完全覆盖背景区，可能背景图片部分看不见
- contain: 缩放背景图片以完全装入背景区，可能背景区部分空白

背景区由前面提到的`background-origin`设置，默认为盒模型的内容区与内边距，也可设置为只有内容区，或者还包括边框。
如果`attachment`为fixed，背景区为浏览器可视区（即视口），不包括滚动条。不能为负值。

下面本骚年简单分享一下图片居中的很棒的方法。

## 图片居中新用法
---
### 组合使用background
- 图片居中

经过上面简单的讲解每个属性的效果，我们可以得到以下的一个样式设置：

``` css
.img-contain{
	background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
}
```

这样，不管`<div>`的宽高怎么设置，需要显示的图片都会按原比例自动缩放以全部刚好包含在`<div>`里面。

- 图片填充

如果需要背景图片按比例拉伸来占满`<div>`（不留白），我们可以调整`background-size`：

``` css
.img-cover{
	background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
}
```

- border和padding

如果有边框，我们可以配合`background-clip`或`background-origin`来使用，具体自行回放上面内容。

- 使用

我们可以这样使用：

``` html
<div class="img-contain" style="background-image: url(your_image_url)"></div>
<div class="img-cover" style="background-image: url(your_image_url)"></div>
```

聪明的你肯定发现了，这样的使用方法有个问题：
作为背景的图片是撑不起元素的，故这里我们需要给div手动添加宽高：

``` html
<div class="img-contain" style="background-image: url(your_image_url); width: 400px; height: 300px;"></div>
<div class="img-cover" style="background-image: url(your_image_url); width: 400px; height: 300px;"></div>
```

其实如果我们在页面内统一对每个模块（像这里的`<div>`）设置了宽高，这里的问题就不需要考虑的。

当然这样处理的话，有个比较不方便的地方就是，我们再也没办法右键下载和保存图片了。还有别忘了浏览器兼容，相信大家可以各种出招解决掉的。

### 代码实现
``` html
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>JS Bin</title>
  <style>
    div{
      width: 500px;
      height: 300px;
      border: solid 2px red;
      background-color: white;
      background-image: url('https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/5df2bea83bbf3a90ca130c70.jpg')
    }
  .img-contain{
	background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
  }
  .img-cover{
	background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    
  }
  </style>
</head>
<body>
  <h1>图片居中</h1>
  <div class="img-contain"></div>
  <h1>图片填充</h1>
  <div class="img-cover"></div>
</body>
</html>
```

具体效果如下：

![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1494939946%281%29.png)

大家也可以查看这里[js-bin](http://jsbin.com/godesow/1/edit?html,output)。

## 结束语
-----
虽然现在我们都习惯性地使用js解决问题，其实有些我们想要的效果，也是可以使用CSS来更简单方便地解决的，多去探索就好啦。