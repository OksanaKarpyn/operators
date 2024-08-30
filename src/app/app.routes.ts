import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RegisterOperatorComponent } from './pages/register-operator/register-operator.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsersComponent } from './pages/users/users.component';
import { DetailsUserComponent } from './pages/details-user/details-user.component';
// import { LoginOperatorComponent } from './pages/login-operator/login-operator.component';
import { ChartsComponent } from './pages/charts/charts.component';
import { AuthGuard } from './guards/auth.guard';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        title: 'Home Page',
        canActivate: [AuthGuard]
    },
   
    {
        path: 'register/add-edit',
        component: RegisterOperatorComponent,
        title: 'Register Page'
    },
    {
        path: 'register/add-edit/:id',
        component: RegisterOperatorComponent,
        title: 'Register Edit Page'
    },
    {
        path: 'login', 
        pathMatch: 'full',
        // component: LoginOperatorComponent,
        loadComponent:()=> import('./pages/login-operator/login-operator.component').then(c=>c.LoginOperatorComponent),// lazy loaded component
        title: 'Login Page',
        canActivate: [AuthGuard]
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        title: 'Dashboard Page'
    },
    {
        path:'users',
        component: UsersComponent,
        title:'Users list Page'
    },
    {
        path:'users/:id',
        component:DetailsUserComponent,
        title:'User Details'
    },
    {
        path:'charts',
        component:ChartsComponent,
        title:'Charts Page'
    },
    {
        path: '**',
        component: PageNotFoundComponent,
        title: 'Not Found Page',
    }
    

];
