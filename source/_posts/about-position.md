---
title: CSS的position和z-index有关
date: 2016-06-25 12:03:10
categories: CSS炒饭
tags: 分享
---
今天刚好kk妹子问我关于position的一些问题，就打算整理一下，希望用比较清晰明了的方式解释一下CSS的position是怎么个玩法。
顺便也进行一下z-index相关的说明。
<!--more-->
## CSS position属性
-----
### w3c的position
这里借用[w3c](http://www.w3school.com.cn/cssref/pr_class_position.asp)上的说明
- absolute	
  - 生成绝对定位的元素，相对于static定位以外的第一个父元素进行定位。
  - 元素的位置通过"left", "top", "right"以及"bottom"属性进行规定。
- fixed	
  - 生成绝对定位的元素，相对于浏览器窗口进行定位。
  - 元素的位置通过"left", "top", "right"以及"bottom"属性进行规定。
- relative	
  - 生成相对定位的元素，相对于其正常位置进行定位。
  - 因此，"left:20"会向元素的 LEFT位置添加 20像素。
- static	
  - 默认值。没有定位，元素出现在正常的流中（忽略top, bottom, left, right或者z-index声明）。
- inherit	
  - 规定应该从父元素继承position属性的值。

### 文档流
- 什么是文档流
相信大家刚开始接触position属性的时候，都会被“文档流”、“流”这样的概念给吓坏了。
- 正常的文档流也叫普通流，在HTML里面的写法就是从上到下，从左到右的排版布局

### static与文档流

如图，[查看页面效果](http://o9bc2k1st.bkt.clouddn.com/position-static.html)
``` css
a, p, div { border: solid 1px red; }
.static { position: static; left: 100px; top: 100px; }
```
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/53ETM3GNX7ZV65W%5DW~%28%7BZK3.png)
可见，此时添加定位（left: 100px; top: 100px;）是无效的

### relative与文档流
relative保持原有文档流，但相对本身的原始位置发生位移，且占空间
如图，[查看页面效果](http://o9bc2k1st.bkt.clouddn.com/position-relative.html)
``` css
a, p, div { border: solid 1px red; }
.relative { position: relative; left: 100px; top: 100px; }
```
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/PN1G~%5DQFF@E7AVRQJ9Z8%28JH.png)
可见：
- relative元素也遵循从上到下，从左到右的排版布局
- relative相对于其正常位置进行定位，在这里设置了relative的元素相对其原本位置（position=static）进行位移
- relative元素占有原本位置，因此下一个元素会排到该元素后方
- relative元素占位不会随着定位的改变而改变。也就是说relative在文档流中占有的位置与其原本位置（position=static）相同
这里有个需要注意的地方： 虽然relative元素占位与static相同，但会溢出父元素，撑开整个页面（document）。
如图，[查看页面效果](http://o9bc2k1st.bkt.clouddn.com/position-relative-occupation.html)
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/LHRK4@9K$YE1%25KMB%29G9%60~%7B8.png)
可以relative元素撑开父元素看到页面底部有滚动条。
此时给父元素设置overflow: hidden;则可以隐藏溢出部分，如图
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/KGE~71FX8H7DW6VNYC1T00M.png)

### absolute与文档流
absolute脱离文档流，相对于其包含块来定位，且不占位
如图
``` css
.parent{ border: solid 1px blue; width: 300px; } 
.parent > div{ border: solid 1px red; height: 100px; width: 300px; } 
.absolute{ position: absolute; left: 100px; height: 100px; }
```
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/75%5D1@NRTQ8$U9KTQ66SPL2A.png)
可见：
- absolute元素脱离文档流
- absolute元素不占位，因此下一个符合普通流的元素会略过absolute元素排到其上一个元素的后方

此时对于absolute元素的占位依然不大清晰，接下来我们给父元素添加margin-left: 200px的样式，如图
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/07J25Y0F~@O%5D@ZAGZ~%25%60%28%29Y.png)
很明显，absolute元素位置没有发生改变，这是因为该元素相对于document进行定位。

- absolute元素的定位是相对于static定位以外的第一个父元素进行定位
- 当absolute的父元素position为static，则会继续往上查找，直到找到一个为relative/absolute/fixed的父元素作为定位参照物
- 当absolute没有position为非static的父元素时，则会进行全局定位，即相对于文档document进行定位

所以我们可以给父元素加上position=relative的样式，如图
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/~NPVE%7D%7DZFR3$PH%609%5DFJQF2Y.png)
此时absolute元素则相对于父元素进行定位，[查看页面效果](http://o9bc2k1st.bkt.clouddn.com/position-absolute.html)。

### 无定位的absolute
在使用absolute进行定位时，若我们只是将元素设置为position: absolute，而不对其进行定位（top, bottom, left, right），会是怎样的情况呢？
如图，[查看页面效果](http://o9bc2k1st.bkt.clouddn.com/position-absolute-without-position.html)
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/CG_14%7DVI%28TDCYFK%7BE$8SC%287.png)
可见：
- 未设置定位的absolute元素，其定位与其原本位置（position=static）相同
- 此时absolute元素依然不占位，因此下一个符合普通流的元素会略过absolute元素排到其上一个元素的后方

### fixed与文档流
fixed脱离文档流，相对于浏览器窗口来定位，且不占位
如图
``` css
.parent { border: solid 1px blue; width: 300px; } 
.parent > div { border: solid 1px red; height: 100px; width: 300px; } 
.fixed { position: fixed; left: 100px; top: 100px; background: yellow; }
```
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/%28FNOAFPIA%5B80%25F%7D6%5B0CQ2%7DE.png)
似乎跟相对于文档定位时的absolute元素没什么两样，即
- fixed元素脱离文档流
- fixed元素不占位

