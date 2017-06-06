import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'reactive-form',
    templateUrl: './reactive.component.html',
})
export class ReactiveFormComponent {
    reactiveForm: FormGroup;

    formErrors = {
        name: '',
        email: ''
    };
    validationMessages = {
        name: {
            required: '名字必填',
            minlength: '名字最少3个字符',
            maxlength: '名字最多8个字符'
        },
        email: {
            required: 'Email必填',
            email: 'Email格式不正确'
        }
    };

    constructor(private fb: FormBuilder) { // <--- inject FormBuilder
        this.createForm();
    }

    createForm() {
        // 有多个FormControl，把它们注册进一个父FormGroup中
        this.reactiveForm = this.fb.group({
            name: ['', [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(8)
            ]
            ],
            email: ['',
                [
                    Validators.required,
                    Validators.email
                ]
            ],
        });
        this.reactiveForm.valueChanges
            .subscribe(data => this.onValueChanged(data));
        this.onValueChanged(); // (re)set validation messages now
    }

    onValueChanged(data?: any) {
        if (!this.reactiveForm) {
            return;
        }
        const form = this.reactiveForm;
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

    submit(){
        alert('成功！');
    }
}