---
title: 将json输出为html(二)：js数据类型判断实现
date: 2016-11-13 00:10:57
categories: js什锦
tags: 逻辑实现
---
最近项目需要用到将json格式化展示在html页面中，在这里简答整理一下其中逻辑实现，将json转换为对象Object然后判断数据类型进行处理。
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

### json样式/颜色
为了使得展示的体验增加，我们可以根据不同的数据类型设置不同的颜色展示。
- 基本符号，`{}`、`[]`、`:`、`""`、`,`
- 字符串
  - key键值
  - value值
- 数字
- true/false/null

### js判断数据类型
下面我们通过js来判断数据类型。
- Object对象
  - `typeof value === 'object'`
  - 在javascript中，null也会被判断为object，所以我们可以添加个条件
  - 即`value && typeof value === 'object'`
  - 这里数组Array也会被判断为object，下面我们讲一下数组的判断
- Array数组
  - 我们可以使用consturctor来判断数组
  - `value.constructor === Array`
  - `Object.prototype.toString.call(value) === '[object Array]'`
  - 后一种是公认的靠谱解法，具体下来大家自己思考哈
- String字符串
  - `typeof value === 'string'`
- Number数字
  - `typeof value === 'number'`
- Null
  - `value === null`
- Boolen
  - `typeof value === 'boolen'`

## 实现逻辑
---
通过上述json分析，我们可以使用两种方式实现json格式化：
- 分析JSON.stringify()后的字符串，使用正则把需要的格式匹配替换
- 将json转化为object，然后通过js判断数据类型进行格式化

这里我们使用第二种方法实现。
第一种实现可以参考上一篇[《将json输出为html(一)：字符串正则匹配》](https://godbasin.github.io/2016/11/13/json-to-html-1-use-string-regular/)。

### 字符串匹配
- 判断数据类型并进行处理
  - 对象Object，将处理为`{<span class="key">"key"</span>:value}`，并进入检测递归
  - 数组Array，将处理为`[value,value]`，并将进入检测递归
  - true/false/null，将处理为`<span class="boolen/null">true/false/null</span>`
  - 字符串，将处理为`<span class="string">"string"</span>`
  - 数字Number，将处理为`<span class="number">1</span>`

- 实现
这里将上述的逻辑进行实现。

- 数组不换行实现

``` js
function ObjectToHtml(data) {
    // 若传入数值为json，则转换为字符串
    var txt = typeof data === 'string' ? data : JSON.stringify(data);
    // 转换为Object
    try {
        var obj = eval('(' + txt + ')');
    } catch (e) {
        alert('数据源语法错误,JSON格式化失败! 错误信息: ' + e.description, 'err');
        return
    }
    var line = '</br>', // 换行
        indentChar = '&nbsp;&nbsp;&nbsp;&nbsp;'; // 缩进量
    // 获取缩进字符
    var getTab = function(num) {
        for (var i = 0, tab = ''; i < num; i++) {
            tab += indentChar;
        }
        return tab;
    };
    // 检测递归
    var format = function(value, indent /*缩进*/ , isLast /*是否数组或者对象最后*/ , inArray /*是否在数组中*/ ) {
        var str = '';
        // 将处理为`[value,value]`，并将进入检测递归
        if (Object.prototype.toString.call(value) === '[object Array]') {
            str += '[';
            value.forEach(function(item, index) {
                str += format(item, indent, index === (value.length - 1), true);
            });
            str += ']';
        // null，将处理为`<span class="null">null</span>`
        } else if (value === null) {
            str += '<span class="null">null</span>';
        // 对象Object，将处理为`{<span class="key">"key"</span>:value}`，并进入检测递归
        } else if (typeof value === 'object') {
            str += '{' + line + getTab(++indent);
            var keys = Object.keys(value);
            keys.forEach(function(key, index) {
                str += '<span class="key">' + key + '</span>: ' + format(value[key], indent, index === (keys.length - 1));
            });
            str += '}';
            indent--;
        // true/false，将处理为`<span class="boolen">true/false</span>`
        } else if (typeof value === 'boolean') {
            str += '<span class="boolean">' + value + '</span>';
        // 字符串，将处理为`<span class="string">"string"</span>`
        } else if (typeof value === 'string') {
            str += '<span class="string">' + value + '</span>';
        // 数字Number，将处理为`<span class="number">1</span>`
        } else {
            str += '<span class="number">' + value + '</span>';
        }
        str += (isLast ? '' : ',') + (inArray ? '' : (line + getTab(isLast ? --indent : indent)));
        return str;
    }
    return ('<div class="json">' + format(obj, 0, true) + '</div>');
}
```

- 数组换行实现

``` js
function ObjectToHtml(data) {
    // 若传入数值为json，则转换为字符串
    var txt = typeof data === 'string' ? data : JSON.stringify(data);
    // 转换为Object
    try {
        var obj = eval('(' + txt + ')');
    } catch (e) {
        alert('数据源语法错误,JSON格式化失败! 错误信息: ' + e.description, 'err');
        return
    }
    var line = '</br>', // 换行
        indentChar = '&nbsp;&nbsp;&nbsp;&nbsp;'; // 缩进量
    // 判断是否为对象
    var isObject = function(item) {
        return item && typeof item === 'object' && Object.prototype.toString.call(item) !== '[object Array]';
    };
    var getTab = function(num) {
        for (var i = 0, tab = ''; i < num; i++) {
            tab += indentChar;
        }
        return tab;
    };
    // 检测递归
    var format = function(value, indent, isLast, inArray) {
        var str = '';
        // [
        //   value,
        //   value
        // ]，并将进入检测递归
        if (Object.prototype.toString.call(value) === '[object Array]') {
            str += '[' + (isObject(value[0]) ? '' : (line + getTab(++indent)));
            value.forEach(function(item, index) {
                str += format(item, indent, index === (value.length - 1), true);
                // 若不为对象，则进行换行
                str += isObject(item) ? '' : (line + getTab((index === (value.length - 1)) ? --indent : indent));
            });
            str += ']';
        // null，将处理为`<span class="null">null</span>`
        } else if (value === null) {
            str += '<span class="null">null</span>';
        // 对象Object，将处理为`{<span class="key">"key"</span>:value}`，并进入检测递归    
        } else if (typeof value === 'object') {
            str += '{' + line + getTab(++indent);
            var keys = Object.keys(value);
            keys.forEach(function(key, index) {
                str += '<span class="key">"' + key + '"</span>: ' + format(value[key], indent, index === (keys.length - 1));
            });
            str += '}';
            indent--;
        // true/false，将处理为`<span class="boolen/null">true/false</span>`
        } else if (typeof value === 'boolean') {
            str += '<span class="boolean">' + value + '</span>';
        // 字符串，将处理为`<span class="string">"string"</span>`
        } else if (typeof value === 'string') {
            str += '<span class="string">"' + value + '"</span>';
        // 数字Number，将处理为`<span class="number">1</span>`
        } else {
            str += '<span class="number">' + value + '</span>';
        }
        str += (isLast ? '' : ',') + (inArray ? '' : (line + getTab(isLast ? --indent : indent)));
        return str;
    }
    return ('<div class="json">' + format(obj, 0, true) + '</div>');
}
```

### 结束语
这里我们讨论了js判断数据类型并进行转换的实现方法。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/blob/blog-codes/json-to-html/json-to-html-2-use-object.html)
[此处点击查看页面](http://og7yu923g.bkt.clouddn.com/json-to-html-2-use-object.html)