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
      { path: 'upload', component: UploadFormComponent },
      { path: 'settings', component: UploadFormComponent }, // placeholder
      { path: 'support', component: UploadFormComponent }   // placeholder
    ]
  },

  {
    path: 'dashboard-admin',
    component: AdminMainComponent,
    canActivate: [adminGuard]
    // children can be added later
  },

{
  path: 'dashboard-employee',
  component: EmployeeMainComponent,
  canActivate: [employeeGuard],
  children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: DashboardComponent },   // 👈 new dashboard page
    { path: 'claims', component: ClaimsListComponent },
    { path: 'upload', component: UploadFormComponent },
    { path: 'settings', component: UploadFormComponent },
    { path: 'support', component: UploadFormComponent }
  ]
},

{
  path: 'dashboard-employee',
  component: EmployeeMainComponent,
  children: [
    { path: 'upload', component: UploadFormComponent },
    { path: 'upload/history', component: HistoryComponent }
  ]
}

];