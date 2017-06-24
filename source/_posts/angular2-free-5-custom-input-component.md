---
title: 玩转Angular2(5)--自定义input表单控件
date: 2017-06-03 09:57:03
categories: angular2火锅
tags: 笔记
---
因为项目原因又玩上了Angular2(v4.0+)，《玩转Angular2》系列用于探索一些灵活或者新的用法。
本文简单介绍封装使用ngModol实现自定义表单控件的过程。
<!--more-->

## NgModel相关
---
### NgModel
`NgModel`用于从作用域创建一个`FormControl`实例，并将它绑定到一个表单控制元素。

- `[ngModel]`: 单向绑定，作用域变更将同步到UI木板
- `[(ngModel)]`: 双向绑定，UI模版的变更也将同步到作用域

`NgModel`继承自`NgControl`。

### NgControl
`NgControl`是所有控制指令继承的基础类。它将一个`FormControl`绑定到DOM元素。

`FormControl`、`FormGroup`和`FormArray`，三者都用于angular表单的值和状态的跟踪，区别在于是一个控件、一组控件或者是它们的组合。

`AbstractControl`是三个具体表单类的抽象基类。并为它们提供了一些共同的行为和属性，其中有些是可观察对象（`Observable`）。
`FormControl`用于跟踪一个单独的表单控件的值和有效性状态。它对应于一个HTML表单控件，比如输入框和下拉框。
`FormGroup`用于跟踪一组`AbstractControl`的实例的值和有效性状态。该组的属性中包含了它的子控件。组件中的顶级表单就是一个`FormGroup`。
`FormArray`用于跟踪`AbstractControl`实例组成的有序数组的值和有效性状态。

### ControlValueAccessor
`ControlValueAccessor`用于在控制和原生元素之间建立联系，它封装了赋值到一个表现为`input`元素的DOM元素。

简单说，就是angular中的input是带有`[(ngModel)]`这个属性的，而我们想要自己控制这个input的写入过程，使用`ControlValueAccessor`就可以做到。

`ControlValueAccessor`提供以下接口：

- `writeValue(obj: any) : void`: 写入值到元素
- `registerOnChange(fn: any) : void`: 设置当控件接收到`change`事件时触发的回调
- `registerOnTouched(fn: any) : void`: 设置当控件接收到`touch`事件时触发的回调
- `setDisabledState(isDisabled: boolean) : void`: 该函数将在控件状态或者`disabled`值变化，根据值来对元素启用或失效

`ControlValueAccessor`继承自`DefaultValueAccessor`。

### DefaultValueAccessor
`DefaultValueAccessor`提供值写入和监听变化的默认访问，像`NgModel`, `FormControlDirective`, 和`FormControlName`指令会使用。

`DefaultValueAccessor`提供类包括：

- `onChange : (_: any) => {}`: `change`事件变化监听
- `onTouched : () => {}`: `touch`事件变化监听

以及`ControlValueAccessor`（上面）的接口。

### NG_VALUE_ACCESSOR
`NG_VALUE_ACCESSOR`提供一个`ControlValueAccessor`供表单控制使用。

