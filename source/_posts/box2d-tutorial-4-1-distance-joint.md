---
title: Box2DJS教程4-1--距离关节(distance-joint)
date: 2017-02-17 21:00:14
categories: box2djs方糖
tags: 教程
---
第四章主要介绍距离关节(distance-joint)。
<!--more-->

## 距离关节(distance-joint)
-----
### 说明
使用距离关节连接的两个物体上的选定的两个点之间的距离是常量，它限制了两个物体之间的距离，使它始终保持一个常量，就像自行车的两个轮子。

### b2DistanceJointDef
距离关节是最简单的关节之一，它描述了两个物体上的两个点之间的距离应该是常量。当你指定一个距离关节时，两个物体必须已在应有的位置上。
随后，你指定两个世界坐标中的锚点 。第一个锚点连接到物体1，第二个锚点连接到物体2。这些点隐含了距离约束的长度。

首先创建两个物体，然后放到世界里，然后使用基类b2DistanceJointDef创建一个距离关节，连接它们。

每个距离关节都有两个锚点，分别赋予两个物体上某一点的坐标，这样子就使用一个距离关节将两个物体的选定点连起来。

``` javascript
var Shape1 = new b2BoxDef();           //创建一个形状Shape1
Shape1.extents.Set(10, 10);         
Shape1.density = 1;                 
Shape1.restitution = .3;            
Shape1.friction = 1;                

var BodyDef1 = new b2BodyDef();       //用Shape1创建一个物体BodyDef1
BodyDef1.position.Set(300, 490);    
BodyDef1.AddShape(Shape1);      
Body1 = world.CreateBody(BodyDef1);   //将BodyDef1放到世界里

var Shape2 = new b2BoxDef();
Shape2.extents.Set(20, 20);
Shape2.density = 1;
Shape2.restitution = .3;
Shape2.friction = 1;

var BodyDef2 = new b2BodyDef();
BodyDef2.position.Set(400, 480); 
BodyDef2.AddShape(Shape2);
Body2 = world.CreateBody(BodyDef2);

var jointDefDistance = new b2DistanceJointDef();  //创建一个距离关节jointDefDistance
jointDefDistance.body1 = Body1;                   //该关节一端连在Body1上
jointDefDistance.body2 = Body2;                   //该关节另一端连在Body2上
jointDefDistance.anchorPoint1=Body1.GetCenterPosition();  //关节和Body1的连接锚点是Body1的中心位置
jointDefDistance.anchorPoint2=Body2.GetCenterPosition();  //关节和Body2的连接锚点是Body2的中心位置
var jointDistance=world.CreateJoint(jointDefDistance);    //将距离关节jointDefDistance放入到世界中
```


### [返回总目录](/2017/02/17/box2d-tutorial-0-catalog/) 