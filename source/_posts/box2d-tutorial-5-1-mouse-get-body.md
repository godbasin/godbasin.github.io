---
title: Box2DJS教程5-1--鼠标获取刚体
date: 2017-02-17 21:00:20
categories: box2djs方糖
tags: 教程
---
本节主要介绍鼠标获取刚体。
<!--more-->

## 鼠标获取刚体
-----
### 鼠标获取刚体--对刚体进行操作的前提
Box2D中，只要提供一个AABB的坐标，b2World就可以返回一个数组，用于保存所有相交于此AABB的形状。

所以，为了利用鼠标获取刚体，首先要画出一个小区域，这个区域小到近似于一个点，然后遍历整个世界的形状，判断鼠标点击位置所画出的小区域是否与某个形状重合，如果有重合，再由这个形状得到这个形状所属的刚体。

``` javascript
function GetBodyAtMouse() {
	//首先创建一个近似于点的小区域
	var mousePVec = new b2Vec2(mousedwX, mousedwY);
	//利用b2Vec2定义一个矢量，用来保存鼠标点击的点
	var aabb = new b2AABB();
	//利用b2AABB创建一个环境
	aabb.minVertex.Set(mousePVec.x - 0.001, mousePVec.y - 0.001);
	aabb.maxVertex.Set(mousePVec.x + 0.001, mousePVec.y + 0.001);
	//设置aabb的左上角及右下角坐标，这里是以鼠标点击位置为中心创建了一个长、宽均为0.002的矩形区域

	//然后查询与指定区域有重叠的刚体
	var k_maxCount = 10;     //设定所要查找形状的数量，注意合理设置其大小，过大会影响运行速度
	var shapes = new Array();  //保存查找到的与已知边界盒相交的形状
	var count = world.Query(aabb, shapes, k_maxCount);    //在世界中查找与边界盒相交的maxCount个形状，并返回边界盒区域内实际包含的形状的个数

	var findBody = null;      //首先设定没有找到物体
	for (var i = 0; i < count; ++i) {
		if (shapes[i].GetBody().IsStatic() == false)
		//条件假定查找到的形状不是静态刚体，比如墙
		{
			var tShape = shapes[i];    //将查找到的形状赋给tShape变量
			var inside = tShape.GetBody();   //将tShape对应的刚体赋给inside
			if (inside)        //如果inside这个刚体存在
			{
				//那么返回这个刚体，并跳出遍历
				findBody = tShape.GetBody();
				break;        
			}
		}
	}
	return findBody;
}
```


### [返回总目录](/2017/02/17/box2d-tutorial-0-catalog/) 