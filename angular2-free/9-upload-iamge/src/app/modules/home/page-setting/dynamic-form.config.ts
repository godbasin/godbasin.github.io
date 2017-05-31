import {ICustomControl} from 'shared/component/dynamic-form/dynamic-form.component';

export const customForms: ICustomControl[] = [
    {
        type: 'text',
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
        type: 'text',
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
    }, {
        type: 'radio',
        label: '性别',
        key: 'gender',
        options: [
            {id: 'male', text: '男'},
            {id: 'female', text: '女'},
            {id: '', text: '未知'}
        ]
    }, {
        type: 'checkbox',
        label: '爱好',
        key: 'hobbit',
        options: [
            {id: '1', text: '运动'},
            {id: '2', text: '看书'},
            {id: '3', text: '音乐'}
        ]
    }, {
        type: 'date',
        label: '生日',
        key: 'birthday'
    }, {
        type: 'upload-image',
        label: '头像',
        key: 'head',
        limit: {
            width:750,
            height:422,
            size:30,
            type:'jpg'
        }
    }
];

export const customFormsDefault = {
    // job: '2',
    // hobbit: ["2"],
    // gender: "female",
    // birthday: '2017-05-23'
};