接来下我们将页面填充满，如图，[查看页面效果](http://o9bc2k1st.bkt.clouddn.com/position-fixed-absolute.html)
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/K4OGL%5BF5~XP9NLRW%254X%7B55X.png)
当我们进行页面滚动的时候，fixed元素位置没有发生变化，可见：

- fixed相对于浏览器窗口来定位，不管是否有static定位以外的父元素
- absolute元素会随着页面的滚动而滚动，而fixed不会

也就是说，fixed元素相对于浏览器窗口进行定位，而无有static定位以外的父元素的absolute，则相对于document进行定位

## z-index
-----
### z-index简述
- z-index属性定义了第三维度，默认为0
- z-index属性设置元素的堆叠顺序，拥有更高堆叠顺序的元素总是会处于堆叠顺序较低的元素的前面
- z-index只能在position属性值为relative或absolute或fixed的元素上有效
-

### z-index在同级元素下的效果
如图，[查看页面效果](http://o9bc2k1st.bkt.clouddn.com/position-z-index-same-level.html)
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/%60X74TE9%7D%28OFY%7BUK$MAW%5B%7B5O.png)
可见：
- 当同级元素不设置z-index或者z-index相等时，后面的元素会叠在前面的元素上方
- 当同级元素z-index不同时，z-index大的元素会叠在z-index小的元素上方

### z-index在不同级元素下的效果
如图，[查看页面效果](http://o9bc2k1st.bkt.clouddn.com/position-z-index-diff-level-1.html)
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/Q%7BFVVGE6NSP8WB~_3P7SZ$G.png)
仔细看会发现个很有意思的现象，parent1和parent2为同级元素，parent2叠在parent1上方，但是parent2子元素却位于parent1子元素的下方。
parent1和parent2的position均为relative，是不是有些难以理解？这是因为：
- 当向上追溯找不到含有z-index值的父元素的情况下，则可以视为自由的z-index元素
- 自由的z-index元素可以与其他自由的定位元素来比较z-index的值，决定其堆叠顺序

在这里，parent1和parent2均无设置z-index值，故在这里子元素的堆叠顺序是由自己的z-index值决定的。
接下来我们为两个parent均加上z-index，如图，[查看页面效果](http://o9bc2k1st.bkt.clouddn.com/position-z-index-diff-level-2.html)
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/PMVG4833%60U%29JC9%5BWK5W%601NC.png)

经测试，在parent2的z-index大于或者等于parent1的z-index的时候，parent2以及它的子元素均位于parent1以及其子元素的上方。
而当我们设置parent2的z-index小于parent1的z-index的时候，如图
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/@22C%5D%5D9~A7%28%29%5B%60LZLD@%29%7BRF.png)
此时parent2以及它的子元素均位于parent1以及其子元素的下方。
可见：
- z-index值只决定同一父元素中的同级子元素的堆叠顺序
- 父元素的z-index值为子元素定义了堆叠顺序，即子元素依赖于父元素z-index值来获得页面中的堆叠顺序

现在我们将parent2的z-index值取消，留下parent1的z-index值为2。
如图，[查看页面效果](http://o9bc2k1st.bkt.clouddn.com/position-z-index-diff-level-3.html)
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/G%5D6CTV7PXO%28UD7B%5B%7B%60%28U693.png)
可见：
- 自由的z-index元素可以与父元素的同级兄弟定位元素来比较z-index的值，决定其堆叠顺序

### z-index与position: fixed
当初一直认为fixed的元素有种优先级特别高的感觉，但在z-index比较上却有了新发现，如图
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/IN7X7L4FJ%5DYT%7DZPG~8_I%60@R.png)
经测试，在不设置z-index值或者z-index值相等时，fixed元素和absolute元素堆叠顺序均由元素在文档中的先后位置决定，后出现的会在上面。
接下来我们给这几个子元素加上z-index值，如图
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/FMC%60R%25%25LLKVM9OQ1~5~%29GQ3.png)
这时候我们会有种想法，会不会fixed元素和absolute元素的堆叠规则一样呢？
现在我们将fixed元素移到parent元素外面，且parent元素z-index值依然为空，如图，[查看页面效果](http://o9bc2k1st.bkt.clouddn.com/position-z-index-fixed.html)
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/A%284RG%7BTP~2$%29%29ZE5Y2HW%7BOD.png)
可见：
- 尽管fixed定位方式与absolute不一致，它们的堆叠规则是一致的

### z-index总结
- 无z-index或者z-index值相等时，堆叠顺序均由元素在文档中的先后位置决定，后出现的会在上面
- 当向上追溯找不到含有z-index值的父元素的情况下，则可以视为自由的z-index元素
- 自由的z-index元素可以与其他自由的定位元素或者父元素的同级兄弟定位元素来比较z-index的值，决定其堆叠顺序
- z-index值只决定同一父元素中的同级子元素的堆叠顺序
- 父元素的z-index值为子元素定义了堆叠顺序，即子元素依赖于父元素z-index值来获得页面中的堆叠顺序

- 参考
[浅析CSS——元素重叠及position定位的z-index顺序](http://www.cnblogs.com/mind/archive/2012/04/01/2198995.html)

- 相关代码保存在[about-position](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/about-position)

## 结束语
不得不说，写这篇文章的过程自己对position和z-index相关的原理和规则也熟悉了很多，总结也是一种学习的方式呢。

