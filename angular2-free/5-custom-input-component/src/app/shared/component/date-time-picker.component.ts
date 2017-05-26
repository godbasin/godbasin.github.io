/**
 * desc：date-time-picker
 * how to use: <date-time-picker [(ngModel)]='your_prop' accuracy='hour' ></date-time-picker>
 */

import {Component, Input, AfterViewInit, ElementRef, EventEmitter, Output} from '@angular/core';
import {CustomInputComponent, customInputAccessor} from '../class/custom-input.class';

@Component({
  selector: 'date-time-picker',
  template: `<input type="text" class="form-control" [disabled]="disabled" [(ngModel)]="value" (blur)="onBlur()" />`,
  providers: [customInputAccessor(DateTimePickerComponent)]
})
// ControlValueAccessor: A bridge between a control and a native element.
export class DateTimePickerComponent extends CustomInputComponent implements AfterViewInit {
  @Input() accuracy: string;  // 日期选择的精度，默认分钟，可选 (hour | day)
  @Input() startDate: string; // 可选最早日期
  @Input() endDate: string; // 可选最晚日期
  @Input() maxView: string; // 最大视图
  @Input() disabled: boolean = false; // 是否禁用

  @Output() change = new EventEmitter<any>(); // input的change事件回调

  private el; // 控件元素

  constructor(el: ElementRef) {
    super();
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
      .on('hide', ev => {
        this.value = $(ev.target).val();
        this.change.emit({value: $(ev.target).val()});
      });
  }
}
