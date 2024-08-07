import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RegisterOperatorComponent } from './pages/register-operator/register-operator.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginOperatorComponent } from './pages/login-operator/login-operator.component';
import { AuthGuard } from './authGuard/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        title: 'Home Page',
    },
    {
        path: 'register',
        component: RegisterOperatorComponent,
        title: 'Register Page',
    },
    {
        path: 'login', 
        pathMatch: 'full',
        component: LoginOperatorComponent,
        title: 'Login Page',
    },
    {
        path: 'dashboard/:id',
        component: DashboardComponent,
        title: 'Dashboard Page',
        canActivate:[AuthGuard]
    },
];
