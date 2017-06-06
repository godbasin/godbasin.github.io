import {Component, Input, OnInit} from '@angular/core';
import {ICustomControl, IOptions} from 'shared/component/dynamic-form/dynamic-form.component';
import {optionsFormControl} from './option-dialog-form.config';
import {customInputAccessor} from '../../class/custom-input.class';

const OptionInit = {
    id: '',
    text: ''
};

interface IOption extends IOptions {
    valid?: boolean;
}

@Component({
    selector: 'option-dialog',
    templateUrl: './option-dialog.component.html',
    providers: [customInputAccessor(OptionDialogComponent)]
})
export class OptionDialogComponent implements OnInit {
    @Input() type: string = '';
    optionsForm: IOption[] = [];
    optionControl: ICustomControl[];

    isShown: boolean = false;

    private model: IOptions[] = []; // 控件的值
    private onChange: (_: any) => void;
    private onTouched: () => void;

    ngOnInit() {
        if (this.type === 'withInput') {
            this.optionControl = optionsFormControl;
        } else {
            this.optionControl = optionsFormControl.slice(0, 2);
        }
    }

    isValid(): boolean {
        let valid = true;
        this.optionsForm.forEach(op => {
            if (!op.valid) {
                valid = false;
            }
        });
        return valid;
    }

    setOptions() {
        this.isShown = true;
        this.optionsForm = [].concat(this.model);
    }

    saveOptions() {
        this.model = [].concat(this.optionsForm.map((op: IOption) => {
            const {id, text} = op;
            return {id, text};
        }));
        this.isShown = false;
        this.onChange(this.model);
    }

    addControl() {
        this.optionsForm.push({...OptionInit});
    }

    // Set touched on blur
    onBlur() {
        this.onTouched();
    }

    writeValue(value: IOptions[]): void {
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