/*世界初始化的类*/

function InitWorldClass(canvasWidth,canvasHeight,world_left,world_top,world_right,world_bottom,gravity_x,gravity_y,doSleep){
	this.worldAABB;
	this.world;
	this.canvas=document.getElementById('canvas_main');
	this.context=this.canvas.getContext('2d');	
	this.canvasWidth=canvasWidth;
	this.canvasHeight=canvasHeight;
	this.world_left=world_left;              //左上角X坐标
	this.world_top=world_top;                 //左上角Y坐标
	this.world_right=world_right;              //右下角X坐标
	this.world_bottom =world_bottom;           //右下角Y坐标
	this.gravity= new b2Vec2(gravity_x,gravity_y);
	this.doSleep=doSleep;                       //bool型  
	this.dt=1/60;                              //计算多少秒之后的世界
	this.iterations = 10;                       //迭代次数，影响物体碰撞的计算精度，太高会导致速度过慢
	
	this.setupWorld();
	
}

InitWorldClass.prototype.setupWorld=function(){
   this.worldAABB = new b2AABB();
   this.worldAABB.minVertex.Set(this.world_left,this.world_top);  //左上角
   this.worldAABB.maxVertex.Set(this.world_right,this.world_bottom);    //右下角
   this.world = new b2World(this.worldAABB, this.gravity, this.doSleep);
};

