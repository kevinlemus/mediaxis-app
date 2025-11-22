import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-employee-settings',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './employee-settings.component.html',
  styleUrls: ['./employee-settings.component.css'],
})
export class EmployeeSettingsComponent {
  resetPassword() {
    // Placeholder: link to external reset flow
    window.open('https://reset.medi-axis.com', '_blank');
  }

  reportIssue() {
    // Placeholder: open support form or external link
    window.open('https://support.medi-axis.com/report', '_blank');
  }

  requestFeature() {
    // Placeholder: open feature request form
    window.open('https://support.medi-axis.com/feature', '_blank');
  }
}
