import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent {
  newPassword = '';
  confirmPassword = '';
  isSubmitting = false;
  errorMessage = '';

  constructor(private router: Router) {}

  updatePassword() {
    this.isSubmitting = true;
    this.errorMessage = '';

    setTimeout(() => {
      if (this.newPassword !== this.confirmPassword) {
        this.errorMessage = 'Passwords do not match. Please try again.';
      } else if (this.newPassword.length < 8) {
        this.errorMessage = 'Password must be at least 8 characters long.';
      } else if (
        !/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).+$/.test(this.newPassword)
      ) {
        this.errorMessage =
          'Include uppercase, lowercase, a number, and a special character.';
      } else {
        this.router.navigate(['/login'], {
          queryParams: { reset: 'success' }
        });
      }

      this.isSubmitting = false;
    }, 1200);
  }
}
