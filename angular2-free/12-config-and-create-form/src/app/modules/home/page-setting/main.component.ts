import {Component} from '@angular/core';
import {ICustomControl} from 'shared/component/dynamic-form/dynamic-form.component';
import {normalFormControl} from './dynamic-form.config';

const CustomControlInit = {
    type: '',
    label: '',
    key: ''
};

interface ICustomForm extends ICustomControl {
    withValidation?: string;
    validation?: any;
}

@Component({
    selector: 'page-setting',
    templateUrl: './main.component.html',
})
export class PageSettingComponent {
    customForms: ICustomForm[] = [];
    customControl: ICustomControl[] = normalFormControl;
    json: any;

    addControl() {
        this.customForms.push({...CustomControlInit});
    }

    formJson() {
        const jsonResult = [];
        this.customForms.forEach(form => {
            const {type, label, key, limit, validations, options, description, setOptions, withValidation} = form;
            let {hiddenWhen} = form;
            const validationArr = [];
            const limitObj = {};
            if (validations) {
                Object.keys(validations).forEach(valid => {
                    const value = validations[valid].value;
                    let message = valid;
                    if (value != null) {
                        message += `: ${value}`;
                    }
                    if (validations[valid].checked) {
                        validationArr.push({
                            type: valid,
                            param: value == null ? undefined : Number(value),
                            message
                        });
                    }
                });
            }
            if (limit) {
                Object.keys(limit).forEach(con => {
                    if (limit[con].checked) {
                        limitObj[con] = limit[con].value;
                    }
                });
            }
            if (withValidation != '1') {
                hiddenWhen = undefined;
            }
            jsonResult.push({
                limit: limitObj,
                validations: validationArr,
                type, label, key, options, description, setOptions, hiddenWhen
            });

        });
        this.json = JSON.stringify({jsonResult});
    }
}