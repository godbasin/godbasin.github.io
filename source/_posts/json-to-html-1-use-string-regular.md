---
title: 将json输出为html(一)：字符串正则匹配
date: 2016-11-13 00:09:01
categories: js什锦
tags: 逻辑实现
---
最近项目需要用到将json格式化展示在html页面中，在这里简答整理一下其中逻辑实现，将json转换为字符串然后用正则匹配。
<!--more-->

## 分析json格式化样式
---
这里我们先分析一下json格式化后的展示方式，例子：
``` json
{
    "type": "type1",
    "total": 111,
    "data": [{
        "time": "2016-10-10 22:22:22",
        "flag": null,
        "appear": {
            "head": "head",
            "list": ["123","123","123"]
        }
    }, {
        "time": "2016-10-10 22:22:22",
        "flag": true,
        "appear": {
            "head": "head",
            "list": ["123","123","123","123","123"]
        }
    }]
}
```

### 数据类型展示
从上面的json我们可以大概将数据格式分为以下几种：
- Object对象
  - 可通过`{}`来标志判断
- Array数组
  - 可通过`[]`来标志判断
- String字符串
  - 可通过`""`来进行标志判断
  - 可分为key和value两种
- Number数字
- Null
- Boolen

### json样式/颜色
为了使得展示的体验增加，我们可以根据不同的数据类型设置不同的颜色展示。
- 基本符号，`{}`、`[]`、`:`、`""`、`,`
- 字符串
  - key键值
  - value值
- 数字
- true/false/null

## 实现逻辑
---
通过上述json分析，我们可以使用两种方式实现json格式化：
- 分析JSON.stringify()后的字符串，使用正则把需要的格式匹配替换
- 将json转化为object，然后通过js判断数据类型进行格式化

这里我们先使用第一种方法实现。

### 字符串匹配
- 需要匹配的值
  - 需要换行的字符，包括`,`后、`{`后、`}`前
  - 位于行首需要缩进的字符，这里包括字符串key键值，以及`}`
  - 字符串
    - key键值，使用`""`、位于`:`前
    - value值，使用`""`、不位于`:`前
  - true/false/null
  - 其余为数字number

- 匹配方法
  - 字符使用正则，`/[,\{\}:\[\]]/`
  - 字符串，`/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?/`
    - key键值，`/:$/`
    - 其余为value值
  - ture/false/null，`/\b(true|false|null)\b/`
  - 数字，`/-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/`

- 实现
这里将上述的逻辑进行实现。

- 数组换行实现

``` js
function JsonToHtml(data) {
    // 若传入数值为json，则转换为字符串
    var str = typeof data === 'string' ? str : JSON.stringify(data);
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
        indentChar = '&nbsp;&nbsp;&nbsp;&nbsp;'; // 缩进量
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
```

- 数组不换行实现

``` js
function JsonToHtml(data) {
    // 若传入数值为json，则转换为字符串
    var str = typeof data === 'string' ? str : JSON.stringify(data);
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
        inArray = false, // 是否在数组里
        inObject = true; // 是否在对象里
    // 将需要换行的元素匹配出来
    // 这里需要注意，逗号,后若有{则不需要换行，此时我们需要将其匹配出来
    str = str.replace(/((,(\t)*[^\{])|(,(\t)*\{)|\}|\{|\]|\[)/g, match => {
        var str = '';
        if (match === ']') {
            inArray = false;
            return match;
        } else if (match === '[') {
            inArray = true;
            inObject = false;
            return match;
        }
        // 若为{或者,{，则换行后缩进增加
        if (match === '{' || /,(\t)*\{/.test(match)) {
            indent++;
            inObject = true;
        // 若为}，则换行后缩进减少
        } else if (match === '}') {
            indent--;
            inObject = false;
        }
        // 转换缩进
        for (var i = 0, tab = ''; i < indent; i++) {
            tab += indentChar;
        }
        // 若为}，则先换行后进行缩进
        if (match === '}') {
            str = line + tab + match;
        // 若为,后不跟{，则在,后进行换行缩进
        } else if (/,(\t)*[^\{]/.test(match)) {
            str = (inArray && !inObject) ? match : (',' + line + tab + match.substring(1));
        // 其余情况，则在最后进行换行缩进    
        } else {
            str = match + line + tab;
        }
        return str;
    });
    return ('<div class="json">' + str + '</div>');
}
```

### 结束语
这里我们讨论了其中一种方式，后面章节我们将使用另外一种方法实现。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/blob/blog-codes/json-to-html/json-to-html-1-use-string-regular.html)
[此处点击查看页面](http://og7yu923g.bkt.clouddn.com/json-to-html-1-use-string-regular.html)