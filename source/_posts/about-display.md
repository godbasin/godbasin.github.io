---
title: CSS的display有关
date: 2016-06-26 20:03:10
categories: CSS炒饭
tags: 分享
---
上一篇主要讲[CSS的position和z-index](https://godbasin.github.io/2016/06/25/about-position/)，刚好想到了display。
本文主要讲述块状元素和内联元素的说明，并补充float浮动相关。
<!--more-->
## CSS display属性
-----
### w3c的display
这里借用[w3c](http://www.w3school.com.cn/cssref/pr_class_display.asp)上的说明
- display属性规定元素应该生成的框的类型
- 这个属性用于定义建立布局时元素生成的显示框类型

### 内联元素和块状元素
- 内联元素
  - 内联元素又称行内元素等，表示位于行内的元素
  - 内联元素只能容纳文本或者其他内联元素，它允许其他内联元素与其位于同一行
  - 内联元素的宽度高度不起作用
- 块状元素
  - 块状元素一般是其他元素的容器，可容纳内联元素和其他块状元素
  - 块状元素排斥其他元素与其位于同一行
  - 块状元素的宽度高度起作用

## 常用的display属性
-----
### block：块状元素
- 常见的默认display: block元素
> div/p/h1/h2...h6/ul/ol
> html5新元素: section/article/header/footer等

- 可容纳其他块状元素或内联元素
此时我们可以在block元素里添加其他块状元素和内联元素。
常见的就是在div内添加div/p，在p内添加a/span等。
``` html
<div><p><a></a></p></div>
```

- 排斥其他元素与其位于同一行
一个block元素占位一行，不管其宽度和高度多少，都不允许其他元素（包括内联元素和块状元素）与其位于同一行。
此时若要使多个block位于同一行，可以选择使用float浮动。后续会讲到。

- 宽度高度起作用
block元素可以设置宽度width和高度height，有效。

### inline：内联元素
- 常见的默认display: inline元素
> a/span/i/strong/sub等

- 位于行内，即位于块状元素或者其他内联元素内
此时我们可以将inline元素放置于块状元素或者其他内联元素内。
常见的就是在p内添加a/span等。
``` html
<p><a></a><span></span></p>
```

- 只能容纳文本或者其他内联元素
请注意，inline元素里面无法放置block元素，这也是为什么我们将div/p放在a内，在浏览器中却依然显示在外面的原因。
此时若要在元素内放置块状元素，可以选择设置display为block。

- 允许其他内联元素与其位于同一行

- inline元素的宽度高度不起作用
即使给inline元素设置了宽高，也是无效的，这也是个常见的失误。
此时若要给元素设置宽高，可以选择设置display为block或者inline-block。

### inline-block元素
- 与inline元素相似的地方
  - 位于行内，即位于块状元素或者其他内联元素内
  - 允许其他内联元素与其位于同一行
- 与block元素相似的地方
  - 可容纳其他块状元素或内联元素
  - 宽度高度起作用
- 使用inline-block
其实，使用inline-block可以很方便解决一些问题：
  - 使元素居中
  > 考虑下面情况，在块状元素parent内添加了另外一个块状元素child
  > 可以将child设置display: inline-block，同时配合parent设置text-align: center，就可以设置child在parent内横向居中
  > 此时将parent的height和line-height设置相等，就可以轻松实现child在parent内纵向居中啦
  > 当然child元素设置margin: auto也是可以实现横向居中的
  - inline元素a/span设置宽高
  > 考虑下面情况，我们需要给多个a元素设置为宽高一致
  > 由于a元素内文字长度可能不一样，若使用padding也达不到想要的效果
  > 此时将a元素设置display: inline-block，然后就可以添加有效的width和height进行设置啦
  - 将多个块状元素放在一行
  > 考虑下面情况，我们需要将多个block块状元素放在一行
  > 由于block元素占位一行，即使设置宽度很小，后面的元素也会出现在下一行
  > 此时将块状元素设置display: inline-block，解决问题

### 其他display属性
- table/table-cell等
以前table也常被用来解决元素纵向居中的问题。
但table样式还会导致很多的问题，这里就不再一一赘述。
- inherite
规定应该从父元素继承 display 属性的值。

## float浮动
-----
说到block元素，当然不能少了float浮动啦
- float属性
  - float属性定义元素在哪个方向浮动
  - float属性可应用于图像，使文本围绕在图像周围

这里我们又得拿起文档流来讲讲了。
给元素的float属性赋值后，就是脱离文档流，进行左右浮动，紧贴着父元素的边框或者是上一个同级同浮动元素的边框。

- float与block
  - 设置float浮动的元素自动获取display: block样式
  - 当一个元素浮动之后，不会影响到块级框的布局
如图：
HTML
``` html
<div>1</div>
<div class="float">2</div>
<div class="float">3</div>
<div>4</div>
<div>5</div>
<div class="float">6</div>
```
CSS
``` css
div { border: solid 1px red; width: 50px; height: 50px; } 
.float { float: left; }
```
![image](http://o905ne85q.bkt.clouddn.com/KSQKV%7D%253L%25Z6XE_C4FWXCRI.png)

- float与inline-block
  - 当一个元素浮动之后，会影响内联框（通常是文本）的排列和布局
  - float浮动若未指明宽度会尽可能地窄，而inline-block元素会带来空白问题

如图：
CSS(给div添加display=inline-block)
``` css
div { border: solid 1px red; width: 50px; height: 50px; display: display: inline-block;} 
```
![image](http://o905ne85q.bkt.clouddn.com/O1%297R8%7BZ%7DAH%25C0F%28U%25M%7D8XX.png)

- float撑开父元素的方法
本属于普通流中的元素浮动之后，包含框内部由于不存在其他普通流元素了，也就表现出高度为0（高度塌陷）
相信使用float的童鞋们都遇到过父元素高度塌陷的问题，这是因为浮动元素不占位的问题引起的。本骚年用过的解决办法如下：
  - 父元素使用overflow: hidden（此时高度为auto）
  父元素overflow:hidden后，首先会计算height: auto的真实高度，由于其触发了BFC，需要包含子元素，所以高度不是0，而是子元素高度。
  > 这里补充BFC的三个特性
  > 1.BFC会阻止垂直外边距（margin-top、margin-bottom）折叠
  > 2.BFC不会重叠浮动元素
  > 3.BFC可以包含浮动
  - 使父元素也成为浮动float元素
  将父容器也改成浮动定位，这样它就可以带着子元素一起浮动了
  - 使用clear清除浮动
  在浮动元素后方加入clear: both的元素，就可以清除浮动撑开父元素
  > 简述clear原理
  > 在样式中添加clear:right，理解为不允许右边有浮动元素，由于上一个元素是浮动元素，因此该元素会自动下移一行来满足规则
  > 添加clear:both，则可以清除左右两边的浮动了

- 参考
[《浮动从何而来 我们为何要清除浮动 清除浮动的原理是什么》](http://www.jb51.net/css/67471.html) 

## 结束语
虽然说这些很简单也很基础的东西，但对于写页面的时候解决各种不明bug和现象很有帮助的哦。