/*获取刚体的类*/

function GetBodyClass(init,canvasBorder){
	
	this.init=init;
	this.world=init.world;
	this.c=init.canvas;
	this.canvasBorder=canvasBorder;
	this.dis_left=this.c.offsetLeft;
	this.dis_top=this.c.offsetTop;
	this.mousePVec;
	this.aabb;
	
	this.slectBody;
	
	this.mouseClickX;
	this.mouseClickY;
	this.mouseDownX;
	this.mouseDownY;
	this.mouseDownFlage=0;
	this.mouseUpX;
	this.mouseUpY;
	this.mouseMoveX;
	this.mouseMoveY;
}

GetBodyClass.prototype.getBodyByClick=function(event){
   
	   var x = event.layerX;
		   if(!x) x = event.x;
	   var y = event.layerY;
		   if(!y) y = event.y;
	   var canvasClickX=x-this.dis_left-this.canvasBorder;
	   var canvasClickY=y-this.dis_top-this.canvasBorder;
	   this.mousePVec= new b2Vec2(canvasClickX, canvasClickY);
	   this.aabb= new b2AABB();
	   this.aabb.minVertex.Set(this.mousePVec.x+this.dis_left- 0.001, this.mousePVec.y+this.dis_top- 0.001);
	   this.aabb.maxVertex.Set(this.mousePVec.x+this.dis_left+ 0.001, this.mousePVec.y+this.dis_top+ 0.001);
	   var k_maxCount= 10;
	   var shapes= new Array();
	   var count= this.world.Query(this.aabb, shapes, k_maxCount);
	   
	   var findBody= null;
	   for (var i= 0; i < count; ++i)
	   {
		  if (shapes[i].GetBody().IsStatic() == false )
		  {
			 var tShape= shapes[i];
			 var inside=tShape.GetBody();
			 if (inside)
			 {
				findBody = tShape.GetBody();
				break;
			 }//if
		  }//if
	   }//for i
	this.slectBody=findBody;
};

GetBodyClass.prototype.getBodyByMouseDown=function(){
	alert("in getBodyByMouseDown");
   //this.mousePVec= new b2Vec2(this.mouseDownX, this.mouseDownY);
   //this.getBodyCommon();
};

GetBodyClass.prototype.getBodyCommon=function(){
	
};

