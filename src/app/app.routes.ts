// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { AdminMainComponent } from './features/dashboard-admin/main/main.component';
import { EmployeeMainComponent } from './features/dashboard-employee/main/main.component';
import { ClaimsListComponent } from './features/claims/list/list.component';
import { UploadFormComponent } from './features/upload/form/form.component';
import { adminGuard } from './core/auth/admin.guard';
import { employeeGuard } from './core/auth/employee.guard';
import { DashboardComponent } from './features/dashboard-employee/main/dashboard/dashboard.component';
import { HistoryComponent } from './features/upload/history/history.component';
import { DetailComponent } from './features/claims/detail/detail.component';
import { EmployeeSettingsComponent } from './features/dashboard-employee/employee-settings/employee-settings.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard-employee',
    component: EmployeeMainComponent,
    canActivate: [employeeGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: DashboardComponent },
      { path: 'claims', component: ClaimsListComponent },
      { path: 'claims/:id', component: DetailComponent },
      { path: 'upload', component: UploadFormComponent },
      { path: 'upload/history', component: HistoryComponent },
      { path: 'settings', component: EmployeeSettingsComponent },
      { path: 'support', component: UploadFormComponent }, // TODO replace later
    ],
  },
  {
    path: 'dashboard-admin',
    component: AdminMainComponent,
    canActivate: [adminGuard],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
