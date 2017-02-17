---
title: Box2DJS教程5-4--为刚体设置属性
date: 2017-02-17 21:00:23
categories: box2djs方糖
tags: 教程
---
本节主要介绍为刚体设置属性。
<!--more-->

## 为刚体设置属性
-----
### 设置刚体的属性
创建一个刚体之后，还可以对它进行许多操作，比如设置质量，访问其位置和速度，施加力，以及转换点和向量等。

``` javascript
// 设置刚体的属性
var position = new b2Vec2(200, 100);             //定义一个点坐标（200，100）
var rotation = 0.3 * Math.PI;                    //定义一个弧度值
spclBodyDef.position.Set(basicX, basicY);    //设置物体的初始位置置，括号内是矢量坐标
slectBody.SetCenterPosition(position, rotation); //设置选中的刚体的中心位置及其旋转弧度

var CenterPosition = new b2Vec2();
CenterPosition = slectBody.GetCenterPosition();
alert(CenterPosition.x + "," + CenterPosition.y);

var RotationMatrix = new b2Mat22();
RotationMatrix = slectBody.GetRotationMatrix();	  //获取一个2X2的刚体旋转矩阵
alert(RotationMatrix);

var LinearVelocity = new b2Vec2(500, -500);	      //定义一个线速度
slectBody.WakeUp();                               //唤醒选中物体，刷新数据
slectBody.SetLinearVelocity(LinearVelocity);	  //设定选中物体的线速度

var LinearVelocity = new b2Vec2();
LinearVelocity = slectBody.GetLinearVelocity();	  //获取选中刚体的线速度向量
alert(LinearVelocity.x + "," + LinearVelocity.y);

var AngularVelocity = 100;                        //定义一个角速度
slectBody.WakeUp();
slectBody.SetAngularVelocity(AngularVelocity);	  //设定选中物体的角速度

var AngularVelocity;
AngularVelocity = slectBody.GetAngularVelocity(); //获取选中刚体的角速度向量
alert(AngularVelocity);

var force = new b2Vec2(10000, 1000000000);	      //定义一个力的大小及方向
var point = new b2Vec2(slectBody.GetCenterPosition().x, slectBody.GetCenterPosition().y);
slectBody.WakeUp();
//在指定点给物体施加一个已知大小与方向的力
//施加一个力,需要很大才有效果，不如直接给定线速度，一般给力据F=ma给定
slectBody.ApplyForce(force, point);
alert(slectBody.m_linearVelocity);

var torque = 100000000000;                        //定义一个力矩
slectBody.WakeUp();
slectBody.ApplyTorque(torque);                    //设定选定物体的力矩，数值较大，可以通过设定角速度大小实现相同功能

var impulse = new b2Vec2(0, 100000000);	          //定义一个物体的冲量
var point = new b2Vec2(slectBody.GetCenterPosition().x, slectBody.GetCenterPosition().y);
slectBody.WakeUp();
//在指定点给物体施加一个已知大小与方向的冲量，一般在初始的时候给定，以便决定初始运动
slectBody.ApplyImpulse(impulse, point);	          
```


### [返回总目录](/2017/02/17/box2d-tutorial-0-catalog/) 