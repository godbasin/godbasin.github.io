---
title: Box2DJS教程4-2--旋转关节(revolute-joint)
date: 2017-02-17 21:00:15
categories: box2djs方糖
tags: 教程
---
本节主要介绍旋转关节(revolute-joint)。
<!--more-->

## 旋转关节(revolute-joint)
-----
### 说明
一个旋转关节会强制两个物体共享一个锚点，即铰接点。旋转关节只有一个自由度：两个物体的相对旋转。

旋转关节即相当于将两个物体用钉子钉在一起，两个物体都可以绕这颗钉子旋转。当然，如果其中一个物体为地面的话，就相当于将物体钉在地面上，物体都可以绕这颗钉子旋转。

### b2RevoluteJointDef
首先创建两个物体，然后将它们放在世界里，使用基类b2RevoluteJointDef创建一个旋转关节，设定铰接点，及旋转关节连接的是哪两个物体之后即可将其放入到世界里。

``` javascript
var jointDefRevolute = new b2RevoluteJointDef();  //创建一个旋转关节jointDefRevolute
jointDefRevolute.anchorPoint.Set(450, 450);       //设定铰接点坐标
jointDefRevolute.body1 = Body1;                   //设定旋转关节一端连接Body1
jointDefRevolute.body2 = Body2;                   //设定旋转关节另一端连接Body2
var jointRevolute= world.CreateJoint(jointDefRevolute);     //将旋转关节放入世界中
jointRevolute.SetMotorSpeed(100);           //设置旋转关节马达的速度
```


### [返回总目录](/2017/02/17/box2d-tutorial-0-catalog/) 