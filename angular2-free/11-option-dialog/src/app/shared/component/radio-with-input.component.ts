import { Component, Input, OnInit } from '@angular/core';
import {customInputAccessor} from '../class/custom-input.class';

@Component({
    selector: 'radio-with-input',
    template: `
        <span *ngFor="let op of options" class="form-check">
            <input type="radio" [disabled]="disabled" [checked]="model.id == op.id"
                   [value]="op.id" (click)="setValue(op)" />{{op.text}}
            <input *ngIf="op.withInput" class="form-control form-inline-input"
                   [type]="op.type || 'text'" [disabled]="model.id != op.id" [(ngModel)]="op.param" />
        </span>`,
    providers: [customInputAccessor(RadioWithTextComponent)]
})
// ControlValueAccessor: A bridge between a control and a native element.
export class RadioWithTextComponent {
    @Input() options: any[] = []; // object: {id, text} or array: []
    @Input() disabled: boolean = false;

    private model: any = {
        id: '',
        param: null
    }; // 控件的值
    private onChange: (_: any) => void;
    private onTouched: () => void;

    setValue(op: any) {
        this.model = op;
        this.onChange(this.model);
    }

    // Set touched on blur
    onBlur() {
        this.onTouched();
    }

    writeValue(value: string): void {
        if (value && value.length) {
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
