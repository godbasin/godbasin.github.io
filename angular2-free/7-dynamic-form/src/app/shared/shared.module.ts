import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


import {DateTimePickerComponent} from './component/date-time-picker.component';
import {Select2Component} from './component/select2.component';
import {CustomFormComponent} from './component/dynamic-form/dynamic-form.component';


@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule
  ],
  declarations: [
    DateTimePickerComponent,
    Select2Component,
    CustomFormComponent,

  ],
  exports: [
    DateTimePickerComponent,
    Select2Component,
    CustomFormComponent,

  ],
  providers: []
})
export class SharedModule {
}
