import {Component, Input, OnInit} from '@angular/core';
import {ICustomControl, IOptions} from 'shared/component/dynamic-form/dynamic-form.component';
import {optionsFormControl} from './option-dialog-form.config';

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
})
export class OptionDialogComponent implements OnInit {
    @Input() options: IOptions[] = [];
    @Input() type: string = '';
    optionsForm: IOption[] = [];
    optionControl: ICustomControl[];

    isShown: boolean = false;

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
        this.optionsForm = [].concat(this.options);
    }

    saveOptions() {
        this.options = [].concat(this.optionsForm);
        this.isShown = false;
    }

    addControl() {
        this.optionsForm.push({...OptionInit});
    }
}