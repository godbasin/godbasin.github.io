import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

// import {HttpHelperService} from './service/http-helper.service';

import {DateTimePickerComponent} from './component/date-time-picker.component';
import {Select2Component} from './component/select2.component';

// import {NgFileSelectDirective} from './directive/ng-file-select.directive';

// import {DateFormatPipe} from './pipe/date-format.pipe';

@NgModule({
  imports: [
    CommonModule, FormsModule
  ],
  declarations: [
    DateTimePickerComponent,
    Select2Component,

    // NgFileSelectDirective,

    // DateFormatPipe,

  ],
  exports: [
    DateTimePickerComponent,
    Select2Component,

    // NgFileSelectDirective,

    // DateFormatPipe,

  ],
  providers: [
    // HttpHelperService,
  ]
})
export class SharedModule {
}
