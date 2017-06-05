import {Component, Input, Output, AfterViewInit, OnChanges, EventEmitter, ElementRef} from '@angular/core';
import {CustomInputComponent, customInputAccessor} from '../class/custom-input.class';
import {JsonToHtml} from '../tool/json-to-html.tool';

@Component({
    selector: 'json-to-html',
    template: `
        <div></div>`,
    providers: [customInputAccessor(JsonToHtmlComponent)]
})
export class JsonToHtmlComponent implements AfterViewInit {
    @Input() options: object = {};
    @Input() isEdit: boolean = false;
    @Output() change = new EventEmitter();

    private editor: any;
    private el;

    private model: any = []; // 控件的值
    private onChange: (_: any) => void;
    private onTouched: () => void;

    constructor(el: ElementRef) {
        this.el = el;
    }

    ngAfterViewInit() {
        this.setValue(this.model);
    }

    setValue(value: any){
        if(value){
            this.el.nativeElement.innerHTML = JsonToHtml(value);
        }
    }

    // Set touched on blur
    onBlur() {
        this.onTouched();
    }

    writeValue(value: string): void {
        if (value) {
            this.model = value;
            this.setValue(value);
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

