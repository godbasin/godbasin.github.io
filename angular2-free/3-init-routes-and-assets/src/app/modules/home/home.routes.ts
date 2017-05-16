import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';

export const HomeRoutes: Routes = [
    {
        path: '', component: HomeComponent, children: [
            // { path: 'login', component: HomeComponent },
            // { path: 'home', loadChildren: '../modules/home/hoem.module.ts#HomeModule' },
            // { path: '', redirectTo: '/heroes', pathMatch: 'full' },
        ]
    }
];