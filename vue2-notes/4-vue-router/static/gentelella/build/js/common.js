const Notify = ({ title, text, type, delay }) => {
    new PNotify({
        title: title || '',
        text: text || '',
        type: type || 'info',
        styling: 'bootstrap3',
        animation: 'slide',
        delay: delay || 2000
    });
};

const FormatJson = (txt, compress) => {
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
    draw = draw.join('').replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, match => {
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

const SetDataTable = (eleType, destroy) => {
    $(eleType).dataTable({
        destroy: destroy || true,
        "language": {
            "url": "./static/datatable_zh_CN.json"
        }
    });
};

const SetTooltip = () => {
    var $tooltip = $('[data-toggle="tooltip"]');
    $tooltip.tooltip({
        container: 'body',
        trigger: 'hover click'
    });
};

const SetICheck = that => {
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

const SetSwitchery = that => {
    // Switchery
    if ($(".js-switch")[0]) {
        var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
        elems.forEach(function(html) {
            var switchery = new Switchery(html, {
                color: '#26B99A'
            });
            html.onchange = () => {
                var value = html.checked === true ? Number(html.attributes['true'].value) : Number(html.attributes['false'].value);
                that.$set(that, html.name, value);
            };
        });

    }
};

const SetDaterangepicker = (that, eleToSet) => {
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
        minDate: `${todate.year}-${todate.month}-${todate.date}`,
        calender_style: "picker_3"
    }, function(start, end, label) {
        that.expiresDate = start.toISOString().substring(0, 10);
    });
}