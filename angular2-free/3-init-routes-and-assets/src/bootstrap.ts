import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
require('zone.js');

// jquery
window['$'] = window['jQuery'] = require('./assets/js/jquery.min.js');
require('../node_modules/bootstrap/dist/js/bootstrap.min.js');

import { AppModule } from './app/container/container.module';

platformBrowserDynamic().bootstrapModule(AppModule);