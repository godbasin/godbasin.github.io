---
title: Box2DJS教程3-4--凸多边形
date: 2017-02-17 21:00:11
categories: box2djs方糖
tags: 教程
---
本节主要介绍凸多边形。
<!--more-->

## 凸多边形
-----
### b2PolyDef
使用基类b2PolyDef创建一个多边形形状，并且设置其属性。

- `b2PolyDef`
  - 继承于b2ShapeDef
  - type为e_ polyShape
  - vertices来表示顶点
  - vertexCount来表示顶点数，目前顶点数最多支持8个

``` javascript
var Shape = new b2PolyDef();              //创建一个多边形Shape，然后设置有关Shape的属性
Shape.vertexCount = 5;                    //设置多边形的顶点数，这里设置为5，意味着Shape是个五边形
Shape.vertices[0] = new b2Vec2(0,-20);    //分别定义五个顶点的坐标
Shape.vertices[1] = new b2Vec2(25,0); 
Shape.vertices[2] = new b2Vec2(15,30);
Shape.vertices[3] = new b2Vec2(-15,30);
Shape.vertices[4] = new b2Vec2(-25,0);
Shape.localPosition.Set(0, 30);           //设置多边形的偏移量
Shape.density = 1.0;                      //设置多边形的密度
Shape.restitution = .3;                   //设置多边形的弹性
Shape.friction = 1;                       //设置多边形的摩擦因子
```

注意：box2d只能创建顶点数不超过8的凸多边形。

多形状刚体中形状的偏移，在多个形状所组成的刚体中，所有形状的中心点都是刚体的初始位置，我们可以设置偏移量使形状偏移中心点。


### [返回总目录](/2017/02/17/box2d-tutorial-0-catalog/) 