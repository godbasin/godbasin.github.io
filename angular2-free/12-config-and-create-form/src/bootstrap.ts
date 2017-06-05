import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
require('zone.js');

// jquery
require('../node_modules/metismenu/dist/metisMenu.min.js');
// require('../node_modules/jsoneditor/dist/jsoneditor.min.js');
require('./assets/plugins/datepicker/bootstrap-datetimepicker.min.js');
require('./assets/plugins/datepicker/bootstrap-datetimepicker.zh-CN.js');
require('./assets/plugins/select2/select2.min.js');

import { AppModule } from './app/container/container.module';

platformBrowserDynamic().bootstrapModule(AppModule);