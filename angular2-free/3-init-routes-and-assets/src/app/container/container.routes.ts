import { Routes } from '@angular/router';
import { AppComponent } from './container.component';
import { LoginComponent } from '../modules/login/login.component';

export const AppRoutes: Routes = [
    {
        path: '', component: AppComponent, children: [
            { path: 'login', component: LoginComponent },
            { path: 'home', loadChildren: '../modules/home/home.module#HomeModule' },
            { path: '**', redirectTo: 'login'}
        ]
    }
];