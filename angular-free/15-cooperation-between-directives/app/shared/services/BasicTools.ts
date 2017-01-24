// Panel toolbox
export function SetPanelToolbox() {
    $('.collapse-link').on('click', function() {
        var $BOX_PANEL = $(this).closest('.x_panel'),
            $ICON = $(this).find('i'),
            $BOX_CONTENT = $BOX_PANEL.find('.x_content');

        // fix for some div with hardcoded fix class
        if ($BOX_PANEL.attr('style')) {
            $BOX_CONTENT.slideToggle(200, function() {
                $BOX_PANEL.removeAttr('style');
            });
        } else {
            $BOX_CONTENT.slideToggle(200);
            $BOX_PANEL.css('height', 'auto');
        }

        $ICON.toggleClass('fa-chevron-up fa-chevron-down');
    });

    $('.close-link').click(function() { 
        var $BOX_PANEL = $(this).closest('.x_panel');
        $BOX_PANEL.remove();
    });
};
// /Panel toolbox

export function Notify({ title = '', text = '', type = 'info', styling = 'bootstrap3', animation = 'slide', delay = 2000, hide = true }) {
    return new PNotify({
        title,
        text,
        type,
        styling,
        animation,
        delay,
        hide
    })
}

export function Comfirm({ title, text, type = 'info', styling = 'bootstrap3', animation = 'slide', delay = 2000, hide = false, confirm = {} as TODO, cancel = {} as TODO }) {
    (new PNotify({
        title,
        text,
        styling,
        animation,
        type,
        icon: 'glyphicon glyphicon-question-sign',
        hide,
        confirm: {
            confirm: true,
            buttons: [{
                text: confirm.text ? confirm.text : '是',
                addClass: "btn btn-default",
                promptTrigger: true,
                click(notice, value) {
                    notice.remove();
                    notice.get().trigger("pnotify.confirm", [notice, value]);
                }
            }, {
                text: cancel.text ? cancel.text : '否',
                addClass: "btn btn-default",
                click(notice) {
                    notice.remove();
                    notice.get().trigger("pnotify.cancel", notice);
                }
            }]
        },
        history: {
            history: false
        }
    })).get().on('pnotify.confirm', function() {
        if (typeof confirm.callback === 'function') {
            confirm.callback()
        }
    }).on('pnotify.cancel', function() {
        if (typeof cancel.callback === 'function') {
            cancel.callback()
        }
    });
}

export function OperationResponse(res, title) {
    let isError = res.exitValue !== 0
    if (isError) {
        Comfirm({
            title: `${title}失败`,
            text: `是否下载log文件?`,
            type: 'error',
            confirm: {
                callback() { window.open(res.logAddress, '_blank') }
            }
        })
    } else {
        Notify({
            title: `${title}成功`,
            type: 'success',
            text: res.logAddress
        })
    }
}

export function FormatJson(txt, compress) {
    if (typeof txt != 'string') {
        txt = JSON.stringify(txt, undefined, 2);
    }
    var indentChar = '&nbsp;&nbsp;&nbsp;&nbsp;';
    if (/^\s*$/.test(txt)) {
        // alert('数据为空,无法格式化! ');
        return undefined;
    }
    try { var data = eval('(' + txt + ')'); } catch (e) {
        alert('数据源语法错误,JSON格式化失败! 错误信息: ' + e.description);
        return undefined;
    };
    var draw = [] as any,
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

export function UrlEncode(param, key, encode) {
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

export function SetDataTable(eleType, destroy) {
   ($(eleType) as any).dataTable({
        destroy: destroy || true,
        "language": {
            "url": "/static/datatable_zh_CN.json"
        }
    });
};

export function SetTooltip(ele = '[data-toggle="tooltip"]', trigger = 'click hover') {
    var $tooltip = $(ele) as any;
    $tooltip.tooltip({
        container: 'body',
        trigger
    });
};

export function SetICheck(callback) {
    // iCheck
    const $input = $("input.flat") as any;
    if ($input.length) {
        $input.iCheck({
            checkboxClass: 'icheckbox_flat-green',
            radioClass: 'iradio_flat-green'
        });
        $('input').on('ifChecked', function(event: any) {
            if (typeof callback === 'function') {
                callback(event.currentTarget.name, event.currentTarget.value);
            }
        });
    }
};

export function SetSwitchery(callback) {
    // Switchery
    if ($(".js-switch")[0]) {
        var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
        elems.forEach(function(html) {
            var switchery = new Switchery(html, {
                color: '#26B99A'
            });
            html.onchange = function() {
                var value = html.checked === true ? Number(html.attributes['true'].value) : Number(html.attributes['false'].value);
                if (typeof callback === 'function') {
                    callback(html.name, value);
                }
            };
        });

    }
};

export function SetDaterangepicker(eleToSet, callback) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const date = today.getDate();
        // daterangepicker
    ($(eleToSet) as any).daterangepicker({
        singleDatePicker: true,
        format: 'YYYY-MM-DD',
        minDate: `${year}-${month}-${date}`,
        calender_style: "picker_3"
    }, (start, end, label) => {
        if (typeof callback === 'function') {
            callback($(eleToSet).attr("name"), start.toISOString().substring(0, 10));
        }
    });
}

export function SetDataTableAjax(url) {
    return {
        url: url,
        // dataSrc: "list",
        data: (data) => {
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
export const AccessToken = {
    get: () => {
        return sessionStorage.getItem('accessToken')
    },
    set: (token) => {
        sessionStorage.setItem('accessToken', token)
    }
};

export function FormatDate(str) {
    // 格式化数字，小于10表示为0x
    function numStd(num) {
        if (!num) {
            return undefined;
        }
        const _val = parseInt(num);
        return (_val < 10) ? ('0' + _val) : ('' + _val);
    }
    // 反格式化数字，去掉0
    function numUnstd(num): TODO {
        if (!num) {
            return '';
        }
        return parseInt(num);
    }
    let _str = str + '';
    if (!_str) {
        return '';
    }
    // 正则判断当前日期格式
    let datearr;
    if (/\d{4}-\d{1,2}-\d{1,2}/.test(_str)) {
        datearr = _str.split('-');
        _str = numStd(datearr[0]) + '-' + numStd(datearr[1]) + '-' + numStd(datearr[2]);
    } else if (/\d{4}\.\d{1,2}\.\d{1,2}/.test(_str)) {
        datearr = _str.split('-');
        _str = numStd(datearr[0]) + '-' + numStd(datearr[1]) + '-' + numStd(datearr[2]);
    } else if ((_str.indexOf('年') > -1) && (_str.indexOf('月') > -1) && (_str.indexOf('日') > -1)) {
        datearr = _str.split('年');
        const year = datearr[0];
        const month = datearr[1].split('月')[0];
        const day = datearr[1].split('月')[1].replace('日', '');
        _str = numStd(year) + '-' + numStd(month) + '-' + numStd(day);
    } else {
        return str;
    }
    return _str;
};

const BasicTools = {
    SetPanelToolbox,
    Notify,
    FormatJson,
    UrlEncode,
    SetDataTable,
    SetTooltip,
    SetICheck,
    SetSwitchery,
    SetDaterangepicker,
    SetDataTableAjax,
    AccessToken,
    FormatDate
};

export default BasicTools;