import {Component, Input} from '@angular/core';
import {ICustomControl} from 'shared/component/dynamic-form/dynamic-form.component';
import {ObjectCopy} from 'shared/tool/object-copy.tool';

export interface IList {
    title: string;
    key: string;
}

export interface IListConfig {
    function: string[];
    content: IList[];
}

@Component({
    selector: 'dynamic-list',
    templateUrl: './dynamic-list.component.html',
})
export class DynamicListComponent {
    @Input() listConfig: IListConfig;
    @Input() formConfig: ICustomControl[] = [];
    @Input() dataModel: any = [];
    @Input() formModel: any = [];

    isShown: boolean = false;
    isEdit: number = -1;

    hasFunction(fun: string) {
        if (this.listConfig && this.listConfig.function) {
            return this.listConfig.function.indexOf(fun) > -1;
        }
        return false;
    }

    edit(index: number) {
        this.isEdit = index;
        if (index > -1) {
            this.formModel = ObjectCopy(this.dataModel[index]);
        } else {
            this.formModel = {};
        }
        this.isShown = true;
    }

    save() {
        const model = ObjectCopy(this.formModel);
        if (this.isEdit > -1) {
            this.dataModel[this.isEdit] = model;
        } else {
            this.dataModel.push(model);
        }
        this.isShown = false;
    }
}