import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-employee-support',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './employee-support.component.html',
  styleUrls: ['./employee-support.component.css'],
})
export class EmployeeSupportComponent {
  subject = '';
  message = '';
  successMessage = '';

  submitSupport() {
    this.successMessage = '';

    if (!this.subject.trim() || !this.message.trim()) {
      return;
    }

    console.log('Support request submitted:', {
      subject: this.subject,
      message: this.message,
    });

    this.successMessage = 'Your support request has been sent. Thank you!';
    this.subject = '';
    this.message = '';

    setTimeout(() => (this.successMessage = ''), 4000);
  }
}
