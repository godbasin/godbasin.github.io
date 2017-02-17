---
title: Box2DJS教程3-2--矩形
date: 2017-02-17 21:00:09
categories: box2djs方糖
tags: 教程
---
本节主要介绍矩形。
<!--more-->

## 矩形
-----
### b2BoxDef 
使用基类b2BoxDef创建一个矩形形状，并且设置其大小、密度、弹性、摩擦力等属性。

- `b2BoxDef`
  - 继承于b2ShapeDef
  - type为e_ boxShape
  - extents来表示区域值

``` javascript
var Shape = new b2BoxDef();        //创建一个形状Shape，然后设置有关Shape的属性
Shape.extents.Set(1200, 5);        //设置矩形高、宽,
Shape.density = 0;                 //设置矩形的密度
Shape.restitution = .3;            //设置矩形的弹性
Shape.friction = 1;                //设置矩形的摩擦因子，可以设置为0-1之间任意一个数，0表示光滑，1表示强摩擦
```

备注：如果将密度设置为0或者null，那么该形状是静止，即不可被移动的地面或者墙体等。


### [返回总目录](/2017/02/17/box2d-tutorial-0-catalog/) 