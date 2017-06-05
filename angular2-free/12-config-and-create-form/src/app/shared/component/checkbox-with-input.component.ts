import {Component, Input, OnInit} from '@angular/core';
import {customInputAccessor} from '../class/custom-input.class';
import {IOptions} from './dynamic-form/dynamic-form.component';

@Component({
    selector: 'checkbox-with-input',
    template: `
        <span *ngFor="let op of options" class="form-check">
            <input type="checkbox" [checked]="model[op.id] && model[op.id].checked"
                   (click)="setValue(op)"
                   [disabled]="disabled" [value]="op.id"/>{{op.text}}
            <input *ngIf="op.withInput" class="form-control form-inline-input"
                   [type]="op.type || 'text'" [disabled]="!(model[op.id] && model[op.id].checked)" [(ngModel)]="model[op.id].value"/>
        </span>`,
    providers: [customInputAccessor(CheckboxWithTextComponent)]
})
export class CheckboxWithTextComponent implements OnInit {
    @Input() options: IOptions[] = []; // object: {id, text} or array: []
    @Input() disabled: boolean = false;

    private model: any = {}; // 控件的值
    private onChange: (_: any) => void;
    private onTouched: () => void;

    ngOnInit() {
        this.options.forEach(op => {
            this.model[op.id] = {
                checked: false,
            };
            if (op.withInput) {
                this.model[op.id].value = null;
            }
        });
    }

    setValue(op: any) {
        const isChecked = !this.model[op.id].checked;
        this.model[op.id].checked = isChecked;
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
