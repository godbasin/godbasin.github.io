import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {CustomFormComponent} from './component/dynamic-form/dynamic-form.component';
import {DateTimePickerComponent} from './component/date-time-picker.component';
import {Select2Component} from './component/select2.component';
import {RadioGroupComponent} from './component/radio-group.component';
import {CheckboxGroupComponent} from './component/checkbox-group.component';
import {UploadImageComponent} from './component/upload-image/upload-image.component';
import {CheckboxWithTextComponent} from './component/checkbox-with-input.component';
import {RadioWithTextComponent} from './component/radio-with-input.component';
import {OptionDialogComponent} from './component/option-dialog/option-dialog.component';
import {ValidationDialogComponent} from './component/hidden-when-dialog/hidden-when-dialog.component';
import {JsonToHtmlComponent} from './component/json-to-html.component';

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
    CheckboxWithTextComponent,
    RadioWithTextComponent,
    OptionDialogComponent,
    ValidationDialogComponent,
    JsonToHtmlComponent,

    SafeUrlPipe,

  ],
  exports: [
    DateTimePickerComponent,
    Select2Component,
    CustomFormComponent,
    RadioGroupComponent,
    CheckboxGroupComponent,
    UploadImageComponent,
    CheckboxWithTextComponent,
    RadioWithTextComponent,
    OptionDialogComponent,
    ValidationDialogComponent,
    JsonToHtmlComponent,

    SafeUrlPipe,

  ],
  providers: []
})
export class SharedModule {
}
