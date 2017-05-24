import { Component, Input, Output, AfterViewInit, ElementRef, EventEmitter, OnChanges } from '@angular/core';
import { NgModel, ControlValueAccessor } from '@angular/forms';

@Component({
    selector: 'select2',
    template: `<select class="form-control" [(ngModel)]="model" name="model" [disabled]="disabled"></select>`
})
// ControlValueAccessor: A bridge between a control and a native element.
export class Select2Component implements ControlValueAccessor, OnChanges, AfterViewInit {
    @Input() options: any[] = []; // object: {id, text} or array: []
    @Input() params: object = {};
    @Input() disabled: boolean = false;
    @Output() select = new EventEmitter<any>();

    select2: any;
    private el;
    private onChange: (_: any) => void;
    private onTouched: () => void;
    private model: any;


    constructor(model: NgModel, el: ElementRef) {
        model.valueAccessor = this;
        this.model = model;
        this.el = el;
    }
    ngAfterViewInit() {
        this.select2.select2('val', [this.model]);
    }

    ngOnChanges() {
        const _this = this;
        this.select2 = $(this.el.nativeElement).find('select').select2({
            data: this.options,
        }).on("select2:select", function (ev) {
            console.log( ev['params'])
            const {id, text} = ev['params']['data'];
            _this.select.emit({ id, text });
        });
    }

    // Write a new value to the element.
    writeValue(value: string): void {
        if (!value) {
            return;
        }
        this.select2.select2('val', [this.model]);
    }

    // Set the function to be called when the control receives a change event.
    registerOnChange(fn: (_: any) => {}): void {
        this.onChange = fn;
    }

    // registerOnTouched(fn: any) : void
    registerOnTouched(fn: () => {}): void {
        this.onTouched = fn;
    }

    private setValue(value: any): void {
        this.model.viewToModelUpdate(value);
    }
}
