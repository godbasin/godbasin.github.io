/*碰撞检测类*/
function CollisionTestClass(bodyList,world){
	this.CollisionBody1;
	this.CollisionBody1Name;
	this.CollisionBody2;
	this.CollisionBody2Name;
	this.bodyList=bodyList;
	this.world=world;	
}

//CollisionTestClass.prototype=new InitWorldClass();

CollisionTestClass.prototype.CollisionProcess=function(){
	
	for (var b = this.world.m_contactList; b; b = b.m_next)
           {
		      this.CollisionBody1= b.m_shape1.m_body;       //接触的两个刚体,先定义的那个为b1,后定义的那个为b2
			  this.CollisionBody2= b.m_shape2.m_body;
			 
			  this.collisionFun_1();
			  this.collisionFun_2();
			  this.collisionFun_3();
			  this.collisionFun_4();
			  this.collisionFun_5();
		 }//for b
};//fun

CollisionTestClass.prototype.distoryBody=function(){
	if((this.CollisionBody1!=null)&&(this.CollisionBody2!=null))
	{
		//alert("CollisionBody1:  "+this.CollisionBody1+"\nCollisionBody2:  "+this.CollisionBody2);
		//alert(this.bodyList[2]+"   "+this.bodyList[3]);
		if((this.CollisionBody1!=this.bodyList[2])&&(this.CollisionBody1!=this.bodyList[3])
				&&(this.CollisionBody2!=this.bodyList[2])&&(this.CollisionBody2!=this.bodyList[3]))
			{
				this.world.DestroyBody(this.CollisionBody1);
				this.world.DestroyBody(this.CollisionBody2);
			}//if
	}//if
};

CollisionTestClass.prototype.collisionFun_1=function(){
		//alert("collisionFun_1");
};

CollisionTestClass.prototype.collisionFun_2=function(){
		//alert("collisionFun_2");
};

CollisionTestClass.prototype.collisionFun_3=function(){
		//alert("collisionFun_3");
};

CollisionTestClass.prototype.collisionFun_4=function(){
		//alert("collisionFun_4");
};

CollisionTestClass.prototype.collisionFun_5=function(){
		//alert("collisionFun_5");
};