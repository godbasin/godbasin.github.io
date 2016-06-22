/*绘制框内特殊图形*/
function DrawSpecialClass(splDateList,canvasInf,picIniInfList){ 
	//alert("splDateList  "+splDateList);
	  this.splDate=new Array();
	  this.splDateList=splDateList;
	  
	  
	  this.creatDate();
	  //alert("here");
	  this.canvasInf=canvasInf;
	  this.canvasId=this.canvasInf[0];
	  this.canvas=document.getElementById(this.canvasId);
	  
	  this.cxt=this.canvas.getContext('2d');
	  this.canvasWidth=this.canvasInf[1];
	  //alert(" this.canvasWidth  "+this.canvasWidth);
	  this.canvasHeight=this.canvasInf[2];
	  this.canvasOx=this.canvasInf[3]; 
	  this.canvasOy=this.canvasInf[4];
	  
	  this.picIniInfList=picIniInfList;
	  this.flage=new Array();
}

DrawSpecialClass.prototype.creatDate=function(){
	//alert("in creatDate");
	var l=this.splDateList.length;
	for(var i=0;i<l;i++)
	{
		var spldate=new SpecialDateClass(this.splDateList[i]);
		this.splDate.push(spldate);
	}
	//alert("out creatDate");
};

DrawSpecialClass.prototype.drawp=function(splDateIdList){
	//alert("in drawp");
	var l=splDateIdList.length;
	this.Initpage();
	for(var i=0;i<l;i++)
	{
		if(this.flage[splDateIdList[i]]!="inited")
	     {
		      //alert("in init");
			  this.displayOneObject(0,this.picIniInfList[5*i],this.picIniInfList[5*i+1],this.picIniInfList[5*i+2],
									 this.picIniInfList[5*i+3],this.splDate[splDateIdList[i]].ud,0);
			  this.flage[splDateIdList[i]]="inited";
	     }
		 
	}
	this.Initpage();
	//alert(l);
	for(var j=0;j<l;j++)
	{
		if(this.flage[splDateIdList[j]]=="inited")
		{ //alert("in draw");
			this.drawSpecial(splDateIdList,j);
		}
	}
	//alert("out drawp");
    
};



DrawSpecialClass.prototype.getObjrect=function(id,key,lo,splDateID){  //(i,2,this.splDate[j].ud,j)
	//alert("in getObjrect");
	var ind=lo.pdex[id][this.splDate[splDateID].sel.indst+1];
    var st=2*lo.pindex[ind][this.splDate[splDateID].sel.start],ed=2*lo.pindex[ind][this.splDate[splDateID].sel.end];
	var left,top,right,bottom;
	var num=lo.pdex[id][this.splDate[splDateID].sel.indst];	
	var inde=lo.pdex[id][this.splDate[splDateID].sel.indst+num-1+1]; 
	var ste=2*lo.pindex[inde][this.splDate[splDateID].sel.start],ede=2*lo.pindex[inde][this.splDate[splDateID].sel.end];
	var length=ede-st+2;
	  left = right  = lo.pvex[st];
	  top  = bottom = lo.pvex[st+1];
	  
 for ( var j=0; j<num;j++){
	  ind=lo.pdex[id][this.splDate[splDateID].sel.indst+1+j];
      st=2*lo.pindex[ind][this.splDate[splDateID].sel.start],ed=2*lo.pindex[ind][this.splDate[splDateID].sel.end];
      var left0,right0,top0,bottom0;
	  left0=right0=lo.pvex[st],top0=bottom0=lo.pvex[st+1];
	  for (var i=st;i<ed+1;i +=2) {
	         var x=lo.pvex[i];
		     var y=lo.pvex[i+1];
		     if ( x <left0 )  left0=x;
		     if ( y <top0 )   top0=y;
		     if ( x >right0 ) right0=x;
		     if ( y >bottom0) bottom0=y;
		     if ( x <left )   left=x;
		     if ( y <top )    top=y;
		     if ( x >right )  right=x;
		     if ( y >bottom)  bottom=y;
	 	    }  //for i
		    lo.pindex[ind][1]  = left0+(right0-left0)/2;    // 中心坐标
		    lo.pindex[ind][2]  = top0+(bottom0-top0)/2;
		  } // for j

		  lo.pdex[id][1]  = left;     // 
		  lo.pdex[id][2]  = top;      // 
		  lo.pdex[id][3]  = right;    // 
		  lo.pdex[id][4]  = bottom;   //
		
		  var num=lo.pdex[id][this.splDate[splDateID].sel.indst]+this.splDate[splDateID].sel.indst+1;
		  var ktype=lo.pdex[id][num];
		  if (ktype >0 && key ==2  ) { //&& pdex[id][this.splDate[splDateID].sel.indst-1]==0
		    var vexst=this.splDate[splDateID].sel.valueend,vx=0;
		    for (var k=num;k<num+ 3*lo.pdex[id][num];k+=3) {
			   if (lo.pdex[id][this.splDate[splDateID].sel.indst-2]==0) {
			     lo.pdex[id][k+1] = vexst;
			     vexst +=length;  //
			   }
		       lo.pdex[id][k+2] = left +(right-left)/2+vx; 
			   lo.pdex[id][k+3] = top  +(bottom-top)/2; 
			   vx +=10;        // 控制点的坐标  
			   
		       } //for
			   if (lo.pdex[id][this.splDate[splDateID].sel.indst-2]==0) 
		       this.splDate[splDateID].sel.valueend=vexst;	
	    } //ktype
		
	      if (key==1 || key==2) {
		  lo.pdex[id][9]  = right+10;
		  lo.pdex[id][10] = top  +(bottom-top)/2;//
		  lo.pdex[id][11] = left +(right-left)/2;
		  lo.pdex[id][12] = top  +(bottom-top)/2+5;//
		} //if
		//alert("out getObjrect");
};//fun getObjrect

	  
DrawSpecialClass.prototype.Initpage=function(){
	//alert("in Initpage");
	for(var j=0;j<this.splDate.length;j++)
	{
		 this.cxt.strokeStyle = '#000'; 
		 this.cxt.clearRect(this.canvasOx,this.canvasOy,this.canvasWidth,this.canvasHeight); 
		 var smartID=1;
	     for (var i=0;i<this.splDate[j].ud.pdex.length;i++){ 
			var num=this.splDate[j].ud.pdex[i][this.splDate[j].sel.indst]; 
			var smartnum=this.splDate[j].ud.pdex[i][this.splDate[j].sel.indst]+this.splDate[j].sel.indst+1;
	        if (smartnum >0 ) {
			    this.splDate[j].ud.pdex[i][this.splDate[j].sel.indst-1] +=smartID;
				smartID++;
		    }
			this.getObjrect(i,2,this.splDate[j].ud,j); 
        } // for i
	}//for j
	//alert("out Initpage");
};//fun  Initpage

