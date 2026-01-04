import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';

      if (!this.token) {
        this.errorMessage = 'Invalid or missing invite token.';
        return;
      }

      // ⭐ REAL API CALL — validate invite token
      this.http.get<any>(`${environment.apiUrl}/auth/invite/validate?token=${this.token}`)
        .subscribe({
          next: (data) => {
            this.email = data.email;
            this.role = data.role;
          },
          error: () => {
            this.errorMessage = 'Invalid or expired invite link.';
          }
        });
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

    // ⭐ REAL API CALL — complete registration
    this.http.post(`${environment.apiUrl}/auth/complete-registration`, {
      token: this.token,
      fullName: this.fullName,
      password: this.password,
      confirmPassword: this.confirmPassword
    }).subscribe({
      next: () => {
        this.successMessage = 'Account created successfully!';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = 'Failed to complete registration. Please try again.';
      }
    });
  }
}
