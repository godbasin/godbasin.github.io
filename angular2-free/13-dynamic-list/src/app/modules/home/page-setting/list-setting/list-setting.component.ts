import {Component} from '@angular/core';
import {ICustomControl} from 'shared/component/dynamic-form/dynamic-form.component';
import {IListConfig} from 'shared/component/dynamic-list/dynamic-list.component';
import {formConfig, listConfig} from './list-setting.config';

@Component({
    selector: 'list-setting',
    templateUrl: './list-setting.component.html',
})
export class ListSettingComponent {
    formConfig: ICustomControl[] = formConfig;
    listConfig: IListConfig = listConfig;


}