import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
require('zone.js');

// jquery
require('../node_modules/metismenu/dist/metisMenu.min.js');

import { AppModule } from './app/container/container.module';

platformBrowserDynamic().bootstrapModule(AppModule);