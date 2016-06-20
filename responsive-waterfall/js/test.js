var windowWidth = 0,
	interval = null;
$(document).ready(function() {
	$(window).on("load", function() {
		boxLocation();
		window.onresize = function() {
			windowWidth = $(window).width();
			if (interval == null) {
				interval = setInterval("test()", 200);
			}
		}
	});
});

function test() {
	if (windowWidth == $(window).width()) {
		boxRelocation();
		clearInterval(interval);
		interval = null;
	}
}

function boxStyle(width, height, top, left) {
	this.position = "absolute";
	this.width = width;
	this.height = height;
	this.top = top;
	this.left = left;
}

function boxArrBuild(boxStyleArr) {
	var box = $(".response");
	var num = 4;
	if ($(window).width() <= 500) num = 1;
	if ($(window).width() > 500) num = 2;
	if ($(window).width() > 800) num = 3;
	if ($(window).width() > 1000) num = 4;
	if ($(window).width() > 1200) num = 5;
	var boxWidth = $(window).width() / num;
	var boxArr = [];
	box.each(function(index, value) {
		$(value).css({
			"width": boxWidth,
			"height": "auto"
		});
		boxStyleArr[index] = new boxStyle();
		boxStyleArr[index].width = boxWidth;
		boxStyleArr[index].height = box.eq(index).height();
		if (index < num) {
			boxArr[index] = boxStyleArr[index].height;
			boxStyleArr[index].left = boxWidth * index;
			boxStyleArr[index].top = 0;
		} else {
			var minboxHeight = Math.min.apply(null, boxArr);
			var minboxIndex = $.inArray(minboxHeight, boxArr);
			boxStyleArr[index].left = boxStyleArr[minboxIndex].left;
			boxStyleArr[index].top = minboxHeight;
			boxArr[minboxIndex] += boxStyleArr[index].height;
		}
	});
}

function boxLocation() {
	var box = $(".response");
	var boxStyleArr = [];
	boxArrBuild(boxStyleArr);
	box.each(function(index, value) {
		$(value).css({
			"position": "absolute",
			"top": 0,
			"left": 0,
			"width": 0,
			"height": 0
		});
		$(value).animate({
			top: boxStyleArr[index].top,
			left: boxStyleArr[index].left,
			height: boxStyleArr[index].height,
			width: boxStyleArr[index].width
		}, 500);

	});
}

function boxRelocation() {
	var box = $(".response");
	var boxStyleArr = [];
	boxArrBuild(boxStyleArr);
	box.each(function(index, value) {
		$(value).animate({
			top: boxStyleArr[index].top,
			left: boxStyleArr[index].left
		}, 500);

	});
}