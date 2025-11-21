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

  submitSupport() {
    // Placeholder: later wire to backend or email service
    console.log('Support request submitted:', {
      subject: this.subject,
      message: this.message,
    });
    alert('Your message has been submitted to support.');
    this.subject = '';
    this.message = '';
  }
}
