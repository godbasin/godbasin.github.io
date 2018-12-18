---
title: 玩转Angular2(6)--模型驱动和模板驱动的表单
date: 2017-06-04 17:32:02
categories: angular2火锅
tags: 笔记
---
因为项目原因又玩上了Angular2(v4.0+)，《玩转Angular2》系列用于探索一些灵活或者新的用法。
本文简单介绍模型驱动和模板驱动的表单，以及一些表单验证。
<!--more-->

## Angular2表单
---
### 模板驱动
很多时候我们都会使用模板驱动的表单，因为很方便。
使用Angular模板语法编写模板，便是模板驱动的表单。

1. FormModule

使用模板驱动的一些模板语法，我们需要引入`FormModule`:

``` js
import { FormsModule } from '@angular/forms';
```

这样，我们的`<form>`和`<input>`等表单元素便是Angular元素，拥有了像`ngModel`、`ngSubmit`等指令或属性。

2. 模板驱动的表单

这里我们使用最简单的`input`，需要输入一个3-8字符的名字。Component中的js代码几乎没多少，而html模板如下：

``` html
<form class="form-horizontal" #form="ngForm" (ngSubmit)="submit()">
    <div class="form-group">
        <label class="col-md-2 control-label">name</label>
        <div class="col-md-6">
            <input class="form-control" type="text"
                   [(ngModel)]="model.name" name="name"
                   required maxlength="8" minlength="3"
                   #name="ngModel" />
        </div>
    </div>
    <div class="alert alert-danger col-md-6 col-md-offset-2" *ngIf="name.errors && (name.dirty || name.touched)">
        <p [hidden]="!name.errors.required">必填</p>
        <p [hidden]="!name.errors.minlength">不小于3个字符</p>
        <p [hidden]="!name.errors.maxlength">不大于8个字符</p>
    </div>
    <div class="form-group">
        <div class="col-sm-offset-2 col-sm-10">
            <button [disabled]="!form.valid" type="submit" class="btn btn-info">提交</button>
        </div>
    </div>
</form>
```

- 通过`ngModel`跟踪修改状态与有效性验证

在表单中使用`ngModel`可以获得比仅使用双向数据绑定更多的控制权，不仅仅跟踪状态。它还使用特定的Angular CSS类来更新控件，以反映当前状态。
可以利用这些CSS类来修改控件的外观，显示或隐藏消息。

- `required`/`maxlength`/`minlength`: 用于表单校验
  - `name.touched`: 控件被访问过
  - `name.dirty`: 控件的值变化了
  - `name.errors`: 控件校验错误

指向`input`控件的引用变量上的`valid`属性，可用于检查控件是否有效、是否显示/隐藏错误信息。

- `#name="ngModel"`

`#name`是模板引用变量。使用井号(`#`)来声明引用变量。
模板引用变量通常用来引用模板中的某个DOM元素，它还可以引用Angular组件或指令或Web Component。

指令的`exportAs`属性告诉Angular如何链接模板引用变量到指令。
这里把`name`设置为`ngModel`是因为`ngModel`指令的`exportAs`属性设置成了"ngModel"。
`name`属性的用途是有效性验证和对表单元素的变更进行追踪。

- 使用`ngSubmit`提交该表单

按钮位于表单的底部，它自己不做任何事，但因为有`type="submit"`，所以会触发表单提交。
而要使得表单提交生效，需要把该表单的`ngSubmit`事件属性绑定到对应的提交事件。

如果需要校验，则需要添加`#form="ngForm"`，将`form`变量`exportAs`属性设置成`ngForm`，可跟踪表单有效性验证：

``` html
<form class="form-horizontal" #form="ngForm" (ngSubmit)="submit()">
    <button [disabled]="!form.valid" type="submit" class="btn btn-info">提交</button>
</form>
```

### 模型驱动
模型驱动表单又称为响应式表单，它将在html上的一些模板语法迁移到js中使用。
Angular的响应式表单能让实现响应式编程风格更容易，这种编程风格更倾向于在非UI的数据模型（通常接收自服务器）之间显式的管理数据流，并且用一个UI导向的表单模型来保存屏幕上HTML控件的状态和值。响应式表单可以让使用响应式编程模式、测试和校验变得更容易。

简单地说，就是模型驱动表单更加灵活，值和状态的同步更新，以及测试性较好。

1. 异步 vs. 同步

响应式表单是同步的。模板驱动表单是异步的。

