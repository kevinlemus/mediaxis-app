import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-employee-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './employee-register.component.html',
  styleUrls: ['./employee-register.component.css']
})
export class EmployeeRegisterComponent {

  fullName = '';
  email = '';
  role = '';
  password = '';
  confirmPassword = '';

  token = '';
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';

      // Simulated token decode (replace with real API call)
      if (!this.token) {
        this.errorMessage = 'Invalid or missing invite token.';
        return;
      }

      // Simulated invite payload
      this.email = 'invited.user@example.com';
      this.role = 'staff';
    });
  }

  register() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Simulated API call
    setTimeout(() => {
      this.isSubmitting = false;
      this.successMessage = 'Account created successfully!';

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500);
    }, 1200);
  }
}
