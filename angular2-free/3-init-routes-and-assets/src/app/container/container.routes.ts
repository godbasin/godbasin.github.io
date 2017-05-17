import { Routes } from '@angular/router';
import { AppComponent } from './container.component';
import { LoginComponent } from '../modules/login/login.component';
import { HomeModule } from '../modules/home/home.module';

export const AppRoutes: Routes = [
    {
        path: '', component: AppComponent, children: [
            { path: 'login', component: LoginComponent },
            { path: 'home', loadChildren: () => HomeModule },
            { path: '**', redirectTo: 'login'}
        ]
    }
];
