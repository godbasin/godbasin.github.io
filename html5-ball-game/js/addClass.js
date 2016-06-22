/*添加物体的类*/
function AddClass(world){

	//InitWorldClass.call(this);
	this.customBodyList=new Array();
	this.world=world;
	
}

//AddClass.prototype=new InitWorldClass();

AddClass.prototype.createBox=function(width ,height,density,restitution,friction){
	
	this.Shape= new b2BoxDef();        
    this.Shape.extents.Set(width/2, height/2);         //定义矩形高、宽
    this.Shape.density =density;                //密度
    this.Shape.restitution =restitution;           //弹性
    this.Shape.friction =friction;              //摩擦力
	
	return this.Shape;                    
};

AddClass.prototype.createCircle=function(radius,density,restitution,friction){
	
	this.Shape= new b2CircleDef();        
    this.Shape.radius =radius;                  //圆形半径
    this.Shape.density =density;                //密度
    this.Shape.restitution =restitution;           //弹性
    this.Shape.friction =friction;              //摩擦力
	
	return this.Shape;
};

AddClass.prototype.createPoly=function(vertexArray,density,restitution,friction){
	
	this.Shape= new b2PolyDef(); 
	this.vertexArray=vertexArray;                //顶点数,要求vertexArray[0]为顶点数目，接下来依次存储第一点X，第一点Y，第二点X，第二点Y......
    this.Shape.vertexCount = vertexArray[0];                    
	for(var i=0;i<this.Shape.vertexCount;i++)
	{
		this.Shape.vertices[i] = new b2Vec2(vertexArray[2*i+1],vertexArray[2*i+2]);     //顶点1
	}
	this.Shape.density =density;                //密度
    this.Shape.restitution =restitution;           //弹性
    this.Shape.friction =friction;              //摩擦力
	
	return this.Shape;
};

AddClass.prototype.createBody=function(shapeNumber,shapeArray,shapeLocationArray,bodyPositionX,bodyPositionY){
	
	this.BodyDef = new b2BodyDef();
    this.BodyDef.position.Set(bodyPositionX,bodyPositionY);    //设置物体的初始位置         BodyDefTop.position.Set(600, 0);    //设置物体的初始位置
	
	this.shapeArray=shapeArray;
	this.shapeLocationArray=shapeLocationArray;
	if(this.shapeLocationArray!=null)
	{
		var l=shapeLocationArray.length;
		for(var j=0;j<l;j+=3)
		{
			this.shapeArray[shapeLocationArray[j]].localPosition.Set(shapeLocationArray[j+1],shapeLocationArray[j+2]);
		}
	}
	
	for(var i=0;i<shapeNumber;i++)
	{
	   this.BodyDef.AddShape(this.shapeArray[i]);          //物体中加入Shape[i]
	}
	this.Body = this.world.CreateBody(this.BodyDef); 
	
	return this.Body ;
};

AddClass.prototype.createDistanceJoint=function(Body1,Body2,anchorPoint1,anchorPoint2){
	
   this.jointDefDistance = new b2DistanceJointDef();
   this.jointDefDistance.body1 = Body1;
   this.jointDefDistance.body2 = Body2;
   this.jointDefDistance.anchorPoint1=anchorPoint1;      //anchorPoint1、anchorPoint2必须在Body1、Body2上
   this.jointDefDistance.anchorPoint2=anchorPoint2;
   
   this.joint=this.world.CreateJoint(this.jointDefDistance);
   
   return this.joint;
};

AddClass.prototype.createRevoluteJoint=function(Body1,Body2,anchorPoint,motorSpeed,motorTorque,enableMotor,lowerAngle,upperAngle,enableLimit){
	
   this.jointDefRevolute = new b2RevoluteJointDef();
   this.jointDefRevolute.anchorPoint=anchorPoint; 
   this.jointDefRevolute.body1 = Body1;
   this.jointDefRevolute.body2 = Body2;
   this.jointDefRevolute.lowerAngle=lowerAngle;
   this.jointDefRevolute.upperAngle=upperAngle;
   this.jointDefRevolute.enableLimit=enableLimit;
   this.jointDefRevolute.motorSpeed =motorSpeed;     //速度
   this.jointDefRevolute.motorTorque =motorTorque;      //力矩
   this.jointDefRevolute.enableMotor =enableMotor;
   
   this.joint= this.world.CreateJoint(this.jointDefRevolute); 
   
   return this.joint;
};

