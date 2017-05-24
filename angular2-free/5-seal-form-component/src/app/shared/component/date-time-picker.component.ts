/**
 * desc：date-time-picker
 * how to use: <date-time-picker [(ngModel)]='your_prop' accuracy='hour' ></date-time-picker>
 */

import {Component, Input, AfterViewInit, ElementRef, EventEmitter, Output} from '@angular/core';
import {NgModel} from '@angular/forms';

@Component({
  selector: 'date-time-picker',
  template: `<input type="text" class="form-control" [disabled]="disabled" [(ngModel)]="model" />`
})
// ControlValueAccessor: A bridge between a control and a native element.
export class DateTimePickerComponent implements AfterViewInit {
  @Input() accuracy: string;
  @Input() startDate: string;
  @Input() endDate: string;
  @Input() maxView: string;
  @Input() disabled: boolean = false;

  @Output() change = new EventEmitter<any>();

  private el;
  private model: any;
  private onChange: (_: any) => void;
  private onTouched: () => void;

  constructor(model: NgModel, el: ElementRef) {
    model.valueAccessor = this;
    this.model = model;
    this.el = el;
  }

  // Lifecycle hook that is called after a component's view has been fully initialized.
  ngAfterViewInit() {
    /*
     source:http://www.bootcss.com/p/bootstrap-datetimepicker/
     minView: default 2
     maxView: default 4
     0 or 'hour' for the hour view
     1 or 'day' for the day view 0-24h
     2 or 'month' for month view (the default)
     3 or 'year' for the 12-month overview
     4 or 'decade' for the 10-year overview. Useful for date-of-birth datetimepickers.
     */
    let format = 'yyyy-mm-dd hh:ii:ss';
    let minView = 0;

    if (this.accuracy === 'minute') { // minute
      format = 'yyyy-mm-dd hh:ii:00';
    } else if (this.accuracy === 'hour') { // hour
      format = 'yyyy-mm-dd hh:00';
      minView = 1;
    } else if (this.accuracy === 'day') { // day
      format = 'yyyy-mm-dd 00:00:00';
      minView = 2;
    }

    $(this.el.nativeElement).find('input').datetimepicker({
      language: 'zh-CN',
      autoclose: true,
      maxView: parseInt(this.maxView, 10) || 4,
      startDate: this.startDate || '',
      endDate: this.endDate || '',
      format,
      minView,
    })
      .on('hide', ev => {
        console.log('plugin on hide: ', $(ev.target).val());
        this.change.emit({value: $(ev.target).val()});
      });
  }

  writeValue(value: string): void{
    this.model = value;
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
