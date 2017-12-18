
(function($) {
    var D = $(document).data("func", {});
    $.smartMenu = $.noop;
    $.fn.smartMenu = function(data, options) {
        var B = $("body"), defaults = {
            name: "",
            container:"",
            offsetX: 2,
            offsetY: 2,
            textLimit: 6,
            beforeShow: $.noop,
            afterShow: $.noop
        };
        var params = $.extend(defaults, options || {});

        var htmlCreateMenu = function(datum) {
            var dataMenu = datum || data, nameMenu = datum? Math.random().toString(): params.name, htmlMenu = "", htmlCorner = "", clKey = "smart_menu_";
            if ($.isArray(dataMenu) && dataMenu.length) {
                htmlMenu = '<div id="smartMenu_'+ nameMenu +'" class="'+ clKey +'box">' +
                    '<div class="'+ clKey +'body">' +
                    '<ul class="'+ clKey +'ul">';

                $.each(dataMenu, function(i, arr) {
                    if (i) {
                        htmlMenu = htmlMenu + '<li class="'+ clKey +'li_separate">&nbsp;</li>';
                    }
                    if ($.isArray(arr)) {
                        $.each(arr, function(j, obj) {
                            var text = obj.text, htmlMenuLi = "", strTitle = "", rand = Math.random().toString().replace(".", "");
                            if (text) {
                                if (text.length > params.textLimit) {
                                    text = text.slice(0, params.textLimit)	+ "...";
                                    strTitle = ' title="'+ obj.text +'"';
                                }
                                if ($.isArray(obj.data) && obj.data.length) {
                                    htmlMenuLi = '<li class="'+ clKey +'li" data-hover="true">' + htmlCreateMenu(obj.data) +
                                        '<a href="javascript:" class="'+ clKey +'a"'+ strTitle +' data-key="'+ rand +'"><i class="'+ clKey +'triangle"></i>'+ text +'</a>' +
                                        '</li>';
                                } else {
                                    htmlMenuLi = '<li class="'+ clKey +'li">' +
                                        '<a href="javascript:" class="'+ clKey +'a"'+ strTitle +' data-key="'+ rand +'">'+ text +'</a>' +
                                        '</li>';
                                }

                                htmlMenu += htmlMenuLi;

                                var objFunc = D.data("func");
                                objFunc[rand] = obj.func;
                                D.data("func", objFunc);
                            }
                        });
                    }
                });

                htmlMenu = htmlMenu + '</ul>' +
                    '</div>' +
                    '</div>';
            }
            return htmlMenu;
        }, funSmartMenu = function() {
            //TODO 修改为事件代理
            var idKey = "#smartMenu_", clKey = "smart_menu_", jqueryMenu = $(idKey + params.name);
            if (!jqueryMenu.length) {
                $("body").append(htmlCreateMenu());

                //浜嬩欢
                $(idKey + params.name +" a").bind("click", function() {
                    var key = $(this).attr("data-key"),
                        callback = D.data("func")[key];
                    if ($.isFunction(callback)) {
                        callback.call(D.data("trigger"));
                    }
                    $.smartMenu.hide();
                    return false;
                });
                $(idKey + params.name +" li").each(function() {
                    var isHover = $(this).attr("data-hover"), clHover = clKey + "li_hover";

                    $(this).hover(function() {
                        var jqueryHover = $(this).siblings("." + clHover);
                        jqueryHover.removeClass(clHover).children("."+ clKey +"box").hide();
                        jqueryHover.children("."+ clKey +"a").removeClass(clKey +"a_hover");

                        if (isHover) {
                            $(this).addClass(clHover).children("."+ clKey +"box").show();
                            $(this).children("."+ clKey +"a").addClass(clKey +"a_hover");
                        }

                    });

                });
                return $(idKey + params.name);
            }
            return jqueryMenu;
        };

        $(this).on('contextmenu',params.container,function(e){
                    if ($.isFunction(params.beforeShow)) {
                        params.beforeShow.call(this);
                    }
                    e = e || window.event;
                    //闃绘鍐掓场
                    e.cancelBubble = true;
                    if (e.stopPropagation) {
                        e.stopPropagation();
                    }
                    //闅愯棌褰撳墠涓婁笅鏂囪彍鍗曪紝纭繚椤甸潰涓婁竴娆″彧鏈変竴涓笂涓嬫枃鑿滃崟
                    $.smartMenu.hide();
                    var st = D.scrollTop();
                    var jqueryMenu = funSmartMenu();
                    if (jqueryMenu) {
                        jqueryMenu.css({
                            display: "block",
                            left: e.clientX + params.offsetX,
                            top: e.clientY + st + params.offsetY
                        });
                        D.data("target", jqueryMenu);
                        D.data("trigger", this);
                        //鍥炶皟
                        if ($.isFunction(params.afterShow)) {
                            params.afterShow.call(this);
                        }
                        return false;
                    }
        });
        if (!B.data("bind")) {
            B.bind("click", $.smartMenu.hide).data("bind", true);
        }
    };
    $.extend($.smartMenu, {
        hide: function() {
            var target = D.data("target");
            if (target && target.css("display") === "block") {
                target.hide();
            }
        },
        remove: function() {
            var target = D.data("target");
            if (target) {
                target.remove();
            }
        }
    });
})(jQuery);
