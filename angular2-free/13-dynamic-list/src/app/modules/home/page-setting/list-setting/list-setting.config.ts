import {ICustomControl} from 'shared/component/dynamic-form/dynamic-form.component';
import {IListConfig} from 'shared/component/dynamic-list/dynamic-list.component';

export const normalListControl: ICustomControl[] = [
    {
        type: 'checkbox',
        label: '功能',
        key: 'function',
        options: [
            {id: 'add', text: '添加'},
            {id: 'remove', text: '删除'},
            {id: 'edit', text: '编辑'},
        ]
    }
];

export const formConfig: ICustomControl[] = [
    {
        type: 'text',
        label: '名字',
        key: 'name',
        validations: [{
            type: 'required',
            message: '名字必填'
        }]
    }, {
        type: 'radio',
        label: '性别',
        key: 'gender',
        options: [
            {id: 'male', text: '男'},
            {id: 'female', text: '女'}
        ]
    }, {
        type: 'text',
        label: '备注',
        key: 'remark'
    }
];

export const listConfig: IListConfig = {
    function: ['add', 'edit', 'remove'],
    content: [{
        key: 'name',
        title: '名字'
    }, {
        key: 'gender',
        title: '性别'
    }, {
        key: 'remark',
        title: '备注'
    }]
};

