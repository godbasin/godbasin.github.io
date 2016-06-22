// JavaScript Document
var busGame = {
	// 游戏关卡常数
	STATE_STARTING_SCREEN : 1,
	STATE_PLAYING : 2,
	STATE_GAMEOVER_SCREEN : 3,
	
	state : 0,
	
	fuel: 0,
	fuelMax: 0,

	currentLevel:0,
	
	busMovable: 0,
	
	busLives:6
}

var canvas;
var ctx;
var canvasWidth;
var canvasHeight;

//加载生命条图片
var livesImages=new Array();
for(var x=0;x<7;x++)
{
     livesImages[x]=new Image();
	 livesImages[x].src="./images/lives"+x+".png";
}


$(function() 
{
		
	//巴士打嗝
	setInterval("hiccup()",3000);	
	
	//按键事件 
	$(document).keydown(function(e)
	{
		switch(e.keyCode) 
		{
			case 39:           //右键向前
				if (busGame.fuel > 0 && busGame.busMovable)
				{
					var force = new b2Vec2(120000, 0);
					busGame.bus[0].ApplyImpulse(force, busGame.bus[0].GetCenterPosition());
					busGame.fuel--;
					$(".fuel-value").width(busGame.fuel/busGame.fuelMax * 100 +'%');
				}				
				break;
				
			case 37:            //左键向后
				if (busGame.fuel > 0 && busGame.busMovable)
				{
					var force = new b2Vec2(-120000, 0);
					busGame.bus[0].ApplyImpulse(force, busGame.bus[0].GetCenterPosition());
					busGame.fuel--;
					$(".fuel-value").width(busGame.fuel/busGame.fuelMax * 100 +'%');					
				}
				break;
				
			case 38:            //上键向上
				if (busGame.fuel > 0 && busGame.busMovable)
				{
	                var force = new b2Vec2(0, -350000);
	                busGame.bus[0].ApplyImpulse(force, busGame.bus[0].GetCenterPosition());
	                busGame.bus[2].ApplyImpulse(force, busGame.bus[2].GetCenterPosition());
					busGame.fuel--;
					$(".fuel-value").width(busGame.fuel/busGame.fuelMax * 100 +'%');					
				}
				break;
				
			case 82: //r键重载
			   document.location.reload();
			   break;
			   
			case 84: //t键再来
			   restartGame(busGame.currentLevel);
		       busGame.busLives--; 

			   break;
		}
	});
	
	// 开始界面
	busGame.state = busGame.STATE_STARTING_SCREEN;
	
	// 点击开始界面开始游戏
	$('#game').click(function()
	{
		if (busGame.state == busGame.STATE_STARTING_SCREEN)
		{
			// 关卡改变
			busGame.state = busGame.STATE_PLAYING;

			// 重新开始游戏
			restartGame(busGame.currentLevel);
			
			// 下一关
			step();
		}				
    });
	
	console.log("The world is created. ", busGame.world);
	
	// get the reference of the context
	canvas = document.getElementById('game');  
	ctx = canvas.getContext('2d');
	canvasWidth = parseInt(canvas.width);
	canvasHeight = parseInt(canvas.height);	

});
	
	
function hiccup()
{
	//给巴士加冲量
	var force = new b2Vec2(0, -200000);
	busGame.bus[0].ApplyImpulse(force, busGame.bus[0].GetCenterPosition());
	busGame.bus[2].ApplyImpulse(force, busGame.bus[2].GetCenterPosition());
}
	
	

