import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-settings',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './employee-settings.component.html',
  styleUrls: ['./employee-settings.component.css'],
})
export class EmployeeSettingsComponent {
  constructor(private router: Router) {}

  goToResetPassword() {
    // Navigate to internal reset-password page
    this.router.navigate(['/reset-password']);
  }

  reportIssue() {
    // Navigate to in-app support page instead of external link
    this.router.navigate(['/dashboard-employee/support']);
  }

  requestFeature() {
    // Navigate to in-app request-feature page
    this.router.navigate(['/dashboard-employee/request-feature']);
  }
}
