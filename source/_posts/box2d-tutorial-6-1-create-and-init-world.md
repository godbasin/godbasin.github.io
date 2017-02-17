---
title: Box2DJS教程6-1--创建世界并初始化
date: 2017-02-17 21:00:26
categories: box2djs方糖
tags: 教程
---
本节我们主要讲述创建一个物理世界，以及初始化的过程。
<!--more-->

## 创建世界并初始化
-----
### 创建世界
前面我们在介绍世界的时候，也有简单说明如何创建一个物理世界：

``` javascript
var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');
var canvasWidth = parseInt(canvas.width);
var canvasHeight = parseInt(canvas.height);

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
```

### 绘制世界
我们可以添加一个绘制世界的功能，讲里面的刚体、关节等都进行绘制：

``` javascript
//绘画功能
function drawWorld(world, context) {
  for (var j = world.m_jointList; j; j = j.m_next) {
    // 绘制关节
    // drawJoint(j, context);
	}
	for (var b = world.m_bodyList; b; b = b.m_next) {
		for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
      // 绘制刚体形状
			// drawShape(s, context);
		}
	}
}
```

### 刷新世界
现在我们可以开始模拟循环了，在游戏中模拟循环应该并入游戏循环。每次循环你都应该调用`world.Step(timeStep, iterations)`，通常调用一次就够了，这取决于帧频以及物理时间步。

- 时间步timeStep

Box2D中有一些数学代码构成的积分器(integrator)，积分器在离散的时间点上模拟物理方程，它将与游戏动画循环一同运行。
所以我们需要为Box2D选取一个时间步，通常来说游戏物理引擎需要至少60Hz的速度，也就是1/60的时间步。你可以使用更大的时间步，但是你必须更加小心地为你的世界调整定义。

- 迭代次数iterations

除了积分器之外，Box2D中还有约束求解器(constraint solver)。约束求解器用于解决模拟中的所有约束，一次一个。
单个的约束会被完美的求解，然而当我们求解一个约束的时候，我们就会稍微耽误另一个。要得到良好的解，我们需要迭代所有约束多次。

建议的Box2D迭代次数是10次。你可以按自己的喜好去调整这个数，但要记得它是速度与质量之间的平衡。更少的迭代会增加性能并降低精度，同样地，更多的迭代会减少性能但提高模拟质量。

``` javascript
// 定义step函数，用于世界的迭代运行
function step() {
  // 
	world.Step(1.0 / 60, 1);
  // 清除画布
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  // 重新绘制
	drawWorld(world, ctx);

  // 再次刷新
	setTimeout(step, 10);
}
```

### 完整代码
``` javascript
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var canvasWidth = parseInt(canvas.width);
var canvasHeight = parseInt(canvas.height);

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
    for (var b = world.m_bodyList; b; b = b.m_next) {
        for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
            // 绘制刚体形状
            // drawShape(s, context);
        }
    }
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

// 启动游戏
world = createWorld();
step();
```

[此处查看项目代码（仅包含src部分）](https://github.com/godbasin/box2djs-tutorial/tree/master/6-practice/6-1-create-and-init-world/6-1-create-and-init-world)  
[此处查看页面效果](http://old7pzwup.bkt.clouddn.com/6-1-create-and-init-world/index.html)  


### [返回总目录](/2017/02/17/box2d-tutorial-0-catalog/)  