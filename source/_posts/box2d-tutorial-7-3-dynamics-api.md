---
title: Box2DJS教程7-3--dynamics-api
date: 2017-02-17 21:00:34
categories: box2djs方糖
tags: 教程
---
本节主要介绍dynamics相关api。
<!--more-->

## dynamics
-----
### 刚体
- `b2BodyDef`：
  - 刚体定义结构
  - userData来表示用户数据
  - shapes来表示形状队列，目前形状数最大支持64个
  - position来表示当前位置
  - rotation来表示当前角度
  - linearVelocity表示线速度
  - angularVelocity来表示角速度
  - linearDamping来表示线性阻尼
  - angularDamping来表示角阻抗
  - allowSleep来表示是否可以允许休眠
  - isSleeping来表示是否正在休眠
  - preventRotation来表示是否防止旋转
  - 支持方法：AddShape(b2ShapeDef* shape)

- `b2CollisionFilters`：
  - 碰撞过滤是用来防止形状与形状之间进行碰撞的，可以用碰撞种类和组名来区别
  - Box2D总共提供16种碰撞种类，每个形状都可以提定属于什么种类，那么它就可以和其他不同种类的形状碰撞
  
### 结点(joints)
- `b2DistanceJoint`：距离连接
- `b2DistanceJointDef`：距离连接定义
- `b2GearJoint`：齿轮连接
- `b2GearJointDef`：齿轮连接定义
- `b2Joint`：连接基类
- `b2JointDef`：连接定义基类
- `b2JointEdge`：用于组合刚体或连接到一起.刚体相当于节点,而连接相当于边
- `b2MouseJoint`：鼠标连接
- `b2MouseJointDef`：鼠标连接定义
- `b2PrismaticJoint`：移动连接
- `b2PrismaticJointDef`：移动连接定义
- `b2PulleyJoint`：滑轮连接
- `b2PulleyJointDef`：滑轮连接定义
- `b2RevoluteJoint`：旋转连接
- `b2RevoluteJointDef`：旋转连接定义

### 接触管理(contacts)
- `b2Contact`：管理两个外形接触
- `b2ContactEdge`：接触边用来连接多个物体和接触到一个接触表(物体是一个节点而接触相当于一个接触边)
- `b2ContactResult`：记录接触结果


### [返回总目录](/2017/02/17/box2d-tutorial-0-catalog/)  