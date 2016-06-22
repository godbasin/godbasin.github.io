

function stop(){direction=0;}




function CheckIntersect(object1,object2,overlap)
{
    A1=object1.x+overlap;
	B1=object1.x+object1.image.width-overlap;
	C1=object1.y+overlap;
	D1=object1.y+object1.image.height-overlap;
	
	A2=object2.x+overlap;
	B2=object2.x+object2.image.width-overlap;
	C2=object2.y+overlap;
	D2=object2.y+object2.image.height-overlap;
	
	if(A1>A2&&A1<B2||B1>A2&&B1<B2)
	{
	    if(C1>C2&&C1<D2||D1>C2&&D1<D2)
		{
		    return true;
		}
	}
	return false;
}



function HasBallHitEdge()
{
    if(ball.x>screenWidth-ball.image.width)
	{
	    if(horizontalSpeed>0)
		horizontalSpeed=-horizontalSpeed;
	}
	if(ball.x<-20)
	{
	    if(horizontalSpeed<0)
	    horizontalSpeed=-horizontalSpeed;
	}
	if(ball.y>screenHeight-ball.image.height)
	{
	    lives-=1;
		if(lives>0)
		{
		    horizontalSpeed=speed;
			verticalSpeed=-speed;
			ball.x=parseInt(screenWidth/2);
			ball.y=parseInt(screenHeight/2);
			$("#BtnImgStart").show();
			ToggleGameplay();
			GameLoop();
		}
	}
	if(ball.y<0)
	{
	    verticalSpeed=-verticalSpeed;
	}
	if(lives<=0)  GameOver();
}
	
	





function HasBallHitStick()
{
    if(CheckIntersect(ball,stick,0))
	{  

		
		sound.play("ballhitstick");
		if((ball.x+ball.image.width/2)<(stick.x+stick.image.width*0.1)&&horizontalSpeed>0)
		{
		     horizontalSpeed=-horizontalSpeed;
		}
		if((ball.x+ball.image.width/2)>(stick.x+stick.image.width*0.9)&&horizontalSpeed<0)
		{
		     horizontalSpeed=-horizontalSpeed;
		}
		verticalSpeed=-speed;
		if(direction==1)    horizontalSpeed+=1;
		if(direction==-1)     horizontalSpeed-=1;
	}
}




