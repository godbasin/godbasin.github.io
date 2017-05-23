import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';

import { PageHandbookComponent } from './page-handbook/main.component';
import { PageRebuildComponent } from './page-rebuild/main.component';
import { PageSettingComponent } from './page-setting/main.component';

export const HomeRoutes: Routes = [
    {
        path: '', component: HomeComponent, children: [
        {path: 'page-handbook', component: PageHandbookComponent},
        {path: 'page-rebuild', component: PageRebuildComponent},
        {path: 'page-setting', component: PageSettingComponent},
        ]
    }
];