function DrawPrizes()
{
    for(var x=0;x<prizes.length;x++)
	{
	    currentPrize=prizes[x];
		if(!currentPrize.hit)
		{
		       ctx.drawImage(currentPrize.image,prizes[x].x,prizes[x].y);
		}
	}
	
}



function InitPrizes()
{
    var count=0;
	for(var x=0;x<3;x++)
	{
	    for(var y=0;y<10;y++)
		{
		    prize=new Prize();
			if(x==0)  {prize.image=sunImg;prize.point=3;}
			if(x==1)  {prize.image=moonImg;prize.point=2;}
			if(x==2)  {prize.image=starImg;prize.point=1;}
			
			prize.row=x;
			prize.col=y;
			prize.x=40*prize.col+30;
			prize.y=40*prize.row+60;
			prizes[count]=prize;
			count++;
		}
	}
}

	


function HasBallHitPrize()
{
    for(var x=0;x<prizes.length;x++)
	{
	    var prize=prizes[x];
		if(!prize.hit)
		{
		   if(CheckIntersect(prize,ball,2))
		   {
			  
			   
			   sound.play("ballhitprize");
			   
			   
			   prize.hit=true;
			   if((ball.x+ball.image.width/2)<(prize.x)&&horizontalSpeed>0)
	          {
		             horizontalSpeed=-horizontalSpeed;
		       }
		       if((ball.x+ball.image.width/2)>(prize.x+prize.image.width)&&horizontalSpeed<0)
		      {
		             horizontalSpeed=-horizontalSpeed;
		      }
		       if((ball.y+ball.image.height/2)<(prize.y)&&verticalSpeed>0)
		      {
		             verticalSpeed=-verticalSpeed;
		       }
		       if((ball.y+ball.image.height/2)>(prize.y+prize.image.height)&&verticalSpeed<0)    
		      {
		             verticalSpeed=-verticalSpeed;
			  }
			  score+=prize.point;
			}
		}
		
	}
}



function AllPrizesHit()
{
    for(var c=0;c<prizes.length;c++)
	{
	    checkPrize=prizes[c];
		if(checkPrize.hit==false)
		return false;
	}
	return true;
}


function HsaAllPrizesHit(){
     if(AllPrizesHit())
	{
	     InitPrizes();
	}
}


