import {Component, Input} from '@angular/core';
import {customInputAccessor} from '../class/custom-input.class';
import {IOptions} from './dynamic-form/dynamic-form.component';

@Component({
    selector: 'checkbox-group',
    template: `
        <span *ngFor="let op of options" class="form-check">
            <input type="checkbox" [checked]="model.indexOf(op.id) > -1" (click)="setValue(op)"
                   [disabled]="disabled" [value]="op.id"/>{{op.text}}
        </span>`,
    providers: [customInputAccessor(CheckboxGroupComponent)]
})
// ControlValueAccessor: A bridge between a control and a native element.
export class CheckboxGroupComponent {
    @Input() options: IOptions[] = []; // object: {id, text} or array: []
    @Input() disabled: boolean = false;

    private model: any = []; // 控件的值
    private onChange: (_: any) => void;
    private onTouched: () => void;

    setValue(option: any) {
        const {id} = option;
        const index = this.model.indexOf(id);
        if (index > -1) {
            this.model.splice(index, 1);
            this.onChange(this.model);
        } else {
            this.model.push(id);
            this.onChange(this.model);
        }
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
