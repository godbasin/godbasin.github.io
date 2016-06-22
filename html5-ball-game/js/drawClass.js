/*绘图类*/

function DrawClass(bgImgSrc,init,splBodyList,dr){   //bgImgSrc,splBodyList,DrawSpl都可以为null
	this.bgImgSrc=bgImgSrc;
	this.init=init;
	this.canvasWidth=this.init.canvasWidth;
	this.canvasHeight=this.init.canvasHeight;
	this.cxt=this.init.context;
	this.splBodyList=splBodyList;
	this.dr=dr;
	
}


DrawClass.prototype.drawWorld=function(){
	
    this.cxt.clearRect(0, 0,this.canvasWidth, this.canvasHeight);
	if(this.bgImgSrc!=null)             //被修改
	{
		var bgimg=new Image();
		bgimg.src=this.bgImgSrc;
		this.cxt.drawImage(bgimg,0,0);
	}
    
	if(this.splBodyList!=null)        //被修改
	{ 
		var l=this.splBodyList.length;
		 
		for (var b = this.init.world.m_bodyList; b; b = b.m_next) {
			
			for(var j=0;j<l;j++)
			{
			   if(b==this.splBodyList[j])
			   {
				  if(this.dr!=null)        //被修改
				     { this.dr.drawp(splDateIdList);}
			   }//if
			}// for j
		}//for b
	}//if
  
   for (var b = this.init.world.m_bodyList; b; b = b.m_next) {
	   
		   for (var s = b.GetShapeList(); s != null; s = s.GetNext())
			   {
				   this.drawShape(s);
			   }//for s
	  
	    
     } //for b
   
};

DrawClass.prototype.drawShape=function(shape){ 
   this.cxt.strokeStyle = '#000';       //线形
   this.cxt.beginPath();
   switch (shape.m_type) {
      case b2Shape.e_circleShape:{    //如果是圆形，画圆
         var circle = shape;
         var r = circle.m_radius;
         var pos = circle.m_position;
         //var pos2 = new Array(pos.x+r, pos.y);
         this.cxt.arc(pos.x, pos.y, r, 0, Math.PI * 2, false);
         this.cxt.moveTo(pos.x, pos.y);
         this.cxt.closePath();
		 this.cxt.fill();
         break;
      }
      case b2Shape.e_polyShape:{      //如果是多边形，画多边形
         var poly = shape;
         var tV = b2Math.AddVV(poly.m_position,
         b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
         this.cxt.moveTo(tV.x, tV.y);
         for (var i = 0; i < poly.m_vertexCount; i++) {
            var v = b2Math.AddVV(poly.m_position,
            b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
            this.cxt.lineTo(v.x, v.y);
         }
         this.cxt.lineTo(tV.x, tV.y);
         break;
      }
   }
   this.cxt.stroke();   //绘制
};


