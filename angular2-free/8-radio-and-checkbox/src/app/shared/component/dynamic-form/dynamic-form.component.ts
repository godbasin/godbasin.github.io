import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
// import {customForms} from '../../../modules/home/page-setting/dynamic-form.config';

interface IValidations {
    type: string;
    param?: any;
    message: string;
}

interface IOptions {
    id: string;
    text: string;
}

export interface ICustomControl {
    type: string;
    label: string;
    key: string;
    validations?: IValidations[];
    options?: IOptions[];
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

    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        this.config.forEach((control: ICustomControl, i) => {
            this.formErrors[control.key] = '';
            this.validationMessages[control.key] = {};
            const validations = [];
            if (control.validations) {
                control.validations.forEach((valid: IValidations) => {
                    this.validationMessages[control.key][valid.type.toLowerCase()] = valid.message;
                    if (valid['value']) {
                        validations.push(Validators[valid.type](valid.param));
                    } else {
                        validations.push(Validators[valid.type]);
                    }
                });
            }

            this.customGroup[control.key] = [this.model[control.key], validations];
        });
        this.createForm();
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
    }

    submit() {
        this.model = {...this.dynamicForm.value};
        console.log(this.model);
        alert('成功！');
    }
}