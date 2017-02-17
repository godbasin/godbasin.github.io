---
title: Box2DJS教程3-3--圆形
date: 2017-02-17 21:00:10
categories: box2djs方糖
tags: 教程
---
本节主要介绍圆形。
<!--more-->

## 圆形
-----
### b2CircleDef 
使用基类b2CircleDef创建一个圆形形状，并且设置其属性。

- `b2CircleDef`
  - 继承于b2ShapeDef
  - type为e_circleShape
  - radius来表示半径值

``` javascript
var Shape = new b2CircleDef();      //创建一个圆形Shape，然后设置有关Shape的属性
Shape.radius = 20;                  //设置圆形的半径
Shape.localPosition.Set(0, 0);      //设置圆形的偏移量
Shape.density = 1.0;                //设置圆形的密度
Shape.restitution = .3;             //设置圆形的弹性
Shape.friction = 1;                 //设置圆形的摩擦因子
```


### [返回总目录](/2017/02/17/box2d-tutorial-0-catalog/) 