DrawSpecialClass.prototype.redraw=function(mct,id,ii,lo,splDateID){
	
   ////alert("mct:"+mct);
   //alert("in redraw");
   var st=2*lo.pindex[id][this.splDate[splDateID].sel.start],ed=2*lo.pindex[id][this.splDate[splDateID].sel.end];  
   var strType=lo.pindex[id][0];
   switch ( strType.charAt(0)) {
    case 'b':
	 { 
	   this.cxt.beginPath();
	   this.cxt.moveTo(lo.pvex[st],lo.pvex[st+1]); 
      for (var i=st;i<ed-1; i +=6) { 
	      this.cxt.bezierCurveTo(lo.pvex[i+2],lo.pvex[i+3],lo.pvex[i+4],lo.pvex[i+5],lo.pvex[i+6],lo.pvex[i+7]);
	   }  //for 
	   this.cxt.lineWidth=lo.pindex[id][this.splDate[splDateID].sel.start+3];
	   this.cxt.stroke();
       this.cxt.closePath();
	  }
	 break;
    case 'l':
    { 
	   this.cxt.beginPath();
	   this.cxt.moveTo(lo.pvex[st],lo.pvex[st+1]);  // 
      for (var i=st;i<ed;i +=2) { 
	      this.cxt.lineTo(lo.pvex[i+2],lo.pvex[i+3]);
	   }  //for 
	   this.cxt.lineWidth=lo.pindex[id][this.splDate[splDateID].sel.start+3];
	   this.cxt.stroke();
       this.cxt.closePath();
	 }
	 break;	 
   } 

  switch (strType.charAt(1)){ 
    case '5':
	    {
		   var x0=lo.pvex[st],y0=lo.pvex[st+1];
	       this.cxt.fillStyle = lo.pindex[id][this.splDate[splDateID].sel.start+2]; 
           this.cxt.font      = lo.pindex[id][this.splDate[splDateID].sel.start+4];
           this.cxt.textAlign ='left'
           this.cxt.textBaseline='top';
		   var strArr=lo.pindex[id][this.splDate[splDateID].sel.start+5];
		   var s=this.cxt.font;//str.replace(/Microsoft/,"W3School"
		
		   var s1=s.substr(0 ,2);
		   var strArray=strArr.split("\n"),heigth=Number(s1);
	//	   //alert(heigth);
		   for (var h=0;h<strArray.length;h++) {
			    this.cxt.fillText(strArray[h],x0,y0+heigth*h);//+heigth*h
		   }
		    
	     }
		 break;
    case '1':
	    {
		  this.cxt.fillStyle=lo.pindex[id][this.splDate[splDateID].sel.start+5];
		  this.cxt.fill(); 
		}

		break;
	case '2':
		{ 
		    var x0 =lo.pdex[ii][1],y0=lo.pdex[ii][2]+(lo.pdex[ii][4]-lo.pdex[ii][2])/2;
		    var x  =lo.pdex[ii][3],y=y0;	
            var grd=this.cxt.createLinearGradient(x0,y0,x,y);
	          grd.addColorStop(0,lo.pindex[id][this.splDate[splDateID].sel.start+4]); // this.splDate[splDateID].sel.start color
              grd.addColorStop(1,lo.pindex[id][this.splDate[splDateID].sel.start+5]); // this.splDate[splDateID].sel.end   color
              this.cxt.fillStyle=grd;
              this.cxt.fill();
 		 }
		 break;
	case '3':
		{   
		     var x0 =lo.pdex[ii][1]+(lo.pdex[ii][3]-lo.pdex[ii][1])/2.0;
			 var y0 =lo.pdex[ii][2]+(lo.pdex[ii][4]-lo.pdex[ii][2])/2.0;
		     var x1 =lo.pdex[ii][3],y1=lo.pdex[ii][2]+(lo.pdex[ii][4]-lo.pdex[ii][2])/2.0
		     var r  =(lo.pdex[ii][3]-lo.pdex[ii][1])/2.0;
             var grd=this.cxt.createRadialGradient(x0,y0,2,x0,y0,r);
			 grd.addColorStop(0,lo.pindex[id][this.splDate[splDateID].sel.start+4]); 
             grd.addColorStop(1,lo.pindex[id][this.splDate[splDateID].sel.start+5]); 
             this.cxt.fillStyle=grd;
             this.cxt.fill();
 		 }
		 break;		 
	case '4':
	   {
        var img=new Image();
	        img.onload=function(){
		    lo.pindex[id][this.splDate[splDateID].sel.start+5]="ok";
		}
		img.src=lo.pindex[id][this.splDate[splDateID].sel.start+4];   //纵向缩放绘制
		if ( lo.pindex[id][this.splDate[splDateID].sel.start+5] =="ok") {
           var ptrn = this.cxt.createPattern(img,'repeat');   //将图案设置为填充样式
		   if ( ptrn !=null) {
              this.cxt.fillStyle = ptrn;   //填充画布
			  this.cxt.fill();
	    	 }
		   }
	    }
	    break;	
	} // switch 
	//alert("out redraw");
}; //fun redraw


