import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  email = '';
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(private router: Router) {}

  resetPassword() {
    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    // Simulate backend call
    setTimeout(() => {
      if (!this.email.includes('@')) {
        this.errorMessage = 'Invalid email address. Please try again.';
      } else {
        // ✅ Professional wording: don't reveal if email exists
        this.successMessage = 'If this email exists in our database, a reset link has been sent.';
      }
      this.isSubmitting = false;
    }, 1500);
  }
}
