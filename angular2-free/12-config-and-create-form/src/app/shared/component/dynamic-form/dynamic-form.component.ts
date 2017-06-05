import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ILimit} from 'shared/component/upload-image/upload-image.component';
import {validate} from '../../tool/validate.tool';

export interface IValidations {
    type: string;
    param?: any;
    message: string;
}

export interface IOptions {
    id: string;
    text: string;
    withInput?: boolean;
    type?: 'text' | 'number' | 'email';
}

export interface IHiddenValidate {
    key: string;
    validate: string;
    param: string | number;
}

export interface IHiddenCondition {
    condition: '||' | '&&' | '';
    validations?: IHiddenValidate[];
}

export interface ICustomControl {
    type: string;
    label: string;
    key: string;
    validations?: IValidations[];
    options?: IOptions[];
    limit?: ILimit;
    hiddenWhen?: IHiddenCondition;
    description?: string;
    setOptions?: boolean;
}

@Component({
    selector: 'dynamic-form',
    templateUrl: './dynamic-form.component.html',
})
export class CustomFormComponent implements OnInit {
    @Input() config: ICustomControl[] = [];
    customGroup: any = {};
    @Input() model: any = {};
    dynamicForm: FormGroup;

    formErrors = {};
    validationMessages = {};

    constructor(private fb: FormBuilder) {
    }

    ngOnInit() {
        this.config.forEach((control: ICustomControl, i) => {
            this.formErrors[control.key] = '';
            this.validationMessages[control.key] = {};
            const validations = [];
            if (control.validations && !control.hiddenWhen) {
                control.validations.forEach((valid: IValidations) => {
                    this.validationMessages[control.key][valid.type.toLowerCase()] = valid.message;
                    if (valid['param']) {
                        validations.push(Validators[valid.type](valid.param));
                    } else {
                        validations.push(Validators[valid.type]);
                    }
                });
            }
            console.log(validations)

            this.customGroup[control.key] = [this.model[control.key], validations];
        });
        this.createForm();
    }

    isHidden(control: ICustomControl) {
        let hidden = false;
        if (control.hiddenWhen && control.hiddenWhen.validations && control.hiddenWhen.validations.length) {
            if(control.hiddenWhen.condition == '&&'){hidden = true;}
            control.hiddenWhen.validations.forEach(valid => {
                hidden = validate(
                    hidden,
                    validate(this.dynamicForm.value[valid.key], valid.param, valid.validate),
                    control.hiddenWhen.condition
                );
            });
        }
        return hidden;
    }

    createForm() {
        // 有多个FormControl，把它们注册进一个父FormGroup中
        this.dynamicForm = this.fb.group(this.customGroup);
        this.dynamicForm.valueChanges
            .subscribe(data => this.onValueChanged(data));
        this.onValueChanged(); // (re)set validation messages now
    }

    onValueChanged(data?: any) {
        if (!this.dynamicForm) {
            return;
        }
        const form = this.dynamicForm;
        for (const field in this.formErrors) {
            // clear previous error message (if any)
            this.formErrors[field] = '';
            const control = form.get(field);
            if (control && control.dirty && !control.valid) {
                const messages = this.validationMessages[field];
                for (const key in control.errors) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
        this.model = Object.assign(this.model, {...this.dynamicForm.value}, {valid: this.dynamicForm.valid});
    }

    optionsType(type: string){
        switch (type){
            case 'select':
            case 'radio':
            case 'checkbox':
                return 'withOption';
            case 'radio-with-input':
            case 'checkbox-with-input':
                return 'withInput';
            default:
                return '';
        }
    }
}