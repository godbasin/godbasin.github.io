var dragging = false;
var target, box, drop;
var dropwidth, dropheight;
var dropping = false;
$(document).on('mousedown',mouseDown);
function mouseDown(e){
	if (e.which == 1) {
		position_target(e);
		if ($(target).attr('class') == "fix-layout") {
			dragging = true;
			target = $(target).clone();
			$(target).removeClass("fix-layout").addClass("move-layout");
			$(".container").append(target);
		}
		if ($(target).attr('class') == "float-layout") {
			dragging = true;		
			$(target).removeClass("float-layout").addClass("move-layout");			
			$(".container").append(target);
		}
		if ($(target).attr('class') == "fix-target") {
			dragging = true;
			target = $(target).clone();
			$(target).removeClass("fix-target").addClass("move-target");
			$(".container").append(target);
		}
		if ($(target).attr('class') == "float-target") {
			dragging = true;
			$(target).removeClass("float-target").addClass("move-target");
			$(".container").append(target);
			$(target).children(".header, .footer, .nav, .content, .slider-7, .slider-8, .slider-9").css("height","auto");
			$(target).children(".listview-l").css("height","100px");
			$(target).children(".listview-s").css("height","50px");
		}
		if(dragging){
			var oX = getMousePos(e).x - $(target).width() / 2;
			var oY = getMousePos(e).y - $(target).height() / 2;
			$(target).css({
				"left": oX + "px",
				"top": oY + "px"
			});
		}
		position_box(e);
		if ($(box).attr('id') == "box") {
			if ($(target).attr('class') == "move-layout" || $(target).attr('class') == "move-layout-over") {
				$(target).removeClass("move-layout").addClass("move-layout-over");
				if (dropping == false) {
					drop = $("<div class='drop-layout'></div>");
					moveDrop();
					$("#box-content").append(drop);
					dropping = true;
				} else {
					$(drop).remove();
					moveDrop();
					$("#box-content").append(drop);
				}
			}
		}
	}
	return false;
}

function getMousePos(event){
	var e = event || window.event;
	var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
	var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
	var x = e.pageX || e.clientX + scrollX;
	var y = e.pageY || e.clientY + scrollY;
	return {'x':x,'y':y};
}

function moveDrop() {
	dropwidth = $(target).width();
	dropheight = $(target).height();
	$(drop).css({
		"width": dropwidth,
		"height": dropheight
	});
}
$(document).mousemove(function(e) {
	if($("#box-content").children().length == 0){
		$("#save-page").attr("disabled","disabled");
		$("#save-page").css("cursor","not-allowed");
	}else {
		$("#save-page").removeAttr("disabled");
		$("#save-page").css("cursor","pointer");
	}
	if (dragging) {
		var oX = getMousePos(e).x - $(target).width() / 2;
		var oY = getMousePos(e).y - $(target).height() / 2;
		$(target).css({
			"left": oX + "px",
			"top": oY + "px"
		});
		position_box(e);
		if ($(box).attr('data-type') == "layout" && $(box).parent().attr('class') == "float-layout") {
			if ($(target).attr('class') == "move-layout" || $(target).attr('class') == "move-layout-over") {
				$(target).removeClass("move-layout").addClass("move-layout-over");
				if (dropping == false) {
					drop = $("<div class='drop-layout'></div>");
					moveDrop();
					$($(box).parent()).before(drop);
					dropping = true;
				} else {
					$(drop).remove();
					moveDrop();
					$($(box).parent()).before(drop);
				}
			}
		} else if ($(box).attr('id') == "box") {
			if ($(target).attr('class') == "move-layout" || $(target).attr('class') == "move-layout-over") {
				$(target).removeClass("move-layout").addClass("move-layout-over");
				if (dropping == false) {
					drop = $("<div class='drop-layout'></div>");
					moveDrop();
					$("#box-content").append(drop);
					dropping = true;
				} else {
					$(drop).remove();
					moveDrop();
					$("#box-content").append(drop);
				}
			}
		} else {
			if ($(target).attr('class') == "move-layout-over") {
				$(target).removeClass("move-layout-over").addClass("move-layout");
			}
			if (dropping == true) {
				$(drop).remove();
				dropping = false;
			}
		}
	}
	return false;
});
$(document).mouseup(function(e) {
	position_box(e);
	e.cancelBubble = true;
	if (dragging == true) {
		if (($(box).attr('data-type') == "layout" && $(box).parent().attr('class') == "float-layout") || ($(box).attr('data-type') == "layout" && $(box).parent().attr('data-type') == "layout")) {
			if ($(target).attr('class') == "move-target" && $(box).children().length == 0) {
				$(target).removeClass("move-target").addClass("float-target");
				$(target).children(".header, .footer, .nav, .listview-l, .listview-s, .content, .slider-7, .slider-8, .slider-9").css("height","100%");
				$(box).append(target);
			} else if ($(target).attr('class') == "move-layout-over") {
				if (dropping) {
					$(target).removeClass("move-layout-over").addClass("float-layout");
					$(drop).before($(target));
				}
			} else $(target).remove();
		} else if ($(box).attr('id') == "box") {
			if ($(target).attr('class') == "move-layout-over") {
				if (dropping) {
					$(target).removeClass("move-layout-over").addClass("float-layout");
					$(drop).before($(target));
				}
			} else {
				$(target).remove();
			}
		} else {
			$(target).remove();
		}
	}
	$(drop).remove();
	dropping = false;
	dragging = false;
});

function fnGetTable(oEl) {
	while (null != oEl && $(oEl).attr('class') != "fix-target" && $(oEl).attr('id') != "set-layout" && $(oEl).attr('id') != "save-page" && $(oEl).attr('class') != "box-footer" && $(oEl).attr('class') != "to-edit" && $(oEl).attr('class') != "edit" && $(oEl).attr('class') != "container" && $(oEl).attr('class') != "float-target" && $(oEl).attr('class') != "fix-layout" && $(oEl).attr('class') != "float-layout" ) {
		oEl = oEl.parentElement;
	}
	return oEl;
}

function position_target(e) {
	var e = e||window.event;
	var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
	var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
	var eventX = e.pageX - scrollX || e.clientX ;
	var eventY = e.pageY - scrollY || e.clientY ;
	target = document.elementFromPoint(eventX, eventY);
	target = fnGetTable(target);
}

function fnGetTable2(oEl) {
	while (null != oEl && $(oEl).attr('id') != "box" && $(oEl).attr('class') != "container" && $(oEl).attr('data-type') != "layout") {
		oEl = oEl.parentElement;
	}
	return oEl;
}

function position_box(e) {
	var e = e||window.event;
	var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
	var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
	var eventX = e.pageX - scrollX || e.clientX ;
	var eventY = $(target).offset().top - 1 - scrollY;
	box = document.elementFromPoint( eventX , eventY);
	box = fnGetTable2(box);
}
 
