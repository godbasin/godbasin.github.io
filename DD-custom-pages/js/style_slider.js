var width;
//slider-7
var slider7_now=1;
var slider7_int=window.setInterval("changetabslide('#slider-7-img','4','right')",3000);
function changetabslide(id,idnum,direction){
	var now;
	width = $(id+1).width();
	if(id == "#slider-7-img") now = slider7_now;
	for(i=1;i<=idnum;i++)
	{
		$(id+i).css("display","none"); 
	}
	if(direction == "left")
	{
		if(now == 1) now=idnum;
		else now--;
		$(id+now).slideDown(500);
	}
	if(direction == "right")
	{
		if(now == idnum) now=1;
		else now++;
		$(id+now).slideDown(500);
	}
	if(id == "#slider-7-img") slider7_now = now;
	window.clearInterval(slider7_int);
	slider7_int=window.setInterval("changetabslide('#slider-7-img','4','right')",3000);
}
function showtabslide(id,idnum,totalnum){
	width = $(id+1).width();
	for(i=1;i<=totalnum;i++)
	{
		$(id+i).css("display","none");   
	}
	$(id+idnum).slideDown(500);
	slider7_now = idnum;
	window.clearInterval(slider7_int);
	slider7_int=window.setInterval("changetabslide('#slider-7-img','4','right')",3000);
}
//slider-8
var slider8_now=1;
var slider8_int=window.setInterval("changetabcollapse('#slider-8-img','4','right')",3000);
function changetabcollapse(id,idnum,direction){
	var now;
	width = $(id+1).width();
	if(id == "#slider-8-img") now = slider8_now;
	if(direction == "left")
	{
		for(i=1;i<=idnum;i++)
		{
			$(id+i).animate({left:'-'+width},800,function(){$(id+i).css("display","none");}); 
		}
		if(now == 1) now=idnum;
		else now--;
		$(id+now).css("left",width).css("display","block").animate({left:0},800);
	}
	if(direction == "right")
	{
		for(i=1;i<=idnum;i++)
		{
			$(id+i).animate({left:'-'+width},800,function(){$(id+i).css("display","none");}); 
		}
		if(now == idnum) now=1;
		else now++;
		$(id+now).css("left",id+1).css("display","block").animate({left:0},800);
	}
	if(id == "#slider-8-img") slider8_now = now;
	window.clearInterval(slider8_int);
	slider8_int=window.setInterval("changetabcollapse('#slider-8-img','4','right')",3000);
}
function showtabcollapse(id,idnum,totalnum){
	width = $(id+1).width();
	for(i=1;i<=totalnum;i++)
	{
		$(id+i).animate({left:"-"+width},800,function(){$(id+i).css("display","none");}); 
	}
	$(id+idnum).css("left",width).css("display","block").animate({left:0},800);
	slider8_now = idnum;
	window.clearInterval(slider8_int);
	slider8_int=window.setInterval("changetabcollapse('#slider-8-img','4','right')",3000);
}

//slider-9
var slider9_now=1;
var slider9_int=window.setInterval("changetabmove('#slider-9-img','5','right')",3000);
function changetabmove(id,totalnum,direction){
	var now, move, totalmove;
	width = $(id).children().eq(1).width();
	totalmove = -(totalnum-1)*width;
	if(id == "#slider-9-img") now = slider9_now;
	if(direction == "left")
	{
		if(now == 1) {now=totalnum-1; $(id).css("left",totalmove);}
		else now--;		
	}
	if(direction == "right")
	{
		if(now == totalnum) {now=2; $(id).css("left",0);}
		else now++;		
	}
	move = -(now-1)*width;
	$(id).animate({left:move},500);
	if(id == "#slider-9-img") slider9_now = now;
	window.clearInterval(slider9_int);
	slider9_int=window.setInterval("changetabmove('#slider-9-img','5','right')",3000);
}
function showtabmove(id,idnum){
	var move;
	width = $(id+1).width();
	move = -(idnum-1)*width;
	$(id).animate({left:move},500);
	slider9_now = idnum;
	window.clearInterval(slider9_int);
	slider9_int=window.setInterval("changetabmove('#slider-9-img','5','right')",3000);
}