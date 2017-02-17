---
title: Box2DJS教程5-2--获取参与碰撞的刚体
date: 2017-02-17 21:00:21
categories: box2djs方糖
tags: 教程
---
本节主要介绍获取参与碰撞的刚体。
<!--more-->

## 获取参与碰撞的刚体
-----
### m_contactList
m_contactList的类型是b2ContactNode，取得附加在该物体上的碰撞表，所有碰撞都保存在这个列表里。
同ShapeList相比，ShapeList保存的是世界中所有的形状，而contactlist保存的是参与碰撞的形状。

``` javascript
function getContactInf() {
	for (var b = world.m_contactList; b; b = b.m_next)
	// 遍历contactlist所有世界，直到b不存在，跳出循环
	{
		// 将b里的两个刚体分别定义为b1和b2
		var b1 = b.m_shape1.m_body;
		var b2 = b.m_shape2.m_body;	  

		// 向下执行的条件是b1和b2不同，且不是三面挡板（BodyTop/BodyLeft/BodyRight）
		if ((b1 != Body2) && (b1 != BodyTop) && (b1 != BodyLeft) && (b1 != BodyRight) && (b2 != Body2) && (b2 != BodyTop) && (b2 != BodyLeft) && (b2 != BodyRight)){}
		// 备注：得到了参与碰撞的刚体，则可以对其中的所有刚体的操作，这个发挥的空间留给游戏开发过程
	}
}
```

### GetContactList
GetContactList其实与上面的作用效果一样，而且其判断接触的逻辑思路也是一致的。

``` javascript
for (var cn = world.GetContactList(); cn != null; cn = cn.GetNext()) {
	var body1 = cn.GetShape1().GetBody();
	var body2 = cn.GetShape2().GetBody();

	// 处理判断发生碰撞的两个刚体是不是分别为箱子和墙壁
	if ((body1 ==  box && body2 == wall) || (body2 == box && body1 == wall)){
		// 进行逻辑处理
	}
}
```


### [返回总目录](/2017/02/17/box2d-tutorial-0-catalog/) 