import {ICustomControl} from 'shared/component/dynamic-form/dynamic-form.component';

export const optionsFormControl: ICustomControl[] = [
    {
        type: 'text',
        label: 'id',
        key: 'id',
        validations: [{
            type: 'required',
            message: 'id必填'
        }]
    }, {
        type: 'text',
        label: 'text',
        key: 'text',
        validations: [{
            type: 'required',
            message: 'text必填'
        }]
    }, {
        type: 'radio',
        label: '是否带输入',
        key: 'withInput',
        options: [
            {id: '0', text: '否'},
            {id: '1', text: '是'},
        ]
    }, {
        type: 'radio',
        label: '输入类型',
        key: 'type',
        options: [
            {id: 'text', text: 'text'},
            {id: 'number', text: 'number'},
            {id: 'email', text: 'email'}
        ],
        hiddenWhen: {
            condition: '&&',
            validations: [{
                key: 'withType',
                validate: '!=',
                param: '1'
            }]
        }
    }
];