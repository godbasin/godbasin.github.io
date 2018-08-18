---
title: 玩转Angular2(11)--使用动态表单制作选项配置对话框
date: 2017-06-24 10:57:12
categories: angular2火锅
tags: 笔记
---
因为项目原因又玩上了Angular2(v4.0+)，《玩转Angular2》系列用于探索一些灵活或者新的用法。
本文在前面的基础架构上，正式开启我们的动态表单生成之旅。
<!--more-->

## 原控件相关调整
---
### 带输入的checkbox和radio
之前我们在配置`radio-with-input`以及`checkbox-with-input`的时候，是统一输入`input`的类型的，而实际使用中我们很可能一组选项中有不同的输入类型。
我们调整在每个选项中配置类型，目前暂时只支持三种：`'text' | 'number' | 'email'`。

我们的控件只需去掉原有的`@Input() type`，以及模板添加type就可以了：

``` html
 <input *ngIf="op.withInput" class="form-control form-inline-input" [type]="op.type || 'text'"  />
```

### 动态表单调整
动态表单需要调整的有：

1. 去掉提交按钮。

因很多时候控制在外面进行，当然使用事件来进行emit也是可以的。
但如果是多组表单联合的情况下，则不适合这样使用了，故我们取消按钮，采用下面的方式。

2. 绑定值

前面我们使用`[model]`来传入初始值，但我们同样可以将变化传递回绑定对象。
因为该值绑定的是`formGroup`表单的`value`，故我们可以使用`Object.assign()`，从而不改变对象的引用而更新里面的值。
同时我们还增加了一个`valid`选项，方便我们获取校验状态，否则不好控制：

``` js
    // dynamic-form.component.ts
    onValueChanged(data?: any) {
        // 前面代码照旧
        // 添加下面一行，更新model的值
        tthis.model = Object.assign(this.model, {...this.dynamicForm.value}, {valid: this.dynamicForm.valid});
    }
```

3. 调整`radio-with-input`以及`checkbox-with-input`相关控件选项

更新为：

``` html
<radio-with-input *ngIf="control.type === 'radio-with-input'"  [options]="control.options" [formControlName]="control.key"></radio-with-input>
<checkbox-with-input *ngIf="control.type === 'checkbox-with-input'" [options]="control.options" [formControlName]="control.key"></checkbox-with-input>                
```

## 选项配置功能
---
### 简单介绍
选项配置功能主要用于配置选项，最后生成的是我们前面某些选择表单（`select`、`radio`、`checkbox`等）的选项内容。
可见我们生成的结构如下：

``` js
export interface IOptions {
    id: string;
    text: string;
    withInput?: boolean;
    type?: 'text' | 'number' | 'email';  // 前面的调整增加
}
```

每一条选项都有四个参数，其中的`id`和`text`则是必须要配的，而剩余的主要用于`radio-with-input`以及`checkbox-with-input`带输入可选的表单控件。

这里我们使用传入参数`@Input() type`的方式判断，若为'withInput'则添加后面两个参数的配置，无则不添加。

### 动态表单的配置
经过上面分析我们知道，每个选项我们最多需要四个配置：
- `id`: text类型的input
- `text`: text类型的input
- `withInput`: 这里我们使用radio单选"是"或"否"
- `type`: 当`withInput`为"是"时，可下拉选择`'text' | 'number' | 'email'`其中一项

到这里，我们的配置文件大概出来了：

``` js
export const optionsFormControl: ICustomControl[] = [
    {
        type: 'text',
        label: 'id',
        key: 'id',
        validations: [{
            type: 'required',
            message: 'id必填'
        }]
    }, {
        type: 'text',
        label: 'text',
        key: 'text',
        validations: [{
            type: 'required',
            message: 'text必填'
        }]
    }, {
        type: 'radio',
        label: '是否带输入',
        key: 'withInput',
        options: [
            {id: '0', text: '否'},
            {id: '1', text: '是'},
        ]
    }, {
        type: 'radio',
        label: '输入类型',
        key: 'type',
        options: [
            {id: 'text', text: 'text'},
            {id: 'number', text: 'number'},
            {id: 'email', text: 'email'}
        ],
        hiddenWhen: {
            condition: '&&',
            validations: [{
                key: 'withType',
                validate: '!=',
                param: '1'
            }]
        }
    }
];
```

### 选项配置的增删
前面讲了每个选项的配置，而我们通常需要配置特定个选项，故需要增删功能。
先看html模板：

