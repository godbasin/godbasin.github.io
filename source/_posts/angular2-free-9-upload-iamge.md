---
title: 玩转Angular2(9)--图片上传控件
date: 2017-06-11 10:24:19
categories: angular2火锅
tags: 笔记
---
因为项目原因又玩上了Angular2(v4.0+)，《玩转Angular2》系列用于探索一些灵活或者新的用法。
本文紧跟上节radio和checkbox表单控件的创建，讲述图片上传表单控件的创建过程。
<!--more-->

## 图片上传控件的制作
---
### type="file"的input
要讲图片上传，事情总要从下面的代码开始：

``` html
<input type="file" accept="image/*" multiple="multiple">
```

这里我们允许上传多张，这样的话我们就需要通过数组的方式双向绑定传值。

跟之前的`checkbox-group`一样，我们需要自定义`ngModel`的绑定过程，这样我们的原型便是：

``` js
import {Component, Input, OnInit, ElementRef} from '@angular/core';
import {customInputAccessor} from '../../class/custom-input.class';

@Component({
    selector: 'upload-image',
    templateUrl: './upload-image.component.html',
    providers: [customInputAccessor(UploadImageComponent)]
})
export class UploadImageComponent {
    @Input() disabled: boolean = false;
    @Input() required: boolean = false;

    private model: string[] = []; // 控件的值
    private onChange: (_: any) => void;
    private onTouched: () => void;

    onBlur() {
        this.onTouched();
    }

    writeValue(value: string[]): void {
        if (value && value.length) {
            this.model = value;
        }
    }

    registerOnChange(fn: (_: any) => {}): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => {}): void {
        this.onTouched = fn;
    }
}
```

