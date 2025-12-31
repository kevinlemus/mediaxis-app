import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';


@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css'],
})
export class NewPasswordComponent {
  newPassword = '';
  confirmPassword = '';
  isSubmitting = false;
  errorMessage = '';
  token = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  updatePassword() {
    this.isSubmitting = true;
    this.errorMessage = '';

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      this.isSubmitting = false;
      return;
    }

    this.auth.updatePassword(this.token, this.newPassword).subscribe({
      next: () => {
        this.router.navigate(['/login'], { queryParams: { reset: 'success' } });
      },
      error: () => {
        this.errorMessage = 'Reset link is invalid or expired.';
        this.isSubmitting = false;
      }
    });
  }

}