AddClass.prototype.createPrismaticJoint=function(Body1,Body2,anchorPoint,axis){
	
   this.jointDefPrismatic = new b2PrismaticJointDef();
   this.jointDefPrismatic.anchorPoin=anchorPoint;            //可选在二者中心点连线的中点
   this.jointDefPrismatic.axis=axis;         //两刚体的相对运动仅可沿此轴，绝对运动无碍
   this.jointDefPrismatic.body1 = Body1;
   this.jointDefPrismatic.body2 = Body2;
   
   this.joint= this.world.CreateJoint(this.jointDefPrismatic); 
   
   return this.joint;
};

AddClass.prototype.createPulleyJoint=function(Body1,Body2,anchorPoint1,anchorPoint2,groundPoint1,groundPoint2,maxLength1,maxLength2,ratio){
	
   this.jointDefPulley = new  b2PulleyJointDef();
   this.jointDefPulley.body1 = Body1;
   this.jointDefPulley.body2 = Body2;
   this.jointDefPulley.anchorPoint1=anchorPoint1;
   this.jointDefPulley.anchorPoint2=anchorPoint2;
   this.jointDefPulley.groundPoint1=groundPoint1;
   this.jointDefPulley.groundPoint2=groundPoint2;
   this.jointDefPulley.maxLength1=maxLength1;         //这两个maxLength至少有一个要大于|groundPoint-anchorPoint|
   this.jointDefPulley.maxLength2=maxLength2;
   this.jointDefPulley.ratio=ratio;                //body1上下移动S，body2上下移动S/ratio
   
   this.joint= this.world.CreateJoint(this.jointDefPulley);
   
   return this.joint;
};

AddClass.prototype.createGearJoint=function(RevoluteBody,PrismaticBody,RevoluteAnchorPoint,PrismaticAnchorPoint,PrismaticAxis,ratio,motorSpeed,motorTorque,enableMotor){
	
   this.jointDefRevolute = new b2RevoluteJointDef();
   this.jointDefRevolute.anchorPoint=RevoluteAnchorPoint;
   this.jointDefRevolute.body1 =this.world.GetGroundBody();     //用作齿轮关节的旋转关节body1须为GroundBody
   this.jointDefRevolute.body2 =RevoluteBody;
   //this.jointDefRevolute.lowerAngle=lowerAngle;
   //this.jointDefRevolute.upperAngle=upperAngle;
   //this.jointDefRevolute.enableLimit=enableLimit;
   this.jointDefRevolute.motorSpeed =motorSpeed;     //速度
   this.jointDefRevolute.motorTorque =motorTorque;      //力矩
   this.jointDefRevolute.enableMotor =enableMotor;
   
   this.jointRevolute= this.world.CreateJoint(this.jointDefRevolute);
   
   this.jointDefPrismatic = new b2PrismaticJointDef();
   this.jointDefPrismatic.anchorPoint=PrismaticAnchorPoint;           //可选在二者中心点连线的中点
   this.jointDefPrismatic.axis=PrismaticAxis;         //在齿轮关节中，这个轴只要设置成平行于屏幕就行，也就是说随着齿轮旋转，移动关节可以上下、左右来回运动，（斜向运动出现bug）
   this.jointDefPrismatic.body1 =this.world.GetGroundBody();           //用作齿轮关节的移动关节body1须为GroundBody
   this.jointDefPrismatic.body2 =PrismaticBody;
   this.jointPrismatic= this.world.CreateJoint(this.jointDefPrismatic); 
  
   this.jointDefGear = new b2GearJointDef();
   this.jointDefGear.body1=RevoluteBody;
   this.jointDefGear.body2=PrismaticBody;
   this.jointDefGear.joint1=this.jointRevolute;
   this.jointDefGear.joint2=this.jointPrismatic;
   
   this.joint= this.world.CreateJoint(this.jointDefGear); 
   
   this.joint.m_ratio=ratio;                           //  转动圈数/移动距离
   return this.joint;
};



