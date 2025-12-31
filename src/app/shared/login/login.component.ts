import { Component } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Angular Forms
import { FormsModule } from '@angular/forms';

// CommonModule for *ngIf, *ngFor, etc.
import { CommonModule } from '@angular/common';

/**
 * Login page component.
 * Handles user authentication and displays success/error banners.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,

    // Angular Material UI modules
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email = '';
  password = '';
  resetSuccess = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // Show success banner if redirected from reset-password
    this.route.queryParams.subscribe(params => {
      if (params['reset'] === 'success') {
        this.resetSuccess = true;
      }
    });
  }

  /**
   * Handles login submission.
   * Calls backend /auth/login and navigates to dashboard on success.
   */
  login() {
  this.errorMessage = '';

  this.authService.login(this.email, this.password).subscribe({
    next: () => {
      const role = this.authService.getUserRole();

      if (role === 'ADMIN') {
        this.router.navigate(['/dashboard-admin']);
      } else if (role === 'STAFF' || role === 'BILLING_MANAGER') {
        this.router.navigate(['/dashboard-employee']);
      } else if (role === 'AUDITOR') {
        this.router.navigate(['/dashboard-auditor']);
      } else {
        console.warn('Unknown role:', role);
      }
    },
    error: err => {
      this.errorMessage = 'Invalid email or password.';
      console.error(err);
    }
  });
}

}
