import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {CustomFormComponent} from './component/dynamic-form/dynamic-form.component';
import {DateTimePickerComponent} from './component/date-time-picker.component';
import {Select2Component} from './component/select2.component';
import {RadioGroupComponent} from './component/radio-group.component';
import {CheckboxGroupComponent} from './component/checkbox-group.component';

@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule
  ],
  declarations: [
    DateTimePickerComponent,
    Select2Component,
    CustomFormComponent,
    RadioGroupComponent,
    CheckboxGroupComponent,

  ],
  exports: [
    DateTimePickerComponent,
    Select2Component,
    CustomFormComponent,
    RadioGroupComponent,
    CheckboxGroupComponent,

  ],
  providers: []
})
export class SharedModule {
}
