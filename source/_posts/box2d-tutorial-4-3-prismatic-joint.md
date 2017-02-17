---
title: Box2DJS教程4-3--移动关节(prismatic-joint)
date: 2017-02-17 21:00:16
categories: box2djs方糖
tags: 教程
---
本节主要介绍移动关节(prismatic-joint)。
<!--more-->

## 移动关节(prismatic-joint)
-----
### 说明
移动关节允许两个物体沿指定轴相对移动，它会阻止相对旋转，简而言之，就是关节对物体的影响只体现在轴向方向。因此，移动关节只有一个自由度。

移动关节类似旋转关节，只是将旋转角度换成了平移。关节中的两个刚体的相对运动只能发生在其轴向上。

### b2PrismaticJointDef
首先创建两个物体，将其放入世界里，然后使用基类b2PrismaticJointDef创建一个移动关节，设置其各个参数，再将其放入到世界里即可。

``` javascript
var jointDefPrismatic = new b2PrismaticJointDef(); //创建一个移动关节jointDefPrismatic
jointDefPrismatic.anchorPoint.Set(700, 565);     //一般选择两个锚点的中心点
jointDefPrismatic.axis.Set(1, 0);                //两物体只沿轴向方向有相对运动
jointDefPrismatic.body1 = Body1;              //移动关节的一端连接到Body1上
jointDefPrismatic.body2 = Body2;              //移动关节的另一端连接到Body2上
var jointPrismatic= world.CreateJoint(jointDefPrismatic); //将设置好参数的移动关节放到世界里
```


### [返回总目录](/2017/02/17/box2d-tutorial-0-catalog/) 