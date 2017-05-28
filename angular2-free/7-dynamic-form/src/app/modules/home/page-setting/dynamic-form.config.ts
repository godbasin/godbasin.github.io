import {ICustomControl} from 'shared/component/dynamic-form/dynamic-form.component';

export const customForms: ICustomControl[] = [
    {
        type: 'input',
        label: '名字',
        key: 'name',
        validations: [{
            type: 'required',
            message: '名字必填'
        }, {
            type: 'maxLength',
            param: 8,
            message: '名字最多8个字符'
        }, {
            type: 'minLength',
            param: 3,
            message: '名字最少3个字符'
        }]
    }, {
        type: 'input',
        label: 'Email',
        key: 'email',
        validations: [{
            type: 'required',
            message: 'Email必填'
        }, {
            type: 'email',
            message: 'Email格式不正确'
        }]
    }, {
        type: 'select',
        label: '职业',
        key: 'job',
        validations: [{
            type: 'required',
            message: '职业必选'
        }],
        options: [
            {id: '', text: ''},
            {id: '1', text: '医生'},
            {id: '2', text: '程序员'},
            {id: '3', text: '公务员'},
            {id: '4', text: '其他'}
        ]
    }
];