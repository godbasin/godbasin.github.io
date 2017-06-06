import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'shared/shared.module';

import { PageSettingRoutes } from './main.routes';
import { PageSettingComponent } from './main.component';

import { FormSettingComponent } from './form-setting/form-setting.component';
import { ListSettingComponent } from './list-setting/list-setting.component';

@NgModule({
  declarations: [
    PageSettingComponent,
      FormSettingComponent,
      ListSettingComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    RouterModule.forChild(PageSettingRoutes)
  ],
  providers: []
})
export class PageSettingModule { }