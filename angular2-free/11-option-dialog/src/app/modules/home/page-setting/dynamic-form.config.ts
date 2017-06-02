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
        type: 'radio',
        label: '是否接收邮件',
        key: 'emailReceived',
        options: [
            {id: '1', text: '是'},
            {id: '0', text: '否'}
        ]
    }, {
        type: 'text',
        label: 'Email',
        key: 'email',
        validations: [{
            type: 'email',
            message: 'Email格式不正确'
        }],
        hiddenWhen: {
            condition: '||',
            validations: [{
                key: 'emailReceived',
                validate: '==',
                param: '0'
            }]
        }
    }, {
        type: 'radio-with-text',
        label: '职业',
        key: 'job',
        validations: [{
            type: 'required',
            message: '职业必选'
        }],
        options: [
            {id: '1', text: '医生'},
            {id: '2', text: '程序员'},
            {id: '3', text: '公务员'},
            {id: '4', text: '其他', withInput: true}
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
        type: 'checkbox-with-text',
        label: '爱好',
        key: 'hobbit',
        options: [
            {id: '1', text: '运动'},
            {id: '2', text: '看书'},
            {id: '3', text: '音乐'},
            {id: '4', text: '其他', withInput: true}
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