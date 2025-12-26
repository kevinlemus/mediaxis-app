import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './admin-register.component.html',
  styleUrls: ['./admin-register.component.css']
})
export class AdminRegisterComponent {

  clinicName = '';
  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(private router: Router) { }

  register() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = "Passwords do not match.";
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Simulated API call
    setTimeout(() => {
      this.isSubmitting = false;
      this.successMessage = "Clinic account created successfully!";

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500);
    }, 1200);
  }
}