## 时间选择控件
---
### datetimepicker
这里我们主要使用一个Bootstrap和jQuery的日期时间选择器插件--[bootstrap-datetimepick](http://www.bootcss.com/p/bootstrap-datetimepicker/)。

先简单介绍一下，我们可以使用该插件方便地进行日期和时间选择，从最大的十年视图到最小的分钟选择都可以自行调整。
具体一些配置项大家可以到官网上查看，这里就不详细介绍了，后面代码用到的会简单进行说明。

首先我们需要下载代码，这里放在了`assets/plugins/datepicker`文件夹里面。

然后添加进我们的应用程序就可以使用了：

``` js
// boostrap.ts
require('./assets/plugins/datepicker/bootstrap-datetimepicker.min.js');
require('./assets/plugins/datepicker/bootstrap-datetimepicker.zh-CN.js');
```

### 创建自定义input控件
我们想要封装后的组件跟原生的angular组件一样，像表现为input的自定义控件，我们想要使用`[(ngModel)]`来进行双向绑定，我们需要使用`ControlValueAccessor`来拓展。

而这里`ControlValueAccessor`只是一个接口，我们应用它，还需要获取一些可用的服务，这时候需要注入`NG_VALUE_ACCESSOR`。

``` js
export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CustomInputComponent),
    multi: true
};
```

这里简单讲讲几个概念：
1. 我们自定义了一个访问控制服务，该服务包装为`NG_VALUE_ACCESSOR`服务，主要用于控制`ControlValueAccessor`相关的访问。
2. 我们需要将自定义input控件提供给`NG_VALUE_ACCESSOR`，以便通过自定义方式控制父组件的`[(ngModel)]`以及其他表单相关的访问。
3. `forwardRef`用于将目前还未获取到的依赖关联起来，这里我们关联后面的自定义Input组件。

``` js
@Component({
    selector: 'custom-input',
    template: `<input [(ngModel)]="value" class="form-control" (blur)="onBlur()" />`,
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR] // 注入访问控制服务
})
// 继承ControlValueAccessor接口
export class CustomInputComponent implements ControlValueAccessor{

    // 内部model值
    private innerValue: any = '';

    // 定义ControlValueAccessor提供的事件回调
    private onTouched: () => void = noop;
    private onChange: (_: any) => void = noop;

    // 获取值的访问
    get value(): any {
        return this.innerValue;
    };

    // 设置值，同时触发change回调
    set value(v: any) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            this.onChange(v);
        }
    }

    // 失焦时触发回调
    onBlur() {
        this.onTouched();
    }

    // 表单ControlValueAccessor接口
    writeValue(value: any) {
        if (value !== this.innerValue) {
            this.innerValue = value;
        }
    }

    // 表单ControlValueAccessor接口
    registerOnChange(fn: any) {
        this.onChange = fn;
    }

    // 表单ControlValueAccessor接口
    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }
}
```

具体的实现实例参考[Angular2 + Connect custom component to ngModel](https://embed.plnkr.co/nqKUSPWb6w5QXr8a0wEu/?show=preview)。

### 创建自定义时间选择控件
像我们定义一个时间选择控件，一般需要对外提供一些配置：
- 选择精度（或自定义视图范围）
  - 这里提供：分钟（默认）、小时和天
- 可选日期范围
- 是否禁用
- 是否必填
- ...

以及通常我们提供一个值变更的回调，像`(change)`这样的事件。
下面看看代码实现：

``` js
import {Component, Input, AfterViewInit, ElementRef, EventEmitter, Output, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DateTimePickerComponent),
  multi: true
};

@Component({
  selector: 'date-time-picker',
  template: `<input type="text" class="form-control" [disabled]="disabled" [(ngModel)]="value" (blur)="onBlur()" />`,
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
})
// ControlValueAccessor: A bridge between a control and a native element.
export class DateTimePickerComponent implements AfterViewInit, ControlValueAccessor {
  @Input() accuracy: string;  // 日期选择的精度，默认分钟，可选 (hour | day)
  @Input() startDate: string; // 可选最早日期
  @Input() endDate: string; // 可选最晚日期
  @Input() maxView: string; // 最大视图
  @Input() disabled: boolean = false; // 是否禁用

  @Output() change = new EventEmitter<any>(); // input的change事件回调

  private el; // 控件元素
  private model: any; // 内部model值

  // 定义ControlValueAccessor提供的事件回调
  private onChange: (_: any) => void;
  private onTouched: () => void;

  constructor(el: ElementRef) {
    this.el = el;
  }

  // Lifecycle hook that is called after a component's view has been fully initialized.
  ngAfterViewInit() {
    /*
     source:http://www.bootcss.com/p/bootstrap-datetimepicker/
     minView: default 2
     maxView: default 4
     0 or 'hour' for the hour view （小时视图）
     1 or 'day' for the day view 0-24h （日视图）
     2 or 'month' for month view (the default) （月视图）
     3 or 'year' for the 12-month overview （年视图）
     4 or 'decade' for the 10-year overview. Useful for date-of-birth datetimepickers. （十年视图）
     */
    let format = 'yyyy-mm-dd hh:ii:00'; // 默认选择分钟，故秒数为00，datetimepicker不支持秒数的选择
    let minView = 0; // 默认最小视图为分钟

    if (this.accuracy === 'hour') {
      format = 'yyyy-mm-dd hh:00'; // 设置为小时，分钟和秒数需为00
      minView = 1; // 最小视图为小时
    } else if (this.accuracy === 'day') {
      format = 'yyyy-mm-dd 00:00:00'; // 设置为天
      minView = 2; // 最小视图为日期
    }

    $(this.el.nativeElement).find('input').datetimepicker({
      language: 'zh-CN',
      autoclose: true, // 选择日期后自动关闭
      maxView: parseInt(this.maxView, 10) || 4, // 选择的最大视图，4为十年视图
      startDate: this.startDate || '', // 最早可选日期，默认不限制
      endDate: this.endDate || '', // 最晚可选日期，默认不限制
      format, // 格式化
      minView, // 选择的最小视图
    })
      .on('hide', ev => { // 这里需要注意，我们使用箭头函数() => {}，则不会更改this的指向
        this.value = $(ev.target).val(); // 更新值
        this.change.emit({value: $(ev.target).val()}); // 触发回调
      });
  }

  // 获取值的访问
  get value(): any {
    return this.model;
  }

  // 设置值，同时触发change回调
  set value(v: any) {
    if (v !== this.model) {
      this.model = v;
      this.onChange(v);
    }
  }

  // 失焦时触发回调
  onBlur() {
    this.onTouched();
  }

  // 父组件的值变更时，更新model的值
  writeValue(value: string): void{
    if (value !== this.model) {
      this.model = value;
    }
  }

  // 表单ControlValueAccessor接口
  registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }

  // 表单ControlValueAccessor接口
  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }
}
```

### 抽象出class继承
我们可以把相同的方法抽象出来，通过继承的方式，这样就能在多个相似组件通用了。

``` js
import {forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

export function customInputAccessor(component){
    return {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => component),
        multi: true
    };
}

export class CustomInputComponent implements ControlValueAccessor {
    private model: any; // 控件的值
    private onChange: (_: any) => void;
    private onTouched: () => void;

    // get accessor
    get value(): any {
        return this.model;
    }

    // set accessor including call the onchange callback
    set value(v: any) {
        if (v !== this.model) {
            this.model = v;
            this.onChange(v);
        }
    }

    // Set touched on blur
    onBlur() {
        this.onTouched();
    }

    writeValue(value: string): void{
        if (value !== this.model) {
            this.model = value;
        }
    }

    // Set the function to be called when the control receives a change event.
    registerOnChange(fn: (_: any) => {}): void {
        this.onChange = fn;
    }

    // registerOnTouched(fn: any) : void
    registerOnTouched(fn: () => {}): void {
        this.onTouched = fn;
    }
}
```

在datetimepick中继承：

``` js
import {CustomInputComponent, customInputAccessor} from '../class/custom-input.class';

@Component({
  selector: 'date-time-picker',
  template: `<input type="text" class="form-control" [disabled]="disabled" [(ngModel)]="value" (blur)="onBlur()" />`,
  providers: [customInputAccessor(DateTimePickerComponent)],
})
export class DateTimePickerComponent extends CustomInputComponent implements AfterViewInit {
  @Input() accuracy: string;  // 日期选择的精度，默认分钟，可选 (hour | day)
  @Input() startDate: string; // 可选最早日期
  @Input() endDate: string; // 可选最晚日期
  @Input() maxView: string; // 最大视图
  @Input() disabled: boolean = false; // 是否禁用

  @Output() change = new EventEmitter<any>(); // input的change事件回调

  private el; // 控件元素

  constructor(el: ElementRef) {
    super(); // 继承
    this.el = el;
  }
  ngAfterViewInit() {
    // 原本的内容
  }
}
```

效果图：

![image](http://o905ne85q.bkt.clouddn.com/1495970682%281%29.png)

## 结束语
-----
这节我们讲了自定义表单相关的一些概念，以及自定义一个时间选择input表单的实现过程。
很多时候我们都需要对不同的input自行封装，所以也可以单独抽象出来Class方便继承，又或者封装成指令等方式都是可以的。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular2-free/5-custom-input-component)
[此处查看页面效果](http://oqntc49tn.bkt.clouddn.com/5-custom-input-component/index.html#/home/page-setting)