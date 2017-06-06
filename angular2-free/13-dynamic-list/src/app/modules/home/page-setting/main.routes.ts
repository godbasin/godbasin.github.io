import { Routes } from '@angular/router';
import { PageSettingComponent } from './main.component';

import { FormSettingComponent } from './form-setting/form-setting.component';
import { ListSettingComponent } from './list-setting/list-setting.component';

export const PageSettingRoutes: Routes = [
    {
        path: '', component: PageSettingComponent, children: [
        {path: 'form-setting', component: FormSettingComponent},
        {path: 'list-setting', component: ListSettingComponent},
        {path: '**', redirectTo: 'list-setting'},
        ]
    }
];