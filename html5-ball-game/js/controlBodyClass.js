/*对刚体进行操作的类*/

function ControlBodyClass(slectBody,init){
	
	InitWorldClass.call(this);
	this.slectBody=slectBody;
	this.init=init;
	this.world=init.world;
}

ControlBodyClass.prototype=new InitWorldClass();

ControlBodyClass.prototype.GetOriginPosition=function(){
	
	var OriginPosition=new b2Vec2(); 
	OriginPosition=this.slectBody.GetOriginPosition();    //获取刚体坐标原点，对于对称图形，原点即中心点
	var position=new Array(OriginPosition.x,OriginPosition.y);
	return position;                                 //返回一个有两个数据的数组，分别为原点的x,y坐标
};

ControlBodyClass.prototype.SetCenterPosition=function(CenterX,CenterY,rotation){
	
	var position=new b2Vec2(CenterX,CenterY);       
	var rotation=rotation;
	this.slectBody.SetCenterPosition(position, rotation);   //设置刚体位置及其旋转弧度，注意是弧度
};

ControlBodyClass.prototype.GetCenterPosition=function(){
	
	var CenterPosition=new b2Vec2(); 
	CenterPosition=this.slectBody.GetCenterPosition();    //获取刚体中心点坐标
	var center=new Array(CenterPosition.x,CenterPosition.y);
	return center;
};

ControlBodyClass.prototype.GetRotation=function(){
	
	
	Rotation=this.slectBody.GetRotation();    //获取刚体绕其中心点旋转弧度
	return Rotation;
};

ControlBodyClass.prototype.SetLinearVelocity=function(Vx,Vy){
	
	var LinearVelocity=new b2Vec2(Vx,Vy);      
	this.slectBody.WakeUp();
	this.slectBody.SetLinearVelocity(LinearVelocity);      //给定一个速度向量
};

ControlBodyClass.prototype.GetLinearVelocity=function(){
	
	var LinearVelocity=new b2Vec2();                   
	LinearVelocity=this.slectBody.GetLinearVelocity();     //获取刚体线速度向量
	var v=new Array(LinearVelocity.x,LinearVelocity.y);
	return v;
};

ControlBodyClass.prototype.SetAngularVelocity=function(w){
	
	this.slectBody.WakeUp();
	this.slectBody.SetAngularVelocity(w);     //给定一个角速度
};

ControlBodyClass.prototype.GetAngularVelocity=function(){
	
	var AngularVelocity=this.slectBody.GetAngularVelocity();     //获取角速度
	return AngularVelocity;
};

ControlBodyClass.prototype.ApplyForce=function(Fx,Fy,PositionX,PositionY){
	
	var force=new b2Vec2(Fx,Fy);
	var point=new b2Vec2(PositionX,PositionY);
	this.slectBody.WakeUp();
	this.slectBody.ApplyForce(force,point);     //施加一个力,需要很大才有作用，不如直接给定线速度，一般给力据F=ma给定
};

ControlBodyClass.prototype.ApplyTorque=function(torque){
	
	this.slectBody.WakeUp();
	this.slectBody.ApplyTorque(torque);     //需要很大才有作用，不如角速度来的实在
};

ControlBodyClass.prototype.ApplyImpulse=function(impulseX,impulseY,PositionX,PositionY){
	
	var impulse=new b2Vec2(impulseX,impulseY);
	var point=new b2Vec2(PositionX,PositionY);
	this.slectBody.WakeUp();
	this.slectBody.ApplyImpulse(impulse,point);     //施加向量,一般在初始的时候给定，以便决定初始运动
};

ControlBodyClass.prototype.GetMass=function(){
	
	var mass=this.slectBody.GetMass();      //获取刚体质量
	return mass;
};

ControlBodyClass.prototype.GetInertia=function(){
	
	var inertia=this.slectBody.GetInertia();      //获取惯性，类似力的大小
	return inertia;
};

ControlBodyClass.prototype.GetWorldPoint=function(localPointX,localPointY){
	
	var localPoint=new b2Vec2(localPointX,localPointY);
	var worldPoint=this.slectBody.GetWorldPoint(localPoint);              //由局部坐标得到世界坐标
	var point=new Array(worldPoint.x,worldPoint.y);    //世界坐标=局部坐标+刚体中心点坐标,详见二者关系
	return point;
};

ControlBodyClass.prototype.GetLocalVector=function(worldVectorX,worldVectorY){
	
	var worldVector=new b2Vec2(worldVectorX,worldVectorY);      //详见二者关系
	var localVector=slectBody.GetLocalVector(worldVector);
	var ve=new Array(localVector.x,localVector.y);
	return ve;
};

ControlBodyClass.prototype.IsStatic=function(){
	
	var staticFlage=this.slectBody.IsStatic();   //判断是否为静止不可移动的刚体
	return staticFlage;
};

ControlBodyClass.prototype.IsSleeping=function(){
	
	var sleepingFlage=this.slectBody.IsSleeping();   //判断是否已进入睡眠状态
	return sleepingFlage;
};

ControlBodyClass.prototype.AllowSleeping=function(allowSleepingFlage){
	
	this.slectBody.AllowSleeping(allowSleepingFlage);   //是否允许睡眠，是则可进入睡眠状态，需要唤醒，allowSleepingFlage为BOOL型变量
};

ControlBodyClass.prototype.WakeUp=function(){
	
	this.slectBody.WakeUp();                //唤醒睡眠刚体，对于非静止刚体，只有碰撞才能自动唤醒，对其赋予速度、力等值时，需要先行唤醒才有效果
};

ControlBodyClass.prototype.GetShapeList=function(){
	
	var shapeList=this.slectBody.GetShapeList();    //直接用m_shapeList效果一样,列表里是一个个的shape，shape是一个类，其表面形状类型的属性为shape.m_type
	return shapeList;
};

ControlBodyClass.prototype.Destroy=function(){
	
	this.slectBody.Destroy();                    //在世界里销毁该刚体，在销毁关节中的刚体时，出现bug
};

ControlBodyClass.prototype.DestroyBody=function(){
	
	this.world.DestroyBody(this.slectBody);
};

ControlBodyClass.prototype.GetNext=function(){
	
	this.slectBody.GetNext();              //获取下一刚体，在world里刚体储存在m_BodyList里
};

ControlBodyClass.prototype.IsConnected=function(otherBody){
	
	var otherBody=otherBody;
	var conectJuge=this.slectBody.IsConnected(otherBody);     //判定是否与另一刚体相连，相连则不碰撞，正逻辑
	return conectJuge;
};

ControlBodyClass.prototype.Freeze=function(){
	
	this.slectBody.Freeze();                 //令刚体线速度、角速度都为0，对刚体所包含形状进行s.DestroyProxy()
};