function createWorld() 
{
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



function step() 
{
	busGame.world.Step(1.0/60, 1);
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	DrawLives();
	
	drawWorld(busGame.world, ctx);
	
	setTimeout(step, 10);
	
	//检查巴士生命是否剩下
	if(busGame.busLives == 0)
	{
		// 游戏结束
		$('#game').removeClass().addClass('gamebg_Lose'); 
				
		// 消除世界
		busGame.world = createWorld();
	}
		
	
	//检查巴士是否接近箱子附近
	for(var i = 0; i < busGame.boxList.length; i++)
	{
	    if( Math.abs(busGame.boxList[i][0].GetOriginPosition().x - busGame.bus[1].GetOriginPosition().x) < 150 )
	    {
		    busGame.world.DestroyBody(busGame.boxList[i][1]);
	    }
	}
	
	
	//检查巴士是否掉下边界
	if(busGame.bus[1].GetOriginPosition().y > 800 )
	{
		restartGame(busGame.currentLevel);
		busGame.busLives--; 
	    
	}

	
	
	for (var cn = busGame.world.GetContactList(); cn != null; cn = cn.GetNext())
	{				
		var body1 = cn.GetShape1().GetBody();
		var body2 = cn.GetShape2().GetBody();
		
		// 检查巴士是否到达目的地
		if ((body1 == busGame.bus[1] && body2 == busGame.gamewinWall) ||
			(body2 == busGame.bus[1] && body1 == busGame.gamewinWall))
		{
			console.log("Level Passed!");
			
			
			if (busGame.currentLevel < 4)
			{
				restartGame(busGame.currentLevel+1);
			}
			else
			{
				// 游戏结束
				$('#game').removeClass().addClass('gamebg_won'); 
				
				// 消除世界
				busGame.world = createWorld();
				
			}
			
		}
		
		//检查巴士是否撞击易碎地面(可用，待完善，无法解决多个倒计时器的问题）
		for(var i = 0; i < busGame.fragileGroundList.length; i++)
		{
		    if ((body1 == busGame.bus[0] && body2 == busGame.fragileGroundList[i]) ||
			    (body2 == busGame.bus[0] && body1 == busGame.fragileGroundList[i]) ||
				(body1 == busGame.bus[1] && body2 == busGame.fragileGroundList[i]) ||
			    (body2 == busGame.bus[1] && body1 == busGame.fragileGroundList[i]) ||
				(body1 == busGame.bus[2] && body2 == busGame.fragileGroundList[i]) ||
			    (body2 == busGame.bus[2] && body1 == busGame.fragileGroundList[i]))
		    {
			    busGame.fragileGround = busGame.fragileGroundList[i];
			    setTimeout("busGame.world.DestroyBody(busGame.fragileGround)",1000);
		    }
		}
				
		//检查轮子是否接触地面
		for(var i = 0; i < busGame.groundList.length; i++)
		{
		    if ((body1 == busGame.bus[0] && body2 == busGame.groundList[i]) ||
			    (body2 == busGame.bus[0] && body1 == busGame.groundList[i]))
		    {
			    busGame.busMovable = 1;
				break;
		    }
			else
			{
				setTimeout("busGame.busMovable = 0",100);
			}
			
		}
		
		//检查车子是否撞击箱子
		for(var i = 0; i < busGame.boxList.length; i++)
		{
		    if ((body1 == busGame.bus[1] && body2 == busGame.boxList[i][0]) ||
			    (body2 == busGame.bus[1] && body1 == busGame.boxList[i][0])||
				(body1 == busGame.bus[0] && body2 == busGame.boxList[i][0]) ||
			    (body2 == busGame.bus[0] && body1 == busGame.boxList[i][0])||
				(body1 == busGame.bus[2] && body2 == busGame.boxList[i][0]) ||
			    (body2 == busGame.bus[2] && body1 == busGame.boxList[i][0]))
		    {
			    restartGame(busGame.currentLevel);
				busGame.busLives--; 
		    }
						
		}
		
		//检查车子是否撞击弹珠
		for(var i = 0; i < busGame.ballList.length; i++)
		{
		    if ((body1 == busGame.bus[1] && body2 == busGame.ballList[i]) ||
			    (body2 == busGame.bus[1] && body1 == busGame.ballList[i])||
				(body1 == busGame.bus[0] && body2 == busGame.ballList[i]) ||
			    (body2 == busGame.bus[0] && body1 == busGame.ballList[i])||
				(body1 == busGame.bus[2] && body2 == busGame.ballList[i]) ||
			    (body2 == busGame.bus[2] && body1 == busGame.ballList[i]))
		    {
			    restartGame(busGame.currentLevel);
				busGame.busLives--;
		    }
						
		}



/*
		//检查巴士是否翻转(待完善）
		for(var i = 0; i < busGame.groundList.length; i++)
		{
			if ((body1 == busGame.bus[3] && body2 == busGame.groundList[i]) ||
			    (body2 == busGame.bus[3] && body1 == busGame.groundList[i]))
			{
			    // 游戏结束
			    $('#game').removeClass().addClass('gamebg_won'); 
			}		
	    }
*/

		
	}
}


function DrawLives()
{
     ctx.drawImage(livesImages[busGame.busLives],700,530);
}



function createGround(x, y, width, height, rotation, type) 
{
	// 矩形定义
	var groundSd = new b2BoxDef();              //矩形
	groundSd.extents.Set(width, height);         //长宽
	groundSd.restitution = 0;                  //弹性
	if (type == "win") 
	{
		groundSd.userData = document.getElementById('flag');
	}


    if (type == "fragile") 
	{
		groundSd.userData = document.getElementById('fragile');
	}

	
	// 用矩形定义刚体
	var groundBd = new b2BodyDef();
	groundBd.AddShape(groundSd);                //添加形状
	groundBd.position.Set(x, y);                //位置
	groundBd.rotation = rotation * Math.PI / 180;     //角度
	var body = busGame.world.CreateBody(groundBd);
	
	return body;
}



function createBusAt(x, y) 
{
	// 巴士定义
	var boxSd = new b2BoxDef();
	boxSd.density = 0.4;                //巴士密度
	boxSd.friction = 4.5;               //巴士摩擦力
	boxSd.restitution =0;             //巴士弹力
	boxSd.extents.Set(30, 20);          //巴士长宽
	boxSd.userData = document.getElementById('bus');
	
	// 巴士刚体
	var boxBd = new b2BodyDef();
	boxBd.AddShape(boxSd);
	boxBd.position.Set(x,y);		
	var busBody = busGame.world.CreateBody(boxBd);
	

/*
	// 巴士顶部定义（用于碰撞检测）
	var ballSd2 = new b2CircleDef();
	ballSd2.density = 0.0000001;          //密度
	ballSd2.radius = 5;            //半径
	ballSd2.restitution = 0;      //弹性
	ballSd2.friction = 0.2;         //摩擦
	var ballBd2 = new b2BodyDef();
	ballBd2.AddShape(ballSd2);
	ballBd2.position.Set(x,y-25);
	var topBody = busGame.world.CreateBody(ballBd2);

	//创建巴士与巴士顶部的关节
	var jointDef = new b2RevoluteJointDef();
	jointDef.anchorPoint.Set(x, y-25);
	jointDef.body1 = busBody;
	jointDef.body2 = topBody;
    busGame.world.CreateJoint(jointDef);
*/


	// 巴士轮子
	var wheelBody1 = createWheel(busGame.world, x-10, y+20);
	var wheelBody2 = createWheel(busGame.world, x+10, y+20);
	
	
	//创建左轮和巴士的关节
	var jointDef = new b2RevoluteJointDef();
	jointDef.anchorPoint.Set(x-10, y+20);
	jointDef.body1 = busBody;
	jointDef.body2 = wheelBody1;
	var frontJoint = busGame.world.CreateJoint(jointDef);
	
	//创建右轮和巴士的关节
	var jointDef = new b2RevoluteJointDef();
	jointDef.anchorPoint.Set(x+10, y+20);
	jointDef.body1 = busBody;
	jointDef.body2 = wheelBody2;
	var rearJoint = busGame.world.CreateJoint(jointDef);
	
	return [wheelBody1,busBody,wheelBody2];
				
}



function createBoxAt(x, y) 
{
	// 箱子定义
	var boxSd = new b2BoxDef();
	boxSd.density = 0.4;                //箱子密度
	boxSd.friction = 4.5;               //箱子摩擦力
	boxSd.restitution =0;             //箱子弹力
	boxSd.extents.Set(20, 20);          //箱子长宽
	boxSd.userData = document.getElementById('box');
	
	// 箱子刚体
	var boxBd = new b2BodyDef();
	boxBd.AddShape(boxSd);
	boxBd.position.Set(x,y+10);		
	var boxBody = busGame.world.CreateBody(boxBd);
	
	//挡住箱子的底座
	var boxSd = new b2BoxDef();
	boxSd.density = 0;                //底座密度
	boxSd.friction = 5;               //底座摩擦力
	boxSd.restitution =0;             //底座弹力
	boxSd.extents.Set(20, 1);          //底座长宽
	
	// 底座刚体
	var boxBd = new b2BodyDef();
	boxBd.AddShape(boxSd);
	boxBd.position.Set(x,y+22);		
	var boxControlBody = busGame.world.CreateBody(boxBd);


	return [boxBody,boxControlBody];
}


function createBallAt(world, x, y) 
{
	var ballSd2 = new b2CircleDef();
	ballSd2.density = 0.8;          //密度
	ballSd2.radius = 10;            //半径
	ballSd2.restitution = 0.99;      //弹性
	ballSd2.friction = 0.2;         //摩擦
	ballSd2.userData = document.getElementById('ball');

	var ballBd2 = new b2BodyDef();
	ballBd2.AddShape(ballSd2);
	ballBd2.position.Set(x,y);
	var ballBody = busGame.world.CreateBody(ballBd2);
	
	return ballBody;
}




function restartGame(level)
{
	$("#level").html("Level " + (level+1));
	
	busGame.currentLevel = level;
	
	// 改变为该关卡的背景图片
	$('#game').removeClass().addClass('gamebg_level'+level);
	
	busGame.fragileGroundList = new Array();
	busGame.groundList = new Array();
	busGame.boxList = new Array();
	busGame.ballList = new Array();

    // 创建世界
	busGame.world = createWorld();
	
	// 创建一个地面
	// 从数据中创建剩余地面
	for(var i=0;i<busGame.levels[level].length;i++)
	{
		var obj = busGame.levels[level][i];
			
		
		// 创建巴士
		if (obj.type == "bus")
		{
			busGame.bus = createBusAt(obj.x,obj.y);
			busGame.fuel = obj.fuel;
			busGame.fuelMax = obj.fuel;
			$(".fuel-value").width('100%');
			continue;
		}
		
		// 创建箱子
		if (obj.type == "box")
		{
			busGame.box = createBoxAt(obj.x,obj.y);
			busGame.boxList.push(busGame.box);
			continue;
		}
		
		// 创建弹珠
		if (obj.type == "ball")
		{
			busGame.ball = createBallAt(busGame.world,obj.x,obj.y);
			busGame.ballList.push(busGame.ball);
			continue;
		}
		
		var groundBody = createGround(obj.x, obj.y, obj.width, obj.height, obj.rotation, obj.type);

		
        //把地面装进一组数组
		if (obj.type == "ground") 
		{
			busGame.groundList.push(groundBody);
		}

		
		if (obj.type == "win") 
		{
			busGame.gamewinWall = groundBody;
		}	
		
		//破坏已碰撞易碎地面
		if (obj.type == "fragile") 
		{			
			busGame.groundList.push(groundBody);
			busGame.fragileGroundList.push(groundBody);			
		}
		
	}
	
		
		
	
}



function createWheel(world, x, y) 
{
	// 轮胎圆形
	var ballSd = new b2CircleDef();
	ballSd.density = 5.0;          //轮子密度
	ballSd.radius = 10;            //轮子半径
	ballSd.restitution = 0.2;      //轮子弹性
	ballSd.friction = 1.0;         //轮子摩擦
	ballSd.userData = document.getElementById('wheel');
	
	//  轮胎刚体
	var ballBd = new b2BodyDef();
	ballBd.AddShape(ballSd);
	ballBd.position.Set(x,y);
	return world.CreateBody(ballBd);
}


//绘画功能
function drawWorld(world, context) 
{
	for (var b = world.m_bodyList; b != null; b = b.m_next) 
	{
		for (var s = b.GetShapeList(); s != null; s = s.GetNext()) 
		{
			if (s.GetUserData() != undefined)
			{
				// 使用数据包括图片
				var img = s.GetUserData();
				
				// 图片的长和宽，需减半
				var x = s.GetPosition().x;
				var y = s.GetPosition().y;
				var topleftX = - $(img).width()/2;
				var topleftY = - $(img).height()/2;
				
				context.save();
				context.translate(x,y);
				context.rotate(s.GetBody().GetRotation());
				context.drawImage(img, topleftX, topleftY);						
				context.restore();
			}
			//drawShape(s, context);
		}
	}
}

// 从draw_world.js里面引用的绘画功能
function drawShape(shape, context) 
{
	context.strokeStyle = '#003300';
	context.beginPath();
	switch (shape.m_type) 
	{
	case b2Shape.e_circleShape:
		var circle = shape;
		var pos = circle.m_position;
		var r = circle.m_radius;
		var segments = 16.0;
		var theta = 0.0;
		var dtheta = 2.0 * Math.PI / segments;
		// 画圆圈
		context.moveTo(pos.x + r, pos.y);
		for (var i = 0; i < segments; i++) 
		{
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
	case b2Shape.e_polyShape:
		var poly = shape;
		var tV = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
		context.moveTo(tV.x, tV.y);
		for (var i = 0; i < poly.m_vertexCount; i++) 
		{
			var v = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
			context.lineTo(v.x, v.y);
		}
		context.lineTo(tV.x, tV.y);
		break;
	}
	context.stroke();
}

busGame.levels = new Array();

busGame.levels[0] = [{"type":"bus","x":50,"y":210,"fuel":200},
{"type":"ground","x":50, "y":270, "width":50, "height":10, "rotation":0},
{"type":"ground","x":120,"y":263,"width":30,"height":10,"rotation":-15},
{"type":"ground","x":220,"y":225,"width":80,"height":10,"rotation":-25},
{"type":"ground","x":400,"y":300,"width":80,"height":10,"rotation":15},
{"type":"ground","x":510,"y":315,"width":50,"height":10,"rotation":-10},
{"type":"ground","x":680,"y":330,"width":80,"height":10,"rotation":-20},
{"type":"ground","x":795,"y":300,"width":50,"height":10,"rotation":-10},
{"type":"ground","x":1000,"y":305,"width":50,"height":10,"rotation":0},
{"type":"ground","x":1120,"y":280,"width":80,"height":10,"rotation":-20},
{"type":"win","x":1200,"y":225,"width":10,"height":15,"rotation":0}];

busGame.levels[1] = [{"type":"bus","x":50,"y":110,"fuel":200},
{"type":"ground","x":50, "y":170, "width":70, "height":10, "rotation":0},
{"type":"ground","x":205,"y":315,"width":40,"height":10,"rotation":15},
{"type":"ground","x":280,"y":315,"width":50,"height":10,"rotation":-15},
{"type":"fragile","x":400,"y":310,"width":50,"height":10,"rotation":5},
{"type":"ground","x":540,"y":315,"width":80,"height":10,"rotation":0},
{"type":"ground","x":680,"y":300,"width":50,"height":10,"rotation":0},
{"type":"fragile","x":800,"y":310,"width":50,"height":10,"rotation":0},
{"type":"ground","x":950,"y":325,"width":80,"height":10,"rotation":0},
{"type":"ground","x":1070,"y":310,"width":50,"height":10,"rotation":-20},
{"type":"ground","x":1155,"y":310,"width":50,"height":10,"rotation":20},
{"type":"win","x":1220,"y":305,"width":10,"height":15,"rotation":0}];

busGame.levels[2] = [{"type":"bus","x":50,"y":160,"fuel":200},
{"type":"ground","x":50, "y":220, "width":50, "height":10, "rotation":0},
{"type":"ground","x":130,"y":210,"width":30,"height":10,"rotation":-18},
{"type":"ground","x":180,"y":190,"width":30,"height":10,"rotation":-25},
{"type":"box","x":250,"y":10},
{"type":"box","x":300,"y":10},
{"type":"ground","x":380,"y":250,"width":50,"height":10,"rotation":15},
{"type":"ground","x":500,"y":250,"width":80,"height":10,"rotation":-10},
{"type":"box","x":600,"y":10},
{"type":"ground","x":700,"y":280,"width":50,"height":10,"rotation":-20},
{"type":"ground","x":790,"y":255,"width":50,"height":10,"rotation":-10},
{"type":"box","x":870,"y":10},
{"type":"box","x":920,"y":10},
{"type":"ground","x":1000,"y":300,"width":50,"height":10,"rotation":0},
{"type":"ground","x":1120,"y":285,"width":50,"height":10,"rotation":10},
{"type":"ground","x":1210,"y":285,"width":50,"height":10,"rotation":-10},
{"type":"win","x":1270,"y":245,"width":10,"height":15,"rotation":0}];

busGame.levels[3] = [{"type":"bus","x":50,"y":410,"fuel":200},
{"type":"ground","x":40, "y":464, "width":30, "height":10, "rotation":10},
{"type":"ground","x":172,"y":470,"width":100,"height":10,"rotation":0},
{"type":"ball","x":160,"y":50},
{"type":"ball","x":190,"y":30},
{"type":"ground","x":320,"y":457,"width":50,"height":10,"rotation":-15},
{"type":"ground","x":460,"y":480,"width":50,"height":10,"rotation":10},
{"type":"ground","x":555,"y":488,"width":50,"height":10,"rotation":0},
{"type":"ball","x":530,"y":80},
{"type":"ground","x":640,"y":470,"width":50,"height":10,"rotation":-25},
{"type":"ground","x":730,"y":450,"width":50,"height":10,"rotation":0},
{"type":"ball","x":730,"y":10},
{"type":"ground","x":840,"y":420,"width":80,"height":10,"rotation":-25},
{"type":"ground","x":1000,"y":430,"width":50,"height":10,"rotation":0},
{"type":"ball","x":1030,"y":40},
{"type":"ground","x":1072,"y":444,"width":30,"height":10,"rotation":30},
{"type":"ground","x":1180,"y":459,"width":80,"height":10,"rotation":0},
{"type":"ball","x":1130,"y":60},
{"type":"win","x":1270,"y":430,"width":10,"height":15,"rotation":0}];

busGame.levels[4] = [{"type":"bus","x":50,"y":270,"fuel":200},
{"type":"ground","x":50, "y":320, "width":50, "height":10, "rotation":0},
{"type":"ground","x":170,"y":345,"width":50,"height":10,"rotation":5},
{"type":"box","x":270,"y":10},
{"type":"ground","x":360,"y":395,"width":50,"height":10,"rotation":15},
{"type":"fragile","x":460,"y":410,"width":50,"height":10,"rotation":0},
{"type":"ground","x":560,"y":385,"width":50,"height":10,"rotation":-30},
{"type":"ground","x":678,"y":362,"width":80,"height":10,"rotation":0},
{"type":"ball","x":720,"y":20},
{"type":"box","x":800,"y":10},
{"type":"fragile","x":900,"y":400,"width":50,"height":10,"rotation":0},
{"type":"ground","x":1030,"y":372,"width":80,"height":10,"rotation":-20},
{"type":"ground","x":1133,"y":345,"width":30,"height":10,"rotation":0},
{"type":"ball","x":1130,"y":20},
{"type":"ground","x":1213,"y":327,"width":50,"height":10,"rotation":-20},
{"type":"win","x":1270,"y":285,"width":10,"height":15,"rotation":0}];
