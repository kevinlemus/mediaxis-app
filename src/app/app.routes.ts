import { Routes } from '@angular/router';

import { LoginComponent } from './shared/login/login.component';
import { ResetPasswordComponent } from './shared/reset-password/reset-password.component';
import { NewPasswordComponent } from './shared/new-password/new-password.component';
import { RequestFeatureComponent } from './shared/request-feature/request-feature.component';

import { AdminRegisterComponent } from './shared/register/admin-register/admin-register.component';

import { AdminMainComponent } from './features/dashboard-admin/main/main.component';
import { EmployeeMainComponent } from './features/dashboard-employee/main/main.component';

import { ClaimsListComponent } from './features/claims/list/list.component';
import { UploadFormComponent } from './features/upload/form/form.component';

import { adminGuard } from './core/auth/admin.guard';
import { employeeGuard } from './core/auth/employee.guard';

import { DashboardComponent } from './features/dashboard-employee/main/dashboard/dashboard.component';
import { HistoryComponent } from './features/claims/history/history.component';
import { DetailComponent } from './features/claims/detail/detail.component';
import { EmployeeSettingsComponent } from './features/dashboard-employee/main/employee-settings/employee-settings.component';
import { EmployeeSupportComponent } from './features/dashboard-employee/main/employee-support/employee-support.component';

export const routes: Routes = [

  // ⭐ PUBLIC AUTH ROUTES
  { path: 'login', component: LoginComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'new-password', component: NewPasswordComponent },

  // ⭐ ADMIN REGISTRATION (PUBLIC)
  {
    path: 'register',
    loadComponent: () =>
      import('./shared/register/admin-register/admin-register.component')
        .then(m => m.AdminRegisterComponent)
  },

  // ⭐ EMPLOYEE REGISTRATION (INVITE-BASED)
  {
    path: 'register/employee',
    loadComponent: () =>
      import('./shared/register/employee-register/employee-register.component')
        .then(m => m.EmployeeRegisterComponent)
  },

  // ⭐ EMPLOYEE DASHBOARD
  {
    path: 'dashboard-employee',
    component: EmployeeMainComponent,
    canActivate: [employeeGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: DashboardComponent },
      { path: 'claims', component: ClaimsListComponent },
      { path: 'claims/:id', component: DetailComponent },
      { path: 'claims/:id/history', component: HistoryComponent },
      { path: 'claims/:id/print', component: DetailComponent },
      { path: 'upload', component: UploadFormComponent },
      { path: 'settings', component: EmployeeSettingsComponent },
      { path: 'support', component: EmployeeSupportComponent },
      { path: 'request-feature', component: RequestFeatureComponent },
    ],
  },

  // ⭐ STANDALONE HISTORY ROUTES (AUDITOR)
  { path: 'claims/:id/history', component: HistoryComponent },
  { path: 'claims/:id/history/print', component: HistoryComponent },

  // ⭐ ADMIN DASHBOARD
  {
    path: 'dashboard-admin',
    component: AdminMainComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },

      {
        path: 'home',
        loadComponent: () =>
          import('./features/dashboard-admin/main/dashboard/dashboard.component')
            .then(m => m.AdminDashboardComponent)
      },

      {
        path: 'clinic-settings',
        loadComponent: () =>
          import('./features/dashboard-admin/main/clinic-settings/clinic-settings.component')
            .then(m => m.ClinicSettingsComponent)
      },

      {
        path: 'user-management',
        loadComponent: () =>
          import('./features/dashboard-admin/main/user-management/user-management.component')
            .then(m => m.UserManagementComponent)
      },

      {
        path: 'audit-logs',
        loadComponent: () =>
          import('./features/dashboard-admin/main/audit-logs/audit-logs.component')
            .then(m => m.AuditLogsComponent)
      },

      {
        path: 'plan-features',
        loadComponent: () =>
          import('./features/dashboard-admin/main/plan-features/plan-features.component')
            .then(m => m.PlanFeaturesComponent)
      },

      {
        path: 'compliance',
        loadComponent: () =>
          import('./features/dashboard-admin/main/compliance/compliance.component')
            .then(m => m.ComplianceComponent)
      },

      // ⭐ AUDIT PACKET PREVIEW
      {
        path: 'compliance/audit-packet-preview',
        loadComponent: () =>
          import('./features/dashboard-admin/main/compliance/audit-packet-preview/audit-packet-preview.component')
            .then(m => m.AuditPacketPreviewComponent)
      },

      {
        path: 'feedback',
        loadComponent: () =>
          import('./features/dashboard-admin/main/feedback/feedback.component')
            .then(m => m.FeedbackComponent)
      },
    ],
  },

  // ⭐ DEFAULT + WILDCARD
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];