DrawSpecialClass.prototype.displayOneObject=function(subID,x,y,width,height,lo,splDateID){
	//alert("in displayOneObject");
	if (subID>=0 && subID <lo.pgraph.length/2){
		var left=lo.pdex[subID][1];
		var top=lo.pdex[subID][2];
		var right=lo.pdex[subID][3];
		var bottom=lo.pdex[subID][4]; 
		var w=right-left;
		var h=bottom-top;
		var rx  =width/w;
		var ry  =height/h; 
		var bx=left,by=top;
        var sID=lo.pgraph[subID*2+1];
	    var num=lo.pdex[sID][this.splDate[splDateID].sel.indst]; 
	    for ( var j=0;j<num;j++) {
	        var ind=lo.pdex[sID][this.splDate[splDateID].sel.indst+1+j]; 
		    var st=2*lo.pindex[ind][this.splDate[splDateID].sel.start],ed=2*lo.pindex[ind][this.splDate[splDateID].sel.end];
           for (var i=st;i<ed+1;i +=2){
		       lo.pvex[i]  =(lo.pvex[i]  -bx)*rx+bx-(left-x);
               lo.pvex[i+1]=(lo.pvex[i+1]-by)*ry+by-(top -y);
	         }  //for i
	       } //for j 	
		   this.getObjrect(sID,2,lo,splDateID);
	
	
	for ( var j=0;j<num;j++) {
			        var ind=lo.pdex[subID][this.splDate[splDateID].sel.indst+1+j];	
				//	redrawAll(this.splDate.ud.mainCt);
				    ////alert(this.cxt);
			        this.redraw(this.cxt,ind,subID,lo,splDateID); 
	   }//for j  
	 } //if
	 //alert("out displayOneObject");
};//fun  displayOneObject

DrawSpecialClass.prototype.redrawOneObject=function(subID,x,y,lo,splDateID){
	//alert("in redrawOneObject");
	if (subID>=0 && subID <lo.pgraph.length/2){
		
        var sID=lo.pgraph[subID*2+1];
	    var num=lo.pdex[sID][this.splDate[splDateID].sel.indst]; 
	  
	 for ( var j=0;j<num;j++) {
		   var ind=lo.pdex[subID][this.splDate[splDateID].sel.indst+1+j];	
				//	redrawAll(this.splDate.ud.mainCt);
		   this.redraw(lo.mainCt,ind,subID,lo,splDateID); 
	   }//for j  
	 } //if
	//alert("out redrawOneObject");
};//fun  redrawOneObject

