var ServerIp = 'http://172.20.3.115:8080/lms';

var Notify = function(item) {
    new PNotify({
        title: item.title || '',
        text: item.text || '',
        type: item.type || 'info',
        styling: 'bootstrap3',
        animation: 'slide',
        delay: item.delay || 2000
    });
};

var FormatJson = function(txt, compress) {
    if (typeof txt != 'string') {
        txt = JSON.stringify(txt, undefined, 2);
    }
    var indentChar = '&nbsp;&nbsp;&nbsp;&nbsp;';
    if (/^\s*$/.test(txt)) {
        // alert('数据为空,无法格式化! ');
        return;
    }
    try { var data = eval('(' + txt + ')'); } catch (e) {
        alert('数据源语法错误,JSON格式化失败! 错误信息: ' + e.description, 'err');
        return;
    };
    var draw = [],
        last = false,
        This = this,
        line = compress ? '' : '<br>',
        nodeCount = 0,
        maxDepth = 0;

    var notify = function(name, value, isLast, indent /*缩进*/ , formObj) {
        nodeCount++; /*节点计数*/
        for (var i = 0, tab = ''; i < indent; i++) tab += indentChar; /* 缩进HTML */
        tab = compress ? '' : tab; /*压缩模式忽略缩进*/
        maxDepth = ++indent; /*缩进递增并记录*/
        if (value && value.constructor == Array) { /*处理数组*/
            draw.push(tab + (formObj ? ('"' + name + '" :  ') : '') + '[' + line); /*缩进'[' 然后换行*/
            for (var i = 0; i < value.length; i++)
                notify(i, value[i], i == value.length - 1, indent, false);
            draw.push(tab + ']' + (isLast ? line : (',' + line))); /*缩进']'换行,若非尾元素则添加逗号*/
        } else if (value && typeof value == 'object') { /*处理对象*/
            draw.push(tab + (formObj ? ('"' + name + '" :  ') : '') + '{' + line); /*缩进'{' 然后换行*/
            var len = 0,
                i = 0;
            for (var key in value) len++;
            for (var key in value) notify(key, value[key], ++i == len, indent, true);
            draw.push(tab + '}' + (isLast ? line : (',' + line))); /*缩进'}'换行,若非尾元素则添加逗号*/
        } else {
            if (typeof value == 'string') value = '"' + value + '"';
            draw.push(tab + (formObj ? ('"' + name + '" :  ') : '') + value + (isLast ? '' : ',') + line);
        };
    };
    var isLast = true,
        indent = 0;
    notify('', data, isLast, indent, false);
    draw = draw.join('').replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
    draw = '<div class="json">' + draw + '</div>';
    return draw;
};

var UrlEncode = function(param, key, encode) {
    if (param == null) return '';
    var paramStr = '';
    var t = typeof(param);
    if (t == 'string' || t == 'number' || t == 'boolean') {
        paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
    } else {
        for (var i in param) {
            var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
            paramStr += UrlEncode(param[i], k, encode);
        }
    }
    return paramStr;
};

var SetDataTable = function(eleType, destroy) {
    $(eleType).dataTable({
        destroy: destroy || true,
        "language": {
            "url": "/static/datatable_zh_CN.json"
        }
    });
};

var SetTooltip = function() {
    var $tooltip = $('[data-toggle="tooltip"]');
    $tooltip.tooltip({
        container: 'body',
        trigger: 'hover click'
    });
};

var SetICheck = function(that) {
    // iCheck
    if ($("input.flat")[0]) {
        $('input.flat').iCheck({
            checkboxClass: 'icheckbox_flat-green',
            radioClass: 'iradio_flat-green'
        });
        $('input').on('ifChecked', function(event) {
            that.$set(that, event.currentTarget.name, event.currentTarget.value);
        });
    }
};

var SetSwitchery = function(that) {
    // Switchery
    if ($(".js-switch")[0]) {
        var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
        elems.forEach(function(html) {
            var switchery = new Switchery(html, {
                color: '#26B99A'
            });
            html.onchange = function() {
                var value = html.checked === true ? Number(html.attributes['true'].value) : Number(html.attributes['false'].value);
                that.$set(that, html.name, value);
            };
        });

    }
};

var SetDaterangepicker = function(that, eleToSet) {
    var today = new Date(),
        todate = {
            year: today.getFullYear(),
            month: today.getMonth() + 1,
            date: today.getDate(),
        };
    // daterangepicker
    $(eleToSet).daterangepicker({
        singleDatePicker: true,
        format: 'YYYY-MM-DD',
        minDate: todate.year + '-' + todate.month + '-' + todate.date,
        calender_style: "picker_3"
    }, function(start, end, label) {
        that.expiresDate = start.toISOString().substring(0, 10);
    });
}

var SetDataTableAjax = function(url) {
    return {
        url: url,
        // dataSrc: "list",
        data: function(data) {
            for (var i = 0; i < data.columns.length; i++) {
                var column = data.columns[i];
                column.searchRegex = column.search.regex;
                column.searchValue = column.search.value;
                delete column.search;
            }
            data.accessToken = AccessToken.get()
                // console.log(AccessToken.get())
        }
    };
};

// class Token {
//     constructor(accessToken) {
//         this.accessToken = undefined;
//     }
//     get() {
//         return this.accessToken;
//     }
//     set(token) {
//         this.accessToken = token;
//     }
// }
var AccessToken = {
    get: function() {
        return sessionStorage.getItem('accessToken')
    },
    set: function(token) {
        sessionStorage.setItem('accessToken', token)
    }
};

// NProgress
if (typeof NProgress != 'undefined') {
    $(document).ready(function() {
        NProgress.start();
    });

    $(window).load(function() {
        NProgress.done();
    });
}

var imsCode = {
    "10001": "系统错误（如：500错误等）",
    "10002": "请求借口不存在（如：404错误等）",
    "10003": "请求参数错误",
    "10004": "IP请求超过最大值",
    "19999": "未知系统异常",
    "20101": "用户名或密码错误",
    "20102": "账户过期",
    "20103": "账户未激活",
    "20104": "账户信息不存在",
    "20105": "访问token失效",
    "20201": "厂商名称已存在",
    "20202": "厂商不存在",
    "20301": "产品不存在",
    "20901": "查询访问日志异常",
    "29999": "未知服务异常"
}