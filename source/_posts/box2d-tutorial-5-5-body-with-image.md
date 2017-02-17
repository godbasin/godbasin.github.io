---
title: Box2DJS教程5-5--绘制功能
date: 2017-02-17 21:00:24
categories: box2djs方糖
tags: 教程
---
本节主要介绍绘制功能，包括绘制刚体、关节等。
<!--more-->

## 绘制刚体
-----
### 绘制刚体图片
1. 在页面中加入图片，并捆绑id

``` html
<img id="box" src='images/box.png'>
```

2. 设置形状定义的userData为图片id

``` javascript
boxSd.userData = document.getElementById('box');
```

3. 在绘制世界时，将图片信息绘制进去

``` javascript
// 绘画世界
function drawWorld(world, context) {
	for (var b = world.m_bodyList; b != null; b = b.m_next) {
		for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
			if (s.GetUserData() != undefined) {
				// 使用数据包括图片
				var img = s.GetUserData();

				// 图片的长和宽
				var x = s.GetPosition().x;
				var y = s.GetPosition().y;
				var topleftX = - $(img).width() / 2;
				var topleftY = - $(img).height() / 2;

				context.save();
				context.translate(x, y);
				context.rotate(s.GetBody().GetRotation());
				context.drawImage(img, topleftX, topleftY);
				context.restore();
			}
			drawShape(s, context);
		}
	}
}
```

注意，以上的方法只试用于圆形和矩形，多边形待验证。

### 绘制刚体形状
有时候我们需要将刚体和关节的形状绘制出来：

``` javascript
// 从draw_world.js里面引用的绘画功能
function drawShape(shape, context) {
	context.strokeStyle = '#003300';
	context.beginPath();
	switch (shape.m_type) {
        // 绘制圆
		case b2Shape.e_circleShape:
			var circle = shape;
			var pos = circle.m_position;
			var r = circle.m_radius;
			var segments = 16.0;
			var theta = 0.0;
			var dtheta = 2.0 * Math.PI / segments;
			// 画圆圈
			context.moveTo(pos.x + r, pos.y);
			for (var i = 0; i < segments; i++) {
				var d = new b2Vec2(r * Math.cos(theta), r * Math.sin(theta));
				var v = b2Math.AddVV(pos, d);
				context.lineTo(v.x, v.y);
				theta += dtheta;
			}
			context.lineTo(pos.x + r, pos.y);

			// 画半径
			context.moveTo(pos.x, pos.y);
			var ax = circle.m_R.col1;
			var pos2 = new b2Vec2(pos.x + r * ax.x, pos.y + r * ax.y);
			context.lineTo(pos2.x, pos2.y);
			break;
		// 绘制多边形
        case b2Shape.e_polyShape:
			var poly = shape;
			var tV = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
			context.moveTo(tV.x, tV.y);
			for (var i = 0; i < poly.m_vertexCount; i++) {
				var v = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
				context.lineTo(v.x, v.y);
			}
			context.lineTo(tV.x, tV.y);
			break;
	}
	context.stroke();
}
```

## 绘制关节
-----
### 绘制关节
- 在绘制世界时加入关节的判断和绘制调用

``` javascript
function drawWorld(world, context) {
	for (var j = world.m_jointList; j; j = j.m_next) {
        // 绘制关节
		drawJoint(j, context);
	}
	for (var b = world.m_bodyList; b; b = b.m_next) {
		for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
            // 绘制刚体形状
			drawShape(s, context);
		}
	}
}
```

- 绘制关节

``` javascript
function drawJoint(joint, context) {
	var b1 = joint.m_body1;
	var b2 = joint.m_body2;
	var x1 = b1.m_position;
	var x2 = b2.m_position;
	var p1 = joint.GetAnchor1();
	var p2 = joint.GetAnchor2();
	context.strokeStyle ='#00eeee';
	context.beginPath();
	switch (joint.m_type) {
    // 绘制距离关节
	case b2Joint.e_distanceJoint:
		context.moveTo(p1.x, p1.y);
		context.lineTo(p2.x, p2.y);
		break;

	case b2Joint.e_pulleyJoint:
		// TODO
		break;

	default:
		if (b1 == world.m_groundBody) {
			context.moveTo(p1.x, p1.y);
			context.lineTo(x2.x, x2.y);
		}
		else if (b2 == world.m_groundBody) {
			context.moveTo(p1.x, p1.y);
			context.lineTo(x1.x, x1.y);
		}
		else {
			context.moveTo(x1.x, x1.y);
			context.lineTo(p1.x, p1.y);
			context.lineTo(x2.x, x2.y);
			context.lineTo(p2.x, p2.y);
		}
		break;
	}
	context.stroke();
}
```


### [返回总目录](/2017/02/17/box2d-tutorial-0-catalog/) 