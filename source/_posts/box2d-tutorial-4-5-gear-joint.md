---
title: Box2DJS教程4-5--齿轮关节(gear-joint)
date: 2017-02-17 21:00:18
categories: box2djs方糖
tags: 教程
---
本节主要介绍齿轮关节(gear-joint)。
<!--more-->

## 齿轮关节(gear-joint)
-----
### 说明
齿轮关节需要两个被旋转关节或移动关节接地(ground)的物体，可以任意组合这些关节类型。

### b2PulleyJointDef
另外，创建旋转或移动关节时，Box2D需要地(ground)作为 body1。

``` javascript
var Shape1 = new b2BoxDef();  //也可以是圆形或者多边形刚体
Shape1.extents.Set(10, 10);
Shape1.density = 1; 
Shape1.restitution = .3;         
Shape1.friction = 1;     

var BodyDef1 = new b2BodyDef();
BodyDef1.position.Set(950, 450);   
BodyDef1.AddShape(Shape1); 
Body1 = world.CreateBody(BodyDef1); 

var jointDefRevolute = new b2RevoluteJointDef();   //创建一个旋转关节
jointDefRevolute.anchorPoint.Set(950, 450);
jointDefRevolute.body1 =world.GetGroundBody();    //用作齿轮关节的旋转关节body1须为GroundBody
jointDefRevolute.body2 = Body1;    //将旋转关节另外一个物体设为Body1
var jointRevolute= world.CreateJoint(jointDefRevolute);    //将旋转关节放入世界中

var Shape2 = new b2BoxDef();
Shape2.extents.Set(100, 10); 
Shape2.density = 1;
Shape2.restitution = .3;       
Shape2.friction = 1;            

var BodyDef2 = new b2BodyDef();
BodyDef2.position.Set(950, 530);
BodyDef2.AddShape(Shape2);
Body2 = world.CreateBody(BodyDef2); 

var jointDefPrismatic = new b2PrismaticJointDef();   //创建一个移动关节
jointDefPrismatic.anchorPoint.Set(950, 565); 
jointDefPrismatic.axis.Set(1,0);     //在齿轮关节中，这个轴只要设置成平行于屏幕就行，也就是说随着齿轮旋转，移动关节可以上下、左右来回运动，（斜向运动会出现bug）
jointDefPrismatic.body1 =world.GetGroundBody();    //用作移动关节的移动关节body1须为GroundBody
jointDefPrismatic.body2 =Body2;    //移动关节的另外一个物体设置为Body2
var jointPrismatic= world.CreateJoint(jointDefPrismatic);     //将移动关节放入到世界中

var jointDefGear = new b2GearJointDef();    //使用基类b2GearJointDef创建一个齿轮关节
jointDefGear.body1=Body1;
jointDefGear.body2=Body2;    //设置齿轮关节连接的两个物体分别是Body1和Body2
jointDefGear.joint1=jointRevolute;
jointDefGear.joint2=jointPrismatic;
var jointGear=world.CreateJoint(jointDefGear);     //将齿轮关节放入到世界中
jointGear.m_ratio=1;      //设定比例系数，ratio=转动圈数/移动距离
```


### [返回总目录](/2017/02/17/box2d-tutorial-0-catalog/) 