DrawSpecialClass.prototype.drawSpecial=function(splDateIdList,j){
	   //alert("in drawSpecial");
	   var x0=ctrlSplBodyList[j].GetCenterPosition()[0];
	   var y0=ctrlSplBodyList[j].GetCenterPosition()[1];
	   var dx=x0-(this.picIniInfList[5*j]+this.picIniInfList[5*j+2]*0.5);
	   var dy=y0-(this.picIniInfList[5*j+1]+this.picIniInfList[5*j+3]*0.5);
	   
	   var position=ctrlSplBodyList[j].GetOriginPosition();
	   
	   var angle=ctrlSplBodyList[j].GetRotation();
	   var dangle=angle-this.picIniInfList[5*j+4];
	
	   var currentX=x0-this.picIniInfList[5*j+2]*0.5;                          
	   var currentY=y0-this.picIniInfList[5*j+3]*0.5;
	   
	   var splDateID=splDateIdList[j];
	   this.moveObjTo(0,dx,dy,this.splDate[splDateID].ud,splDateID);
	
	   if(Math.abs(dangle)<=0.001)
	   {
		   this.redrawOneObject(0,currentX,currentY,this.splDate[splDateID].ud,splDateID);  
	   }
	   else
	   {
		   this.rotateOneObject(0,x0,y0,dangle,this.splDate[splDateID].ud,splDateID); 
		   this.redrawOneObject(0,currentX,currentY,this.splDate[splDateID].ud,splDateID);  
	   }      
	   this.picIniInfList[5*j]=x0-this.picIniInfList[5*j+2]*0.5;
	   this.picIniInfList[5*j+1]=y0-this.picIniInfList[5*j+3]*0.5;
	   this.picIniInfList[5*j+4]=angle;
};

DrawSpecialClass.prototype.drawSpecialPic=function(splDateIdList,j){
};

DrawSpecialClass.prototype.moveObjTo=function(id,dx,dy,lo,splDateID){
	 //alert("in moveObjTo");
	 var num=lo.pdex[id][this.splDate[splDateID].sel.indst];  
	 for ( var j=0;j<num;j++) {
	      var ind=lo.pdex[id][this.splDate[splDateID].sel.indst+1+j];
    	  var st=2*lo.pindex[ind][this.splDate[splDateID].sel.start],ed=2*lo.pindex[ind][this.splDate[splDateID].sel.end];
		  lo.pindex[ind][1] +=dx;
		  lo.pindex[ind][2] +=dy;
		  for (var i=st;i<ed+1;  i +=2) {
		   lo.pvex[i]    += dx;
		   lo.pvex[i+1]  += dy;
		  }//for i
	  } //for j
	  lo.pdex[id][1]   += dx;
	  lo.pdex[id][2]   += dy; 
	  lo.pdex[id][3]   += dx;
	  lo.pdex[id][4]   += dy;
	  //alert("out moveObjTo");
};//fun  moveObjTo

DrawSpecialClass.prototype.rotateOneObject=function(subID,x,y,angle,lo,splDateID){
	//alert("in rotateOneObject");
	if (subID>=0 && subID <lo.pgraph.length/2){
		var left=lo.pdex[subID][1],top=lo.pdex[subID][2],right=lo.pdex[subID][3],bottom=lo.pdex[subID][4];   
        var sID=lo.pgraph[subID*2+1];
		var x0=x;//(right-left)/2.0;  
		var y0=y;//(bottom-top)/2.0;
	    var num=lo.pdex[sID][this.splDate[splDateID].sel.indst];   //var num=lo.pdex[sID][this.splDateList[splDateID].sel.indst]; 
	    for ( var j=0;j<num;j++) {
	        var ind=lo.pdex[sID][this.splDate[splDateID].sel.indst+1+j]; 
		    var st=2*lo.pindex[ind][this.splDate[splDateID].sel.start],ed=2*lo.pindex[ind][this.splDate[splDateID].sel.end];
           for (var i=st;i<ed+1;i +=2){
			   var sx=lo.pvex[i],sy=lo.pvex[i+1];
		       lo.pvex[i]  =(sx-x0)*Math.cos(angle)-(sy-y0)*Math.sin(angle)+x0;			
               lo.pvex[i+1]=(sx-x0)*Math.sin(angle)+(sy-y0)*Math.cos(angle)+y0;
	         }  //for i
	       } //for j 	
   } //if  
};//fun rotateOneObject





