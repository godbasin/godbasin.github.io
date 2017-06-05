export function JsonToHtml(data) {
    // 若传入数值为json，则转换为字符串
    var str = typeof data === 'string' ? data : JSON.stringify(data);
    //将一些需要添加颜色的值匹配出来
    str = str.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, match => {
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
    // 下面将进行换行匹配，包括,后、{后、}前
    var indent = 0, // 缩进数
        line = '</br>', // 换行
        indentChar = '&nbsp;&nbsp;&nbsp;&nbsp;', // 缩进量
        inArray = false; // 是否在数组里
    // 将需要换行的元素匹配出来
    // 这里需要注意，逗号,后若有{则不需要换行，此时我们需要将其匹配出来
    str = str.replace(/((,(\t)*[^\{])|(,(\t)*\{)|(\[(\t)*\{)|(\}(\t)*\])|\}|\{|\[|\])/g, match => {
        var str = '';
        // 若为{或者,{，则换行后缩进增加
        if (match === '{' || match === '[' || /,(\t)*\{/.test(match) || /\[(\t)*\{/.test(match)) {
            indent++;
            // 若为}，则换行后缩进减少
        } else if (match === '}' || match === ']' || /\}(\t)*\]/.test(match)) {
            indent--;
        }
        // 转换缩进
        for (var i = 0, tab = ''; i < indent; i++) {
            tab += indentChar;
        }
        // 若为}，则先换行后进行缩进
        if (match === '}' || match === ']' || /\}\]/.test(match)) {
            str = line + tab + match;
            // 若为,后不跟{，则在,后进行换行缩进
        } else if (/,(\t)*[^\{]/.test(match)) {
            str = ',' + line + tab + match.substring(1);
            // 其余情况，则在最后进行换行缩进
        } else {
            str = match + line + tab;
        }
        return str;
    });
    return ('<div class="json">' + str + '</div>');
}