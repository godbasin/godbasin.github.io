---
title: 玩转Angular2(8)--表单的radio和checkbox
date: 2017-06-10 21:55:36
categories: angular2火锅
tags: 笔记
---
因为项目原因又玩上了Angular2(v4.0+)，《玩转Angular2》系列用于探索一些灵活或者新的用法。
本文结合前面的响应式表单和动态表单，讲述继续拓展radio和checkbox表单选项的过程。
<!--more-->

## 动态表单与自定义input控件
---
### 自定义input控件
前面有较详细讲解自定义input表单过程，参考[《玩转Angular2(5)--自定义input表单控件》](https://godbasin.github.io/2017/06/03/angular2-free-5-custom-input-component/)。
过程无非是将Angular原本的双向绑定过程抽离出来，自己定义实现而已。通过Angular提供的一些接口，还是很容易达到想要的效果的。

这里我们再拓展两个：`radio`和`checkbox`类型的input控件。

1. `radio`

通常我们使用radio，除了双向绑定的`ngModel`之外，还有的大概就是选项了。
选项我们使用统一的数据结构`{id:id, text:text}`。

结合前面我们抽象出来的`CustomInputComponent`和`customInputAccessor`，实现`radio-group`还是很简单的，如下：

``` js
import {Component, Input, Output} from '@angular/core';
import {CustomInputComponent, customInputAccessor} from '../class/custom-input.class';

@Component({
    selector: 'radio-group',
    template: `
        <span *ngFor="let op of options" class="form-check">
            <input type="radio" [(ngModel)]="value" [name]="value" [disabled]="disabled" [value]="op.id" />{{op.text}}
        </span>`,
    providers: [customInputAccessor(RadioGroupComponent)]
})
export class RadioGroupComponent extends CustomInputComponent {
    @Input() options: any[] = []; // object: {id, text}
    @Input() disabled: boolean = false;

    constructor() {
        super();
    }
}
```

2. `checkbox`

而要实现`checkbox`就稍微复杂一点，毕竟我们不能直接使用`ngModel`来双向绑定。

这里我们约定以数组方式返回选中的id，以上的通用class不能直接使用，我们需要调整双向绑定的过程。如下：

``` js
import {Component, Input} from '@angular/core';
import {customInputAccessor} from '../class/custom-input.class';

@Component({
    selector: 'checkbox-group',
    template: `
        <span *ngFor="let op of options" class="form-check">
            <input type="checkbox" [name]="value" [checked]="model.indexOf(op.id) > -1" (click)="setValue(op)"
                   [disabled]="disabled" [value]="op.id"/>{{op.text}}
        </span>`,
    providers: [customInputAccessor(CheckboxGroupComponent)]
})
export class CheckboxGroupComponent {
    @Input() options: any[] = []; // object: {id, text} or array: []
    @Input() disabled: boolean = false;

    private model: any = []; // 控件的值
    private onChange: (_: any) => void;
    private onTouched: () => void;

    // 设置checkbox值
    setValue(option: any) {
        const {id} = option;
        const index = this.model.indexOf(id);
        if (index > -1) {
            // 有则移出
            this.model.splice(index, 1);
            this.onChange(this.model); // 需更新绑定的值
        } else {
            // 无则添加
            this.model.push(id);
            this.onChange(this.model); // 需更新绑定的值
        }
    }

    // 以下接口基本一致
    onBlur() {
        this.onTouched();
    }

    writeValue(value: string): void {
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

到了这里，是不是大家的自定义input控件技能又提升了。

### 动态表单与自定义input控件
大家会不会很好奇，我们自行封装了这些自定义input控件，要怎么使用呢？

其实很简单，我们跟其他原生的input一样使用就好了，使用一个`formControlName`就可以很方便地跟`formGroup`结合起来了。
这里我们把目前为止所有封装过的自定义input都放进来检验使用：

``` html
<form class="form-horizontal" [formGroup]="dynamicForm" (ngSubmit)="submit()" style="border: solid 1px #ccc; padding: 20px 0;">
    <div *ngFor="let control of config" class="form-group">
        <div class="form-group">
            <label class="col-md-2 control-label">{{control.label}}</label>
            <div class="col-md-6">
                <input *ngIf="control.type === 'text' || control.type === 'number'" [type]="control.type" class="form-control" [formControlName]="control.key" />
                <select2 *ngIf="control.type === 'select'" [options]="control.options" [formControlName]="control.key"></select2>
                <radio-group *ngIf="control.type === 'radio'" [options]="control.options" [formControlName]="control.key"></radio-group>
                <checkbox-group *ngIf="control.type === 'checkbox'" [options]="control.options" [formControlName]="control.key"></checkbox-group>
                <date-time-picker *ngIf="control.type === 'date'" accuracy="day" [formControlName]="control.key"></date-time-picker>
                <date-time-picker *ngIf="control.type === 'date-hour'" accuracy="hour" [formControlName]="control.key"></date-time-picker>
                <date-time-picker *ngIf="control.type === 'date-time'" accuracy="day" [formControlName]="control.key"></date-time-picker>
            </div>
        </div>
        <div *ngIf="formErrors[control.key]" class="alert alert-danger col-md-6 col-md-offset-2">
            <p>{{ formErrors[control.key] }}</p>
        </div>
    </div>
    <div class="col-md-offset-2">
        {{dynamicForm.value | json}}
    </div>
    <div class="form-group">
        <div class="col-sm-offset-2 col-sm-10">
            <button [disabled]="!dynamicForm.valid" type="submit" class="btn btn-info">提交</button>
        </div>
    </div>
</form>
```

然后我们调整输入：

``` js
// dynamic-form.config.ts
import {ICustomControl} from 'shared/component/dynamic-form/dynamic-form.component';
export const customForms: ICustomControl[] = [
    {
        type: 'text',
        label: '名字',
        key: 'name',
        validations: [{
            type: 'required',
            message: '名字必填'
        }, {
            type: 'maxLength',
            param: 8,
            message: '名字最多8个字符'
        }, {
            type: 'minLength',
            param: 3,
            message: '名字最少3个字符'
        }]
    }, {
        type: 'text',
        label: 'Email',
        key: 'email',
        validations: [{
            type: 'required',
            message: 'Email必填'
        }, {
            type: 'email',
            message: 'Email格式不正确'
        }]
    }, {
        type: 'select',
        label: '职业',
        key: 'job',
        validations: [{
            type: 'required',
            message: '职业必选'
        }],
        options: [
            {id: '', text: ''},
            {id: '1', text: '医生'},
            {id: '2', text: '程序员'},
            {id: '3', text: '公务员'},
            {id: '4', text: '其他'}
        ]
    }, {
        type: 'radio',
        label: '性别',
        key: 'gender',
        options: [
            {id: 'male', text: '男'},
            {id: 'female', text: '女'},
            {id: '', text: '未知'}
        ]
    }, {
        type: 'checkbox',
        label: '爱好',
        key: 'hobbit',
        options: [
            {id: '1', text: '运动'},
            {id: '2', text: '看书'},
            {id: '3', text: '音乐'}
        ]
    }, {
        type: 'date',
        label: '生日',
        key: 'birthday'
    }
];
```

效果图如下：

![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1496128414%281%29.png)

### 默认值加载获取
为了检验我们的初始值能否正确加载，我们添加默认值：

``` js
// dynamic-form.config.ts
export const customFormsDefault = {
    job: '2',
    hobbit: ["2"],
    gender: "female",
    birthday: '2017-05-23'
};
```

同时我们注入到控件：

``` html
<dynamic-form [config]="customForms" [model]="customFormsDefault"></dynamic-form>
```

效果图如下：

![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1496128243%281%29.png)

## 结束语
-----
目前我们能很方便地拓展需要的动态表单，来做一些配置化的东西。
而当我们真正在项目中使用的时候，或许还需要考虑从接口获取数据（初始值）的情况，不过解决办法也有很多，大家多去实践吧。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular2-free/8-radio-and-checkbox)
[此处查看页面效果](http://angular2-free.godbasin.com/8-radio-and-checkbox/index.html#/home/page-setting)