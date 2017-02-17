---
title: Box2DJS教程5-3--获取刚体的各属性
date: 2017-02-17 21:00:22
categories: box2djs方糖
tags: 教程
---
本节主要介绍获取刚体的各属性。
<!--more-->

## 获取刚体的各属性
-----
### `Body.Get属性名()`
在实际编程中，往往需要得到一些关于刚体的信息、数据等，以便下一步对刚体进行一系列操作。
下面代码中给出了获取某些数据的方法，还有一些设置刚体属性的语句。语法格式一般为Body.Get属性名()。

``` javascript
function showAllFuc() {
	//获得刚体位置
	var OriginPosition = new b2Vec2();                //利用b2Vec2定义一个起始位置的二维矢量
	OriginPosition = slectBody.GetOriginPosition();	  //获取刚体坐标原点，对称图形的原点即中心点
	alert(OriginPosition.x + "," + OriginPosition.y); //显示该坐标

	var mass;
	mass = slectBody.GetMass();          //获取刚体质量

	var inertia;
	inertia = slectBody.GetInertia();    //获取惯性，类似力的大小
	alert(inertia);

	var worldPoint;
	var localPoint = new b2Vec2(100, 100);
	worldPoint = slectBody.GetWorldPoint(localPoint);	                              //由局部坐标得到世界坐标
	alert(slectBody.GetCenterPosition().x + "," + slectBody.GetCenterPosition().y);	  //世界坐标=局部坐标+刚体中心点坐标
	alert(localPoint.x + "," + localPoint.y);
	alert(worldPoint.x + "," + worldPoint.y);

	var localVector;
	var worldVector = new b2Vec2(slectBody.GetCenterPosition().x,
		slectBody.GetCenterPosition().y);
	localVector = slectBody.GetLocalVector(worldVector);
	alert(worldVector.x + "," + worldVector.y);
	alert(localVector.x + "," + localVector.y);

	var staticFlage;                                //定义一个静态标志
	staticFlage = slectBody.IsStatic();             //判断选中物体是否为静止不可移动的刚体，并将结果反馈给静态标志
	alert(staticFlage);

	var frozenFlage;
	frozenFlage = slectBody.IsFrozen();
	alert(frozenFlage);

	var sleepingFlage;                              //定义一个睡眠标志
	sleepingFlage = slectBody.IsSleeping();	        //判断选中物体是否已进入睡眠状态，并将结果反 馈给静态标志
	alert(sleepingFlage);

	var allowSleepingFlage = 1;                     //定义一个允许睡眠的标志，并设定初值为1，即允许睡眠
	slectBody.AllowSleeping(allowSleepingFlage);	//根据标志判断是否允许睡眠，是则可进入睡眠状态，否则唤醒
	slectBody.WakeUp();                             //唤醒睡眠刚体，对于非静止刚体，只有碰撞才能自动唤醒，对其赋予速度、力等值时，需要先行唤醒才有效果

	var shapeList = new Array();
	shapeList = slectBody.GetShapeList();           //数组内保存选中刚体的shapelist；直接用m_shapeList效果一样,列表里是一个个的shape，shape是一个类，其表面形状类型的属性为shape.m_type
	slectBody.Destroy();                            //在世界里销毁该刚体
	slectBody.GetNext();                            //获取下一刚体，在world里刚体储存在m_BodyList里

	var otherBody = Body4;
	var conectJuge;
	conectJuge = slectBody.IsConnected(otherBody);	//判定选定的刚体是否与另一刚体相连，相连则不碰撞
	alert(conectJuge);
}
```


### [返回总目录](/2017/02/17/box2d-tutorial-0-catalog/) 