import {ICustomControl} from 'shared/component/dynamic-form/dynamic-form.component';

export const normalFormControl: ICustomControl[] = [
    {
        type: 'select',
        label: '类型',
        key: 'type',
        validations: [{
            type: 'required',
            message: '类型必选'
        }],
        options: [
            {id: 'text', text: 'input-text'},
            {id: 'number', text: 'input-数字'},
            {id: 'select', text: 'select'},
            {id: 'radio', text: 'radio组'},
            {id: 'checkbox', text: 'checkbox组'},
            {id: 'date', text: '日期'},
            {id: 'date-time', text: '日期+时间(分钟)'},
            {id: 'date-hour', text: '日期+时间(小时)'},
            {id: 'upload-image', text: '图片上传'},
        ]
    }, {
        type: 'text',
        label: '字段key',
        key: 'key',
        validations: [{
            type: 'required',
            message: '字段key必填'
        }, {
            type: 'maxLength',
            param: 15,
            message: '字段key最多15个字符'
        }, {
            type: 'minLength',
            param: 3,
            message: '字段key最少3个字符'
        }]
    }, {
        type: 'text',
        label: '标签说明',
        key: 'label',
        validations: [{
            type: 'required',
            message: '标签说明必填'
        }]
    }, {
        type: 'checkbox-with-input',
        label: '校验',
        key: 'validations',
        options: [
            {id: 'required', text: '必填/必选'},
            {id: 'email', text: '邮件格式'},
            {id: 'maxLength', text: '最大字符数', withInput: true, type: 'number'},
            {id: 'minLength', text: '最小字符数', withInput: true, type: 'number'}
        ]
    }, {
        type: 'checkbox-with-input',
        label: '图片上传限制',
        key: 'limit',
        options: [
            {id: 'width', text: '宽(px)', withInput: true, type: 'number'},
            {id: 'height', text: '高(px)', withInput: true, type: 'number'},
            {id: 'size', text: '大小', withInput: true, type: 'number'},
            {id: 'type', text: '类型', withInput: true, type: 'text'}
        ],
        description: '类型限制可填 jpg | png | gif',
        hiddenWhen: {
            condition: '||',
            validations: [{
                key: 'type',
                validate: '!=',
                param: 'upload-image'
            }]
        }
    }, {
        type: 'select',
        label: '选项配置',
        key: 'options',
        options: [],
        hiddenWhen: {
            condition: '&&',
            validations: [{
                key: 'type',
                validate: '!=',
                param: 'select'
            }, {
                key: 'type',
                validate: '!=',
                param: 'checkbox'
            }, {
                key: 'type',
                validate: '!=',
                param: 'radio'
            }]
        },
        setOptions: true
    }, {
        type: 'text',
        label: '描述说明',
        key: 'description'
    }, {
        type: 'radio',
        label: '是否自定义选项',
        key: 'setOptions',
        options: [
            {id: '', text: '否'},
            {id: 'withOption', text: '是'},
        ],
        hiddenWhen: {
            condition: '&&',
            validations: [{
                key: 'type',
                validate: '!=',
                param: 'select'
            }, {
                key: 'type',
                validate: '!=',
                param: 'checkbox'
            }, {
                key: 'type',
                validate: '!=',
                param: 'radio'
            }]
        }
    }, {
        type: 'radio',
        label: '是否启用条件隐藏',
        key: 'withValidation',
        options: [
            {id: '0', text: '否'},
            {id: '1', text: '是'},
        ]
    }, {
        type: 'hidden-when-dialog',
        label: '隐藏条件配置',
        key: 'hiddenWhen',
        hiddenWhen: {
            condition: '&&',
            validations: [{
                key: 'withValidation',
                validate: '!=',
                param: '1'
            }]
        }
    }
];