``` html
<a class="btn btn-info" (click)="setOptions()" >配置表单选项</a>
<div class="modal" [hidden]="!isShown">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close" (click)="isShown = false;"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">自定义选项配置</h4>
            </div>
            <div class="modal-body">
                <a class="btn btn-info" (click)="addControl()" >添加选项</a>
                <div *ngFor="let form of optionsForm; let i = index;">
                    <h2>选项{{i + 1}} <a class="btn btn-danger" (click)="optionsForm.splice(i, 1);" >移除选项</a></h2>
                    <dynamic-form [config]="optionControl" [(model)]="optionsForm[i]"></dynamic-form>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal" (click)="isShown = false;">取消</button>
                <button type="button" class="btn btn-primary" [disabled]="!isValid()" (click)="saveOptions()">保存</button>
            </div>
        </div>
    </div>
</div>
```

这是一个对话框配置，我们可以看到：
- `setOptions()`: 进行表单选项的配置
- `isShown`: 控制对话框的展示
- `addControl()`: 添加一个选项
- `optionsForm`: 保存生成的选项组
- `optionControl`: 每个选项表单的配置，参看上面
- `isValid()`: 返回表单校验状态
- `saveOptions()`: 保存选项配置

简单地分析，我们可以大致获得我们的组件：

``` js
const OptionInit = {
    id: '',
    text: ''
};

interface IOption extends IOptions {
    valid?: boolean;
}

@Component({
    selector: 'option-dialog',
    templateUrl: './option-dialog.component.html',
})
export class OptionDialogComponent implements OnInit {
    @Input() options: IOptions[] = []; // 输入，可绑定选项
    @Input() type: string = ''; // 类型，控制是否有input配置
    optionsForm: IOption[] = []; // 每个选项表单的model组
    optionControl: ICustomControl[]; // 选项表单的配置

    isShown: boolean = false;

    ngOnInit() {
        // 若无type为withInput时，只选取前面两项配置，即id和text
        if (this.type === 'withInput') {
            this.optionControl = optionsFormControl;
        } else {
            this.optionControl = optionsFormControl.slice(0, 2);
        }
    }

    isValid(): boolean {
        let valid = true;
        // 若每个表单均校验有效，则返回有效
        this.optionsForm.forEach(op => {
            if (!op.valid) {
                valid = false;
            }
        });
        return valid;
    }

    setOptions() {
        // 进行配置，显示对话框，并绑定options到表单配置
        this.isShown = true;
        this.optionsForm = [].concat(this.options);
    }

    saveOptions() {
        // 保存表单配置到选项，并关闭对话框
        this.options = [].concat(this.optionsForm);
        this.isShown = false;
    }

    addControl() {
        // 添加选项配置
        this.optionsForm.push({...OptionInit});
    }
}
```

### 增加列表展示
上面我们已经基本完成了选项配置的制作，当然最后我们还需要添加一个列表，来显示我们的配置成果：

``` html
<div class="row" [hidden]="!(options && options.length)">
    <div class="col-lg-12">
        <table class="table table-bordered table-striped">
            <thead>
            <tr>
                <th>序号</th>
                <th>id</th>
                <th>text</th>
                <th *ngIf="type === 'withInput'">withInput</th>
                <th *ngIf="type === 'withInput'">InputType</th>
            </tr>
            </thead>
            <tbody>
            <tr *ngFor="let op of options; let i = index">
                <td>{{i+1}}</td>
                <td>{{op.id}}</td>
                <td>{{op.text}}</td>
                <td *ngIf="type === 'withInput'">{{op.withInput === true ? 'true' : 'false'}}</td>
                <td *ngIf="type === 'withInput'">{{op.withInput ? op.type : ''}}</td>
            </tr>
            </tbody>
        </table>
    </div>
</div>
```

到这里，我们的选项配置功能开发完毕。效果图如下：

![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/OFB3FN9YKFUX841~~R%29@F%5DV.png)

![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/TL%7B$@AU%5BH%60XZ%5DPO0YVR%5DWPT.png)

## 结束语
-----
使用自己搭建的基本架构，来进行二次开发的感觉其实挺棒的。
后面我们的这个选项配置再作为基础架构的一部分，来实现更多的功能，才是项目设计的有意思之处吧。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular2-free/11-option-dialog)
[此处查看页面效果](http://oqntc49tn.bkt.clouddn.com/11-option-dialog/index.html#/home/page-setting)