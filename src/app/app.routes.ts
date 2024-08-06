import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RegisterOperatorComponent } from './pages/register-operator/register-operator.component';

export const routes: Routes = [
    {
        path: '',
        component: RegisterOperatorComponent,
        title: 'Register Page',
    },
    {
        path: 'dashboard-home',
        component: HomeComponent,
        title: 'Dashboard-Home Page',
    },
];