如果说这里看不懂，那麻烦大家补一下前两节的内容：
[《玩转Angular2(7)--创建动态表单》](https://godbasin.github.io/2017/06/09/angular2-free-7-dynamic-form/)
[《玩转Angular2(8)--表单的radio和checkbox》](https://godbasin.github.io/2017/06/10/angular2-free-8-radio-and-checkbox/) 

### change事件
这里我们首先要把原本丑丑的file input藏起来，这个通过样式调整就可以啦：

``` css
.btn-file {
    position: relative;
    overflow: hidden;
}

.btn-file input[type="file"] {
    position: absolute;
    top: 0;
    right: 0;
    min-width: 100%;
    min-height: 100%;
    font-size: 100px;
    text-align: right;
    filter: alpha(opacity=0);
    opacity: 0;
    outline: none;
    background: #fff;
    cursor: inherit;
    display: block;
}
```

然后我们的html调整一下：

``` html
<span class="btn btn-info btn-file">
    <i class="fa fa-upload fa-fw"></i>
    {{btnName}} 
    <input type="file" accept="image/*" multiple="multiple" (change)="upLoad()">
</span>
```

是的，我们添加了按钮的名字，这里默认设置为"上传图片就好了"，后面我们再一起看逻辑代码。

这样我们点击呈现的按钮的同时，也就是点击了`<input type="file" />`，当我们选择了不同的内容之后，`change`事件便会触发。

这里我们可以猜想`upload()`回调会执行些什么：
1. 多个图片，遍历数组。
2. 获取每个图片信息，包括预览url、名字、大小等等。

``` js
        // 拿到input，然后获取选中文件
        const input = $(this.el.nativeElement).find('input')[0];  
        const files = input.files;
        if (files) {
            // 遍历文件
            Object.keys(files).forEach(index => {
                const file = files[index];
                // 获取每个图片信息
            });
        }
```

### FileReader
好久没处理上传事件了，我们先来回顾一下`FileReader`。

`FileReader`对象允许Web应用程序异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容，使用`File`或`Blob`对象指定要读取的文件或数据。

其中`File`对象可以是来自用户在一个`<input>`元素上选择文件后返回的`FileList`对象，也可以来自拖放操作生成的`DataTransfer`对象，还可以是来自在一个`HTMLCanvasElement`上执行`mozGetAsFile()`方法后返回结果。

- 方法
  - `abort()`: 中止该读取操作
  - `readAsArrayBuffer(in Blob blob)`/`readAsBinaryString(in Blob blob)`/`readAsDataURL(in Blob blob)`/`readAsText`
    - 开始读取指定的`Blob`对象或`File`对象中的内容。当读取操作完成时，`readyState`属性的值会成为`DONE`，如果设置了`onloadend`事件处理程序，则调用
    - 四者区别在于返回的`result`
    - `readAsDataURL()`的`result`属性中将包含一个`data: URL`格式的字符串以表示所读取文件的内容

- 事件处理程序
  - `onabort`: 当读取操作被中止时调用
  - `onerror`: 当读取操作发生错误时调用
  - `onload`: 当读取操作成功完成时调用
  - `onloadend`: 当读取操作完成时调用,不管是成功还是失败。在onload或者onerror之后调用
  - `onloadstart`: 当读取操作将要开始之前调用
  - `onprogress`: 在读取数据过程中周期性调用

说这么多，其实我们只需要它的一个`onload`事件回调，以及一个`readAsDataURL()`方法：

``` js
const reader: FileReader = new FileReader();
// 设置文件读取完毕事件
reader.onload = (e: ProgressEvent) => {
    const url = reader.result; // 获取url
    const name = file.name; // 获取文件名字
};
reader.readAsDataURL(file); // 获取图片的data: URL
```

### 添加校验
一般来说，我们常用的校验有：大小、宽高、类型。
这里我们使用`limit`输入：`@Input() limit: ILimit = {};`。

而我们的`limit`输入为以下的样子：

``` js
interface ILimit {
    width?: number; // 宽
    height?: number; // 高
    size?: number; // 大小
    type?: string; // 类型
}
```

其中我们的大小和类型都可以通过`FileReader`获取，那我们的宽高呢？
我们将使用`new Image()`来获取。

``` js
const image = new Image();
const url = reader.result;
// 添加load事件
image.onload = ev => {
    // image.width
    // image.height
}
image.src = url; // 添加图片地址
```

### 处理错误信息
我们的图片校验成功，则进行预览。而校验不通过的话，好的交互则需要我们返回详细的错误信息。
这里我们可以将错误信息收集起来打印：

``` html
<div *ngIf="checkErrArr.length" style="color: red;">
    <div *ngFor="let errArr of checkErrArr">
        <p><strong>{{errArr.name}}</strong></p>
        <p *ngFor="let err of errArr.checkErr">{{err}}</p>
    </div>
</div>
```

大家可以看到`checkErrArr`将以数组方式存放错误信息。我们添加校验后，`FileReader`的load事件如下：

``` js
                const regMap = { // 图片类型校验
                    jpg: /\.(jpe?g)$/i,
                    jpeg: /\.(jpe?g)$/i,
                    png: /\.(png)$/i,
                    gif: /\.(gif)$/i
                };
                reader.onload = (e: ProgressEvent) => {
                    const image = new Image();
                    const url = reader.result;
                    const name = file.name;
                    const checkErr = [];
                    image.onload = ev => {
                        // 图片大小校验
                        if (this.limit.size && file.size > this.limit.size * 1024) {
                            checkErr.push('图片大小已超过 ' + this.limit.size + ' K限制');
                        }
                        // 图片尺寸校验
                        if ((this.limit.width && image.width > this.limit.width) ||
                            (this.limit.height && image.height > this.limit.height)) {
                            checkErr.push('图片尺寸不满足 ' + (this.limit.width ? 'w: ' + this.limit.width + ' 以内' : '') +
                                (this.limit.height ? ' h: ' + this.limit.height + ' 以内' : ''));
                        }
                        // 图片类型校验
                        if (this.limit.type && regMap[this.limit.type] && !regMap[this.limit.type].test(file.name)) {
                            checkErr.push('图片类型不符合要求，需要上传' + this.limit.type);
                        }
                        if (!checkErr.length) {
                            // 若校验通过，添加进预览列表
                            this.imagesArr.push({name, url});
                            this.model.push(url);
                            this.onChange(this.model);
                        } else {
                            // 校验不通过，则收入错误信息
                            this.checkErrArr.push({name, checkErr});
                        }
                    };
                    image.src = url;
                };
```

### 添加设置说明
这里我们还需要给我们的设定添加说明，像该处做了哪些限制，需要展示出来给用户。
我们通过一个`help`字段保存这些协助信息：

``` js
    help: string = '';

    ngOnInit() {
        if (this.required) {
            this.help += '必填；';
        }
        if (this.limit) {
            if (this.limit.width && this.limit.height) {
                this.help += '图片尺寸：' + this.limit.width + '*' + this.limit.height + '以内';
            }
            if (this.limit.size) {
                this.help = this.help ? this.help + ',' + this.limit.size + 'k以内' : this.limit.size + 'k以内';
            }
            if (this.limit.type) {
                this.help = this.help ? this.help + ',图片类型:' + this.limit.type : ',图片类型:' + this.limit.type;
            }
        }
    }
```

然后我们在按钮下面进行辅助说明：

``` html
<p *ngIf="help" class="help-block">{{help}}</p>
```

### 使用[(ngModel)]绑定
经过前面的处理，我们的图片上传控件基本完成了。使用方式也很简单，绑定`[(ngModel)]`就好了：

``` html
<upload-image [limit]="{width:750,height:422,size:30,type:'jpg'}" [(ngModel)]="imageArr" [required]="true"></upload-image>
```

这里本骚年还传入了些设定，最终效果图如下：

![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1496243776%281%29.png)

## 结束语
-----
上传图片控件和前面动态表单的结合大家可以自行实践，本骚年也将实现代码放到项目里了。
不知道是不是FileReader的原因，上传文件变得好慢，或许是本骚年的使用方式不对。不知道大家有啥建议没呢？
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular2-free/9-upload-iamge)
[此处查看页面效果](http://oqntc49tn.bkt.clouddn.com/9-upload-iamge/index.html#/home/page-setting)