模板驱动表单会委托指令来创建它们的表单控件。 
使用响应式表单，我们会在代码中创建整个表单控件树。 我们可以立即更新一个值或者深入到表单中的任意节点，因为所有的控件都始终是可用的。

2. ReactiveFormsModule

使用模型驱动的一些模板语法，我们需要引入`ReactiveFormsModule`:

``` js
import { ReactiveFormsModule } from '@angular/forms';
```

3. 基础的表单类

- `AbstractControl`
  - 是三个具体表单类的抽象基类
  - 为它们提供了一些共同的行为和属性，其中有些是可观察对象（`Observable`）。
- `FormControl`
  - 用于跟踪一个单独的表单控件的值和有效性状态
  - 它对应于一个HTML表单控件，比如输入框和下拉框
- `FormGroup`
  - 用于跟踪一组`AbstractControl`的实例的值和有效性状态
  - 该组的属性中包含了它的子控件
  - 组件中的顶级表单就是一个`FormGroup`
- `FormArray`
  - 用于跟踪`AbstractControl`实例组成的有序数组的值和有效性状态

4. `FormGroup`

有多个`FormControl`，把它们注册进一个父`FormGroup`中：

``` js
reactiveForm = new FormGroup ({
    name: new FormControl(),
    email: new FormControl(),
});
```

将`formGroup`关联到的是`form`元素上的`FormGroup`实例reactiveForm：

``` html
<form class="form-horizontal" [formGroup]="reactiveForm" (ngSubmit)="submit()">
```

`formGroup`是一个响应式表单的指令，它拿到一个现有`FormGroup`实例，并把它关联到一个HTML元素上。

5. formControlName

有了`FormGroup`，`name`输入框就需要再添加一个语法`formControlName="name"`，以便让它关联到类中正确的`FormControl`上：

``` html
    <div class="form-group">
        <label class="col-md-2 control-label">name</label>
        <div class="col-md-6">
            <input class="form-control" formControlName="name" />
        </div>
    </div>
```

这个语法告诉Angular，查阅父`FormGroup`，然后在这个`FormGroup`中查阅一个名叫`name`的`FormControl`。

6. FormBuilder

`FormBuilder`类能通过处理控件创建的细节问题来帮我们减少重复劳动。

``` js
    constructor(private fb: FormBuilder) { // 注入FormBuilder
        this.createForm();
    }

    createForm() {
        this.reactiveForm = this.fb.group({
            name: ['', [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(8)
            ]
            ],
            email: ['',
                [
                    Validators.required,
                    Validators.email
                ]
            ],
        });
    }
```

`FormBuilder.group`是一个用来创建`FormGroup`的工厂方法，它接受一个对象，对象的键和值分别是`FormControl`的名字和它的定义。
每个`FormControl`的设置都是`FormControl`名字和数组值。第一个数组元素是控件对应的当前值，第二个值（可选）是验证器函数或者验证器函数数组。

大多数验证器函数是Angular以`Validators`类的静态方法的形式提供的原装验证器。

7. valueChanges

可以通过订阅表单控件的属性之一来了解表单控件变化。
`valueChanges`返回一个RxJS的Observable对象。

``` js
this.reactiveForm.valueChanges
    .subscribe(data => this.onValueChanged(data));
```

这里我们需要添加触发事件回调：

``` js
    // 定义表单错误
    formErrors = {
        name: ''
    };
    // 对表单错误做说明映射
    validationMessages = {
        name: {
            required: '名字必填',
            minlength: '名字最少3个字符',
            maxlength: '名字最多8个字符'
        }
    };
    // 表单更新触发回调
    onValueChanged(data?: any) {
        if (!this.reactiveForm) {
            return;
        }
        const form = this.reactiveForm;
        // 遍历表单控件名字
        for (const field in this.formErrors) {
            this.formErrors[field] = ''; // 清除之前的错误信息
            const control = form.get(field);  // 获取控件
            if (control && control.dirty && !control.valid) {
                // 遍历获取错误说明
                const messages = this.validationMessages[field];
                for (const key in control.errors) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    }
```

最终效果图：

![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1495970774%281%29.png)

## 结束语
-----
讲到这里，我们的两种Angular表单--模型驱动和模板驱动，它们的简单使用和校验已经完成。
而需要更复杂一些的功能，像多级`FormGroup`、动态表单等，后面我们或许也会讲到。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular2-free/6-two-form-building)
[此处查看页面效果](http://angular2-free.godbasin.com/6-two-form-building/index.html#/home/page-setting)