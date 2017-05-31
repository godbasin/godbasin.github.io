import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {CustomFormComponent} from './component/dynamic-form/dynamic-form.component';
import {DateTimePickerComponent} from './component/date-time-picker.component';
import {Select2Component} from './component/select2.component';
import {RadioGroupComponent} from './component/radio-group.component';
import {CheckboxGroupComponent} from './component/checkbox-group.component';
import {UploadImageComponent} from './component/upload-image/upload-image.component';

import {SafeUrlPipe} from './pipe/safe-url.pipe';


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
    UploadImageComponent,

    SafeUrlPipe,

  ],
  exports: [
    DateTimePickerComponent,
    Select2Component,
    CustomFormComponent,
    RadioGroupComponent,
    CheckboxGroupComponent,
    UploadImageComponent,

    SafeUrlPipe,

  ],
  providers: []
})
export class SharedModule {
}
