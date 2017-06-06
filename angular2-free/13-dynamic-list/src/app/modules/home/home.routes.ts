import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';

import { PageHandbookComponent } from './page-handbook/main.component';
import { PageRebuildComponent } from './page-rebuild/main.component';
import { PageSettingModule } from './page-setting/main.module';

export const HomeRoutes: Routes = [
    {
        path: '', component: HomeComponent, children: [
        {path: 'page-handbook', component: PageHandbookComponent},
        {path: 'page-rebuild', component: PageRebuildComponent},
        {path: 'page-setting', loadChildren: () => PageSettingModule},
        {path: '**', redirectTo: 'page-setting'},
        ]
    }
];