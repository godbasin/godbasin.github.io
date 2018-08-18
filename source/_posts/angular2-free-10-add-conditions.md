---
title: 玩转Angular2(10)--向表单添加条件控制
date: 2017-06-23 21:09:03
categories: angular2火锅
tags: 笔记
---
因为项目原因又玩上了Angular2(v4.0+)，《玩转Angular2》系列用于探索一些灵活或者新的用法。
本文介绍向表单添加简单的条件控制的过程。
<!--more-->

## 表单条件
---
### 常用表单条件
很多时候，我们的表单需要添加一些条件，例如：
- 选择是否订阅邮件，是则需要填写邮件
- 针对不同的选择展示不同的表单控件

这里我们只考虑比较容易实现的：
- 校验
  - 通过某个控件值的比较，来作为判断标准
  - 传入其他控件的`key`，通过常用比较`>`/`>=`/`==`等，来控制显示
- 条件（只能二选一），作为以上校验的叠加方式选择
  - '&&': 与，需同时满足多个条件
  - '||': 或，满足其中一个条件即可

通过以上我们可以定义基本配置接口结构：

``` js
// 校验配置
export interface IHiddenValidate {
    key: string;
    validate: string;
    param: string | number;
}
// 条件配置
export interface IHiddenCondition {
    condition: '||' | '&&';
    validations: IHiddenValidate[];
}
// 自定义单个控件配置
export interface ICustomControl {
    type: string;
    label: string;
    key: string;
    validations?: IValidations[];
    options?: IOptions[];
    limit?: ILimit;
    hiddenWhen?: IHiddenCondition;
}
```

### 条件判断
我们针对上面的数据结构，需要进行条件判断，返回布尔值来控制表单的显示或隐藏。

首先，我们添加一个用于计算条件的函数：

``` js
export function validate(a, b, condition): boolean {
    switch (condition) {
        case '>':
            return a > b;
        case '>=':
            return a >= b;
        case '==':
            return a == b;
        case '===':
            return a === b;
        case '>':
            return a > b;
        case '>=':
            return a >= b;
        case '&&':
            return a && b;
        case '||':
            return a || b;
        case 'indexOf': // 用于数组判断
            return a.indexOf(b) > -1;
        default:
            return true;
    }
}
```

然后我们开始处理较复杂的条件和校验，先将多个校验计算出来，再使用条件合并：

``` js
    isHidden(control: ICustomControl) {
        let hidden = false; // 初始化显示
        if (control.hiddenWhen && control.hiddenWhen.validations && control.hiddenWhen.validations.length) {
            control.hiddenWhen.validations.forEach(valid => {
                // 条件计算
                hidden = validate(
                    hidden,
                    validate(this.dynamicForm.value[valid.key], valid.param, valid.validate), // 校验计算
                    control.hiddenWhen.condition
                );
            });
        }
        return hidden;
    }
```

通过这个方法我们就能控制是否显示对应表单控件了：

``` html
    <div *ngFor="let control of config" class="form-group">
        <div *ngIf="!isHidden(control)">
            <!--具体控件-->
        </div>
    </div>
```

### 实例配置
我们可以通过一个简单的邮件接收配置来检验：

``` js
export const customForms: ICustomControl[] = [
    {
        type: 'radio',
        label: '是否接收邮件',
        key: 'emailReceived',
        options: [
            {id: '1', text: '是'},
            {id: '0', text: '否'}
        ]
    }, {
        type: 'text',
        label: 'Email',
        key: 'email',
        validations: [{
            type: 'email',
            message: 'Email格式不正确'
        }],
        hiddenWhen: {
            condition: '||',
            validations: [{
                key: 'emailReceived',
                validate: '==',
                param: '0'
            }]
        }
    }
];
```

效果如下：

![iamge](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1496326365%281%29.png)
![iamge](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1496326383%281%29.png)

## 带输入的选择
---
很多时候我们需要有这样的表单控件：
- checkbox勾选后可自定义填写
- radio选择自定义填写

这里我们简单做个组件封装吧。

### 带输入的checkbox
我们先来定义我们想要的效果：

``` html
        <span *ngFor="let op of options" class="form-check">
            <input type="checkbox" [name]="value" [checked]="model[op.id] && model[op.id].checked"
                   (click)="setValue(op)" [disabled]="disabled" [value]="op.id"/>{{op.text}}
            <input *ngIf="op.withInput" class="form-control form-inline-input"
                   [type]="type" [disabled]="!(model[op.id] && model[op.id].checked)" [(ngModel)]="model[op.id].value"/>
        </span>
```

由于多了自定义填写，通过绑定选中数组的形式也不适用了，我们需要通过对象的方式来绑定返回值：

``` js
// 这里为了方便表达清楚结构，使用了不合规范的表示，莫介意
model = {
    id: {
        checked: boolen,
        value: string | number
    }
};
```

用的实现还是前面自定义表单的那一套：

``` js
@Component({
    selector: 'checkbox-with-input',
    template: `...同上`,
    providers: [customInputAccessor(CheckboxWithTextComponent)]
})
export class CheckboxWithTextComponent implements OnInit {
    @Input() options: IOptions[] = []; // object: {id, text} or array: []
    @Input() disabled: boolean = false;
    @Input() type: string = 'text';

    private model: any = {}; // 控件的值
    private onChange: (_: any) => void;
    private onTouched: () => void;

    ngOnInit() {
        // 初始化model的值
        this.options.forEach(op => {
            this.model[op.id] = {
                checked: false,
            };
            if (op.withInput) {
                this.model[op.id].value = '';
            }
        });
    }

    setValue(op: any) {
        // 选择某选项的时候处理
        const isChecked = !this.model[op.id].checked;
        this.model[op.id].checked = isChecked;
        this.onChange(this.model);
    }

    // 下面的方法参照前面几节
    // onBlur
    // writeValue
    // registerOnChange
    // registerOnTouched
}
```

然后我们在动态表单里面添加进去：

``` html
<checkbox-with-input *ngIf="control.type === 'checkbox-with-text'" type="text" [options]="control.options" [formControlName]="control.key"></checkbox-with-input>
<checkbox-with-input *ngIf="control.type === 'checkbox-with-number'" type="number" [options]="control.options" [formControlName]="control.key"></checkbox-with-input>        
```

而带输入的`radio`大家就自己解决吧，本骚年的项目代码里面有，基本与checkbox的很相像。

结合上面，最终我们的效果图如下：

![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1496325904%281%29.png)

## 结束语
-----
这里我们只针对简单的条件进行表单校验，并且这里只能匹配一些简单绑定的值，像多选等因为绑定的值为对象，暂无法进行条件判断。
一些复杂的控制功能或许需要我们通过其他方式进行吧，毕竟很多时候更广的通用性也会增加设计的复杂度、消耗使用的简便性。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular2-free/10-add-conditions)
[此处查看页面效果](http://oqntc49tn.bkt.clouddn.com/10-add-conditions/index.html#/home/page-setting)