var background=new Image();
var stickImg=new Image();
var ballImg=new Image();
var speed=2;
var horizontalSpeed=speed;
var verticalSpeed=-speed;
var ballAngle=2;
var ctx;
var screenWidth;
var screenHeight;
var livesImages=new Array();
var score=0;
var scoreImg=new Image();
var gameRunning=false;
var gameloopId;
var lives=5;
var direction;

var sound = new Sound();

var sunImg=new Image();
var moonImg=new Image();
var starImg=new Image();

var stage=1;

var x, xold, xdiff;
document.onmousemove =function SpeedChange(evt) { 
evt = evt ? evt : (window.event ? window.event : null);
     x = (document.layers) ? evt.pageX : evt.clientX;
     xdiff = x -xold;
     if (xdiff >  2) direction=1;
     if (xdiff < -2) direction=-1; 
     xold = x;    
}



function Sound()
{
	
}


Sound.prototype.play = function(name)
{
	var ss = document.getElementById(name);
	ss.play();
};

Sound.prototype.stop=function(name){
    var sss = document.getElementById(name);
	sss.stop();
	};





function GameObject()
{
   this.x=0;
   this.y=0;
   this.image=null;
}







function Stick(){};
Stick.prototype=new GameObject();
var stick= new Stick();






function Ball(){};
Ball.prototype= new GameObject();
Ball.prototype.angle=0;
var ball=new Ball;




var prizes=new Array();
function Prize(){};
Prize.prototype=new GameObject();
Prize.prototype.row=0;
Prize.prototype.col=0;
Prize.prototype.hit=false;
Prize.prototype.point=0;



function AddEventHandlers()
{
    $("#container").mousemove(function(e){
      stick.x=e.pageX-(stick.image.width/2);
    });
	$("#BtnImgStart").click(function(){
	   ToggleGameplay();
	});
}






function DrawLives()
{
     ctx.drawImage(livesImages[lives],0,0);
}








function DrawScore()
{
     ctx.drawImage(scoreImg,screenWidth-(scoreImg.width),0);
	 ctx.font="12pt Arial";
	 ctx.fillText(""+score,550,33);
}






function loadImages()
{
   stickImg.src="./images/stick.png";
   background.src="./images/night.jpg";
   ballImg.src="./images/ball.png";
   sunImg.src="./images/sun.png";
   moonImg.src="./images/moon.png";
   starImg.src="./images/star.png";
   scoreImg.src="./images/score.png";
   for(var x=0;x<6;x++)
   {
      livesImages[x]=new Image();
	  livesImages[x].src="./images/lives"+x+".png";
    }
   stick.image=stickImg;
   ball.image=ballImg;
   background.onload=function(){GameLoop();};
}




