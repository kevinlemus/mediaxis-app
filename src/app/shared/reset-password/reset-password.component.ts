import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent {
  email = '';
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(private router: Router, private authService: AuthService) { }

  resetPassword() {
    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.authService.requestPasswordReset(this.email).subscribe({
      next: () => {
        this.successMessage =
          'If this email exists in our system, a reset link has been sent.';
        this.isSubmitting = false;
      },
      error: () => {
        // Same message for security
        this.successMessage =
          'If this email exists in our system, a reset link has been sent.';
        this.isSubmitting = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/login']);
  }
}
