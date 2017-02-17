---
title: Box2DJS教程7-2--collisions-api
date: 2017-02-17 21:00:33
categories: box2djs方糖
tags: 教程
---
本节主要介绍collisions相关api。
<!--more-->

## collisions
-----
### shapes形状定义
- `b2ShapeDef`：形状定义
  - b2ShapeDef为形状定义
  - type来表示形状类型
  - localPosition来表示当前位置
  - localRotation来表示当前角度
  - friction、density、restitution来表示摩擦力、密度、弹性系数
  - categoryBits和maskBits来表示碰撞位及位标识（可以用来过滤一些碰撞）
  - groupIndex来表示组号，这个组号可以用来过滤还比位标识优先

- `b2CircleDef`：圆形
  - 继承于b2ShapeDef
  - type 为 e_circleShape
  - 带有一个类型为float32的量radius来表示半径值

- `b2BoxDef`：矩形
  - 继承于b2ShapeDef
  - type 为 e_ boxShape
  - 带有一个类型为b2Vec2的量extents来表示区域值

- `b2PolyDef`：凸多边形
  - 继承于b2ShapeDef
  - type 为 e_ polyShape
  - 带有一个类型为b2Vec2的数组vertices来表示顶点
  - 带有一个int32型的量vertexCount来表示顶点数，目前顶点数最多支持8个

### 碰撞的功能/查询
- `b2AABB`：AABB坐标
  - 盒子，由两个向量组成，一个为minVertex是最小顶点，另一个为maxVertex是最大顶点，通过这两个顶点来表示最为普通的AABB框

- `b2OBB`：OBB坐标
- `b2ContactID`：接触ID
- `b2ContactPoint`：接触点

### broad-phase算法
- `b2BroadPhase`：通过使用动态树降低了管理数据方面的开销，极大的降低了调用narrow-phase算法的次数


### [返回总目录](/2017/02/17/box2d-tutorial-0-catalog/)  