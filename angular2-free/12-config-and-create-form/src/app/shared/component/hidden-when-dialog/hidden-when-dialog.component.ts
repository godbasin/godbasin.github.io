import {Component, Input, OnInit} from '@angular/core';
import {ICustomControl, IHiddenCondition, IHiddenValidate} from 'shared/component/dynamic-form/dynamic-form.component';
import {validationsFormControl} from './hidden-when-dialog-form.config';
import {customInputAccessor} from '../../class/custom-input.class';

const ValidationInit = {
    key: '',
    validate: '',
    param: ''
};

interface IValidation extends IHiddenValidate {
    valid?: boolean;
}

@Component({
    selector: 'hidden-when-dialog',
    templateUrl: './hidden-when-dialog.component.html',
    providers: [customInputAccessor(ValidationDialogComponent)]
})
export class ValidationDialogComponent {
    validationsForm: IValidation[] = [];
    validationControl: ICustomControl[] = validationsFormControl;

    isShown: boolean = false;

    private model: IHiddenCondition = {
        condition: '',
        validations: []
    }; // 控件的值
    private onChange: (_: any) => void;
    private onTouched: () => void;

    isValid(): boolean {
        let valid = true;
        this.validationsForm.forEach(op => {
            if (!op.valid) {
                valid = false;
            }
        });
        return valid;
    }

    setValidations() {
        this.isShown = true;
        const {validations} = this.model;
        this.validationsForm = [].concat(validations || []);
    }

    saveValidations() {
        this.model.validations = [].concat(this.validationsForm.map((op: IHiddenValidate) => {
            const {key, validate, param} = op;
            return {key, validate, param};
        }));
        this.isShown = false;
        this.onChange(this.model);
    }

    addControl() {
        this.validationsForm.push({...ValidationInit});
    }

    // Set touched on blur
    onBlur() {
        this.onTouched();
    }

    writeValue(value: IHiddenCondition): void {
        if(value){
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