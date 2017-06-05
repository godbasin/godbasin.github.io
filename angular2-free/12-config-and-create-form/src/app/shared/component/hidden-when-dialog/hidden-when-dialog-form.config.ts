import {ICustomControl} from 'shared/component/dynamic-form/dynamic-form.component';

export const validationsFormControl: ICustomControl[] = [
    {
        type: 'text',
        label: 'key',
        key: 'key',
        validations: [{
            type: 'required',
            message: 'key必填'
        }]
    }, {
        type: 'select',
        label: 'validate',
        key: 'validate',
        validations: [{
            type: 'required',
            message: 'validate必选'
        }],
        options: [
            {id: '>', text: '>'},
            {id: '>=', text: '>='},
            {id: '<', text: '<'},
            {id: '<=', text: '<='},
            {id: '==', text: '=='},
            {id: '===', text: '==='},
            {id: '!=', text: '!='},
            {id: '!==', text: '!=='},
            {id: 'indexOf', text: 'indexOf'},
        ]
    }, {
        type: 'text',
        label: 'param',
        key: 'param',
        validations: [{
            type: 'required',
            message: 'param必填'
        }]
    }
];