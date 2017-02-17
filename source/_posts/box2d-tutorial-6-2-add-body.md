---
title: Box2DJS教程6-2--添加刚体
date: 2017-02-17 21:00:27
categories: box2djs方糖
tags: 教程
---
本节我们主要讲述在世界中创建形状并添加刚体的过程。
<!--more-->

## 添加刚体
-----
### 创建刚体
前面我们说过，box2d中创建刚体、关节的过程类似于堆积木，由形状构成刚体，由刚体构成关节，稍微不同的地方是，这里的形状可以多次使用，其过程：
`形状 -> 刚体 -> 关节`

这里我们首先创建各种形状，然后创建对应的刚体。

- 创建圆形

``` javascript
function createBall(world, x, y, r) {
    // 创建圆形定义
	var ballSd = new b2CircleDef();
	ballSd.density = 1.0;               // 设置密度
    ballSd.radius = 20;                 // 设置半径
    ballSd.restitution = 1.0;           // 设置弹性
    ballSd.friction = 0;                // 设置摩擦因子
	var ballBd = new b2BodyDef();       // 创建刚体定义
	ballBd.AddShape(ballSd);            // 添加形状
	ballBd.position.Set(x || 0,y || 0); // 设置位置
	return world.CreateBody(ballBd);    // 创建并返回刚体
}
```

- 创建矩形

``` javascript
// 创建矩形刚体
function createBox(world, x, y, width, height, userData) {
    var boxSd = new b2BoxDef();                     // 创建一个形状Shape，然后设置有关Shape的属性
    boxSd.extents.Set(width || 1200, height || 5);  // 设置矩形高、宽
    boxSd.density = 1.0;                            // 设置矩形的密度 
    boxSd.userData = userData;                      // 传入图片数据
    boxSd.restitution = .3;                         //设置矩形的弹性
    boxSd.friction = 1;                             //设置矩形的摩擦因子，可以设置为0-1之间任意一个数，0表示光滑，1表示强摩擦

    var boxBd = new b2BodyDef();   // 创建刚体定义
    boxBd.AddShape(boxSd);         // 添加形状
    boxBd.position.Set(x || 10, y || 10);       // 设置位置
    return world.CreateBody(boxBd) // 创建并返回刚体
}
```

### 添加刚体
利用上面创建刚体的函数，我们可以往世界中添加刚体：

``` javascript
var ball1 = createBall(world, 100, 20, 20);
var ball2 = createBall(world, 300, 60, 10);
var box1 = createBox(world, 100, 200, 25, 30, true);
var box2 = createBox(world, 200, 50, 20, 20);
```

### 绘制刚体
我们可以通过添加绘制刚体的函数，在绘制世界时调用：

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

我们也可以在其中一个刚体里将图片与刚体结合：

``` javascript
//绘画功能
function drawWorld(world, context) {
    for (var j = world.m_jointList; j; j = j.m_next) {
        // 绘制关节
        // drawJoint(j, context);
    }
    for (var b = world.m_bodyList; b != null; b = b.m_next) {
        for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
            if (s.GetUserData() != undefined) {
                // 使用数据包括图片
                var img = s.GetUserData();

                // 图片的长和宽
                var x = s.GetPosition().x;
                var y = s.GetPosition().y;
                var topleftX = - img.clientWidth / 2;
                var topleftY = - img.clientHeight / 2;

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

### 完整代码
``` javascript
var canvas;
var ctx;
var canvasWidth;
var canvasHeight;

var world;

// 我们将创建世界封装至createWorld函数内
function createWorld() {
    // 世界的大小
    var worldAABB = new b2AABB();
    worldAABB.minVertex.Set(-4000, -4000);
    worldAABB.maxVertex.Set(4000, 4000);

    //定义重力
    var gravity = new b2Vec2(0, 300);

    // 是否休眠
    var doSleep = false;

    // 最终创建世界
    var world = new b2World(worldAABB, gravity, doSleep);

    return world;
}

//绘画功能
function drawWorld(world, context) {
    for (var j = world.m_jointList; j; j = j.m_next) {
        // 绘制关节
        // drawJoint(j, context);
    }
    for (var b = world.m_bodyList; b != null; b = b.m_next) {
        for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
            if (s.GetUserData() != undefined) {
                // 使用数据包括图片
                var img = s.GetUserData();

                // 图片的长和宽
                var x = s.GetPosition().x;
                var y = s.GetPosition().y;
                var topleftX = -img.clientWidth / 2;
                var topleftY = -img.clientHeight / 2;

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

// 创建圆形刚体
function createBall(world, x, y, r) {
    // 创建圆形定义
    var ballSd = new b2CircleDef();
    ballSd.density = 1.0; // 设置密度
    ballSd.radius = 20; // 设置半径
    ballSd.restitution = 1.0; // 设置弹性
    ballSd.friction = 0; // 设置摩擦因子
    var ballBd = new b2BodyDef(); // 创建刚体定义
    ballBd.AddShape(ballSd); // 添加形状
    ballBd.position.Set(x || 0, y || 0); // 设置位置
    return world.CreateBody(ballBd); // 创建并返回刚体
}

// 创建矩形刚体
function createBox(world, x, y, width, height, userData) {
    var boxSd = new b2BoxDef(); //创建一个形状Shape，然后设置有关Shape的属性
    boxSd.extents.Set(width || 1200, height || 5); //设置矩形高、宽
    boxSd.density = 1.0;
    boxSd.userData = userData;
    boxSd.restitution = .3; //设置矩形的弹性
    boxSd.friction = 1; //设置矩形的摩擦因子，可以设置为0-1之间任意一个数，0表示光滑，1表示强摩擦

    var boxBd = new b2BodyDef(); // 创建刚体定义
    boxBd.AddShape(boxSd); // 添加形状
    boxBd.position.Set(x || 10, y || 10); // 设置位置
    return world.CreateBody(boxBd) // 创建并返回刚体
}

// 定义step函数，用于游戏的迭代运行
function step() {
    // 模拟世界
    world.Step(1.0 / 60, 1);
    // 清除画布
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    // 重新绘制
    drawWorld(world, ctx);

    // 再次刷新
    setTimeout(step, 10);
    console.log('step...');
}

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

window.onload = function() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    canvasWidth = parseInt(canvas.width);
    canvasHeight = parseInt(canvas.height);
    // 启动游戏
    world = createWorld();
    var ball1 = createBall(world, 100, 20, 20);
    var ball2 = createBall(world, 300, 60, 10);
    var box1 = createBox(world, 200, 50, 20, 20);
    var box2 = createBox(world, 400, 80, 20, 20, document.getElementById('box'));
    step();
};
```

[此处查看项目代码（仅包含src部分）](https://github.com/godbasin/box2djs-tutorial/tree/master/6-practice/6-2-add-body/6-2-add-body)  
[此处查看页面效果](http://old7pzwup.bkt.clouddn.com/6-2-add-body/index.html)  



### [返回总目录](/2017/02/17/box2d-tutorial-0-catalog/)  
